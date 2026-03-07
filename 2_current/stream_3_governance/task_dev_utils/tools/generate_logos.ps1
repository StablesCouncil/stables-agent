Add-Type -AssemblyName System.Drawing

$sourceDir = "c:\Users\Charles\.gemini\antigravity\scratch\Stables_v2\V2\Files"
$symbolSource = Join-Path $sourceDir "SW_LOGO_Stables_S_v1_MASTER (1).png"
$lockupSource = Join-Path $sourceDir "Stables_lockup.png"

$destSymbol = Join-Path $sourceDir "1_Symbol_Transparent.png"
$destLockup = Join-Path $sourceDir "2_Lockup_Stables_Transparent.png"
$destSlogan = Join-Path $sourceDir "3_Lockup_Slogan_Transparent.png"

# 1. Asset A: Symbol Only (Start from SW_LOGO)
Write-Host "Processing Asset 1: Symbol Only..."
if (Test-Path $symbolSource) {
    Copy-Item $symbolSource $destSymbol -Force
    Write-Host "Created $destSymbol"
}
else {
    Write-Error "Source symbol not found: $symbolSource"
}

# 2. Asset B: Logo + Name (Remove BG from lockup)
Write-Host "Processing Asset 2: Lockup + Transparent..."
if (Test-Path $lockupSource) {
    $bmp = [System.Drawing.Bitmap]::FromFile($lockupSource)
    # Background color to remove: R=20 G=27 B=39 (#141B27)
    $bgR = 20; $bgG = 27; $bgB = 39; $tolerance = 15
    
    # Create new bitmap with alpha
    $newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($newBmp)
    $g.DrawImage($bmp, 0, 0)
    
    # Iterate and make transparent
    # Note: Direct LockBits is faster but GetPixel is safer for script simplicity/readability here for single image
    for ($x = 0; $x -lt $newBmp.Width; $x++) {
        for ($y = 0; $y -lt $newBmp.Height; $y++) {
            $c = $newBmp.GetPixel($x, $y)
            $dist = [Math]::Sqrt([Math]::Pow($c.R - $bgR, 2) + [Math]::Pow($c.G - $bgG, 2) + [Math]::Pow($c.B - $bgB, 2))
            
            if ($dist -lt $tolerance) {
                $newBmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
            }
        }
    }
    
    $newBmp.Save($destLockup, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Host "Created $destLockup"
    
    # 3. Asset C: Logo + Name + Slogan
    Write-Host "Processing Asset 3: Slogan Version..."
    
    # Canvas Size: Width match, Height + 100px padding
    $sloganH = 150
    $sloganBmp = New-Object System.Drawing.Bitmap($newBmp.Width, $newBmp.Height + $sloganH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $gS = [System.Drawing.Graphics]::FromImage($sloganBmp)
    # $gS.Clear([System.Drawing.Color]::Transparent) # Already transparent default
    
    # Draw Lockup
    $gS.DrawImage($newBmp, 0, 0)
    
    # Draw Slogan Text
    $text = "THE MONEY PLATFORM" # Uppercase usually matches this style
    $fontFamily = New-Object System.Drawing.FontFamily("Century Gothic") # Try Century Gothic
    if (-not $fontFamily.Name) { $fontFamily = New-Object System.Drawing.FontFamily("Arial") } # Fallback
    
    $font = New-Object System.Drawing.Font($fontFamily, 36, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $brush = [System.Drawing.Brushes]::White 
    
    # Measure string to center it
    $textSize = $gS.MeasureString($text, $font)
    $ textX = ($sloganBmp.Width - $textSize.Width) / 2
    $textY = $newBmp.Height + 20 # Padding below logo
    
    # Setup formatting for centered text
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    
    # Draw text shadow for visibility? Or just clean white.
    # User presentation background is dark, so white is good.
    $gS.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
    $gS.DrawString($text, $font, $brush, $textX + ($textSize.Width / 2), $textY, $sf) # Centered
    
    $sloganBmp.Save($destSlogan, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Host "Created $destSlogan"
    
    $gS.Dispose()
    $sloganBmp.Dispose()
    $g.Dispose()
    $newBmp.Dispose()
    $bmp.Dispose()
}
else {
    Write-Error "Source lockup not found: $lockupSource"
}




