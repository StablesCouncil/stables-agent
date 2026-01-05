$pfpPath = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\2_current\assets\stables_twitter_pfp_final.png"
$pfpBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($pfpPath))
$newOgImage = '<meta property="og:image" content="data:image/png;base64,' + $pfpBase64 + '">'

$file = "c:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\docs\presentations V01\stables - presentation en v01.html"
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

$content = [regex]::Replace($content, '<meta property="og:image".*?>', $newOgImage)

[System.IO.File]::WriteAllText($file, $content, (New-Object System.Text.UTF8Encoding($false)))
Write-Output "OG:Image optimized successfully."
