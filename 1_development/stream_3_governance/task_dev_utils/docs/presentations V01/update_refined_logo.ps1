$logoPath = "C:\Users\Charles\.gemini\antigravity\brain\bd0763a1-65ed-4b7c-b399-ab934ea7baff\logo_pitch_black_1767642314102.png"
$logoBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($logoPath))
$logoData = "data:image/png;base64," + $logoBase64

$file = "c:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\docs\presentations V01\stables - presentation en v01.html"
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# 1. Update Logo Source and Position
$newLogotype = '<div class="brand-logotype"><span class="brand-name">STABLES</span><img src="' + $logoData + '" alt="Stables Logo" class="hero-logo"></div>'
$content = [regex]::Replace($content, '(?s)<div class="brand-logotype">.*?</div>', $newLogotype)

# 2. Update CSS for transparency
$cssFix = ".hero-logo { width: 80px !important; height: 80px !important; object-fit: contain; margin-top: 0 !important; mix-blend-mode: screen; }"
if ($content -match "\.hero-logo \{") {
    $content = [regex]::Replace($content, '\.hero-logo \{.*?\}', $cssFix)
}
else {
    $content = $content.Replace(".brand-logotype {", $cssFix + "`n        .brand-logotype {")
}

[System.IO.File]::WriteAllText($file, $content, (New-Object System.Text.UTF8Encoding($false)))
Write-Output "Successfully updated $file with pitch black logo"
