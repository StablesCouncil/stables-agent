Add-Type -AssemblyName System.Drawing

$assetsDir = "c:\Users\Charles\.gemini\antigravity\scratch\Stablesworks_v2\Assets"
$lockupSource = Join-Path $assetsDir "2_Lockup_Stables_Transparent.png"
$destSlogan = Join-Path $assetsDir "3_Lockup_Slogan_Transparent.png"

try {
    Write-Host "Regenerating slogan logo with tighter spacing..."
    if (Test-Path $lockupSource) {
        $bmp = [System.Drawing.Bitmap]::FromFile($lockupSource)
        
        # Reduced canvas height - slogan closer to name (30px instead of 80px)
        $newHeight = $bmp.Height + 50
        $finalBmp = New-Object System.Drawing.Bitmap($bmp.Width, $newHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        $g = [System.Drawing.Graphics]::FromImage($finalBmp)
        
        # Draw Original Lockup at top
        $g.DrawImage($bmp, 0, 0)
        
        # Configure Slogan Text
        $text = "THE MONEY PLATFORM"
        
        # Font setup
        try {
            $fontFamily = New-Object System.Drawing.FontFamily("Century Gothic")
        }
        catch {
            try {
                $fontFamily = New-Object System.Drawing.FontFamily("Arial")
            }
            catch {
                $fontFamily = [System.Drawing.FontFamily]::GenericSansSerif
            }
        }
        
        # Smaller, bolder font for tighter look
        $font = New-Object System.Drawing.Font($fontFamily, 20, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
        $brush = [System.Drawing.Brushes]::White
        
        # Position slogan MUCH closer (only 8px below logo)
        $sf = New-Object System.Drawing.StringFormat
        $sf.Alignment = [System.Drawing.StringAlignment]::Center
        $centerX = $finalBmp.Width / 2
        $yPos = $bmp.Height + 8
        
        $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
        $g.DrawString($text, $font, $brush, $centerX, $yPos, $sf)
        
        $finalBmp.Save($destSlogan, [System.Drawing.Imaging.ImageFormat]::Png)
        Write-Host "Success: Created $destSlogan with improved spacing"
        
        $g.Dispose()
        $finalBmp.Dispose()
        $bmp.Dispose()
    }
    else {
        Write-Error "Source file 2_Lockup_Stables_Transparent.png missing!"
    }
}
catch {
    Write-Error "Script Failed: $_"
}



