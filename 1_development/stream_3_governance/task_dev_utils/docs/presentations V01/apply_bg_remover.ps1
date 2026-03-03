$logoPath = "C:\Users\Charles\.gemini\antigravity\brain\bd0763a1-65ed-4b7c-b399-ab934ea7baff\logo_pitch_black_1767642314102.png"
$logoBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($logoPath))
$logoData = "data:image/png;base64," + $logoBase64

$file = "c:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\docs\presentations En v01.html"
# Wait, I should use the correct filename
$file = "c:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\docs\presentations V01\stables - presentation en v01.html"
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# 1. Update Logo Source and Layout
$newLogotype = '<div class="brand-logotype"><span class="brand-name">STABLES</span><img src="' + $logoData + '" alt="Stables Logo" class="hero-logo" id="main-logo"></div>'
$content = [regex]::Replace($content, '(?s)<div class="brand-logotype">.*?</div>', $newLogotype)

# 2. Update CSS (removed mix-blend-mode, we will use canvas)
$cssFix = ".hero-logo { width: 80px !important; height: 80px !important; object-fit: contain; margin-top: 0 !important; visibility: hidden; }"
if ($content -match "\.hero-logo \{") {
    $content = [regex]::Replace($content, '\.hero-logo \{.*?\}', $cssFix)
}
else {
    $content = $content.Replace(".brand-logotype {", $cssFix + "`n        .brand-logotype {")
}

# 3. Add the Background Remover Script
$script = @'
<script>
    window.addEventListener('load', () => {
        const img = document.getElementById('main-logo');
        if (!img) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        img.onload = () => {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Remove dark pixels (chroma-key black)
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i+1], b = data[i+2];
                // If it's very dark, make it transparent
                if (r < 30 && g < 30 && b < 30) {
                    data[i + 3] = 0;
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
            img.src = canvas.toDataURL();
            img.style.visibility = 'visible';
        };
        
        if (img.complete) img.onload();
    });
</script>
'@

if ($content -match "</body>") {
    $content = $content.Replace("</body>", $script + "`n</body>")
}

[System.IO.File]::WriteAllText($file, $content, (New-Object System.Text.UTF8Encoding($false)))
Write-Output "Successfully updated $file with automated background remover"
