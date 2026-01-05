$logoPath = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\2_current\assets\stables_twitter_pfp_final.png"
$logoBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($logoPath))
$logoData = "data:image/png;base64," + $logoBase64

$sourceFile = "c:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\docs\presentations V01\stables - presentation en fr v01.html"
$testFile = "c:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\docs\presentations V01\test_logo_fix.html"

$content = Get-Content $sourceFile -Raw

# 1. Update Logo Source and Position
$oldPattern = '(?s)<div class="brand-logotype">.*?<span class="brand-name">STABLES</span>.*?<img.*?class="hero-logo".*?>.*?</div>'
$newFragment = '<div class="brand-logotype"><span class="brand-name">STABLES</span><img src="' + $logoData + '" alt="Stables Logo" class="hero-logo"></div>'
$content = [regex]::Replace($content, $oldPattern, $newFragment)

# 2. Add CSS to constrain logo size
$cssFix = ".hero-logo { width: 80px !important; height: 80px !important; object-fit: contain; margin-top: 0 !important; }"
$content = $content.Replace("        .brand-symbol {", "        " + $cssFix + "`n        .brand-symbol {")

# 3. Fix the "taking a cut" text while we are at it
$content = $content.Replace("without intermediaries taking a cut.", "without intermediaries.")
$content = $content.Replace("sans intermédiaires prélevant une commission.", "sans intermédiaires.")

[System.IO.File]::WriteAllText($testFile, $content)
Write-Output "Created $testFile"
