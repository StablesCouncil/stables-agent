$path1 = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_3_governance\prod_strategic_roadmap\index.html"
$path2 = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_2_community\task_capital_flow_assets\detailed.html"

function Fix-File($path) {
    if (Test-Path $path) {
        $content = [System.IO.File]::ReadAllText($path)
        
        # Replacement 1: Logo filename update
        $content = $content.Replace('1_symbol_favicon.png', 'stables_logo_final.png')
        
        # Replacement 2: Mermaid overlap fix (detailed.html only)
        if ($path -like "*detailed.html") {
            # Specific edge label change to prevent overlap
            $content = $content.Replace('User -- "1. Deposits Minima" --> Oracle', 'User -- "1. Deposits Minima<br/>(Flow In)" --> Oracle')
            $content = $content.Replace('User -. "Burn Stables" .-> Oracle', 'User -. "Burn Stables<br/>(Exit Path)" .-> Oracle')
            
            # Increase spacing even more for extreme legibility
            $content = $content.Replace('rankSpacing: 250', 'rankSpacing: 350')
            $content = $content.Replace('nodeSpacing: 180', 'nodeSpacing: 250')
        }

        [System.IO.File]::WriteAllText($path, $content)
        Write-Host "Updated with cache-buster and overlap fix: $path"
    }
}

Fix-File $path1
Fix-File $path2
