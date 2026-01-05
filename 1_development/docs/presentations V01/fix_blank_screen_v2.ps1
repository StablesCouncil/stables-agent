$files = @(
    "c:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\docs\presentations V01\stables - presentation en v01.html",
    "c:\Users\Charles\.gemini\antigravity\scratch\Stables\index.html"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

        # 1. First, fix the unclosed <body tag
        $content = $content.Replace('<body', '<body>')

        # 2. Fix the redundancy created by the close tag being pushed
        # It was likely <body> > now after step 1
        $content = $content.Replace('<body> >', '<body>')

        # 3. Fix the image tag ending in >>
        $content = $content.Replace('Stables Preview">>', 'Stables Preview">')

        # 4. Final safety check: if we have <body><body>, fix it
        $content = $content.Replace('<body><body>', '<body>')

        [System.IO.File]::WriteAllText($file, $content, (New-Object System.Text.UTF8Encoding($false)))
        Write-Output "Blank screen fix applied to: $file"
    }
    else {
        Write-Warning "File not found: $file"
    }
}
