# Twitter Header Generator - Using ONLY 2_current Assets
# Source: 1_symbol_current.png + Text from HTML
# Output: 1500x500 Black Header

# Paths (READ-ONLY from 2_current)
$symbolPath = "h:\My Drive\Stablesworks\2_current\assets\1_symbol_current.png"
$destPath = "h:\My Drive\Stablesworks\1_development\assets\stables_twitter_header_final.png"

# Load System.Drawing
Add-Type -AssemblyName System.Drawing

# 1. Create Canvas (1500x500 Black)
$header = New-Object System.Drawing.Bitmap(1500, 500)
$graph = [System.Drawing.Graphics]::FromImage($header)
$graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graph.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

$blackBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
$graph.FillRectangle($blackBrush, 0, 0, 1500, 500)

# 2. Load Symbol
if (-not (Test-Path $symbolPath)) {
    Write-Error "Symbol not found at $symbolPath"
    exit
}
$symbolImg = [System.Drawing.Image]::FromFile($symbolPath)

# 3. Scale Symbol (Height: 200px for balance with text)
$symbolHeight = 200
$symbolScale = $symbolHeight / $symbolImg.Height
$symbolW = [int]($symbolImg.Width * $symbolScale)
$symbolH = [int]($symbolImg.Height * $symbolScale)

# 4. Position Symbol (Left-aligned in center area)
$symbolX = 350  # Left of center
$symbolY = [int]((500 - $symbolH) / 2)

# 5. Draw Symbol
$graph.DrawImage($symbolImg, $symbolX, $symbolY, $symbolW, $symbolH)

# 6. Add "STABLES" Text
# Font: Inter Bold (from HTML), Size: 80px, Color: Metallic gradient approximation
try {
    $fontFamily = New-Object System.Drawing.FontFamily("Inter")
}
catch {
    $fontFamily = New-Object System.Drawing.FontFamily("Arial")
}
$font = New-Object System.Drawing.Font($fontFamily, 80, [System.Drawing.FontStyle]::Bold)

# Metallic Silver Color (approximation)
$textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 220, 230))

# Text Position (Right of symbol)
$textX = $symbolX + $symbolW + 30
$textY = [int]((500 - 80) / 2) - 10

$graph.DrawString("STABLES", $font, $textBrush, $textX, $textY)

# 7. Save
$header.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

# Cleanup
$graph.Dispose()
$blackBrush.Dispose()
$textBrush.Dispose()
$font.Dispose()
$header.Dispose()
$symbolImg.Dispose()

Write-Host "Success: Twitter Header created at $destPath"
Write-Host "Source: 1_symbol_current.png (from 2_current/assets)"



