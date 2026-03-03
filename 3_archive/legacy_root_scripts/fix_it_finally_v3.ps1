$logoPath = "C:\Users\Charles\Desktop\Stables\2_current\stream_1_app\prod_brand_masters\1_symbol_favicon.png"
if (-not (Test-Path $logoPath)) {
    $logoPath = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_3_governance\prod_strategic_roadmap\stables_logo_final.png"
}
$path1 = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_3_governance\prod_strategic_roadmap\index.html"
$path2 = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_2_community\task_capital_flow_assets\detailed.html"

# Get Base64
$bytes = [System.IO.File]::ReadAllBytes($logoPath)
$base64 = [System.Convert]::ToBase64String($bytes)
$dataUri = "data:image/png;base64,$base64"

function Fix-File($path, $uri) {
    if (Test-Path $path) {
        $content = [System.IO.File]::ReadAllText($path)
        
        # Robust replacement
        $content = [Regex]::Replace($content, '<img src="[^"]+" alt="Stables">', "<img src=`"$uri`" alt=`"Stables`">")
        $content = [Regex]::Replace($content, '<img src="[^"]+"(\s+)alt="Stables Logo">', "<img src=`"$uri`" alt=`"Stables Logo`">")
        $content = [Regex]::Replace($content, '<link rel="icon" type="image/png" href="[^"]+">', "<link rel=`"icon`" type=`"image/png`" href=`"$uri`">")

        if ($path -like "*detailed.html") {
            # MASSIVE MERMAID REWRITE FOR ZERO OVERLAP
            # 1. Force flowchart LR
            $content = $content.Replace('flowchart TD', 'flowchart LR')
            
            # 2. Separate Deposit and Burn paths using hidden nodes or distinct directions
            # We'll use invisible nodes to force space if needed, or just better labels
            $content = $content.Replace('User -- "1. Deposits Minima" --> Oracle', 'User -- "1. Deposits Minima" --> Oracle')
            $content = $content.Replace('User -. "Burn Stables" .-> Oracle', 'User -. "Exit: Burn Stables" .-> Oracle')
            
            # 3. Spacing
            $content = [Regex]::Replace($content, 'rankSpacing: \d+', 'rankSpacing: 500')
            $content = [Regex]::Replace($content, 'nodeSpacing: \d+', 'nodeSpacing: 400')
        }

        [System.IO.File]::WriteAllText($path, $content)
        Write-Host "Success: Optimized $path"
    }
}

Fix-File $path1 $dataUri
Fix-File $path2 $dataUri
