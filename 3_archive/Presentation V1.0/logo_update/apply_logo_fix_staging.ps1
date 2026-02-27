$targetFile = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\public_stage\index.html"
$refFile = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\docs\presentations V01\test_logo_fix.html"

$refContent = Get-Content $refFile -Raw
$targetContent = Get-Content $targetFile -Raw

# Extract new base64 logo (starts with iVBORw0KG)
$newLogoMatch = [regex]::Match($refContent, 'src="data:image/png;base64,(iVBORw0KG[^"]+)"')
if ($newLogoMatch.Success) {
    $newLogoB64 = $newLogoMatch.Groups[1].Value
    Write-Host "Extracted new high-quality logo base64."
    
    # Replace in target (the target has a JPEG base64 starting with /9j/)
    $targetContent = $targetContent -replace 'src="data:image/png;base64,[^"]+"', "src=`"data:image/png;base64,$newLogoB64`""
    Write-Host "Updated target logo."
}
else {
    Write-Error "Failed to extract new logo from reference."
    exit
}

# Update 3D Calligraphy CSS for .brand-name
$newBrandNameStyle = @"
        .brand-name {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            font-size: 80px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -0.03em;
            line-height: 1;
            /* Smoother gradient to avoid stripe artifact */
            background: linear-gradient(180deg, #FFFFFF 0%, #E0E0E0 45%, #C0C0C0 60%, #909090 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0px 2px 0px rgba(0, 0, 0, 0.3));
        }
"@

# Match the old .brand-name block in target CSS and replace it
# The target has the style spread over multiple lines 373-386
$targetContent = [regex]::Replace($targetContent, '(?s)\.brand-name\s*\{[^}]+\}', $newBrandNameStyle)
Write-Host "Updated 3D Calligraphy styles."

# Save target
Set-Content -Path $targetFile -Value $targetContent -Encoding UTF8
Write-Host "Update completed in 1_development/logo_update/index.html"

