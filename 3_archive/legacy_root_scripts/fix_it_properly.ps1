$logoPath = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_3_governance\prod_strategic_roadmap\stables_logo_final.png"
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
            # MANUALLY SPACE EDGES TO PREVENT OVERLAP
            # 1. Deposits Minima and Burn Stables are on same path (User -> Oracle)
            # We add a hidden intermediate node or just heavy line breaking
            $content = $content.Replace('User -- "1. Deposits Minima" --> Oracle', 'User -- "<br/><br/>1. Deposits Minima<br/>(Input)" --> Oracle')
            $content = $content.Replace('User -. "Burn Stables" .-> Oracle', 'User -. "Burn Stables<br/>(Output)<br/><br/>" .-> Oracle')
            $content = $content.Replace('User -- "1. Deposits Minima<br/>(Input Flow)" --> Oracle', 'User -- "<br/><br/>1. Deposits Minima<br/>(Input)" --> Oracle')
            $content = $content.Replace('User -. "Burn Stables<br/>(Output Flow)" .-> Oracle', 'User -. "Burn Stables<br/>(Output)<br/><br/>" .-> Oracle')

            # Force vertical spacing
            $content = [Regex]::Replace($content, 'rankSpacing: \d+', 'rankSpacing: 500')
            $content = [Regex]::Replace($content, 'nodeSpacing: \d+', 'nodeSpacing: 400')
        }

        [System.IO.File]::WriteAllText($path, $content)
        Write-Host "Success: Optimized $path"
    }
}

Fix-File $path1 $dataUri
Fix-File $path2 $dataUri
