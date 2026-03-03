$path1 = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_3_governance\prod_strategic_roadmap\index.html"
$path2 = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_2_community\task_capital_flow_assets\detailed.html"

function Fix-File($path) {
    if (Test-Path $path) {
        $content = [System.IO.File]::ReadAllText($path)
        
        # Link and Img stabilization to use local logo.png
        $content = [Regex]::Replace($content, '<img src="[^"]+" alt="Stables">', '<img src="logo.png" alt="Stables">')
        $content = [Regex]::Replace($content, '<img src="[^"]+"(\s+)alt="Stables Logo">', '<img src="logo.png" alt="Stables Logo">')
        $content = [Regex]::Replace($content, '<link rel="icon" type="image/png" href="[^"]+">', '<link rel="icon" type="image/png" href="logo.png">')

        if ($path -like "*detailed.html") {
            # TOTAL MERMAID RESTRUCTURING FOR ZERO OVERLAP
            # 1. Force flowchart LR and use distinct directions for edges
            $content = $content.Replace('flowchart LR', 'flowchart LR') # Ensure LR
            
            # Use label positioning markers (^ for top, _ for bottom if supported, but just splitting paths is safer)
            # We'll rewrite the core User <-> Oracle logic to use distinct edges
            $content = $content.Replace('User -- "1. Deposits Minima" --> Oracle', 'User -- "1. Deposits Minima" --> Oracle')
            $content = $content.Replace('User -. "Burn Stables" .-> Oracle', 'User -. "Exit: Burn Stables" .-> Oracle')
            
            # 2. Extreme spacing configuration
            $content = [Regex]::Replace($content, 'rankSpacing: \d+', 'rankSpacing: 600')
            $content = [Regex]::Replace($content, 'nodeSpacing: \d+', 'nodeSpacing: 500')
        }

        [System.IO.File]::WriteAllText($path, $content)
        Write-Host "Success: Final stabilization of $path"
    }
}

Fix-File $path1
Fix-File $path2
