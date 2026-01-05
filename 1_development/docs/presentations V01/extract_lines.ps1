$filePath = "c:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\docs\presentations V01\stables - presentation en v01.html"
$content = [System.IO.File]::ReadAllLines($filePath)
Write-Output ("Line 13: " + $content[12].Substring(0, 200))
Write-Output ("Line 20: " + $content[19].Substring(0, 200))
Write-Output ("Line 277: " + $content[276].Substring(0, 200))
