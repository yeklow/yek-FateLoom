# FateLoom 发布打包脚本
# 用法：powershell -NoProfile -ExecutionPolicy Bypass -File package-release.ps1
$ErrorActionPreference = 'Stop'
$Root = $PSScriptRoot
$Manifest = Get-Content (Join-Path $Root 'manifest.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$Ver = $Manifest.version
$Name = 'yek-FateLoom'
$ReleaseRoot = Join-Path $Root 'release'
$Stage = Join-Path $ReleaseRoot "$Name-v$Ver"

if (Test-Path $Stage) { Remove-Item $Stage -Recurse -Force }
New-Item -ItemType Directory -Path $Stage -Force | Out-Null

# 需要打包的文件/目录
$files = @('index.js', 'style.css', 'manifest.json', 'speaker-engine.js', 'yek-FateLoom.script.js',
    'build-script.mjs', 'package.json', 'README.md', 'CHANGELOG.md')
foreach ($f in $files) {
    $p = Join-Path $Root $f
    if (Test-Path $p) { Copy-Item $p (Join-Path $Stage $f) -Force }
}
$testsDir = Join-Path $Root 'tests'
if (Test-Path $testsDir) { Copy-Item $testsDir (Join-Path $Stage 'tests') -Recurse -Force }

$zip = Join-Path $ReleaseRoot "$Name-v$Ver.zip"
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path (Join-Path $Stage '*') -DestinationPath $zip -Force
Write-Host "已生成：$zip"
Write-Host "大小：$([math]::Round((Get-Item $zip).Length / 1KB, 1)) KB"
