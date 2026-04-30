param(
    [string]$ProjectRoot = "${PSScriptRoot}\..",
    [string]$DbName = "mernapp",
    [string]$OutDir = "${PSScriptRoot}\..\backups"
)

# Normalize paths
$ProjectRoot = Resolve-Path $ProjectRoot
$OutDir = Resolve-Path -LiteralPath $OutDir -ErrorAction SilentlyContinue
if (-not $OutDir) {
    New-Item -ItemType Directory -Path "${PSScriptRoot}\..\backups" -Force | Out-Null
    $OutDir = Resolve-Path "${PSScriptRoot}\..\backups"
}

Write-Host "Project root: $ProjectRoot"
Write-Host "Backup dir: $OutDir"

# Check Docker
$dockerAvailable = $false
try {
    # $dockerVersion = docker version --format '{{.Server.Version}}' 2>$null
    if ($LASTEXITCODE -eq 0) { $dockerAvailable = $true }
} catch {
    $dockerAvailable = $false
}

if ($dockerAvailable) {
    Write-Host "Docker is available — using container-based backup."
    # Ensure compose services are up
    docker-compose up -d

    # Get mongo container id
    $cid = docker-compose ps -q mongo
    if (-not $cid) {
        Write-Error "Mongo container not found. Ensure service name is 'mongo' in docker-compose.yml and it's running."
        exit 2
    }

    $archiveName = "$($DbName)_$(Get-Date -Format yyyyMMdd_HHmmss).archive"
    $containerPath = "/dump/$archiveName"
    $hostArchive = Join-Path $OutDir $archiveName

    Write-Host "Creating archive inside container: $containerPath"
    docker exec $cid bash -c "mkdir -p /dump && mongodump --db $DbName --archive=$containerPath" | Write-Host

    Write-Host "Copying archive to host: $hostArchive"
    docker cp "${cid}:$containerPath" "$hostArchive"

    # Export products collection as JSON
    $productsName = "products_$(Get-Date -Format yyyyMMdd_HHmmss).json"
    $containerJson = "/dump/$productsName"
    $hostJson = Join-Path $OutDir $productsName
    Write-Host "Exporting 'products' collection to $containerJson"
    docker exec $cid bash -c "mongoexport --db $DbName --collection=products --jsonArray --out=$containerJson" | Write-Host
    docker cp "${cid}:$containerJson" "$hostJson"

    Write-Host "Backup complete. Files created:"
    Get-ChildItem -Path $OutDir | Where-Object { $_.Name -like "$DbName*" }
    exit 0
}

# If Docker not available, try mongodump locally
Write-Host "Docker not available — falling back to local Mongo tools."
$tools = @('mongodump','mongorestore','mongoexport')
$missing = @()
foreach ($t in $tools) {
    $p = Get-Command $t -ErrorAction SilentlyContinue
    if (-not $p) { $missing += $t }
}

if ($missing.Count -gt 0) {
    Write-Error "Missing MongoDB tools: $($missing -join ', '). Install from https://www.mongodb.com/docs/database-tools/installation/"
    exit 3
}

$archiveName = "$($DbName)_$(Get-Date -Format yyyyMMdd_HHmmss).archive"
$hostArchive = Join-Path $OutDir $archiveName
Write-Host "Running mongodump -> $hostArchive"
mongodump --uri="mongodb://127.0.0.1:27017/$DbName" --archive="$hostArchive"

$productsName = "products_$(Get-Date -Format yyyyMMdd_HHmmss).json"
$hostJson = Join-Path $OutDir $productsName
Write-Host "Running mongoexport -> $hostJson"
mongoexport --uri="mongodb://127.0.0.1:27017/$DbName" --collection=products --jsonArray --out="$hostJson"

Write-Host "Local backup complete. Files created:"
Get-ChildItem -Path $OutDir | Where-Object { $_.Name -like "$DbName*" }
exit 0
