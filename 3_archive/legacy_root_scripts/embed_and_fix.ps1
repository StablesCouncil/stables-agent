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
        
        # Replace image src (be careful with existing data uris or paths)
        $content = [Regex]::Replace($content, '<img src="[^"]+" alt="Stables">', "<img src=`"$uri`" alt=`"Stables`">")
        $content = [Regex]::Replace($content, '<img src="[^"]+"(\s+)alt="Stables Logo">', "<img src=`"$uri`" alt=`"Stables Logo`">")
        $content = [Regex]::Replace($content, '<link rel="icon" type="image/png" href="[^"]+">', "<link rel=`"icon`" type=`"image/png`" href=`"$uri`">")

        # Mermaid fixes for detailed.html
        if ($path -like "*detailed.html") {
            # Ensure multiline labels to avoid horizontal crowding/overlap
            $content = $content.Replace('User -- "1. Deposits Minima" --> Oracle', 'User -- "1. Deposits Minima<br/>(Input Flow)" --> Oracle')
            $content = $content.Replace('User -. "Burn Stables" .-> Oracle', 'User -. "Burn Stables<br/>(Output Flow)" .-> Oracle')
            $content = $content.Replace('User -- "1. Deposits Minima<br/>(Flow In)" --> Oracle', 'User -- "1. Deposits Minima<br/>(Input Flow)" --> Oracle')
            $content = $content.Replace('User -. "Burn Stables<br/>(Exit Path)" .-> Oracle', 'User -. "Burn Stables<br/>(Output Flow)" .-> Oracle')
            
            # Ultra-wide spacing
            $content = $content.Replace('rankSpacing: 250', 'rankSpacing: 400')
            $content = $content.Replace('nodeSpacing: 180', 'nodeSpacing: 300')
            $content = $content.Replace('rankSpacing: 350', 'rankSpacing: 400')
            $content = $content.Replace('nodeSpacing: 250', 'nodeSpacing: 300')
        }

        [System.IO.File]::WriteAllText($path, $content)
        Write-Host "Success: Fully embedded and optimized $path"
    }
}

Fix-File $path1 $dataUri
Fix-File $path2 $dataUri
