$iconPath = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\2_current\assets\1_symbol_favicon.png"
if (-not (Test-Path $iconPath)) {
    Write-Error "Icon path not found: $iconPath"
    exit 1
}

$iconBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($iconPath))
$iconData = "data:image/png;base64," + $iconBase64

$file = "c:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\docs\presentations V01\stables - presentation en v01.html"
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# 1. Update Favicon
$newFavicon = '<link rel="icon" type="image/png" href="' + $iconData + '">'
$content = [regex]::Replace($content, '<link rel="icon".*?>', $newFavicon)

# 2. Update Social Preview Tags for maximum platform compatibility
# We use both OG and Twitter tags to ensure the preview works
$ogImage = '<meta property="og:image" content="' + $iconData + '">'
$twitterImage = '<meta name="twitter:image" content="' + $iconData + '">'

$content = [regex]::Replace($content, '<meta property="og:image".*?>', $ogImage)
if ($content -match '<meta name="twitter:image"') {
    $content = [regex]::Replace($content, '<meta name="twitter:image".*?>', $twitterImage)
}
else {
    $content = $content.Replace($ogImage, $ogImage + "`n    " + $twitterImage)
}

# 3. Ensure Tags are high in the head (Platforms like them early)
# I'll just save it back since the positions are already established.

[System.IO.File]::WriteAllText($file, $content, (New-Object System.Text.UTF8Encoding($false)))
Write-Output "Successfully updated $file with definitive icon: 1_symbol_favicon.png"
