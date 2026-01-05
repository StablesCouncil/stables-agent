$file = "c:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\docs\presentations V01\stables - presentation en v01.html"
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# 1. Simplify the hero section to centered 3D branding only
# Replace the logo+name div with JUST the image
$logoPath = "C:\Users\Charles\.gemini\antigravity\brain\bd0763a1-65ed-4b7c-b399-ab934ea7baff\logo_pitch_black_1767642314102.png"
$logoBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($logoPath))
$logoData = "data:image/png;base64," + $logoBase64

$newHeroBranding = '<div class="brand-logotype" style="display:flex; justify-content:center; width:100%;"><img src="' + $logoData + '" alt="Stables" class="hero-logo" id="main-logo" style="width: 450px !important; height: auto !important; max-width: 90vw;"></div>'
$content = [regex]::Replace($content, '(?s)<div class="brand-logotype">.*?</div>', $newHeroBranding)

# 2. Cleanup CSS and ensure visibility
$content = $content.Replace("visibility: hidden;", "")

[System.IO.File]::WriteAllText($file, $content, (New-Object System.Text.UTF8Encoding($false)))
Write-Output "Option A applied successfully."
