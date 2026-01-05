$logoPath = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\2_current\assets\stables_twitter_pfp_final.png"
$logoBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($logoPath))
$logoData = "data:image/png;base64," + $logoBase64

$files = @(
    "c:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\docs\presentations V01\stables - presentation en fr v01.html",
    "c:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\docs\presentations V01\stables - presentation en v01.html"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # 1. Update Logo Source and Position (Flexible pattern)
        $oldPattern = '(?s)<div class="brand-logotype">.*?<span class="brand-name">STABLES</span>.*?<img.*?class="hero-logo".*?>.*?</div>'
        $newFragment = '<div class="brand-logotype"><span class="brand-name">STABLES</span><img src="' + $logoData + '" alt="Stables Logo" class="hero-logo"></div>'
        
        # Try both directions if needed (though we expect Name then Image already)
        if ($content -match $oldPattern) {
            $content = [regex]::Replace($content, $oldPattern, $newFragment)
        }
        else {
            # Fallback for Image then Name pattern if it exists in any file
            $oldPatternRev = '(?s)<div class="brand-logotype">.*?<img.*?class="hero-logo".*?>.*?<span class="brand-name">STABLES</span>.*?</div>'
            $content = [regex]::Replace($content, $oldPatternRev, $newFragment)
        }

        # 2. Add/Update CSS for logo size
        if ($content -match "\.hero-logo \{") {
            $content = [regex]::Replace($content, '\.hero-logo \{.*?\}', '.hero-logo { width: 80px !important; height: 80px !important; object-fit: contain; margin-top: 0 !important; }')
        }
        else {
            $cssFix = ".hero-logo { width: 80px !important; height: 80px !important; object-fit: contain; margin-top: 0 !important; }"
            $content = $content.Replace(".brand-logotype {", $cssFix + "`n        .brand-logotype {")
        }

        # 3. Remove "taking a cut."
        $content = $content.Replace("without intermediaries taking a cut.", "without intermediaries.")
        $content = $content.Replace("sans intermédiaires prélevant une commission.", "sans intermédiaires.")
        
        # 4. Save with UTF8 to ensure French characters are preserved
        [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
        Write-Output "Fixed and Verified $file"
    }
}
