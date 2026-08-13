$ErrorActionPreference = 'Stop'
$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

function Assert-Http([string]$Name, [string]$Url, [int[]]$Allowed = @(200)) {
    try { $response = Invoke-WebRequest -UseBasicParsing -Uri $Url -MaximumRedirection 0 -TimeoutSec 30 -ErrorAction Stop; $status=[int]$response.StatusCode }
    catch { if ($_.Exception.Response) { $status=[int]$_.Exception.Response.StatusCode } else { throw "$Name unavailable: $($_.Exception.Message)" } }
    if ($status -notin $Allowed) { throw "$Name returned HTTP $status" }
    Write-Host "PASS $Name HTTP $status"
}

Assert-Http 'Django public course API' 'http://127.0.0.1:8000/api/v1/courses/'
Assert-Http 'Public website' 'http://127.0.0.1:3000/'
Assert-Http 'SEO Admin login' 'http://127.0.0.1:3001/login'

$countLines = @(python (Join-Path $ProjectRoot 'backend/manage.py') shell -c "from courses.models import Course; print(Course.objects.count()); print(Course.objects.filter(status=Course.STATUS_PUBLISHED).count()); print(Course.objects.filter(status=Course.STATUS_DRAFT).count())" | Select-Object -Last 3)
if ($LASTEXITCODE -ne 0) { throw 'Django course count query failed.' }
if ($countLines.Count -ne 3) { throw 'Could not read course counts.' }
$total = [int]$countLines[0]; $published = [int]$countLines[1]; $draft = [int]$countLines[2]
if ($total -ne 70 -or $published -ne 48 -or $draft -ne 22) { throw "Unexpected course counts: total=$total published=$published draft=$draft" }
Write-Host "PASS course counts total=70 published=48 draft=22"

$hash = git -C $ProjectRoot hash-object 'next.js-website-perfect-one-/src/data/courses.ts'
$expected = '235dd23c99a7f01d49fa2e21022b43fb78919526'
if ($hash -ne $expected) { throw "courses.ts hash mismatch: $hash" }
Write-Host "PASS courses.ts hash $hash"
