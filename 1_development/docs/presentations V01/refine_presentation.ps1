$logoPath = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\2_current\assets\extracted_asset_2.png"
$logoBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($logoPath))
$logoData = "data:image/png;base64," + $logoBase64

$files = @(
    "c:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\docs\presentations V01\stables - presentation en fr v01.html",
    "c:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\docs\presentations V01\stables - presentation en v01.html"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # 1. Remove "taking a cut." (English)
        $content = $content.Replace("without intermediaries taking a cut.", "without intermediaries.")
        
        # 2. Remove "prélevant une commission." (French - only in fr version)
        $content = $content.Replace("sans intermédiaires prélevant une commission.", "sans intermédiaires.")
        
        # 3. Handle Logo Position and Source (Bilingual check)
        # Search for the brand-logotype div and swap contents
        $oldPattern = '(?s)<div class="brand-logotype">.*?<img.*?class="hero-logo".*?>.*?<span class="brand-name">STABLES</span>.*?</div>'
        $newFragment = '<div class="brand-logotype"><span class="brand-name">STABLES</span><img src="' + $logoData + '" alt="Stables Logo" class="hero-logo"></div>'
        
        if ($content -match $oldPattern) {
            $content = [regex]::Replace($content, $oldPattern, $newFragment)
        }
        else {
            # Fallback for simpler matches if needed
            $content = $content.Replace('class="hero-logo">', 'class="hero-logo" src="' + $logoData + '">')
        }
        
        [System.IO.File]::WriteAllText($file, $content)
        Write-Output "Refined $file"
    }
}
