$b64 = Get-Content "C:\Users\Charles\.gemini\antigravity\scratch\Stables\logo_base64.txt" -Raw
$b64 = $b64.Trim()
$logoData = "data:image/png;base64,$b64"

$files = @(
    @{ Path = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_3_governance\prod_strategic_roadmap\index.html"; Alt = "Stables" },
    @{ Path = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_2_community\task_capital_flow_assets\detailed.html"; Alt = "Stables Logo" },
    @{ Path = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_2_community\prod_capital_flows_infographic\index.html"; Alt = "Stables" }
)

foreach ($file in $files) {
    Write-Host "Patching $($file.Path)..."
    $content = Get-Content $file.Path
    $newContent = @()
    foreach ($line in $content) {
        if ($line -match '<img src="data:image/png;base64,') {
            $indent = ($line -split '<img')[0]
            $newContent += "$indent<img src=""$logoData"" alt=""$($file.Alt)"">"
        } else {
            $newContent += $line
        }
    }
    $newContent | Set-Content $file.Path -Encoding utf8
}
Write-Host "All files patched successfully."
