# Twitter Profile Picture Generator - Using ONLY 2_current Assets
# Source: 1_symbol_current.png
# Output: 400x400 Black Background (Twitter will apply circular crop)

# Paths (READ-ONLY from 2_current)
$symbolPath = "h:\My Drive\Stablesworks\2_current\assets\1_symbol_current.png"
$destPath = "h:\My Drive\Stablesworks\1_development\assets\stables_twitter_pfp_final.png"

# Load System.Drawing
Add-Type -AssemblyName System.Drawing

# 1. Create Canvas (400x400 Black)
$pfp = New-Object System.Drawing.Bitmap(400, 400)
$graph = [System.Drawing.Graphics]::FromImage($pfp)
$graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

$blackBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
$graph.FillRectangle($blackBrush, 0, 0, 400, 400)

# 2. Load Symbol
if (-not (Test-Path $symbolPath)) {
    Write-Error "Symbol not found at $symbolPath"
    exit
}
$symbolImg = [System.Drawing.Image]::FromFile($symbolPath)

# 3. Scale Symbol (320px to leave padding for circular crop)
$targetSize = 320
$scale = $targetSize / [Math]::Max($symbolImg.Width, $symbolImg.Height)
$symbolW = [int]($symbolImg.Width * $scale)
$symbolH = [int]($symbolImg.Height * $scale)

# 4. Center Symbol
$symbolX = [int]((400 - $symbolW) / 2)
$symbolY = [int]((400 - $symbolH) / 2)

# 5. Draw Symbol
$graph.DrawImage($symbolImg, $symbolX, $symbolY, $symbolW, $symbolH)

# 6. Save
$pfp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

# Cleanup
$graph.Dispose()
$blackBrush.Dispose()
$pfp.Dispose()
$symbolImg.Dispose()

Write-Host "Success: Twitter PFP created at $destPath"
Write-Host "Source: 1_symbol_current.png (from 2_current/assets)"
Write-Host "Note: Twitter will apply circular crop automatically"



