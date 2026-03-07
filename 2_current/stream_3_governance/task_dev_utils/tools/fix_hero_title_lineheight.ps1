$baseDir = "h:\My Drive\Stables"
$assetsDir = Join-Path $baseDir "assets"

# Regex to find h1.hero-title block
$heroTitleRegex = '(?s)h1\.hero-title\s*\{[^}]*\}'

# Find all presentation files
$files = Get-ChildItem -Path $assetsDir -Filter "Stables - Presentation*.html"

foreach ($file in $files) {
    Write-Host "Processing $($file.Name)..."
    $path = $file.FullName
    $content = [IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    $modified = $false

    $match = [regex]::Match($content, $heroTitleRegex)
    if ($match.Success) {
        $oldBlock = $match.Value
        $newBlock = $oldBlock
        
        # Check if line-height is present
        if ($oldBlock -notmatch 'line-height:') {
            # Inject line-height: 0.95; before the closing brace
            $newBlock = $oldBlock -replace '\}', '    line-height: 0.95;`n        }'
            Write-Host "  > Injecting line-height: 0.95;"
        }
        else {
            # If present but maybe incorrect? Let's force it to 0.95 if it's not.
            # This simple regex replace assumes it's on one line or standard format
            $newBlock = $newBlock -replace 'line-height:\s*[^;]+;', 'line-height: 0.95;'
            Write-Host "  > Updating line-height to 0.95;"
        }

        if ($newBlock -ne $oldBlock) {
            $content = $content.Replace($oldBlock, $newBlock)
            $modified = $true
        }
        else {
            Write-Host "  > Title block already correct."
        }
    }
    else {
        Write-Warning "  > h1.hero-title block not found."
    }

    if ($modified) {
        [IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
        Write-Host "  > File Saved."
    }
}
Write-Host "Batch Line-Height Fix Complete."




