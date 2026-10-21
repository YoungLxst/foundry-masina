# La Mašina — système Foundry VTT

Système de jeu pour **La Mašina**, un JDR d'âge du fer, rude et presque sans magie.
Compatible Foundry VTT **v13 et v14**.

## Installation

Le dossier du système **doit s'appeler `masina`** (c'est l'`id` du `system.json`) :

```bash
cd FoundryVTT/Data/systems
git clone https://github.com/YoungLxst/foundry-masina.git masina
```

Si le dépôt est déjà cloné sous le nom `foundry-masina`, il suffit de renommer le dossier en `masina`.
Relancez Foundry, puis créez un monde avec le système « La Mašina ».

Pour mettre à jour : `git pull` dans le dossier `masina`, puis rechargez le monde (F5).

## Ce que fait le système (v0.1)

### Fiche de personnage
- **Caractéristiques** : score, VC (score ÷ 2) et modificateur (VC − 5) calculés automatiquement.
- **Compétences** : niveau, maximum (B + 4 pour la classe, B + 2 sinon), total VC + niveau − M, compteur des 30 points de création.
- **B, M, emplacements** selon le niveau ; SD de classe (7 + VC principale + B) ; SD de lecture (10 + B).
- **Défense passive** : VC CON + VC DEX (limitée par l'armure) + bouclier.
- **Armure localisée** : PA par zone calculé depuis les armures équipées (superposition du gambison comprise), usure, réparation.
- **Blessures graves** par zone, avec les tables d'effets, le suivi des soins et des repos.
- **Roulement** : aptitudes équipées, compteur d'emplacements, Postures / Techniques / Réflexes / passifs, limites 1/combat et 1/jour.
- **Corruption** et marques de la Mašina aux paliers 3, 5, 7 et 9.
- Charge, vitesse, bourse, histoire, liens, notes.

### Jets
- **Jet de base** : VC + compétence + 1d10. Sur un **10 naturel** on relance et on ajoute, sur un **1 naturel** on relance et on retire.
- Avantage / désavantage (2d10, on garde le meilleur ou le pire), modificateurs, SD avec les degrés de réussite
  (exceptionnelle, réussite, réussite à un prix, échec, échec grave).
- **Maj + clic** sur une compétence : jet rapide sans fenêtre.
- Les compétences qui ne s'improvisent pas (Lettres, langues, Langue de Fer) refusent le jet au niveau 0.

### Combat
1. **Attaque** (clic sur une arme) : comparaison automatique avec la DP des cibles (touche T), critique sur 10 naturel, zone visée avec son malus.
2. **Se défendre** (bouton sur la carte) : Blocage, Parade ou Esquive, avec les règles de chaque classe (Blocage naturel du Soldat, riposte du Fourbe…).
3. **Dégâts** : localisation au d10, multiplicateurs qui s'additionnent (critique, tête, Techniques), dés en plus, finesse, arbalètes sans modificateur.
4. **Appliquer** : retire le PA de la zone (÷ 2 contre le perce-armure), use l'armure, retire les PV, vérifie le seuil de blessure et tire la blessure grave, gère l'inconscience et la mort.
- **Lire l'adversaire** : Perception contre 10 + B de la cible ; la Posture est révélée en message privé au joueur et au MJ.
- **Initiative** : VC DEX + 1d10 (égalité : meilleure Perception).
- PNJ : rang (sbire B 2, vétéran B 3, chef B 4) et postures Offensive / Défensive appliquées automatiquement.
- États de la Mašina sur les jetons (à découvert, à terre, étourdi, saignement…).

### Compendiums
- **Armes** (toute la table de l'équipement), **Armures et boucliers**.
- **Équipement d'aventurier** : matériel, soins et poisons, munitions, vêtements, outils de métier, services, montures, véhicules, bateaux et marchandises.
- **Aptitudes de classe** : niveaux 1 à 5 des trois classes et aptitudes de voie du niveau 3.
- **Aptitudes de peuple** : passives (⚠ = défaut) et aptitudes de Roulement de chaque peuple, plus l'héritage des Marqués.
- **Bestiaire** (privé par défaut) : les 17 PNJ et créatures du chapitre, avec leurs armes, armures, capacités, PA naturel et Résistance au fer. Faiblesses, Monstrologie et butin sont dans des blocs secrets.
Glissez-les sur la fiche ou sur la scène. Les aptitudes de peuple de Roulement prennent un emplacement normal.

### Confidentialité
- Accès **limité** à une fiche : on ne voit que le portrait, le nom et la description publique (sans les secrets). Ni valeurs, ni notes.
- Les blocs **secrets** des descriptions ne sont visibles que des propriétaires et du MJ.

## Pas encore automatisé
- Les effets chiffrés des Postures des personnages (ils sont décrits sur la fiche, à ajouter à la main dans la fenêtre de jet).
- Les bonus de caractéristiques et les niveaux de compétence de peuple se saisissent à la main.
- Les aptitudes des niveaux 6 à 20.

## Développement

```
system.json            manifeste
masina.mjs             point d'entrée
module/config.mjs      toutes les données de règles (compétences, classes, peuples, blessures…)
module/data/           modèles de données (acteurs, objets) et valeurs dérivées
module/documents/      jets, attaque, défense, dégâts, repos
module/sheets/         fiches (ApplicationV2)
templates/             gabarits Handlebars
styles/masina.css      styles
tools/                 génération des compendiums
packs/                 compendiums compilés (LevelDB)
```

Pour modifier les compendiums : éditez `tools/donnees/*.mjs`, puis

```bash
npm install
npm run build:packs
```

(Foundry doit être fermé pendant la compilation.)
