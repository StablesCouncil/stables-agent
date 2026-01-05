$logoPath = "C:\Users\Charles\.gemini\antigravity\scratch\Stables\2_current\app\assets\stables_logo.png"
$logoBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($logoPath))
$logoData = "data:image/png;base64," + $logoBase64

$files = @(
    "c:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\docs\presentations V01\stables - presentation en fr v01.html",
    "c:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\docs\presentations V01\stables - presentation en v01.html"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        # Read as UTF8 but allow for some distortion to be cleaned up
        $content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)
        
        # 1. Update Logo Source and Position
        # Ensure name then logo on the right
        $newLogotype = '<div class="brand-logotype"><span class="brand-name">STABLES</span><img src="' + $logoData + '" alt="Stables Logo" class="hero-logo"></div>'
        $content = [regex]::Replace($content, '(?s)<div class="brand-logotype">.*?</div>', $newLogotype)

        # 2. Update CSS for logo: constrained size + mix-blend-mode to remove black background
        $cssFix = ".hero-logo { width: 80px !important; height: 80px !important; object-fit: contain; margin-top: 0 !important; mix-blend-mode: screen; }"
        if ($content -match "\.hero-logo \{") {
            $content = [regex]::Replace($content, '\.hero-logo \{.*?\}', $cssFix)
        }
        else {
            $content = $content.Replace(".brand-logotype {", $cssFix + "`n        .brand-logotype {")
        }

        # 3. Fix the French translations block with Unicode escapes for reliability
        $frTranslations = @'
            fr: {
                "hero-title": "Plateforme Mon\u00e9taire",
                "hero-tagline": "L\u0027argent qui est vraiment le v\u00f4tre. S\u00e9curis\u00e9, pseudonyme et inarretable",
                "btn-testing": "Commencer le test",
                "btn-soon": "Prochainement",
                "btn-follow": "Suivez-nous sur X",
                "badge-you": "POUR VOUS",
                "wallet-title": "Payez instantan\u00e9ment. Poss\u00e9dez totalement.",
                "wallet-p": "D\u00e9couvrez l\u0027argent qui circule aussi vite qu\u0027un message. Pas de banques pour geler votre compte. Pas de frais cach\u00e9s. Juste un portefeuille simple et puissant qui vous donne un contr\u00f4le total sur vos actifs.",
                "wallet-li1": "<strong>100% Auto-garde :</strong> Vous seul poss\u00e9dez les cl\u00e9s.",
                "wallet-li2": "<strong>Pr\u00eat pour le quotidien :</strong> Rapide, \u00e9conomique et simple.",
                "wallet-li3": "<strong>Stables :</strong> Con\u00e7u pour conserver sa valeur.",
                "badge-business": "POUR LES ENTREPRISES",
                "biz-title": "R\u00e8glement en quelques secondes. Connectez-vous directement.",
                "biz-p1": "Arr\u00eatez d\u0027attendre des jours pour votre argent. Avec Stables, les paiements sont confirm\u00e9s et r\u00e9gl\u00e9s en quelques secondes. \u00c9tablissez une relation directe avec vos clients sans interm\u00e9diaires.",
                "biz-p2": "Parfait pour le commerce moderne, des boutiques locales aux services mondiaux.",
                "badge-growth": "POUR LA CROISSANCE",
                "growth-title": "Le Multiplicateur.",
                "growth-p1": "Une nouvelle fa\u00e7on de participer \u00e0 la stabilit\u00e9 de l\u0027\u00e9cosyst\u00e8me. Utilisez le Multiplicateur pour amplifier votre exposition et soutenir la r\u00e9silience du r\u00e9seau.",
                "growth-p2": "Des outils avanc\u00e9s pour ceux qui veulent faire plus que simplement payer.",
                "cta-title": "Pr\u00eat \u00e0 fa\u00e7onner l\u0027avenir ?",
                "cta-p": "Rejoignez le test public. Essayez de casser le syst\u00e8me. Aidez-nous \u00e0 construire la plateforme mon\u00e9taire la plus fiable au monde.",
                "footer": "Stables - Pr\u00e9sentation Informationnelle v1.0",
                "mock-wallet": "Portefeuille",
                "mock-coffee": "Caf\u00e9t\u00e9ria",
                "mock-salary": "Salaire",
                "mock-merchant": "Vue Marchand",
                "mock-status": "Statut : En ligne",
                "mock-paid": "PAY\u00c9",
                "mock-order": "Commande #8291",
                "mock-receipt": "Imprimer le re\u00e7u",
                "mock-investment": "Investissement",
                "mock-multi": "Multiplicateur",
                "mock-pos": "Position Active",
                "mock-yield": "Rendement",
                "mock-apy": "APY Actuel"
            }
'@
        $content = [regex]::Replace($content, '(?s)fr: \{.*?\}', $frTranslations)

        # 4. Remove "taking a cut" from EN
        $content = $content.Replace("without intermediaries taking a cut.", "without intermediaries.")
        
        # 5. Save with UTF8 no BOM
        [System.IO.File]::WriteAllText($file, $content, (New-Object System.Text.UTF8Encoding($false)))
        Write-Output "Applied fix to $file"
    }
}
