$baseDir = "h:\My Drive\Stables"
$assetsDir = Join-Path $baseDir "assets"

# 1. Define the Refined CSS
$refinedLogoCss = @"
        /* Brand Logotype Reconstruction (Refined) */
        .brand-logotype {
            display: flex;
            align-items: center;
            gap: 24px;
            margin-top: 10px;
            margin-bottom: 30px;
        }
        .brand-symbol {
            width: 120px !important;
            height: auto !important;
            max-width: none !important;
            margin-top: 0 !important;
        }
        .brand-name {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            font-size: 80px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -0.03em;
            line-height: 1;
            /* Smoother gradient to avoid stripe artifact */
            background: linear-gradient(180deg, #FFFFFF 0%, #E0E0E0 45%, #C0C0C0 60%, #909090 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0px 2px 0px rgba(0,0,0,0.3));
        }
        @media (max-width: 1023px) {
            .brand-logotype { justify-content: center; }
        }
"@

# Regex to find the OLD unrefined block
# It started with "/* Brand Logotype Reconstruction */" and ended with the media query
$oldCssRegex = '(?s)/\*\s*Brand Logotype Reconstruction\s*\*/.*?@media \(max-width: 1023px\) \{\s*\.brand-logotype \{ justify-content: center; \}\s*\}'

# Regex to find the Hero Title block to fix spacing
$heroTitleRegex = '(?s)h1\.hero-title\s*\{[^}]*\}'

# Find all presentation files
$files = Get-ChildItem -Path $assetsDir -Filter "Stables - Presentation*.html"

foreach ($file in $files) {
    Write-Host "Processing $($file.Name)..."
    $path = $file.FullName
    $content = [IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    $modified = $false

    # 1. Update Logo CSS
    if ($content -match $oldCssRegex) {
        $content = $content -replace $oldCssRegex, $refinedLogoCss
        Write-Host "  > Updated Logo CSS."
        $modified = $true
    }
    elseif ($content -match 'Brand Logotype Reconstruction \(Refined\)') {
        Write-Host "  > Already Refined."
    }
    else {
        Write-Warning "  > Block not found (First batch script might not have run on this file?)."
    }

    # 2. Fix 'Money Platform' Spacing
    $match = [regex]::Match($content, $heroTitleRegex)
    if ($match.Success) {
        $oldBlock = $match.Value
        # Check if it has the bad spacing
        if ($oldBlock -match 'word-spacing:\s*-0.1em;') {
            $newBlock = $oldBlock -replace 'word-spacing:\s*-0.1em;', 'word-spacing: normal;'
            $newBlock = $newBlock -replace 'letter-spacing:\s*-0.05em;', 'letter-spacing: -0.02em;'
            $content = $content.Replace($oldBlock, $newBlock)
            Write-Host "  > Relaxed Hero Title spacing."
            $modified = $true
        }
        else {
            Write-Host "  > Spacing already relaxed."
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
Write-Host "Batch Refinement Complete."




