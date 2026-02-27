Add-Type -AssemblyName System.Drawing
function Extract-Wordmark {
    param([string]$inputPath, [string]$outputPath)
    $bmp = [System.Drawing.Bitmap]::FromFile($inputPath)
    $newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)
    for ($x=0; $x -lt $bmp.Width; $x++) {
        for ($y=0; $y -lt $bmp.Height; $y++) {
            $pixel = $bmp.GetPixel($x, $y)
            # Filter: if pixel is dark (black background), make it transparent.
            # Using a threshold to catch anti-aliasing.
            if ($pixel.R -gt 15 -or $pixel.G -gt 15 -or $pixel.B -gt 15) {
                $newBmp.SetPixel($x, $y, $pixel)
            } else {
                $newBmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
            }
        }
    }
    $newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $newBmp.Dispose()
}

Extract-Wordmark 'C:\Users\Charles\.gemini\antigravity\scratch\Stables\2_current\assets\stables_twitter_header_final.png' 'C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\vested_assets\stables_wordmark_transparent.png'
