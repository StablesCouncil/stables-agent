import os

file_path = r"c:\Users\Charles\.gemini\antigravity\scratch\Stables\1_development\docs\presentations V01\stables - presentation en fr v01.html"

translations_block = """        const translations = {
            en: {
                "hero-title": "Money Platform",
                "hero-tagline": "Money that is truly yours. Secure, Pseudonymous and Unstoppable",
                "btn-testing": "Start Testing",
                "btn-soon": "Coming Soon",
                "btn-follow": "Follow on X",
                "badge-you": "FOR YOU",
                "wallet-title": "Pay instantly. Own completely.",
                "wallet-p": "Experience money that moves as fast as a message. No banks to freeze your account. No hidden fees. Just a simple, powerful wallet that gives you 100% control over your assets.",
                "wallet-li1": "<strong>100% Self-Custody:</strong> Only you have the keys.",
                "wallet-li2": "<strong>Day-to-day ready:</strong> Fast, cheap, and simple.",
                "wallet-li3": "<strong>Stables:</strong> Designed to hold its value.",
                "badge-business": "FOR BUSINESS",
                "biz-title": "Settled in seconds. Connect directly.",
                "biz-p1": "Stop waiting days for your money. With Stables, payments are confirmed and settled in seconds. Build a direct relationship with your customers without intermediaries.",
                "biz-p2": "Perfect for modern commerce, from local shops to global services.",
                "badge-growth": "FOR GROWTH",
                "growth-title": "The Multiplicator.",
                "growth-p1": "A new way to participate in the stability of the ecosystem. Use the Multiplicator to amplify your exposure and support the network's resilience.",
                "growth-p2": "Advanced tools for those who want to do more than just pay.",
                "cta-title": "Ready to shape the future?",
                "cta-p": "Join the public test. Try to break the system. Help us build the most reliable money platform in the world.",
                "footer": "Stables - Informational Overview v1.0",
                "mock-wallet": "Wallet",
                "mock-coffee": "Coffee Shop",
                "mock-salary": "Salary",
                "mock-merchant": "Merchant View",
                "mock-status": "Status: Online",
                "mock-paid": "PAID",
                "mock-order": "Order #8291",
                "mock-receipt": "Print Receipt",
                "mock-investment": "Investment",
                "mock-multi": "Multiplicator",
                "mock-pos": "Active Position",
                "mock-yield": "Yield",
                "mock-apy": "Current APY"
            },
            fr: {
                "hero-title": "Plateforme Monétaire",
                "hero-tagline": "L'argent qui est vraiment le vôtre. Sécurisé, pseudonyme et inarretable",
                "btn-testing": "Commencer le test",
                "btn-soon": "Prochainement",
                "btn-follow": "Suivez-nous sur X",
                "badge-you": "POUR VOUS",
                "wallet-title": "Payez instantanément. Possédez totalement.",
                "wallet-p": "Découvrez l'argent qui circule aussi vite qu'un message. Pas de banques pour geler votre compte. Pas de frais cachés. Juste un portefeuille simple et puissant qui vous donne un contrôle total sur vos actifs.",
                "wallet-li1": "<strong>100% Auto-garde :</strong> Vous seul possédez les clés.",
                "wallet-li2": "<strong>Prêt pour le quotidien :</strong> Rapide, économique et simple.",
                "wallet-li3": "<strong>Stables :</strong> Conçu pour conserver sa valeur.",
                "badge-business": "POUR LES ENTREPRISES",
                "biz-title": "Règlement en quelques secondes. Connectez-vous directement.",
                "biz-p1": "Arrêtez d'attendre des jours pour votre argent. Avec Stables, les paiements sont confirmés et réglés en quelques secondes. Établissez une relation directe avec vos clients sans intermédiaires.",
                "biz-p2": "Parfait pour le commerce moderne, des boutiques locales aux services mondiaux.",
                "badge-growth": "POUR LA CROISSANCE",
                "growth-title": "Le Multiplicateur.",
                "growth-p1": "Une nouvelle façon de participer à la stabilité de l'écosystème. Utilisez le Multiplicateur pour amplifier votre exposition et soutenir la résilience du réseau.",
                "growth-p2": "Des outils avancés pour ceux qui veulent faire plus que simplement payer.",
                "cta-title": "Prêt à façonner l'avenir ?",
                "cta-p": "Rejoignez le test public. Essayez de casser le système. Aidez-nous à construire la plateforme monétaire la plus fiable au monde.",
                "footer": "Stables - Présentation Informationnelle v1.0",
                "mock-wallet": "Portefeuille",
                "mock-coffee": "Cafétéria",
                "mock-salary": "Salaire",
                "mock-merchant": "Vue Marchand",
                "mock-status": "Statut : En ligne",
                "mock-paid": "PAYÉ",
                "mock-order": "Commande #8291",
                "mock-receipt": "Imprimer le reçu",
                "mock-investment": "Investissement",
                "mock-multi": "Multiplicateur",
                "mock-pos": "Position Active",
                "mock-yield": "Rendement",
                "mock-apy": "APY Actuel"
            }
        };"""

with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

import re
pattern = r'const translations = \{.*?fr: \{.*?\}\s*\};'
new_content = re.sub(pattern, translations_block, content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Successfully updated encoding for {file_path}")
