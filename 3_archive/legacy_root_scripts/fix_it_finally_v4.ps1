$logoPath = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_3_governance\prod_strategic_roadmap\logo.png"
$path1 = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_3_governance\prod_strategic_roadmap\index.html"
$path2 = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_2_community\task_capital_flow_assets\detailed.html"

# Use absolute file:// URI for maximum browser reliability
$absoluteUri = "file:///C:/Users/Charles/.gemini/antigravity/scratch/Stables/1_development/stream_3_governance/prod_strategic_roadmap/logo.png"

function Fix-File($path, $uri) {
    if (Test-Path $path) {
        $content = [System.IO.File]::ReadAllText($path)
        
        # Force absolute paths for the logo
        $content = [Regex]::Replace($content, '<img src="[^"]+" alt="Stables">', "<img src=`"$uri`" alt=`"Stables`">")
        $content = [Regex]::Replace($content, '<img src="[^"]+"(\s+)alt="Stables Logo">', "<img src=`"$uri`" alt=`"Stables Logo`">")
        $content = [Regex]::Replace($content, '<link rel="icon" type="image/png" href="[^"]+">', "<link rel=`"icon`" type=`"image/png`" href=`"$uri`">")

        if ($path -like "*detailed.html") {
            # MANUALLY SPACE EDGES
            $content = $content.Replace('User -- "1. Deposits Minima" --> Oracle', 'User -- "1. Deposits Minima" --> Oracle')
            $content = $content.Replace('User -. "Burn Stables" .-> Oracle', 'User -. "Exit: Burn Stables" .-> Oracle')
            
            # Massive spacing
            $content = [Regex]::Replace($content, 'rankSpacing: \d+', 'rankSpacing: 600')
            $content = [Regex]::Replace($content, 'nodeSpacing: \d+', 'nodeSpacing: 500')
        }

        [System.IO.File]::WriteAllText($path, $content)
        Write-Host "Success: Final stabilization of $path"
    }
}

Fix-File $path1 $absoluteUri
Fix-File $path2 $absoluteUri
