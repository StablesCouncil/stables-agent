Add-Type -AssemblyName System.Drawing

function Create-Variant {
    param([string]$inputPath, [string]$outputPath, [int]$size, [string]$mode)
    $bmp = [System.Drawing.Bitmap]::FromFile($inputPath)
    $newBmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($newBmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    
    if ($mode -eq "circle") {
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $path.AddEllipse(0, 0, $size, $size)
        $g.SetClip($path)
    }
    
    # Calculate scale to fit centered
    $ratio = [Math]::Min($size / $bmp.Width, $size / $bmp.Height)
    $w = $bmp.Width * $ratio
    $h = $bmp.Height * $ratio
    $x = ($size - $w) / 2
    $y = ($size - $h) / 2
    
    $g.DrawImage($bmp, $x, $y, $w, $h)
    
    $newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    $newBmp.Dispose()
}

$devPath = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\vested_assets"
$masterSymbol = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\2_current\assets\1_symbol_social.png"

# 1. Squared S symbol (1024x1024)
Create-Variant $masterSymbol "$devPath\vested_symbol_square_1024.png" 1024 "square"
# 2. Rounded S symbol (1024x1024)
Create-Variant $masterSymbol "$devPath\vested_symbol_round_1024.png" 1024 "circle"
# 3. Favicon variant (128x128)
Create-Variant $masterSymbol "$devPath\vested_symbol_favicon_128.png" 128 "square"

