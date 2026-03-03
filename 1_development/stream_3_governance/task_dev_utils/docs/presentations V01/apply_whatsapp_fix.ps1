$iconPath = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\2_current\assets\1_symbol_favicon.png"
$iconBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($iconPath))
$iconData = "data:image/png;base64," + $iconBase64

$file = "c:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\docs\presentations V01\stables - presentation en v01.html"
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# 1. Define the Optimized Metadata Block (priority order)
$metaBlock = @"
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stables | Money Platform</title>
    
    <!-- WhatsApp & Open Graph -->
    <meta property="og:title" content="Stables | Money Platform">
    <meta property="og:description" content="Money that is truly yours. Secure, Pseudonymous and Unstoppable.">
    <meta property="og:image" content="$iconData">
    <meta property="og:type" content="website">
    
    <!-- Fallback Schema.org for WhatsApp -->
    <meta itemprop="name" content="Stables | Money Platform">
    <meta itemprop="description" content="Money that is truly yours. Secure, Pseudonymous and Unstoppable.">
    <meta itemprop="image" content="$iconData">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Stables | Money Platform">
    <meta name="twitter:description" content="Secure, Pseudonymous and Unstoppable.">
    <meta name="twitter:image" content="$iconData">
    
    <link rel="icon" type="image/png" href="$iconData">
"@

# 2. Inject at the very start of <head>
# First, remove existing meta tags to avoid bloat
$content = [regex]::Replace($content, '(?s)<meta charset=.*?<link rel=\"icon\".*?>', $metaBlock)

# 3. Add hidden thumbnail image to body (Crawler Trick)
$hiddenThumb = '<img src="' + $iconData + '" style="display:none; visibility:hidden; width:0; height:0;" alt="Stables Preview">'
if (-not ($content -match "Stables Preview")) {
    $content = $content.Replace('<body', '<body' + "`n    " + $hiddenThumb)
}

[System.IO.File]::WriteAllText($file, $content, (New-Object System.Text.UTF8Encoding($false)))
Write-Output "WhatsApp Preview Fix applied surgically in Turbo Mode."
