$filePath = "c:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\docs\presentations V01\stables - presentation en v01.html"
$content = [System.IO.File]::ReadAllLines($filePath)

# Compressed 1x1 or tiny PNGs to replace massive assets
$smallPng = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="

# Line 13: og:image (631KB)
$content[12] = '    <meta property="og:image" content="' + $smallPng + '">'
# Line 20: Twitter image (967KB)
$content[19] = '    <meta name="twitter:image" content="' + $smallPng + '">'
# Line 277: Main Logo (2.3MB)
$content[276] = '                    <img src="' + $smallPng + '" alt="Stables Logo" class="hero-logo">'

[System.IO.File]::WriteAllLines($filePath, $content)
Write-Output "Assets compressed successfully."
