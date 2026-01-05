$baseDir = "h:\My Drive\Stablesworks"
$assetsDir = Join-Path $baseDir "assets"
$currentAssetsDir = Join-Path $assetsDir "current"
$symbolImg = Join-Path $currentAssetsDir "1_Symbol_current.png"

# Read Symbol Base64
if (-not (Test-Path $symbolImg)) { Write-Error "Symbol not found"; exit 1 }
$bytes = [IO.File]::ReadAllBytes($symbolImg)
$symbolB64 = [Convert]::ToBase64String($bytes)

# Define the new HTML structure for the Lockup replacement
# We use a div container instead of the single img.
# We also need to inject CSS.
$newLockupHtml = @"
<div class="brand-logotype">
    <img src="data:image/png;base64,$symbolB64" class="brand-symbol" alt="Stables">
    <span class="brand-name">STABLES</span>
</div>
"@

# Define the CSS to inject
$newCss = @"
        /* Brand Logotype Reconstruction */
        .brand-logotype {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-top: 10px;
            margin-bottom: 20px;
        }
        .brand-symbol {
            width: 72px !important;
            height: auto !important;
            max-width: none !important;
            margin-top: 0 !important;
        }
        .brand-name {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            font-size: 52px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -0.03em;
            line-height: 1;
            background: linear-gradient(180deg, #FFFFFF 20%, #B0B0B0 50%, #E0E0E0 52%, #909090 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0px 2px 0px rgba(0,0,0,0.3));
        }
        @media (max-width: 1023px) {
            .brand-logotype { justify-content: center; }
        }
"@

# Find files
$files = Get-ChildItem -Path $assetsDir -Filter "Stables - Presentation*.html"

foreach ($file in $files) {
    Write-Host "Processing $($file.Name)..."
    $path = $file.FullName
    $content = [IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    $len = $content.Length

    # 1. Inject CSS
    # Insert before </style> if not already present
    if ($content -notmatch "\.brand-logotype") {
        $content = $content -replace "</style>", "$newCss`n    </style>"
        Write-Host "  Injected CSS."
    }

    # 2. Replace the old Image Lockup
    # We look for the img tag we previously messed with or the original one.
    # Pattern: <img ... alt="Stables" ...> or class="hero-lockup" inside .brand-container
    # NOTE: The previous script might have replaced src but kept the tag. 
    # We want to replace the WHOLE tag.
    
    # Regex for the img tag
    $imgRegex = '<img[^>]*alt="Stables"[^>]*>'
    
    if ($content -match $imgRegex) {
        $content = $content -replace $imgRegex, $newLockupHtml
        Write-Host "  Replaced Lockup Image with HTML/CSS version."
    }
    elseif ($content -match '<img[^>]*class="hero-lockup"[^>]*>') {
        $content = $content -replace '<img[^>]*class="hero-lockup"[^>]*>', $newLockupHtml
        Write-Host "  Replaced Lockup (class match)."
    }

    # 3. Update Favicon/Icon (Ensure high quality symbol)
    if ($content -match 'rel="icon"') {
        # Check if already updated to high res symbol? 
        # Just update src to be sure
        $srcPattern = 'src="data:image/[^;]+;base64,[^"]+"' # Wait, link tags use href not src
        # <link rel="icon" type="image/png" href="...">
        
        $linkRegex = '<link[^>]*rel="icon"[^>]*>'
        $match = [regex]::Match($content, $linkRegex)
        if ($match.Success) {
            $tag = $match.Value
            if ($tag -match 'href="data:image/[^;]+;base64,[^"]+"') {
                $newHref = "href=""data:image/png;base64,$symbolB64"""
                $newTag = $tag -replace 'href="data:image/[^;]+;base64,[^"]+"', $newHref
                $content = $content.Replace($tag, $newTag)
                Write-Host "  Updated Favicon."
            }
        }
    }

    if ($content.Length -ne $len) {
        [IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
        Write-Host "  File Saved."
    }
    else {
        Write-Host "  No changes needed."
    }
}



