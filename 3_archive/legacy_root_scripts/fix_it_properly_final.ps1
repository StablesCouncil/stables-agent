$logoPath = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_3_governance\prod_strategic_roadmap\stables_logo_final.png"

# Read original bytes to avoid truncation
$bytes = [System.IO.File]::ReadAllBytes($logoPath)
$base64 = [System.Convert]::ToBase64String($bytes)
$dataUri = "data:image/png;base64,$base64"

$path1 = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_3_governance\prod_strategic_roadmap\index.html"
$path2 = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_2_community\task_capital_flow_assets\detailed.html"

function Fix-File($path, $uri) {
    if (Test-Path $path) {
        $content = [System.IO.File]::ReadAllText($path)
        
        # 1. Force Base64 for guaranteed rendering
        $content = [Regex]::Replace($content, '<img src="[^"]+" alt="Stables">', "<img src=`"$uri`" alt=`"Stables`">")
        $content = [Regex]::Replace($content, '<img src="[^"]+"(\s+)alt="Stables Logo">', "<img src=`"$uri`" alt=`"Stables Logo`">")
        $content = [Regex]::Replace($content, '<link rel="icon" type="image/png" href="[^"]+">', "<link rel=`"icon`" type=`"image/png`" href=`"$uri`">")

        if ($path -like "*detailed.html") {
            # 2. RADICAL MERMAID RESTRUCTURE
            # Splitting labels to prevent overlap
            $content = $content.Replace('User -- "1. Deposits Minima" --> Oracle', 'User -- "<br/>1. Deposits Minima<br/>" --> Oracle')
            $content = $content.Replace('User -. "Burn Stables" .-> Oracle', 'User -. "<br/>Burn Stables<br/>" .-> Oracle')
            
            # Massive spacing
            $content = [Regex]::Replace($content, 'rankSpacing: \d+', 'rankSpacing: 800')
            $content = [Regex]::Replace($content, 'nodeSpacing: \d+', 'nodeSpacing: 600')
        }

        [System.IO.File]::WriteAllText($path, $content)
        Write-Host "Success: Optimized $path"
    }
}

Fix-File $path1 $dataUri
Fix-File $path2 $dataUri
