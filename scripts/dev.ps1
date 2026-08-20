param(
    [ValidateSet('start','stop','restart','status')]
    [string]$Action = 'status'
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$RuntimeRoot = Join-Path $ProjectRoot '.runtime'
$Services = @(
    @{ Name='django'; Port=8000; WorkDir=(Join-Path $ProjectRoot 'backend'); File='python.exe'; Args=@('manage.py','runserver','127.0.0.1:8000','--noreload'); Health='http://127.0.0.1:8000/api/v1/courses/' },
    @{ Name='public'; Port=3000; WorkDir=(Join-Path $ProjectRoot 'frontend'); File='cmd.exe'; Args=@('/c','npm run dev'); Health='http://127.0.0.1:3000/' },
    @{ Name='seo-admin'; Port=3001; WorkDir=(Join-Path $ProjectRoot 'seo-admin'); File='cmd.exe'; Args=@('/c','npm run dev'); Health='http://127.0.0.1:3001/login' }
)

function Get-ListenerPid([int]$Port) {
    $row = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($row) { return [int]$row.OwningProcess }
    return $null
}

function Test-OwnedProcess($Service, [int]$ProcessId) {
    $pidFile = Join-Path $RuntimeRoot "$($Service.Name).pid"
    if (!(Test-Path -LiteralPath $pidFile)) { return $false }
    return [int](Get-Content -LiteralPath $pidFile -Raw) -eq $ProcessId
}

function Stop-ServiceSafe($Service) {
    $listenerPid = Get-ListenerPid $Service.Port
    if (!$listenerPid) { Write-Host "$($Service.Name): already stopped"; return }
    if (!(Test-OwnedProcess $Service $listenerPid)) {
        throw "$($Service.Name): port $($Service.Port) is owned by untracked PID $listenerPid. Refusing to stop it."
    }
    Stop-Process -Id $listenerPid -Force
    Remove-Item -LiteralPath (Join-Path $RuntimeRoot "$($Service.Name).pid") -Force -ErrorAction SilentlyContinue
    Write-Host "$($Service.Name): stopped PID $listenerPid"
}

function Start-ServiceSafe($Service) {
    $existing = Get-ListenerPid $Service.Port
    if ($existing) { throw "$($Service.Name): port $($Service.Port) is already occupied by PID $existing." }
    New-Item -ItemType Directory -Path $RuntimeRoot -Force | Out-Null
    $stdout = Join-Path $RuntimeRoot "$($Service.Name).out.log"
    $stderr = Join-Path $RuntimeRoot "$($Service.Name).err.log"
    $process = Start-Process -FilePath $Service.File -ArgumentList $Service.Args -WorkingDirectory $Service.WorkDir -WindowStyle Hidden -RedirectStandardOutput $stdout -RedirectStandardError $stderr -PassThru
    $deadline = (Get-Date).AddSeconds(90)
    $listener = $null
    do {
        Start-Sleep -Milliseconds 500
        $listener = Get-ListenerPid $Service.Port
    } while (!$listener -and (Get-Date) -lt $deadline)
    if (!$listener) { throw "$($Service.Name): did not bind port $($Service.Port). See $stderr" }
    Set-Content -LiteralPath (Join-Path $RuntimeRoot "$($Service.Name).pid") -Value $listener -NoNewline
    Write-Host "$($Service.Name): started PID $listener on port $($Service.Port)"
}

function Show-Status {
    foreach ($service in $Services) {
        $listenerPid = Get-ListenerPid $service.Port
        if ($listenerPid) {
            $owned = Test-OwnedProcess $service $listenerPid
            Write-Host "$($service.Name): RUNNING port=$($service.Port) pid=$listenerPid tracked=$owned"
        } else { Write-Host "$($service.Name): STOPPED port=$($service.Port)" }
    }
}

switch ($Action) {
    'status' { Show-Status }
    'stop' { [array]::Reverse($Services); foreach ($service in $Services) { Stop-ServiceSafe $service }; [array]::Reverse($Services) }
    'start' { foreach ($service in $Services) { Start-ServiceSafe $service }; & (Join-Path $PSScriptRoot 'health-check.ps1') }
    'restart' { [array]::Reverse($Services); foreach ($service in $Services) { Stop-ServiceSafe $service }; [array]::Reverse($Services); foreach ($service in $Services) { Start-ServiceSafe $service }; & (Join-Path $PSScriptRoot 'health-check.ps1') }
}
