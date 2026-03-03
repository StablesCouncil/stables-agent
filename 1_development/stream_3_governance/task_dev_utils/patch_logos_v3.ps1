$b64 = [System.IO.File]::ReadAllText("C:\Users\Charles\.gemini\antigravity\scratch\Stables\logo_base64.txt").Trim()
$logoData = "data:image/png;base64,$b64"

$files = @(
    @{ Path = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_3_governance\prod_strategic_roadmap\index.html"; Alt = "Stables" },
    @{ Path = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_2_community\task_capital_flow_assets\detailed.html"; Alt = "Stables Logo" },
    @{ Path = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_2_community\prod_capital_flows_infographic\index.html"; Alt = "Stables" }
)

foreach ($file in $files) {
    if (-not (Test-Path $file.Path)) { continue }
    
    Write-Host "Updating $($file.Path)..."
    $lines = Get-Content $file.Path
    $newLines = @()
    $found = $false
    
    foreach ($line in $lines) {
        if ($line -like '*<img src="data:image/png;base64,*') {
            # Capture the indentation
            $indent = ($line -split '<img')[0]
            $newLine = "$indent<img src=""$logoData"" alt=""$($file.Alt)"">"
            $newLines += $newLine
            $found = $true
        } else {
            $newLines += $line
        }
    }
    
    if ($found) {
        $newLines | Set-Content $file.Path -Encoding UTF8
        Write-Host "  Successfully updated $($file.Path)"
    } else {
        Write-Host "  Warning: Pattern not found in $($file.Path)"
    }
}
