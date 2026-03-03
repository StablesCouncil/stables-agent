Add-Type -AssemblyName System.Drawing

function Check-Transparency ($path) {
    if (Test-Path $path) {
        $img = [System.Drawing.Bitmap]::FromFile($path)
        $hasAlpha = [System.Drawing.Image]::IsAlphaPixelFormat($img.PixelFormat)
        
        Write-Host "File: $(Split-Path $path -Leaf)"
        
        if ($hasAlpha) {
            # Check corners and center for transparency (simplified)
            $c = $img.GetPixel(0, 0)
            if ($c.A -eq 0) { Write-Host "  Status: Transparent" }
            else { 
                Write-Host "  Status: Has Alpha but Corner Not Transparent (A=$($c.A))" 
                # Check random spots 
            }
        }
        else {
            Write-Host "  Status: Opaque"
        }
        $img.Dispose()
    }
}

$files = @(
    "c:\Users\Charles\.gemini\antigravity\scratch\Stablesworks_v2\V2\Files\2_Lockup_Stables_Transparent.png",
    "c:\Users\Charles\.gemini\antigravity\scratch\Stablesworks_v2\V2\Files\3_Lockup_Slogan_Transparent.png"
)

foreach ($f in $files) { Check-Transparency $f }



