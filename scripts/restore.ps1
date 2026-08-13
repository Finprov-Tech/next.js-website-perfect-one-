param([Parameter(Mandatory=$true)][string]$Backup, [switch]$Apply)
$ErrorActionPreference = 'Stop'
$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$folder = (Resolve-Path -LiteralPath $Backup).Path
$manifestPath = Join-Path $folder 'manifest.json'
if (!(Test-Path -LiteralPath $manifestPath)) { throw 'Backup manifest.json is missing.' }
$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
$dbSource = Join-Path -Path $folder -ChildPath ([string]$manifest.database.file)
$mediaSource = Join-Path -Path $folder -ChildPath ([string]$manifest.media.directory)
if (!(Test-Path -LiteralPath $dbSource) -or !(Test-Path -LiteralPath $mediaSource)) { throw 'Backup database or media directory is missing.' }
$actualHash = (Get-FileHash -LiteralPath $dbSource -Algorithm SHA256).Hash.ToLower()
if ($actualHash -ne $manifest.database.sha256) { throw 'Backup database checksum mismatch.' }
$mediaFiles = @(Get-ChildItem -LiteralPath $mediaSource -Recurse -File)
if ($mediaFiles.Count -ne $manifest.media.files) { throw 'Backup media file count mismatch.' }
$mediaManifestPath = Join-Path -Path $folder -ChildPath ([string]$manifest.media.manifest)
if (!(Test-Path -LiteralPath $mediaManifestPath)) { throw 'Backup media checksum manifest is missing.' }
$mediaManifestHash = (Get-FileHash -LiteralPath $mediaManifestPath -Algorithm SHA256).Hash.ToLower()
if ($mediaManifestHash -ne $manifest.media.manifest_sha256) { throw 'Backup media manifest checksum mismatch.' }
$mediaChecks = Get-Content -LiteralPath $mediaManifestPath -Raw | ConvertFrom-Json
foreach ($entry in $mediaChecks) {
    $relativePath = ([string]$entry.path).Replace('/', '\')
    if ([IO.Path]::IsPathRooted($relativePath) -or $relativePath.Split('\') -contains '..') { throw "Unsafe media path in manifest: $($entry.path)" }
    $candidate = Join-Path -Path $mediaSource -ChildPath $relativePath
    if (!(Test-Path -LiteralPath $candidate)) { throw "Backup media file is missing: $($entry.path)" }
    $candidateHash = (Get-FileHash -LiteralPath $candidate -Algorithm SHA256).Hash.ToLower()
    if ($candidateHash -ne $entry.sha256) { throw "Backup media checksum mismatch: $($entry.path)" }
}
Write-Host "VALID backup=$folder database_sha256=$actualHash media_files=$($mediaFiles.Count)"
if (!$Apply) { Write-Host 'DRY RUN ONLY. Pass -Apply to perform the guarded restore.'; exit 0 }

throw 'Apply mode intentionally requires a separate, explicit implementation approval. No restore was performed.'
