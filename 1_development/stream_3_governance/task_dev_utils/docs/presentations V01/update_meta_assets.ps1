$faviconPath = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\2_current\app\assets\favicon.png"
$logoIconPath = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\2_current\app\assets\stables_logo.png"

$faviconBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($faviconPath))
$logoIconBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($logoIconPath))

$file = "c:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\docs\presentations V01\stables - presentation en v01.html"
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# Update Favicon
$newFavicon = '<link rel="icon" type="image/png" href="data:image/png;base64,' + $faviconBase64 + '">'
$content = [regex]::Replace($content, '<link rel="icon".*?>', $newFavicon)

# Update OG:Image (Social Preview)
$newOgImage = '<meta property="og:image" content="data:image/png;base64,' + $logoIconBase64 + '">'
$content = [regex]::Replace($content, '<meta property="og:image".*?>', $newOgImage)

[System.IO.File]::WriteAllText($file, $content, (New-Object System.Text.UTF8Encoding($false)))
Write-Output "Favicon and OG:Image updated successfully."
