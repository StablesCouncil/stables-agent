Add-Type -AssemblyName System.Drawing

function Check-Transparency ($path) {
    if (Test-Path $path) {
        $img = [System.Drawing.Bitmap]::FromFile($path)
        $hasAlpha = [System.Drawing.Image]::IsAlphaPixelFormat($img.PixelFormat)
        
        Write-Host "File: $(Split-Path $path -Leaf)"
        Write-Host "  Format: $($img.PixelFormat)"
        
        if ($hasAlpha) {
            # Check if any pixel is actually transparent
            $isTransparent = $false
            for ($x = 0; $x -lt $img.Width; $x += 10) {
                for ($y = 0; $y -lt $img.Height; $y += 10) {
                    if ($img.GetPixel($x, $y).A -lt 255) {
                        $isTransparent = $true
                        break
                    }
                }
                if ($isTransparent) { break }
            }
            if ($isTransparent) { Write-Host "  Status: Has Transparency" }
            else { Write-Host "  Status: Alpha channel exists but appears Opaque" }
        }
        else {
            Write-Host "  Status: No Transparency (Opaque)"
        }
        
        # Sample corner color for background removal
        $corner = $img.GetPixel(0, 0)
        Write-Host "  Corner Color: R=$($corner.R) G=$($corner.G) B=$($corner.B)"
        
        $img.Dispose()
    }
    else {
        Write-Host "File not found: $path"
    }
}

$files = @(
    "c:\Users\Charles\.gemini\antigravity\scratch\Stables_v2\V2\Files\Stables_lockup.png",
    "c:\Users\Charles\.gemini\antigravity\scratch\Stables_v2\V2\Files\SW_LOGO_Stables_S_v1_MASTER (1).png"
)

foreach ($f in $files) { Check-Transparency $f }




