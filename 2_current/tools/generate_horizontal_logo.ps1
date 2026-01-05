Add-Type -AssemblyName System.Drawing

# Paths
$assetsDir = "C:\Users\Charles\.gemini\antigravity\scratch\Stablesworks_v2\Assets"
$symbolSource = Join-Path $assetsDir "1_Symbol_Transparent.png"
$destLogo = Join-Path $assetsDir "3_Lockup_Slogan_Transparent.png"

try {
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host "  Stablesworks Horizontal Logo Generator" -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host ""
    
    if (-not (Test-Path $symbolSource)) {
        Write-Error "Symbol file not found: $symbolSource"
        exit 1
    }
    
    Write-Host "[1/6] Loading symbol logo..." -ForegroundColor Yellow
    $symbol = [System.Drawing.Bitmap]::FromFile($symbolSource)
    Write-Host "      Symbol dimensions: $($symbol.Width)x$($symbol.Height)px" -ForegroundColor Gray
    
    # Scale symbol to reasonable size (150px height)
    $targetSymbolHeight = 150
    $scale = $targetSymbolHeight / $symbol.Height
    $symbolWidth = [int]($symbol.Width * $scale)
    $symbolHeight = $targetSymbolHeight
    
    Write-Host "[2/6] Calculating canvas size..." -ForegroundColor Yellow
    
    # Canvas dimensions - horizontal layout
    $canvasWidth = 800  # Wide enough for logo + text
    $canvasHeight = 180 # Slightly taller than symbol for padding
    
    Write-Host "      Canvas: ${canvasWidth}x${canvasHeight}px" -ForegroundColor Gray
    
    $finalBmp = New-Object System.Drawing.Bitmap($canvasWidth, $canvasHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($finalBmp)
    
    # High-quality rendering
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    
    Write-Host "[3/6] Drawing symbol..." -ForegroundColor Yellow
    
    # Draw symbol on left side with padding
    $symbolX = 15
    $symbolY = ($canvasHeight - $symbolHeight) / 2
    $destRect = New-Object System.Drawing.Rectangle($symbolX, $symbolY, $symbolWidth, $symbolHeight)
    $g.DrawImage($symbol, $destRect)
    
    Write-Host "[4/6] Configuring main text 'Stables'..." -ForegroundColor Yellow
    
    # Main text "Stables"
    $mainText = "Stables"
    
    # Font for main text - large and bold
    $mainFontFamily = $null
    $fontNames = @("Century Gothic", "Futura", "Arial Black", "Arial")
    
    foreach ($fontName in $fontNames) {
        try {
            $mainFontFamily = New-Object System.Drawing.FontFamily($fontName)
            Write-Host "      Main font: $fontName" -ForegroundColor Gray
            break
        }
        catch {
            continue
        }
    }
    
    if ($null -eq $mainFontFamily) {
        $mainFontFamily = [System.Drawing.FontFamily]::GenericSansSerif
    }
    
    # Large bold font for "Stables"
    $mainFont = New-Object System.Drawing.Font($mainFontFamily, 72, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $brush = [System.Drawing.Brushes]::White
    
    # Position main text next to symbol
    $mainTextX = $symbolX + $symbolWidth + 20
    $mainTextY = 25
    
    $g.DrawString($mainText, $mainFont, $brush, $mainTextX, $mainTextY)
    
    Write-Host "[5/6] Adding slogan 'money platform'..." -ForegroundColor Yellow
    
    # Slogan text - very close below "Stables"
    $sloganText = "m o n e y  p l a t f o r m"  # Letter spacing with spaces
    
    # Smaller font for slogan
    $sloganFont = New-Object System.Drawing.Font($mainFontFamily, 14, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    
    # Position slogan directly under "Stables" with minimal gap
    $sloganX = $mainTextX + 2  # Slight indent
    $sloganY = $mainTextY + 75  # Very close to main text
    
    Write-Host "      Slogan: '$sloganText'" -ForegroundColor Gray
    Write-Host "      Font size: 14px" -ForegroundColor Gray
    
    $g.DrawString($sloganText, $sloganFont, $brush, $sloganX, $sloganY)
    
    Write-Host "[6/6] Saving final logo..." -ForegroundColor Yellow
    
    # Crop to actual content (remove excess transparent space)
    # For now, save full canvas - can be cropped later if needed
    $finalBmp.Save($destLogo, [System.Drawing.Imaging.ImageFormat]::Png)
    
    Write-Host ""
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host "  SUCCESS!" -ForegroundColor Green
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host "  Output: $destLogo" -ForegroundColor White
    Write-Host "  Dimensions: ${canvasWidth}x${canvasHeight}px" -ForegroundColor White
    Write-Host ""
    
    # Cleanup
    $g.Dispose()
    $mainFont.Dispose()
    $sloganFont.Dispose()
    $finalBmp.Dispose()
    $symbol.Dispose()
    
    Write-Host "Horizontal logo created successfully!" -ForegroundColor Green
}
catch {
    Write-Host ""
    Write-Host "==================================================" -ForegroundColor Red
    Write-Host "  ERROR" -ForegroundColor Red
    Write-Host "==================================================" -ForegroundColor Red
    $errorMsg = $_.Exception.Message
    Write-Error "Script failed: $errorMsg"
    Write-Host ""
    exit 1
}



