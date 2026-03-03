$b64 = [System.IO.File]::ReadAllText("C:\Users\Charles\.gemini\antigravity\scratch\Stables\logo_base64.txt").Trim()
$logoData = "data:image/png;base64,$b64"

$files = @(
    @{ Path = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_3_governance\prod_strategic_roadmap\index.html"; Alt = "Stables" },
    @{ Path = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_2_community\task_capital_flow_assets\detailed.html"; Alt = "Stables Logo" },
    @{ Path = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_2_community\prod_capital_flows_infographic\index.html"; Alt = "Stables" }
)

foreach ($file in $files) {
    if (-not (Test-Path $file.Path)) { Write-Host "Error: $($file.Path) not found."; continue }
    
    Write-Host "Patching $($file.Path)..."
    $content = [System.IO.File]::ReadAllText($file.Path)
    
    # We look for the <img tag with any base64 string currently there
    $regex = '(?s)(<div class="brand">.*?<img src="data:image/png;base64,).*?(" alt=".*?")'
    $replacement = "`$1$b64`$2"
    
    if ($content -match $regex) {
        $newContent = [System.Text.RegularExpressions.Regex]::Replace($content, $regex, $replacement)
        [System.IO.File]::WriteAllText($file.Path, $newContent, [System.Text.Encoding]::UTF8)
        Write-Host "  Successfully patched $($file.Path)"
    } else {
        Write-Host "  Warning: Logo pattern not found in $($file.Path)"
    }
}
Write-Host "All patching complete."
