$path1 = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_3_governance\prod_strategic_roadmap\index.html"
$path2 = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_2_community\task_capital_flow_assets\detailed.html"

function Fix-File($path) {
    if (Test-Path $path) {
        $content = [System.IO.File]::ReadAllText($path)
        
        # 1. Force local logo.png reference and REMOVE any other src attributes
        $content = [Regex]::Replace($content, '<img[^>]+alt="Stables">', '<img src="logo.png" alt="Stables">')
        $content = [Regex]::Replace($content, '<img[^>]+alt="Stables Logo">', '<img src="logo.png" alt="Stables Logo">')
        $content = [Regex]::Replace($content, '<link rel="icon"[^>]+>', '<link rel="icon" type="image/png" href="logo.png">')

        if ($path -like "*detailed.html") {
            # 2. RADICAL MERMAID RESTRUCTURE
            # Splitting labels and adding manual spacing
            $content = $content.Replace('User -- "1. Deposits Minima" --> Oracle', 'User -- "<br/>1. Deposits Minima<br/>" --> Oracle')
            $content = $content.Replace('User -. "Burn Stables" .-> Oracle', 'User -. "<br/>Burn Stables<br/>" .-> Oracle')
            
            # Massive spacing
            $content = [Regex]::Replace($content, 'rankSpacing: \d+', 'rankSpacing: 1000')
            $content = [Regex]::Replace($content, 'nodeSpacing: \d+', 'nodeSpacing: 800')
        }

        [System.IO.File]::WriteAllText($path, $content)
        Write-Host "Success: Optimized $path"
    }
}

Fix-File $path1
Fix-File $path2
