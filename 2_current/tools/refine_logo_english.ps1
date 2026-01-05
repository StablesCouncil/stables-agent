$baseDir = "h:\My Drive\Stablesworks"
$assetsDir = Join-Path $baseDir "assets"
$targetFile = Join-Path $assetsDir "Stables - Presentation v01.html"

# Read Content
if (-not (Test-Path $targetFile)) { Write-Error "File not found"; exit 1 }
$content = [IO.File]::ReadAllText($targetFile, [System.Text.Encoding]::UTF8)

# 1. Refine Brand Logotype CSS
# - Bigger Symbol (120px)
# - Bigger Text (80px)
# - Smoother Gradient (No hard stripe)
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

# Replace the previous CSS block for .brand-logotype
# We search for the start of the block and replace until the media query or end of style
# A simpler way is to regex replace the entire block we injected previously.
# Previous block started with "/* Brand Logotype Reconstruction */"
$cssRegex = '(?s)/\*\s*Brand Logotype Reconstruction\s*\*/.*?@media \(max-width: 1023px\) \{\s*\.brand-logotype \{ justify-content: center; \}\s*\}'
if ($content -match $cssRegex) {
    $content = $content -replace $cssRegex, $refinedLogoCss
    Write-Host "Updated Logo CSS."
}
else {
    Write-Warning "Could not find previous Logo CSS block to update. Appending new CSS."
    $content = $content -replace "</style>", "$refinedLogoCss`n    </style>"
}

# 2. Fix 'Money Platform' Spacing
# Inspecting the file showed word-spacing: -0.1em; for h1.hero-title
# We will relax this.
# Regex to find h1.hero-title block
$heroTitleRegex = '(?s)h1\.hero-title\s*\{[^}]*\}'
$match = [regex]::Match($content, $heroTitleRegex)
if ($match.Success) {
    $oldBlock = $match.Value
    # Replace word-spacing and letter-spacing with neutral values
    # Or simply remove the tight spacing lines
    $newBlock = $oldBlock -replace 'word-spacing:\s*-0.1em;', 'word-spacing: normal;'
    $newBlock = $newBlock -replace 'letter-spacing:\s*-0.05em;', 'letter-spacing: -0.02em;'
    
    $content = $content.Replace($oldBlock, $newBlock)
    Write-Host "Relaxed Hero Title spacing."
}
else {
    Write-Warning "Could not find h1.hero-title CSS block."
}

# Write back
[IO.File]::WriteAllText($targetFile, $content, [System.Text.Encoding]::UTF8)
Write-Host "Done."



