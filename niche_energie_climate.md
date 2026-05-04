# Niche énergie / climat / Web3 — notions et parcours

Document de référence pour monter en **logique métier** dans l’intersection **énergie**, **carbone**, **marchés / flexibilité** et **Web3** (traçabilité, gouvernance, oracles).

## Ce que ce document couvre (et ce qu’il ne remplace pas)

- **Couvre** : une **cartographie** des concepts à connaître pour **comprendre le domaine**, **poser les bonnes questions** et **cadrer** des MVP (type vault, marché flex, registre REC, crédits démo, DAO).
- **Ne couvre pas** : expertise **juridique** pays par pays, **ingénierie réseau** avancée, **modélisation** prix spot détaillée, **conformité** spécifique à un client — à compléter selon projets.
- **Junior → mid** : maîtriser ces notions **+** **livrer** des systèmes fiables (Web2 et/ou Web3), **documenter** les limites, et **traduire** métier ↔ technique correspond à ce qu’on attend souvent d’un profil **intermédiaire**. La liste seule ne suffit pas sans **pratique** et **responsabilité** sur des features réelles.

---

## Checklist ~30 notions (junior accessible → mid)

### A. Électricité & système (fondations)

1. **kW vs kWh** — puissance instantanée vs énergie sur une période.
2. **Charge vs production** — équilibre offre/demande en temps réel (image simplifiée).
3. **Flexibilité** — décaler ou moduler la conso/prod pour aider l’équilibre.
4. **Courbe de charge** — forme typique jour/nuit ; pics et vallées.
5. **Ancillary services / réserves** (concept) — services système pour stabiliser le réseau (noms exacts varient par pays).
6. **Producteur / consommateur / prosumer** — qui injecte, qui prélève, qui fait les deux.
7. **Agrégateur** — acteur qui regroupe des flexibilités pour les vendre sur un marché.
8. **TSO / DSO** (gros traits EU) — transport vs distribution ; qui opère quoi (sans devenir expert d’un TSO national).

### B. Marchés & mécanismes (sans juriste, mais pro)

9. **Marché de gros / spot** (idée) — prix court terme ; lien avec la flex.
10. **Contrats / engagements** — pourquoi un créneau « flex » a une valeur contractuelle.
11. **Prévision vs réalisation** — erreur de prévision = risque ; pourquoi les oracles/compteurs comptent.
12. **Pénalités / settlement** — que se passe-t-il si on ne tient pas l’engagement ? (logique métier).

### C. Garanties d’origine & traçabilité énergie

13. **GO / REC** — certificat lié à **1 MWh** produit ; séparation énergie physique / attribut.
14. **Double comptage** — même MWh revendiqué deux fois ; risque central des registres.
15. **Émission / retrait / annulation** — cycle de vie d’un certificat dans un registre (même en démo).
16. **Granularité temporelle** — annuelle vs horaire ; enjeu des revendications type 24/7 CFE (concept).
17. **Book & claim** — modèle d’allocation comptable des attributs vs « ligne physique dédiée ».

### D. Carbone (volontaire vs réglementé)

18. **Scopes 1 / 2 / 3** — périmètre d’émissions directes / énergie / chaîne de valeur.
19. **Facteurs d’émission** — intensité carbone du kWh, du transport, etc.
20. **Crédits carbone volontaires vs compliance** — deux mondes ; risque de confusion marketing.
21. **Additionnalité / permanence** (vocabulaire) — pourquoi tous les « crédits » ne se valent pas.
22. **Greenwashing risk** — quand une appli « carbone » promet trop sans preuve.

### E. Web3 appliqué (différenciation)

23. **Compte / transaction / état on-chain** — ce qui est public, coûteux, lent vs ce qui doit rester off-chain.
24. **Smart contract = règles automatiques** — mais pas « oracle du monde réel » magique.
25. **Oracle** — qui pousse quelle donnée on-chain ; attaques, délais, confiance.
26. **Token vs registry off-chain** — ce que le jeton **prouve** vraiment (possession, droit, dette…).
27. **ERC-20 / ERC-721 / ERC-1155** (logique) — quand utiliser quel standard pour des lots ou des droits.
28. **Gouvernance on-chain** — propositions, quorum, fenêtres de vote ; limites légales / opérationnelles.
29. **Upgradeabilité & admin keys** — qui peut changer le contrat ; risque de centralisation.
30. **Quand SQL + signatures suffisent** — critères honnêtes pour choisir Web3 vs Web2 (compétence « senior » tôt).

---

## Utilisation (rythme suggéré)

- **Semaines 1–2** : notions **1 → 8** et **13 → 17** (énergie + GO/REC).
- **Semaines 3–4** : notions **9 → 12** et **18 → 22** (marchés légers + carbone).
- **Ensuite** : notions **23 → 30** en les recollant au code (vault, market, REC, gouvernance).

Pour chaque notion, objectif minimal : **une phrase** de définition + **un exemple** lié à un produit (MVP, registre, flex, etc.).

---

## Modèles produit & compétences full-stack (SaaS, données, intégrations)

Complément **côté dev** pour un profil **full-stack niche énergie / climat** : au-delà de **SaaS** (GreenOps) et **dApp** (GreenChain Common), autant **connaître l’éventail** **sans** tout paralléliser. **L’ordre d’apprentissage** en bas est indicatif.

### Types de produits / modèles (utiles à connaître)

| Bloc | Intérêt dans la niche | Niveau à viser |
|------|------------------------|----------------|
| **SaaS B2B** | Abonnement, multi-comptes, org | **Cœur** (GreenOps) |
| **Marketplace / plateforme** | Flex, capacité, REC (règles, matching) | **Concept** + 1 POC souvent suffisant |
| **Data / ETL léger** | CSV, API, jobs (l’énergie = **données**) | **Très** utile |
| **API produit** | Exposer l’outil au SI client, webhooks | **Important** en B2B |
| **Temps réel / streaming** (léger) | Courbes, alarmes | **Option** ; souvent après le batch |
| **PWA** | Terrain, techniciens | Souvent **avant** une app store native |
| **IoT / edge** (notion) | Capteurs → remontée | **Veille** ; souvent avec **partenaire** terrain |
| **Reporting / exports** (CSV, PDF) | Bilan, preuves, exigences clients | **Très** demandé en B2B climat |

### Spécialisations transverses (métier + numérique)

- **Séries temporelles** : courbes, pas de temps, trous de données, agrégations.
- **Marchés / mécanismes** (vocabulaire) : flex, capacité, GO/REC côté **marché** (pas besoin d’être trader).
- **Carbone / reporting** (niveau **awareness** au début) : GHG, périmètres, **CSRD** en gros traits — **parler** la langue des interlocuteurs.
- **Interop** : REST, webhooks, **OAuth** (client → tiers) — nerf du SaaS B2B.
- **Sécurité de base** : secrets, RLS, validation côté serveur — crédibilité.
- **Observabilité** légère : logs, erreurs (même simple sur hébergeur).
- **CI** (GitHub Actions) : build, lint, tests ciblés.
- **Cadrage produit** : PRD court, user flows — accélère SaaS et dApp.

### Ordre d’apprentissage **réaliste** (indicatif)

*Base de cet ordre : (1) **ship** d’abord une preuve démontrable, (2) **dépendances** techniques (exports/API après un produit qui tient), (3) **usage fréquent** côté B2B climat (rapports, intégrations), (4) **complexité** (IoT / streaming souvent plus tard). **À réordonner** dès qu’un **client** impose une **urgence** réelle (ex. export PDF prioritaire).*

1. **SaaS** opérationnel (déploiement, auth, données) — **GreenOps**.
2. **API** + **exports** (CSV / PDF) — souvent **demandé** en B2B climat.
3. **Données** (time series, qualité, agrégations).
4. **Veille** marché / rég (vocabulaire + **limites** des démos).
5. **Web3** (GreenChain) affiné (oracle, V2) quand le **socle** web2 est **propre**.
6. **IoT / streaming** plutôt **tardif** (souvent projet avec **autre** acteur).

**En une phrase** : à côté de **SaaS** + **blockchain**, ce qui **rapporte** souvent le plus ici, c’est **données** + **intégrations** + **reporting** + **sécurité**, avec un **vocabulaire** métier **honnête** — le reste s’**ajoute** selon **vrais** besoins clients.

---

## Voir aussi

- Projet Web3 modulaire : dépôt **GreenChain Common** (vault, marché, registre REC, démo carbone, DAO).
- Projet Web2 associé : **greenops** (console type SaaS, alignée sur la même vision produit).
- Côté dépôt **GreenChain Common** : `../GreenChainCommon/docs/Open_Source_et_Services.md` (matrice modules / monétisation, depuis la racine du dossier `greenops` à côté sur le Bureau).
