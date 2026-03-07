Add-Type -AssemblyName System.Drawing

# Paths
$assetsDir = "C:\Users\Charles\.gemini\antigravity\scratch\Stables_v2\Assets"
$lockupSource = Join-Path $assetsDir "2_Lockup_Stables_Transparent.png"
$destSlogan = Join-Path $assetsDir "3_Lockup_Slogan_Transparent.png"

try {
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host "  Stables Logo Generator - Optimized v1.0" -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host ""
    
    if (-not (Test-Path $lockupSource)) {
        Write-Error "Source file not found: $lockupSource"
        exit 1
    }
    
    Write-Host "[1/5] Loading source logo..." -ForegroundColor Yellow
    $bmp = [System.Drawing.Bitmap]::FromFile($lockupSource)
    Write-Host "      Source dimensions: $($bmp.Width)x$($bmp.Height)px" -ForegroundColor Gray
    
    # Optimized spacing: Only 40px additional height (very tight)
    $additionalHeight = 40
    $newHeight = $bmp.Height + $additionalHeight
    
    Write-Host "[2/5] Creating canvas ($($bmp.Width)x$($newHeight)px)..." -ForegroundColor Yellow
    $finalBmp = New-Object System.Drawing.Bitmap($bmp.Width, $newHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($finalBmp)
    
    # High-quality rendering settings
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    
    Write-Host "[3/5] Drawing base logo..." -ForegroundColor Yellow
    $g.DrawImage($bmp, 0, 0)
    
    # Slogan configuration
    $text = "THE MONEY PLATFORM"
    
    Write-Host "[4/5] Configuring slogan text..." -ForegroundColor Yellow
    
    # Font selection with fallbacks
    $fontFamily = $null
    $fontNames = @("Century Gothic", "Futura", "Arial", "Helvetica")
    
    foreach ($fontName in $fontNames) {
        try {
            $fontFamily = New-Object System.Drawing.FontFamily($fontName)
            Write-Host "      Using font: $fontName" -ForegroundColor Gray
            break
        }
        catch {
            continue
        }
    }
    
    if ($null -eq $fontFamily) {
        $fontFamily = [System.Drawing.FontFamily]::GenericSansSerif
        Write-Host "      Using font: Generic Sans-Serif (fallback)" -ForegroundColor Gray
    }
    
    # Optimized font size: 18px for better proportion
    $fontSize = 18
    $font = New-Object System.Drawing.Font($fontFamily, $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $brush = [System.Drawing.Brushes]::White
    
    # Position slogan very close to logo (5px gap)
    $sloganGap = 5
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Near
    
    $centerX = $finalBmp.Width / 2
    $yPos = $bmp.Height + $sloganGap
    
    Write-Host "      Slogan gap: ${sloganGap}px" -ForegroundColor Gray
    Write-Host "      Font size: ${fontSize}px" -ForegroundColor Gray
    
    Write-Host "[5/5] Rendering final logo..." -ForegroundColor Yellow
    $g.DrawString($text, $font, $brush, $centerX, $yPos, $sf)
    
    # Save with high quality
    $finalBmp.Save($destSlogan, [System.Drawing.Imaging.ImageFormat]::Png)
    
    Write-Host ""
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host "  SUCCESS!" -ForegroundColor Green
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host "  Output: $destSlogan" -ForegroundColor White
    Write-Host "  Final dimensions: $($finalBmp.Width)x$($finalBmp.Height)px" -ForegroundColor White
    Write-Host ""
    
    # Cleanup
    $g.Dispose()
    $font.Dispose()
    $finalBmp.Dispose()
    $bmp.Dispose()
    
    Write-Host "Logo generation complete!" -ForegroundColor Green
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




