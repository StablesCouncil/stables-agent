$ErrorActionPreference = "Stop"

# Twitter Profile Picture Generator (repo-local)
# Input: 1_symbol_current.png (placed in same folder as this script)
# Output: exports/stables_twitter_pfp_final.png (400x400)

Add-Type -AssemblyName System.Drawing

$here = $PSScriptRoot
$symbolPath = Join-Path $here "1_symbol_current.png"
$outDir = Join-Path $here "exports"
$destPath = Join-Path $outDir "stables_twitter_pfp_final.png"

if (-not (Test-Path -LiteralPath $symbolPath)) {
  throw "Missing required input: $symbolPath"
}

New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$pfp = New-Object System.Drawing.Bitmap(400, 400)
$graph = [System.Drawing.Graphics]::FromImage($pfp)
$graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

$blackBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
$graph.FillRectangle($blackBrush, 0, 0, 400, 400)

$symbolImg = [System.Drawing.Image]::FromFile($symbolPath)

$targetSize = 320
$scale = $targetSize / [Math]::Max($symbolImg.Width, $symbolImg.Height)
$symbolW = [int]($symbolImg.Width * $scale)
$symbolH = [int]($symbolImg.Height * $scale)

$symbolX = [int]((400 - $symbolW) / 2)
$symbolY = [int]((400 - $symbolH) / 2)

$graph.DrawImage($symbolImg, $symbolX, $symbolY, $symbolW, $symbolH)
$pfp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

$graph.Dispose()
$blackBrush.Dispose()
$pfp.Dispose()
$symbolImg.Dispose()

Write-Host "Success: Twitter PFP created at $destPath"
Write-Host "Source: 1_symbol_current.png (next to script)"
