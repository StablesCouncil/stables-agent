$baseDir = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development"
$symbolPath = Join-Path $baseDir "stables_symbol_b64.txt"
$wordmarkPath = Join-Path $baseDir "stables_wordmark_b64.txt"
$htmlPath = Join-Path $baseDir "index.html"

Write-Host "Reading assets..."
$symbolB64 = Get-Content $symbolPath -Raw
$wordmarkB64 = Get-Content $wordmarkPath -Raw
$htmlContent = Get-Content $htmlPath -Raw

Write-Host "Trimming assets..."
$symbolB64 = $symbolB64.Trim()
$wordmarkB64 = $wordmarkB64.Trim()

Write-Host "Injecting assets..."
$htmlContent = $htmlContent.Replace("__SYMBOL_PLACEHOLDER__", $symbolB64)
$htmlContent = $htmlContent.Replace("__WORDMARK_PLACEHOLDER__", $wordmarkB64)

Write-Host "Writing final HTML..."
Set-Content -Path $htmlPath -Value $htmlContent -Encoding UTF8

Write-Host "Done."
