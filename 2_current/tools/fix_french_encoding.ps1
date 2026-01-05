$path = "H:\My Drive\Stablesworks\assets\Stables - Presentation EN-FR v01.html"
$content = [IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# Replace 1: qu\'un -> qu'un
$content = $content.Replace("qu\'un", "qu'un")

# Replace 2: l\'avenir -> l'avenir
$content = $content.Replace("l\'avenir", "l'avenir")

# Replace 3: l\'&eacute;cosyst&egrave;me
$content = $content.Replace("l\'&eacute;cosyst&egrave;me", "l'&eacute;cosyst&egrave;me")

[IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
Write-Host "French encoding fixed."



