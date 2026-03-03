function Fix-File($path) {
    if (Test-Path $path) {
        $lines = Get-Content $path
        $newLines = @()
        foreach ($line in $lines) {
            if ($line -like '*<link rel="icon"*') {
                $newLines += '    <link rel="icon" type="image/png" href="1_symbol_favicon.png">'
            } elseif ($line -like '*data:image/png;base64,*' -or $line -like '*2_current/stream_1_app/prod_brand_masters*') {
                if ($line -like '*alt="Stables Logo"*') {
                    $newLines += '            <img src="1_symbol_favicon.png" alt="Stables Logo">'
                } elseif ($line -like '*alt="Stables"*') {
                    $newLines += '            <img src="1_symbol_favicon.png" alt="Stables">'
                } else {
                    $newLines += $line
                }
            } else {
                $newLines += $line
            }
        }
        $newLines | Set-Content $path
        Write-Host "Rebuilt: $path"
    }
}

Fix-File "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_3_governance\prod_strategic_roadmap\index.html"
Fix-File "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_2_community\task_capital_flow_assets\detailed.html"
