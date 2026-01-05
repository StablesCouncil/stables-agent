$file = "c:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\docs\presentations V01\stables - presentation en v01.html"
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# Fix the corrupted body tag and hidden image syntax
# Search for the unclosed body and the image tag ending in >>
$pattern = '(?s)<body\s+<img src="(.*?)" style="display:none; visibility:hidden; width:0; height:0;" alt="Stables Preview">>'
$replacement = '<body>' + "`n    " + '<img src="$1" style="display:none; visibility:hidden; width:0; height:0;" alt="Stables Preview">'

if ($content -match $pattern) {
    $content = [regex]::Replace($content, $pattern, $replacement)
    [System.IO.File]::WriteAllText($file, $content, (New-Object System.Text.UTF8Encoding($false)))
    Write-Output "Syntax error fixed successfully."
}
else {
    Write-Output "Pattern not found, checking for alternative corruption..."
    # Fallback: Just ensure <body> is correctly closed and no double >>
    $content = $content.Replace("<body", "<body>")
    $content = $content.Replace("Stables Preview\">>", "Stables Preview\">")
    [System.IO.File]::WriteAllText($file, $content, (New-Object System.Text.UTF8Encoding($false)))
    Write-Output "Generic fix applied."
}
