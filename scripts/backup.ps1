param([string]$Destination)
$ErrorActionPreference = 'Stop'
$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$BackupRoot = if ($Destination) { [IO.Path]::GetFullPath($Destination) } else { Join-Path $ProjectRoot 'backups' }
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$folder = Join-Path $BackupRoot "current-$stamp"
New-Item -ItemType Directory -Path $folder -Force | Out-Null

$db = Join-Path $ProjectRoot 'backend/db.sqlite3'
$media = Join-Path $ProjectRoot 'backend/media'
$backupDb = Join-Path $folder 'db.sqlite3'
python -c "import sqlite3,sys; source=sqlite3.connect(sys.argv[1]); target=sqlite3.connect(sys.argv[2]); source.backup(target); target.close(); source.close()" $db $backupDb
if ($LASTEXITCODE -ne 0) { throw 'SQLite online backup failed.' }
Copy-Item -LiteralPath $media -Destination (Join-Path $folder 'media') -Recurse
$mediaFiles = @(Get-ChildItem -LiteralPath (Join-Path $folder 'media') -Recurse -File)
$dbHash = (Get-FileHash -LiteralPath $backupDb -Algorithm SHA256).Hash.ToLower()
$mediaBackupRoot = (Resolve-Path -LiteralPath (Join-Path $folder 'media')).Path
$mediaManifest = foreach ($file in $mediaFiles) {
    $relative = $file.FullName.Substring($mediaBackupRoot.Length).TrimStart('\').Replace('\', '/')
    [ordered]@{ path=$relative; bytes=$file.Length; sha256=(Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLower() }
}
$mediaManifestPath = Join-Path $folder 'media-files.json'
$mediaManifest | ConvertTo-Json -Depth 3 | Set-Content -LiteralPath $mediaManifestPath -Encoding UTF8
$mediaManifestHash = (Get-FileHash -LiteralPath $mediaManifestPath -Algorithm SHA256).Hash.ToLower()
$manifest = [ordered]@{
    format_version=1; created_at=(Get-Date).ToString('o'); project_root=$ProjectRoot
    database=@{ file='db.sqlite3'; bytes=(Get-Item $backupDb).Length; sha256=$dbHash }
    media=@{ directory='media'; files=$mediaFiles.Count; bytes=($mediaFiles | Measure-Object Length -Sum).Sum; manifest='media-files.json'; manifest_sha256=$mediaManifestHash }
    courses_ts_git_hash=(git -C $ProjectRoot hash-object 'frontend/src/data/courses.ts')
}
$countLines = @(python (Join-Path $ProjectRoot 'backend/manage.py') shell -c "from courses.models import Course; print(Course.objects.count()); print(Course.objects.filter(status=Course.STATUS_PUBLISHED).count()); print(Course.objects.filter(status=Course.STATUS_DRAFT).count())" | Select-Object -Last 3)
if ($LASTEXITCODE -ne 0) { throw 'Django course count query failed.' }
if ($countLines.Count -ne 3) { throw 'Could not read course counts.' }
$manifest.course_counts = [ordered]@{ total=[int]$countLines[0]; published=[int]$countLines[1]; draft=[int]$countLines[2] }
$manifest | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $folder 'manifest.json') -Encoding UTF8
Write-Host "Backup created: $folder"
Write-Host "Database SHA-256: $dbHash"
Write-Host "Media: $($mediaFiles.Count) files"
