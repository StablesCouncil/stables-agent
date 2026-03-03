$path1 = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_3_governance\prod_strategic_roadmap\index.html"
$path2 = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\stream_2_community\task_capital_flow_assets\detailed.html"

function Fix-File($path) {
    if (Test-Path $path) {
        $content = [System.IO.File]::ReadAllText($path)
        
        # Replacement 1: Data URI img tags
        $content = [Regex]::Replace($content, '<img src="data:image/png;base64,[^"]+"', '<img src="1_symbol_favicon.png"')
        
        # Replacement 2: Data URI link tags
        $content = [Regex]::Replace($content, '<link rel="icon" type="image/png" href="data:image/png;base64,[^"]+"', '<link rel="icon" type="image/png" href="1_symbol_favicon.png"')

        # Replacement 3: Old relative paths (4 levels)
        $content = [Regex]::Replace($content, '<img src="\.\./\.\./\.\./\.\./2_current/stream_1_app/prod_brand_masters/1_symbol_favicon\.png"', '<img src="1_symbol_favicon.png"')
        
        # Replacement 4: Old relative paths (3 levels)
        $content = [Regex]::Replace($content, '<img src="\.\./\.\./\.\./2_current/stream_1_app/prod_brand_masters/1_symbol_favicon\.png"', '<img src="1_symbol_favicon.png"')

        [System.IO.File]::WriteAllText($path, $content)
        Write-Host "Completely purged: $path"
    }
}

Fix-File $path1
Fix-File $path2
