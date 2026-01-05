$filePath = "c:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\docs\presentations V01\stables - presentation en v01.html"
$content = Get-Content $filePath
$i = 1
foreach ($line in $content) {
    if ($line.Length -gt 50000) {
        Write-Output ("Line " + $i + ": " + $line.Length + " chars")
    }
    $i++
}
