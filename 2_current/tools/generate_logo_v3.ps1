Add-Type -AssemblyName System.Drawing

$sourceDir = "c:\Users\Charles\.gemini\antigravity\scratch\Stablesworks_v2\V2\Files"
$lockupSource = Join-Path $sourceDir "2_Lockup_Stables_Transparent.png"
$destSlogan = Join-Path $sourceDir "3_Lockup_Slogan_Transparent.png"

try {
    Write-Host "Generating Asset 3 from $lockupSource..."
    if (Test-Path $lockupSource) {
        $bmp = [System.Drawing.Bitmap]::FromFile($lockupSource)
        
        # New Canvas: Height + 80px for slogan
        $newHeight = $bmp.Height + 80
        $finalBmp = New-Object System.Drawing.Bitmap($bmp.Width, $newHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        $g = [System.Drawing.Graphics]::FromImage($finalBmp)
        
        # Draw Original Lockup
        $g.DrawImage($bmp, 0, 0)
        
        # Configure Text
        $text = "THE MONEY PLATFORM"
        
        # Try finding a good font, fallback to GenericSansSerif
        try {
            $fontFamily = New-Object System.Drawing.FontFamily("Century Gothic")
        }
        catch {
            $fontFamily = [System.Drawing.FontFamily]::GenericSansSerif
        }
        
        $font = New-Object System.Drawing.Font($fontFamily, 24, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
        $brush = [System.Drawing.Brushes]::White
        
        # Center Text
        $sf = New-Object System.Drawing.StringFormat
        $sf.Alignment = [System.Drawing.StringAlignment]::Center
        $centerX = $finalBmp.Width / 2
        $yPos = $bmp.Height + 10
        
        $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
        $g.DrawString($text, $font, $brush, $centerX, $yPos, $sf)
        
        $finalBmp.Save($destSlogan, [System.Drawing.Imaging.ImageFormat]::Png)
        Write-Host "Success: Created $destSlogan"
        
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



