$ErrorActionPreference = "Stop"

# Twitter Header Generator (repo-local)
# Input: 1_symbol_current.png (placed in same folder as this script)
# Output: exports/stables_twitter_header_final.png (1500x500)

Add-Type -AssemblyName System.Drawing

$here = $PSScriptRoot
$symbolPath = Join-Path $here "1_symbol_current.png"
$outDir = Join-Path $here "exports"
$destPath = Join-Path $outDir "stables_twitter_header_final.png"

if (-not (Test-Path -LiteralPath $symbolPath)) {
  throw "Missing required input: $symbolPath"
}

New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$header = New-Object System.Drawing.Bitmap(1500, 500)
$graph = [System.Drawing.Graphics]::FromImage($header)
$graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graph.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

$blackBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
$graph.FillRectangle($blackBrush, 0, 0, 1500, 500)

$symbolImg = [System.Drawing.Image]::FromFile($symbolPath)

$symbolHeight = 200
$symbolScale = $symbolHeight / $symbolImg.Height
$symbolW = [int]($symbolImg.Width * $symbolScale)
$symbolH = [int]($symbolImg.Height * $symbolScale)

$symbolX = 350
$symbolY = [int]((500 - $symbolH) / 2)
$graph.DrawImage($symbolImg, $symbolX, $symbolY, $symbolW, $symbolH)

try { $fontFamily = New-Object System.Drawing.FontFamily("Inter") }
catch { $fontFamily = New-Object System.Drawing.FontFamily("Arial") }

$font = New-Object System.Drawing.Font($fontFamily, 80, [System.Drawing.FontStyle]::Bold)
$textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 220, 230))

$textX = $symbolX + $symbolW + 30
$textY = [int]((500 - 80) / 2) - 10
$graph.DrawString("STABLES", $font, $textBrush, $textX, $textY)

$header.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

$graph.Dispose()
$blackBrush.Dispose()
$textBrush.Dispose()
$font.Dispose()
$header.Dispose()
$symbolImg.Dispose()

Write-Host "Success: Twitter Header created at $destPath"
Write-Host "Source: 1_symbol_current.png (next to script)"
