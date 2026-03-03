
$path = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\Stables - Presentation v01.html"
Write-Host "Reading file..."
$content = Get-Content -Path $path -Raw -Encoding UTF8

# Regex to find <div class="pillar-icon"> followed by content that is NOT an entity AND not a closing tag
# This identifies the raw emoji
$pattern = '<div class="pillar-icon">[^&<]+</div>'
$replacement = '<div class="pillar-icon">&#128373;</div>'

if ($content -match $pattern) {
    Write-Host "Found match. Replacing..."
    $newContent = [Regex]::Replace($content, $pattern, $replacement)
    Set-Content -Path $path -Value $newContent -Encoding UTF8
    Write-Host "Done."
} else {
    Write-Host "No remaining raw emojis found."
}
