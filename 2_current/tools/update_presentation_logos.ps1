$baseDir = "h:\My Drive\Stablesworks"
$assetsDir = Join-Path $baseDir "assets"
$currentAssetsDir = Join-Path $assetsDir "current"
$symbolImg = Join-Path $currentAssetsDir "1_Symbol_current.png"
$lockupImg = Join-Path $currentAssetsDir "2_Lockup_Stables_current.png"

function Get-Base64($path) {
    if (-not (Test-Path $path)) {
        Write-Error "File not found: $path"
        exit 1
    }
    $bytes = [IO.File]::ReadAllBytes($path)
    return [Convert]::ToBase64String($bytes)
}

Write-Host "Reading Images..."
try {
    $symbolB64 = Get-Base64 $symbolImg
    $lockupB64 = Get-Base64 $lockupImg
}
catch {
    Write-Error "Error reading images: $_"
    exit 1
}

# Find presentation files
$presentationFiles = Get-ChildItem -Path $assetsDir -Filter "Stables - Presentation*.html"

if ($presentationFiles.Count -eq 0) {
    Write-Warning "No presentation files found."
    exit
}

Write-Host "Found $($presentationFiles.Count) files."

foreach ($file in $presentationFiles) {
    $htmlFile = $file.FullName
    Write-Host "Processing: $htmlFile"

    $htmlContent = [IO.File]::ReadAllText($htmlFile, [System.Text.Encoding]::UTF8)
    $originalContentLength = $htmlContent.Length
    $modified = $false

    # Helper for replacement to keep code dry
    function Replace-Src($content, $tagRegex, $newB64, $label) {
        $match = [regex]::Match($content, $tagRegex, 'IgnoreCase')
        if ($match.Success) {
            $tagText = $match.Value
            # Match src only inside found tag
            $srcPattern = 'src="data:image/[^;]+;base64,[^"]+"'
            # For meta tags it's content="..."
            $contentPattern = 'content="data:image/[^;]+;base64,[^"]+"'
            
            if ($tagText -match $srcPattern) {
                $newSrc = "src=""data:image/png;base64,$newB64"""
                $newTagText = $tagText -replace $srcPattern, $newSrc
                $content = $content.Replace($tagText, $newTagText)
                Write-Host "  Updated src for $label."
                return $content
            }
            elseif ($tagText -match $contentPattern) {
                # Ensure we don't double prefix if pattern has data:image
                $newAttr = "content=""data:image/png;base64,$newB64"""
                $newTagText = $tagText -replace $contentPattern, $newAttr
                $content = $content.Replace($tagText, $newTagText)
                Write-Host "  Updated content for $label."
                return $content
            }
            else {
                Write-Warning "  Could not find data URI in $label tag."
            }
        }
        else {
            Write-Warning "  Tag for $label not found (Regex: $tagRegex)."
        }
        return $content
    }

    # 1. Main Logo (Lockup) - Looking for alt="Stables" or class="hero-lockup" to cover bases
    # Try alt="Stables" first (Files in assets root)
    if ($htmlContent -match 'alt="Stables"') {
        $htmlContent = Replace-Src $htmlContent '<img[^>]*alt="Stables"[^>]*>' $lockupB64 "Main Logo (alt)"
    } 
    # Fallback to class based if not found (Files in current/)
    elseif ($htmlContent -match 'class="hero-lockup"') {
        $htmlContent = Replace-Src $htmlContent '<img[^>]*class="hero-lockup"[^>]*>' $lockupB64 "Main Lockup (class)"
    }

    # 2. Symbol (Favicon or Hero Symbol)
    # Favicon
    if ($htmlContent -match 'rel="icon"') {
        $htmlContent = Replace-Src $htmlContent '<link[^>]*rel="icon"[^>]*>' $symbolB64 "Favicon"
    }
    # Hero Symbol (class)
    if ($htmlContent -match 'class="hero-symbol"') {
        $htmlContent = Replace-Src $htmlContent '<img[^>]*class="hero-symbol"[^>]*>' $symbolB64 "Hero Symbol (class)"
    }

    # 3. Social Image (OG Image) - Use Lockup
    if ($htmlContent -match 'property="og:image"') {
        $htmlContent = Replace-Src $htmlContent '<meta[^>]*property="og:image"[^>]*>' $lockupB64 "Social Image"
    }

    if ($htmlContent.Length -ne $originalContentLength) {
        try {
            [IO.File]::WriteAllText($htmlFile, $htmlContent, [System.Text.Encoding]::UTF8)
            Write-Host "  Saved changes."
        }
        catch {
            Write-Error "  Failed to save: $_"
        }
    }
    else {
        Write-Host "  No changes made."
    }
    Write-Host "--------------------"
}



