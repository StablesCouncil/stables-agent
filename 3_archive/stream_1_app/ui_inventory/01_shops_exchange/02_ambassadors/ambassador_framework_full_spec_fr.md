# Programme d'Ambassadeurs Stables : L'Économie des 16 Big Mac®

Ce document définit l'architecture centrale du programme d'Ambassadeurs Stables, plus précisément "l'économie des 16 Big Mac®".

## 🎯 1. Objectif
Notre objectif principal est de construire un réseau professionnel et motivé d'Ambassadeurs rémunérés pour soutenir la croissance du réseau de commerçants acceptant les paiements Stables. Les Ambassadeurs constituent la couche humaine qui intègre les commerçants dans la boucle économique de Stables et garantit un répertoire de haute qualité et de confiance.

## ⚖️ 2. Contraintes
- **Entièrement Ouvert :** Nous avons une structure totalement ouverte où n'importe qui peut devenir Ambassadeur.
- **Équitable et Mondial :** Tous les frais sont indexés sur l'Indice Big Mac pour rester équitables à l'échelle mondiale.
  Référence : [Indice Big Mac par pays](https://worldpopulationreview.com/country-rankings/big-mac-index-by-country)

## 🛑 3. Le Problème : Le Contournement par Auto-Inscription
Comment s'assurer que les commerçants n'ont pas d'incitation financière à s'inscrire eux-mêmes pour capter la rémunération de l'Ambassadeur ?

Dans un système ouvert, il existe un risque qu'un commerçant tente de contourner l'Ambassadeur qui lui a présenté le projet pour "auto-capturer" la récompense d'inscription.

## 💡 4. Notre Solution : L'Économie des 16 Big Mac®
Nous résolvons ce problème en veillant à ce que le coût d'entrée et la récompense active soient déconnectés, et en faisant de la Trésorerie le mentor par défaut.

### **Cœur Économique :**
- **Frais d'Entrée :** 16 Big Mac® est un coût fixe pour tout le monde (commerçants et Ambassadeurs).
- **Répartition de l'Inscription :**
    - 8 Big Mac® pour l'Ambassadeur Actif (dans un hub mentoré) ou 9 Big Mac® (si direct)
    - 1 Big Mac® de Récompense Mentor (si l'Ambassadeur a lui-même été mentoré)
    - 7 Big Mac® pour la Trésorerie du Conseil
- **Captations de la Trésorerie :** La Trésorerie du Conseil capte **7, 8 ou 16 Big Mac®** selon le scénario.
- **Durée de l'Inscription :** Les frais d'entrée de 16 Big Mac® couvrent une **inscription de 12 mois**. Les renouvellements suivent la même logique économique.
- **Utilité Future :** Cette même logique s'applique aux campagnes publicitaires des commerçants, avec une **répartition 8/1/7** par tranche de 16 Big Mac® dépensés.

---

## 🏛️ 5. Les Scénarios Type

### **Scénario 1 : L'Ancre Universelle (L'Auto-Inscription)**
C'est le point de départ pour chaque participant. Que vous soyez un futur Ambassadeur ou un commerçant local choisissant de s'inscrire lui-même sans présentation externe, votre première entrée dans le répertoire officiel est l'**Ancre Universelle**.
- **Action :** L'utilisateur B s'inscrit directement dans l'application.
- **Vérification sur la Chaîne :** Le champ `mentor` pour B est vide (NULL).
- **Répartition :** 100% (16 Big Mac®) → **Trésorerie du Conseil**.
- **Résultat :** B est désormais un participant référencé "Vérifié". En choisissant de s'auto-inscrire, B a payé l'intégralité des frais d'ancrage à la Trésorerie, établissant ainsi la valeur de base du réseau. B peut désormais agir en tant qu'Ambassadeur pour d'autres personnes.

### **Scénario 2 : Inscription Mentorée Standard**
L'Ambassadeur A (Mentor) inscrit un nouveau commerçant (B).
- **Action :** Le commerçant B est inscrit par A.
- **Vérification sur la Chaîne :** Le mentor de B est défini comme étant A.
- **Répartition :** 7 Big Mac® → **Trésorerie du Conseil** et 9 Big Mac® → **Ambassadeur A**.
- **Résultat :** A est récompensé pour sa présentation et son soutien. Le Conseil reçoit 7.

### **Scénario 3 : Expansion du Hub (Récompense Mentor)**
Le commerçant B (qui a été inscrit par A) inscrit à son tour le commerçant C.
- **Action :** Le commerçant C est inscrit par B.
- **Vérification sur la Chaîne :** B a un mentor (A).
- **Répartition :** 7 Big Mac® → **Trésorerie du Conseil**, 8 Big Mac® → **Commerçant B (Actif)**, et 1 Big Mac® → **Ambassadeur A (Mentor)**.
- **Résultat :** Le commerçant B gagne pour son travail actif, et A gagne pour avoir mentoré B. Le Conseil reçoit 7.

### **Scénario 4 : Inscription Indépendante (Le Bouclier)**
Le commerçant B choisit de contourner l'Ambassadeur A et de s'auto-inscrire pour "devenir indépendant". Ensuite, B inscrit le commerçant C.
- **Action :** Le commerçant C est inscrit par B.
- **Vérification sur la Chaîne :** B n'a AUCUN mentor (auto-inscrit).
- **Répartition :** 8 Big Mac® → **Trésorerie du Conseil** et 8 Big Mac® → **Commerçant B (Actif)**.
- **Résultat :** Le commerçant B ne gagne toujours que 8 Big Mac®. La "part de mentor non réclamée" revient au Conseil. Cela signifie que B n'a aucun avantage financier à contourner A.

---

## 🏗️ 6. Mise en Œuvre Technique : Comment le système fait la distinction

Le registre Stables suit une adresse optionnelle de `mentor` pour chaque participant inscrit. Ce `mentor` est défini uniquement lors de la toute première inscription (Scénario 1) et ne peut jamais être modifié.

- **Commerçant Auto-Inscrit :** Le champ `mentor` est NULL.
- **Commerçant Mentoré :** Le champ `mentor` est défini sur l'adresse de l'Ambassadeur qui a effectué l'inscription.

Lorsqu'un participant (B) inscrit un nouveau commerçant (C), le code vérifie le **profil de B** :
1. B a-t-il un mentor ?
   - **Oui (A a mentoré B) :** B fait partie d'un Hub. La répartition est **8 pour B, 1 pour A, 7 pour le Conseil**.
   - **Non (B est indépendant) :** B est solo. La répartition est **8 pour B, 8 pour le Conseil** (l'unité du mentor revient à la Trésorerie).
2. La récompense active pour B est **toujours de 8 Big Mac®**. Cette récompense fixe garantit que B n'a aucune incitation financière à contourner son mentor d'origine.

### **Acceptation des Paiements sans Frais**
Stables repose sur une technologie de protocole ouvert. Tout commerçant peut accepter des paiements Stables immédiatement et sans frais, simplement en générant une adresse Minima. L'acceptation des paiements est gratuite et sans permission.

### **Les Avantages d'être Référencé**
Choisir de payer les frais d'entrée de 16 Big Mac® pour être référencé dans l'application officielle Stables offre des avantages cruciaux :
- **Visibilité :** Mise en avant sur la carte mondiale Stables et dans le répertoire des commerçants.
- **Confiance et Vérification :** Le référencement confère un statut "Vérifié", montrant que le commerçant fait partie de la communauté officielle.
- **Découvrabilité :** Les clients cherchant à dépenser des Stables peuvent trouver le commerçant par catégories et géolocalisation.
- **Croissance du Réseau :** Accès au support local des Ambassadeurs et aux futures campagnes marketing à l'échelle du protocole.

### **Les Ambassadeurs comme Commerçants Spécialisés**
Les Ambassadeurs sont eux-mêmes référencés comme un type de commerçant dans l'application. Cela leur permet de présenter leurs services et d'être trouvés par d'autres commerçants en fonction de la géolocalisation et d'autres critères. Un commerçant peut rechercher un Ambassadeur à proximité pour recevoir une formation, une aide à l'inscription ou un support technique.

### **Accords de "Side Letter"**
Le protocole Stables définit la distribution standard des frais sur la chaîne. Cependant, nous prévoyons que les Ambassadeurs et les commerçants puissent conclure des accords de "Side Letter" pour partager les commissions.
- **Transparence sur la Chaîne :** Ces paramètres peuvent être convenus directement dans le contrat d'inscription, rendant les conditions de rétrocession visibles par tous sur la blockchain.
- **Flexibilité Privée :** Alternativement, ces accords peuvent être conclus indépendamment comme une deuxième étape privée en dehors du protocole d'inscription principal.
Bien que le protocole par défaut soit la répartition 7/8/16, ces "side letters" permettent des relations commerciales sur mesure tandis que l'ancre des 16 Big Mac® protège toujours la base de la Trésorerie.

### **Futures Campagnes Publicitaires**
La logique de mentorat établie ici ne se limite pas à l'inscription initiale. Le même mécanisme s'appliquera aux futures campagnes publicitaires menées par les commerçants référencés. Lorsqu'un commerçant paie pour lancer une promotion ou une campagne à l'échelle du réseau, la récompense suit le modèle du hub : 8 Big Mac® pour l'Ambassadeur actif, 1 Big Mac® pour le Mentor, et 7 Big Mac® pour la Trésorerie du Conseil.

### **Système d'Évaluation et d'Avis sur la Chaîne**
Pour garantir la qualité du réseau de commerçants Stables, l'application comprend un système d'avis par étoiles et de commentaires.
- **Vérification sur la Chaîne :** Chaque avis est lié à une transaction sur la blockchain, prouvant que l'auteur de l'avis est un véritable client.
- **Mécanisme Anti-Spam :** Pour maintenir des retours de haute intégrité, un avis n'est publié que si le client a dépensé un **montant seuil minimum** dans la boutique du commerçant.
- **Modération des Ambassadeurs :** Les Ambassadeurs jouent un rôle clé dans le suivi de ces avis afin de soutenir les commerçants qu'ils encadrent.

---

## 🏛️ 7. La Trésorerie du Conseil

La Trésorerie du Conseil Stables est le moteur économique du protocole, conçu selon les principes fondamentaux suivants :

- **Propriété Basée sur le Code :** La trésorerie n'appartient à personne. Elle est entièrement régie par le code et les règles du protocole pour soutenir la croissance à long terme de l'écosystème.
- **Agent Économique Libre :** La trésorerie agit comme un agent économique autonome. Elle recherche activement des opportunités financières pour accroître sa base, principalement par des opportunités d'arbitrage sur le réseau et les marchés liés.
- **Gouvernance du Budget :** Bien que la trésorerie soit automatisée, son budget de croissance est alloué via la gouvernance communautaire.
- **Vote Pondéré par le Temps :** Les votes sur le budget sont menés périodiquement par la communauté. Le pouvoir de vote est déterminé sur une base de **détention de jetons pondérée par le temps**, récompensant ceux qui ont engagé leur "skin-in-the-game" dans le protocole pour la plus longue durée.

---

## 🎬 8. Résumé
Ce cadre démontre une économie "régie par le code" qui récompense le mentorat tout en protégeant la trésorerie. Il transforme la compétition humaine en une structure collaborative de cellules et de hubs où la trésorerie se développe toujours comme une ressource collective pour l'ensemble du réseau Stables.
