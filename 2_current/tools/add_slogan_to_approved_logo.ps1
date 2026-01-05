Add-Type -AssemblyName System.Drawing

# Paths - using EXACT existing approved logo
$assetsDir = "C:\Users\Charles\.gemini\antigravity\scratch\Stablesworks_v2\Assets"
$approvedLogo = Join-Path $assetsDir "2_Lockup_Stables_Transparent.png"
$inProgressDir = Join-Path $assetsDir "In-Progress"
$outputLogo = Join-Path $inProgressDir "Lockup_With_Slogan.png"

try {
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host "  Adding Slogan to APPROVED Logo" -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "IMPORTANT: Using EXACT approved logo without modification" -ForegroundColor Yellow
    Write-Host ""
    
    if (-not (Test-Path $approvedLogo)) {
        Write-Error "Approved logo not found: $approvedLogo"
        exit 1
    }
    
    Write-Host "[1/4] Loading approved logo..." -ForegroundColor Yellow
    $baseLogo = [System.Drawing.Bitmap]::FromFile($approvedLogo)
    Write-Host "      Logo dimensions: $($baseLogo.Width)x$($baseLogo.Height)px" -ForegroundColor Gray
    
    # Add minimal space for slogan (30px)
    $sloganSpace = 30
    $newHeight = $baseLogo.Height + $sloganSpace
    
    Write-Host "[2/4] Creating canvas with slogan space..." -ForegroundColor Yellow
    Write-Host "      New dimensions: $($baseLogo.Width)x${newHeight}px" -ForegroundColor Gray
    
    $finalBmp = New-Object System.Drawing.Bitmap($baseLogo.Width, $newHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($finalBmp)
    
    # High-quality rendering
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    
    # Draw EXACT approved logo at top (NO CHANGES)
    $g.DrawImage($baseLogo, 0, 0)
    
    Write-Host "[3/4] Adding 'money platform' slogan..." -ForegroundColor Yellow
    
    # Slogan text
    $sloganText = "money platform"
    
    # Match the logo's typography - try to use same font family
    $fontFamily = $null
    $fontNames = @("Century Gothic", "Futura", "Arial", "Helvetica")
    
    foreach ($fontName in $fontNames) {
        try {
            $fontFamily = New-Object System.Drawing.FontFamily($fontName)
            Write-Host "      Font: $fontName" -ForegroundColor Gray
            break
        }
        catch {
            continue
        }
    }
    
    if ($null -eq $fontFamily) {
        $fontFamily = [System.Drawing.FontFamily]::GenericSansSerif
    }
    
    # Small, elegant font for slogan
    $fontSize = 12
    $sloganFont = New-Object System.Drawing.Font($fontFamily, $fontSize, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brush = [System.Drawing.Brushes]::White
    
    # Center the slogan below the logo
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    
    $centerX = $finalBmp.Width / 2
    $sloganY = $baseLogo.Height + 8  # 8px gap
    
    Write-Host "      Text: '$sloganText'" -ForegroundColor Gray
    Write-Host "      Size: ${fontSize}px" -ForegroundColor Gray
    Write-Host "      Gap: 8px" -ForegroundColor Gray
    
    $g.DrawString($sloganText, $sloganFont, $brush, $centerX, $sloganY, $sf)
    
    Write-Host "[4/4] Saving to In-Progress folder..." -ForegroundColor Yellow
    
    # Ensure In-Progress directory exists
    if (-not (Test-Path $inProgressDir)) {
        New-Item -ItemType Directory -Path $inProgressDir -Force | Out-Null
    }
    
    $finalBmp.Save($outputLogo, [System.Drawing.Imaging.ImageFormat]::Png)
    
    Write-Host ""
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host "  SUCCESS!" -ForegroundColor Green
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host "  Output: $outputLogo" -ForegroundColor White
    Write-Host "  Dimensions: $($finalBmp.Width)x$($finalBmp.Height)px" -ForegroundColor White
    Write-Host ""
    Write-Host "  NOTE: File saved to In-Progress folder" -ForegroundColor Yellow
    Write-Host "  Once approved, move to Final folder" -ForegroundColor Yellow
    Write-Host ""
    
    # Cleanup
    $g.Dispose()
    $sloganFont.Dispose()
    $finalBmp.Dispose()
    $baseLogo.Dispose()
    
    Write-Host "Logo with slogan created successfully!" -ForegroundColor Green
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



