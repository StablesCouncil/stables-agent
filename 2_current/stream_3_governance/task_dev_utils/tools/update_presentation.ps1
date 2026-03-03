
$logoPath = "C:\Users\Charles\.gemini\antigravity\scratch\Stablesworks\Files\SW_LOGO_Stablesworks_S_v1_MASTER (1).png"
$targetFile = "C:\Users\Charles\.gemini\antigravity\scratch\Stablesworks\Files\Stables - Presentation.html"

# 1. Read the logo file and convert to Base64
if (Test-Path $logoPath) {
    $logoBytes = [System.IO.File]::ReadAllBytes($logoPath)
    $base64String = [System.Convert]::ToBase64String($logoBytes)
    $base64Uri = "data:image/png;base64,$base64String"
    Write-Host "Successfully converted logo to Base64."
}
else {
    Write-Error "Logo file not found at: $logoPath"
    Exit 1
}

# 2. Define the new HTML Content
# We are using OPTION C: GEOMETRIC WIDE (matches "The Futurist" / Wide & Uppercase)
# We remove the border/background from option-container to fix "white frame" issue.

$newHtml = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stables - The Futurist</title>
    <link rel="icon" type="image/png" href="$base64Uri">
    <style>
        body {
            background: #0f1623;
            color: #fff;
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 40px;
        }

        /* Container without border/background (White Frame Fix) */
        .presentation-container {
            text-align: center;
            padding: 40px;
            /* border: 1px solid rgba(255, 255, 255, 0.05); REMOVED */
            /* background: rgba(255, 255, 255, 0.02); REMOVED */
            width: 100%;
            max-width: 900px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 40px;
        }

        .brand-lockup {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 30px; /* Slightly increased gap for presentation */
        }

        .logo-img {
            width: 120px; /* Slightly larger for presentation */
            background: none;
        }

        /* OPTION C: GEOMETRIC WIDE (The Futurist) */
        .brand-text {
            font-family: 'Century Gothic', 'Futura', sans-serif;
            font-weight: 800;
            font-size: 90px; /* Larger for presentation */
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: #fff;
            text-shadow: 0 0 30px rgba(124, 58, 237, 0.3);
            margin: 0;
            line-height: 1;
        }
    </style>
</head>
<body>

    <div class="presentation-container">
        <div class="brand-lockup">
            <img src="$base64Uri" class="logo-img" alt="Stables Logo">
            <h1 class="brand-text">Stables</h1>
        </div>
    </div>

</body>
</html>
"@

# 3. Write the new file
Set-Content -Path $targetFile -Value $newHtml
Write-Host "Successfully created $targetFile with original logo."



