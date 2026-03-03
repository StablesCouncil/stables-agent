$b64 = (Get-Content "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_1_app\task_branding_and_previews\master_symbol_b64.txt" -Raw).Trim()
$dataUri = "data:image/png;base64,$b64"

function Fix-File($path) {
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        $content = $content.Replace('<link rel="icon" type="image/png" href="../../../../2_current/stream_1_app/prod_brand_masters/1_symbol_favicon.png">', "<link rel=`"icon`" type=`"image/png`" href=`"$dataUri`">")
        $content = $content.Replace('<img src="../../../../2_current/stream_1_app/prod_brand_masters/1_symbol_favicon.png" alt="Stables">', "<img src=`"$dataUri`" alt=`"Stables`">")
        $content = $content.Replace('<img src="../../../../2_current/stream_1_app/prod_brand_masters/1_symbol_favicon.png" alt="Stables Logo">', "<img src=`"$dataUri`" alt=`"Stables Logo`">")
        [System.IO.File]::WriteAllText($path, $content)
        Write-Host "Fixed: $path"
    } else {
        Write-Error "File not found: $path"
    }
}

Fix-File "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_3_governance\prod_strategic_roadmap\index.html"
Fix-File "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_2_community\task_capital_flow_assets\detailed.html"
