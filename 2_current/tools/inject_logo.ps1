param([string]$TargetFile = "Files/Stables - Presentation.html")

$ErrorActionPreference = "Stop"

try {
    if (-not (Test-Path "temp_logo_b64.txt")) {
        Write-Error "temp_logo_b64.txt not found."
    }

    $b64 = [IO.File]::ReadAllText("temp_logo_b64.txt")
    
    if (-not (Test-Path $TargetFile)) {
        Write-Error "Target file '$TargetFile' not found."
    }

    $html = [IO.File]::ReadAllText($TargetFile)
    
    # Check if placeholder exists
    if ($html.Contains("TOKEN_NEW_LOGO_B64")) {
        $html = $html.Replace("TOKEN_NEW_LOGO_B64", "data:image/png;base64," + $b64)
        [IO.File]::WriteAllText($TargetFile, $html)
        Write-Host "Logo successfully injected into $TargetFile"
    }
    else {
        Write-Warning "Placeholder TOKEN_NEW_LOGO_B64 not found in $TargetFile (It might have been already replaced)"
    }
}
catch {
    Write-Error $_.Exception.Message
}



