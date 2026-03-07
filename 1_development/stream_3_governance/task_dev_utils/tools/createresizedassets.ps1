
Add-Type -AssemblyName System.Drawing

$sourcePath = "H:\My Drive\Stables\assets\current\1_Symbol_current.png"
$faviconPath = "H:\My Drive\Stables\assets\current\1_Symbol_favicon.png"
$socialPath = "H:\My Drive\Stables\assets\current\1_Symbol_social.png"

$img = [System.Drawing.Image]::FromFile($sourcePath)
Write-Host "Original Dimensions: $($img.Width)x$($img.Height)"

# Function to resize image
function Resize-Image {
    param(
        [System.Drawing.Image]$image,
        [int]$width,
        [int]$height,
        [string]$path
    )
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
    $destImage = New-Object System.Drawing.Bitmap($width, $height)
    $destImage.SetResolution($image.HorizontalResolution, $image.VerticalResolution)

    $graphics = [System.Drawing.Graphics]::FromImage($destImage)
    $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $wrapMode = [System.Drawing.Imaging.ImageAttributes]::new()
    $wrapMode.SetWrapMode([System.Drawing.Drawing2D.WrapMode]::TileFlipXY)
    
    $graphics.DrawImage($image, $destRect, 0, 0, $image.Width, $image.Height, [System.Drawing.GraphicsUnit]::Pixel, $wrapMode)
    
    $destImage.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $destImage.Dispose()
    $graphics.Dispose()
    Write-Host "Saved resized image to: $path"
}

# 1. Create Favicon (64x64)
Resize-Image -image $img -width 64 -height 64 -path $faviconPath

# 2. Create Social Image (800x800)
# Check if original is smaller than 800, if so keep original dimensions? Assuming square.
$socialWidth = 800
$socialHeight = 800

if ($img.Width -lt 800) {
    $socialWidth = $img.Width
    $socialHeight = $img.Height
}

Resize-Image -image $img -width $socialWidth -height $socialHeight -path $socialPath

$img.Dispose()




