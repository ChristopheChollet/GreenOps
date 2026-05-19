# Roadmap compétences — 12 mois (niche climat / énergie · SaaS Web2 · Web3 optionnel)

Document personnel : **piste d’entraînement** pour monter en niveau (technique + livraison + communication).  
Ce n’est **pas** une promesse de titre RH (« senior »), ni une garantie de missions ou de revenus — à **réviser chaque trimestre** selon ce que tu apprends sur le terrain.

**Fiche client / marché** (document séparé, même dossier) : [fiche-client-demarchage-missions.md](fiche-client-demarchage-missions.md) — démarchage, messages types, cadrage mission, conseils terrain.

---

## 1. Positionnement cible (rappel)

- **Profondeur (barre verticale du T)** : ingénierie **produit web SaaS** — Next.js, TypeScript, données, auth/permissions, mise en prod, qualité.
- **Large (barre horizontale)** : compréhension **énergie / climat / opérations**, communication client, bases **sécurité** et **observabilité** ; **blockchain comme outil** (traçabilité, registre, coordination) **quand le cas métier le justifie**, pas comme label « crypto ».

**Projets de référence** : GreenOps (console SaaS), GreenChain Common (dApp modulaire · Web3 pédagogique / POC).

---

## 2. Principes pour les 12 mois

1. **Une priorité à la fois** par trimestre (éviter de disperser sur 10 sujets).
2. **Ownership** : clarifier besoin → livrer → recetter → assumer la correction des bugs liés au périmètre.
3. **Preuve marché** : à chaque trimestre, viser au moins une **preuve externe** (mission courte, étude de cas, contribution visible, reco).
4. **Adapter** : si une mission réelle te force sur un sujet (perf, sécu, intégration), tu réordonnes — la réalité bat la théorie.

---

## 3. Habitudes hebdomadaires (toute l’année)

| Habitude | Pourquoi |
|----------|----------|
| **2–5 h** de travail structuré sur GreenOps *ou* repo mission | Progression mesurable sans burnout |
| **1 session debug méthodique** (reproduire → isoler → corriger → prévenir) | Compétence #1 en prod |
| **Lecture de doc officielle** (Next / Supabase / Postgres) avant de « stackoverflow » | Évite les faux patterns |
| **Pipeline commercial** (ex. LinkedIn) selon ton rythme | Les compétences sans conversations restent invisibles |

---

## 4. Trimestre 1 — Fiabilité & « livraison propre »

**Objectif** : passer de « ça marche sur ma machine » à « **je maîtrise le flux principal** et je peux le faire évoluer sans tout casser ».

### Technique (priorités)

- **Auth + modèle de données** GreenOps : tu peux expliquer le flux (sessions / rôles / tables / RLS si applicable).
- **Supabase / Postgres** : au minimum — schéma lisible, migrations propres, pas de requêtes « mystère ».
- **Qualité minimale** : checklist de recette manuelle + **2 à 5 tests ciblés** (chemins critiques : login, règle métier clé, une route sensible).
- **Environnements** : variables d’environnement, secrets hors repo, déploiement reproductible (README court).

### Produit / niche

- Reformuler **1 parcours utilisateur** métier (flex / registre / dashboard) comme **user story + critères d’acceptation**.

### Freelance / marché

- **Lots courts** + proposition écrite ; objectif : **première mission** ou équivalent « engagement sérieux » (POC rémunéré, audit court).

### Indicateurs de fin de T1

- Tu corriges un bug **sans aide AI sur toute la chaîne** sur au moins une zone à toi.
- Un nouveau dev peut **installer et lancer** avec ton README.
- Tu as une **trace écrite** d’au moins une offre / proposition type.

---

## 5. Trimestre 2 — SaaS « confirmé » sur ta stack

**Objectif** : features plus complexes, données et UX « produit ».

### Technique

- **Données** : index simples, pagination, éviter N+1 évidents ; validations serveur/client cohérentes.
- **UX états** : chargement, erreurs, empty states, permissions visibles.
- **Perf « raisonnable»** : bundles, images, requêtes évidentes à optimiser.
- **Sécu web bases** : XSS/CSRF (notions utiles), gestion des secrets, surface d’upload si présente.

### Niche

- **1 mini-spec** « tableau de bord énergie/climat » : KPI fictifs mais réalistes, définitions, sources.

### Freelance

- Enchaîner **2e mission** ou prolonger en récurrence ; documenter **livré / hors-scope**.

### Indicateurs de fin de T2

- Une feature « large » livrée avec **périmètre stable** (peu de dérive).
- Tu expliques **trade-offs** (temps vs complexité) à un non-dev en 5 minutes.

---

## 6. Trimestre 3 — Ownership & exploitation

**Objectif** : tenir un **service** (pas seulement des écrans).

### Technique

- **Observabilité** : logs structurés, gestion d’erreurs, identification rapide des incidents.
- **Rollback / releases** : stratégie simple (tags, branches, checklist).
- **Architecture** : séparation UI / logique métier ; modules testables.

### Soft skills

- **Estimation** par lots ; communication sur risques **sans dramatiser**.
- **Compte-rendu** client court après chaque jalon.

### Web3 (optionnel, si niche)

- Renforcer **GreenChain** sur **un module** (lisibilité événements, erreurs wallet, doc testnet) — pas tout refaire.

### Indicateurs de fin de T3

- Tu résous un incident « prod » (même démo) avec **timeline + cause + correctif**.
- Un client peut **valider** avec une recette écrite sans ambiguïté.

---

## 7. Trimestre 4 — Crédibilité marché dans ta niche

**Objectif** : être **lisible** pour un acheteur climat/énergie.

### Livrables « vitrine »

- **1 étude de cas** (format court) : contexte → contraintes → solution → stack → résultat **vérifiable** (lien démo / captures anonymisées).
- **Recommandations** (LinkedIn / Malt) si missions faites.
- **Portfolio** à jour : GreenOps en tête Web2 ; GreenChain en « option métier ».

### Technique

- Durcir **sécurité & conformité pragmatique** sur les parties sensibles (données utilisateur, exports).
- Revue « **dette technique** » : 10 tickets priorisés pour la suite.

### Web3 niche énergie

- Si pertinent : **POC testnet** documenté (risques, limites, pas de promesse « prod chain » sans audit).

### Indicateurs de fin de T4

- Tu peux défendre ton **TJM** avec **preuves + méthode**.
- Ton message LinkedIn/Malt et ton GitHub racontent **la même histoire**.

---

## 8. Module optionnel — Blockchain « outil », pas « hype »

À répartir sur T3–T4 si tu veux garder la formation initiiale vivante :

- Contrats **simples**, tests Hardhat, scripts deploy **testnet**.
- **UX transactionnelle** : erreurs utilisateur, états pending, coûts gas expliqués superficiellement.
- **Limites** : pas recommander la chaîne pour tout ; savoir dire **« pas nécessaire ici »**.

---

## 9. Ce que tu ajoutes volontairement (au-delà des tutos)

| Sujet | Utilité niche |
|-------|----------------|
| **RGPD / données personnelles** (bases) | SaaS B2B, exports, comptes |
| **Contrats / API externes** | Intégrations opérationnelles |
| **Accessibilité** (bases) | Produits internes sérieux |
| **Anglais technique** (lecture) | Docs, libs, clients EU |

---

## 10. Revue trimestrielle (template)

À remplir en fin de chaque trimestre :

1. **Ce que j’ai livré** (liens / missions).  
2. **Ce que j’ai appris** (3 bullets).  
3. **Ce qui a été trop ambitieux** → ajuster le trimestre suivant.  
4. **Un objectif unique** pour le trimestre suivant (la « une chose »).

---

## 11. Rappel honnête

- **Senior** en entreprise = souvent années + responsabilité transverse ; cette roadmap vise surtout **compétence réelle et crédibilité marché** en ~12 mois.  
- Le titre suit parfois plus tard que les capacités — ou l’inverse selon les boîtes.

*Bonne route — document vivant : modifie-le au fil de tes missions réelles.*
