$b64 = [System.IO.File]::ReadAllText("C:\Users\Charles\.gemini\antigravity\scratch\Stables\logo_base64.txt").Trim()

$files = @(
    @{ Path = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_3_governance\prod_strategic_roadmap\index.html"; Alt = "Stables" },
    @{ Path = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_2_community\task_capital_flow_assets\detailed.html"; Alt = "Stables Logo" },
    @{ Path = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_2_community\prod_capital_flows_infographic\index.html"; Alt = "Stables" }
)

foreach ($file in $files) {
    if (-not (Test-Path $file.Path)) { continue }
    $content = [System.IO.File]::ReadAllText($file.Path)
    
    # Surgical Regex: Match the entire <div class="brand"> block content and replace specifically the img part
    # Or more simply, find the <div class="brand"> and replace everything until the next </div>'s content starts
    # Actually, let's just find the malformed <img> and its trailing artifacts
    
    # This regex finds the <img> tag and any immediately following lines that look like fragments of an <img> tag
    $regex = '(?s)<img\s+src="data:image/png;base64,.*?>(\s*alt=".*?>)*'
    $replacement = '<img src="data:image/png;base64,' + $b64 + '" alt="' + $file.Alt + '">'
    
    if ($content -match $regex) {
        $newContent = [System.Text.RegularExpressions.Regex]::Replace($content, $regex, $replacement)
        [System.IO.File]::WriteAllText($file.Path, $newContent, [System.Text.Encoding]::UTF8)
        Write-Host "Syntatically corrected $($file.Path)"
    }
}
