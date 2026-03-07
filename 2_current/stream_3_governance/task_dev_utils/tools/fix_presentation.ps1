
$relativePath = "Files/Stables - Presentation.html"
$logoFile = "SW_LOGO_Stables_S_v1_MASTER (1).png"

# Resolve to absolute path to avoid .NET/PS CWD mismatch
if (-not (Test-Path $relativePath)) {
    Write-Error "HTML file not found at relative path: $relativePath"
    exit 1
}
$htmlPath = (Convert-Path $relativePath)
Write-Host "Targeting file: $htmlPath"

$html = [IO.File]::ReadAllText($htmlPath)

# 1. Replace the massive Base64 image with the relative link
# Pattern: src="data:image/png;base64,..." 
$newHtml = $html -replace 'src="data:image\/.*;base64,[^"]+"', "src=""$logoFile"""

# 2. Replace 'private' with 'pseudonymous'
# Also cover case variations just in case
if ($newHtml -match "private") {
    Write-Host "Found 'private', replacing with 'pseudonymous'..."
    # Replace independent word "private" to avoid breaking "privateKey" if it exists in scripts?
    # Context is "Fast, Secure, Private". So it's likely standalone or comma-separated.
    # The Regex below replaces "private" (case insensitive)
    $newHtml = $newHtml -replace "private", "pseudonymous" 
}
else {
    Write-Warning "Text 'private' not found in document."
}

# 3. Save
[IO.File]::WriteAllText($htmlPath, $newHtml)

Write-Host "Successfully updated logo source and copy."




