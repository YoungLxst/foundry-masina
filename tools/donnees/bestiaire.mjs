/**
 * Bestiaire de la Mašina, tiré du chapitre « Le bestiaire ».
 *
 * Les profils donnent des totaux (VC + niveau). Le script de compilation choisit les niveaux de compétence
 * à partir des caractéristiques indiquées ici, et ajoute un bonus d'arme si nécessaire pour retomber
 * exactement sur les valeurs du livre.
 *
 * caracs : scores FOR DEX CON INT SAG CHA (l'initiative du profil = VC DEX)
 * competences : totaux du profil
 * armes : [nom, compétence, attaque totale, dé, modificateur de dégâts, options]
 *         options : { proprietes: [], portee, type, qualite, objet (nom dans le compendium d'armes) }
 * armures : noms dans le compendium « Armures et boucliers »
 * pa : PA naturel { tete, torse, bras, jambes }
 * aptitudes : [genre, nom, effet, { limite }]
 * texte : { accroche, comportement, mj, faiblesses, monstrologie: [[SD, texte]], butin }
 */

export const CATEGORIES = {
  hommes: "Les hommes",
  betes: "Les bêtes",
  masina: "Les créatures de la Mašina"
};

const PARTOUT = n => ({ tete: n, torse: n, bras: n, jambes: n });

export const BESTIAIRE = [
  /* ================================ Les hommes ================================ */
  {
    nom: "Bandit", categorie: "hommes", type: "Humain", menace: 1, B: 2, pv: 14, dp: 10, defense: "parade",
    caracs: [12, 10, 10, 10, 10, 10],
    competences: { parade: 7, discretion: 7, intimidation: 6, survie: 6 },
    armes: [
      ["Masse d'armes", "armesUneMain", 8, "1d6", 1, { objet: "Masse d'armes" }],
      ["Arc court", "arc", 8, "1d6", 0, { objet: "Arc court" }]
    ],
    armures: ["Gambison matelassé"],
    aptitudes: [
      ["passif", "Embuscade", "En terrain boisé, les bandits ont l'avantage aux jets de surprise."]
    ],
    texte: {
      accroche: "Paysan ruiné, déserteur, gamin sans terre. Il a faim, et il a une masse.",
      comportement: "Postures : Offensive / Défensive. Fuit ou se rend quand le moral flanche.",
      butin: "2d6 pf, une arme usée, parfois un objet volé qui intéressera quelqu'un."
    }
  },
  {
    nom: "Chef de bande", categorie: "hommes", type: "Humain", menace: 2, B: 3, pv: 22, dp: 12, defense: "esquive",
    caracs: [14, 12, 12, 10, 12, 12],
    competences: { esquive: 8, intimidation: 10, tactique: 7, perception: 8 },
    armes: [["Hache d'armes", "armesUneMain", 10, "1d8", 2, { objet: "Hache d'armes" }]],
    armures: ["Cuir bouilli"],
    aptitudes: [
      ["technique", "Hurler des ordres", "Jusqu'à trois bandits qui l'entendent ont +2 à leur prochaine attaque.", { limite: "combat" }],
      ["passif", "Moral", "S'il tombe, ses hommes font immédiatement un jet de moral."]
    ],
    texte: {
      accroche: "Celui qui a survécu assez longtemps pour donner les ordres.",
      comportement: "Postures : Offensive / Défensive, ou un Roulement de Soldat de niveau 2.",
      butin: "3d6 pc, une hache, la carte ou la clé de la cachette de la bande."
    }
  },
  {
    nom: "Soldat de garnison", categorie: "hommes", type: "Humain", menace: 2, B: 3, pv: 20, dp: 12, defense: "blocage",
    caracs: [14, 10, 14, 10, 10, 10],
    competences: { blocage: 10, athletisme: 9, perception: 7, intimidation: 7 },
    armes: [
      ["Lance", "armesHast", 9, "1d6", 2, { objet: "Lance" }],
      ["Arbalète légère", "arbalete", 9, "1d8", 0, { objet: "Arbalète légère" }]
    ],
    armures: ["Casque à nasal", "Cotte de mailles", "Bouclier rond"],
    aptitudes: [
      ["passif", "Mur de boucliers", "Chaque soldat adjacent à un autre soldat a +1 DP (maximum +2)."]
    ],
    texte: {
      accroche: "Payé quand le seigneur s'en souvient. Discipliné quand le sergent regarde.",
      comportement: "Postures : Offensive / Défensive. La DP de 12 comprend le bouclier rond.",
      butin: "1d6 pc, la livrée du seigneur (utile pour se déguiser… ou pour se faire pendre)."
    }
  },
  {
    nom: "Purificateur", categorie: "hommes", type: "Humain", menace: 3, B: 4, pv: 28, dp: 13, defense: "parade",
    caracs: [16, 12, 14, 12, 14, 12],
    competences: { parade: 10, volonte: 12, intuition: 10, monstrologie: 9, intimidation: 10 },
    armes: [
      ["Épée longue d'argent", "armesUneMain", 11, "1d8", 3, { objet: "Épée longue", qualite: "argent" }],
      ["Arbalète légère", "arbalete", 10, "1d8", 0, { objet: "Arbalète légère" }]
    ],
    armures: ["Casque à nasal", "Cotte de mailles", "Jambières de cuir (la paire)"],
    aptitudes: [
      ["passif", "Flairer la Mašina", "Avantage en Perception et en Intuition pour repérer un personnage qui a au moins 3 en Corruption."],
      ["passif", "Foi inébranlable", "Immunisé à l'état effrayé."],
      ["passif", "Bûcher", "Il porte de l'huile et de la poix."]
    ],
    texte: {
      accroche: "Chasseur de Marqués au service de l'Ordre de la Cendre Blanche, qui brûle ce qu'il ne comprend pas. Il croit sincèrement sauver le monde.",
      comportement: "Postures : un Roulement de Soldat de niveau 5.",
      butin: "Une épée plaquée d'argent (environ 2 po), un registre de noms, des Marqués « à purifier »."
    }
  },

  /* ================================ Les bêtes ================================ */
  {
    nom: "Loup", categorie: "betes", type: "Bête", menace: 1, B: 2, pv: 12, dp: 13, defense: "esquive",
    caracs: [12, 14, 12, 4, 12, 6],
    competences: { esquive: 9, perception: 9, discretion: 9 },
    armes: [["Morsure", "bagarre", 9, "1d6", 1, { type: "perforant" }]],
    aptitudes: [
      ["passif", "Croc-en-jambe", "Si la morsure touche, la cible fait un jet d'Athlétisme SD 13 ou tombe à terre."],
      ["passif", "Meute", "Les loups encerclent toujours (prise en tenaille, +2)."],
      ["passif", "Odorat", "Avantage aux jets de Perception à l'odorat."]
    ],
    texte: {
      accroche: "Il ne chasse jamais seul.",
      comportement: "Une meute de 2d4 loups. Elle fuit si la moitié des loups tombe.",
      butin: "Peau (5 pc), crocs."
    }
  },
  {
    nom: "Sanglier", categorie: "betes", type: "Bête", menace: 2, B: 2, pv: 22, dp: 11, defense: "aucune",
    caracs: [16, 10, 12, 4, 10, 6],
    competences: { perception: 7, athletisme: 10 },
    armes: [["Défenses", "bagarre", 10, "1d8", 3, { type: "perforant" }]],
    pa: { torse: 2 },
    aptitudes: [
      ["passif", "Charge", "S'il parcourt au moins 6 m en ligne droite avant d'attaquer, +1 DA, et la cible fait un jet d'Athlétisme SD 15 ou tombe à terre."],
      ["reflexe", "Acharné", "Quand il tombe à 0 PV, Résistance SD 13 pour rester à 1 PV.", { limite: "combat" }]
    ],
    texte: {
      accroche: "Quatre-vingts kilos de colère et deux défenses.",
      comportement: "PA 2 sur le corps (cuir épais).",
      butin: "Viande pour un village (1 pe), défenses (5 pc)."
    }
  },
  {
    nom: "Ours", categorie: "betes", type: "Bête", menace: 3, B: 2, pv: 40, dp: 11, defense: "aucune",
    caracs: [18, 10, 14, 4, 12, 6],
    competences: { athletisme: 13, perception: 8 },
    armes: [["Griffes", "bagarre", 11, "2d6", 4, { type: "tranchant" }]],
    pa: PARTOUT(2),
    aptitudes: [
      ["passif", "Deux attaques", "Il fait 2 attaques de griffes par tour."],
      ["passif", "Étreinte", "Si les deux griffes touchent la même cible, elle est entravée et subit 1d8 + 4 au début de chacun de ses tours (pour se libérer : Athlétisme ou Acrobaties contre +13)."],
      ["passif", "Odorat", "Avantage aux jets de Perception à l'odorat."]
    ],
    texte: {
      accroche: "Le seigneur de la forêt, avant les seigneurs des hommes.",
      comportement: "Il ne cherche pas le combat, sauf en hiver ou si on approche de ses petits. PA 2 partout (fourrure, graisse).",
      butin: "Fourrure (2 pe), griffes (1 pe), graisse."
    }
  },

  /* ========================= Les créatures de la Mašina ========================= */
  {
    nom: "Domovoï", categorie: "masina", type: "Créature de la Mašina (Dých)", menace: 0, B: 2, pv: 8, dp: 16,
    defense: "aucune", masina: true,
    caracs: [8, 16, 10, 14, 14, 12],
    competences: { discretion: 14, perception: 12 },
    armes: [["Coup de bâton", "bagarre", 6, "1d4", 0, { type: "contondant" }]],
    aptitudes: [
      ["passif", "Invisible chez lui", "On ne le voit que s'il le veut."],
      ["passif", "Maître de maison", "Il peut cacher des objets, faire grincer les portes, renverser le lait, éteindre le feu."]
    ],
    texte: {
      accroche: "Le petit vieux barbu qui vit derrière le poêle. Il protège la maison… tant qu'on le respecte.",
      comportement: "On le nourrit (un bol de lait, du pain sur le poêle) et il protège la famille, prévient des dangers, fait fuir les kikimoras. Offensé, il casse, il étouffe les chevaux, il chasse les habitants.",
      mj: "Un PNJ plutôt qu'un adversaire. Il sait beaucoup de choses sur ceux qui ont vécu dans « sa » maison.",
      monstrologie: [[9, "Il faut le nourrir."], [13, "Quand on déménage, on l'emmène dans une vieille botte avec des braises du foyer."]]
    }
  },
  {
    nom: "Kikimora", categorie: "masina", type: "Créature de la Mašina (Snov)", menace: 1, B: 2, pv: 12, dp: 15,
    defense: "esquive", masina: true,
    caracs: [12, 16, 10, 10, 12, 8],
    competences: { esquive: 10, discretion: 12, escamotage: 10 },
    armes: [["Griffes", "bagarre", 8, "1d4", 1, { type: "tranchant" }]],
    aptitudes: [
      ["passif", "Cauchemar", "La nuit, elle s'assoit sur un dormeur. Résistance SD 13, sinon le repos long ne compte pas et il gagne un niveau d'épuisement."],
      ["passif", "Insaisissable", "Dans une maison ou un marais, elle peut se cacher par une action libre."]
    ],
    texte: {
      accroche: "Petite, maigre, la tête comme une noix. Elle file la nuit, casse la vaisselle… et s'assoit sur la poitrine des dormeurs.",
      faiblesses: "Un collier de fougère ou de l'armoise suspendus au-dessus du lit l'empêchent d'approcher. Un domovoï la chasse.",
      monstrologie: [[9, "C'est elle qui empêche de dormir."], [13, "Les herbes la repoussent."],
        [17, "Elle naît d'un enfant mort sans baptême… ou d'une malédiction jetée sur la maison."]],
      butin: "Rien, sinon le sommeil retrouvé. Le village paiera 1 pe."
    }
  },
  {
    nom: "Topielec (le noyé)", categorie: "masina", type: "Créature de la Mašina (Dých)", menace: 1, B: 2, pv: 18, dp: 11,
    defense: "aucune", masina: true,
    caracs: [14, 10, 12, 6, 10, 6],
    competences: { athletisme: 10, discretion: 9 },
    armes: [["Griffes", "bagarre", 9, "1d6", 2, { type: "tranchant" }]],
    pa: PARTOUT(1),
    aptitudes: [
      ["technique", "Entraîner au fond", "Au lieu d'attaquer, il empoigne une cible adjacente (Bagarre +10 contre Athlétisme ou Acrobaties). En cas de réussite, il l'entraîne sous l'eau, et elle doit retenir son souffle."],
      ["passif", "Dans son élément", "Dans l'eau, il a l'avantage à ses attaques. Athlétisme pour nager, Discrétion dans l'eau."]
    ],
    texte: {
      accroche: "Un mort qui n'a pas quitté l'eau. La peau verte et gonflée, les doigts palmés, l'œil vitreux. Il attend sous la surface.",
      comportement: "En groupes de 2 à 5, près des gués, des moulins et des noyades récentes. PA 1 partout (peau gonflée).",
      faiblesses: "Le feu (+1d6 dégâts de feu). Hors de l'eau depuis plus d'une heure, il s'affaiblit (−2 à tous ses jets).",
      monstrologie: [[9, "Les noyés reviennent."], [13, "Il ne s'éloigne pas de l'eau."], [17, "Brûler son corps (le vrai, au fond) empêche son retour."]],
      butin: "Cervelle et sang verdâtre, des ingrédients d'huile de lame contre les nécrophages (5 pc)."
    }
  },
  {
    nom: "Trupojed (le mangeur de morts)", categorie: "masina", type: "Créature de la Mašina (Prah)", menace: 1, B: 2, pv: 16,
    dp: 12, defense: "esquive", masina: true,
    caracs: [14, 12, 12, 4, 12, 4],
    competences: { esquive: 7, perception: 8, discretion: 8 },
    armes: [["Griffes souillées", "bagarre", 9, "1d6", 2, { type: "tranchant" }]],
    pa: PARTOUT(1),
    aptitudes: [
      ["passif", "Griffes souillées", "Une blessure grave infligée par un trupojed provoque une fièvre (Résistance SD 13, sinon désavantage en Endurance et en Résistance jusqu'à un jet de Médecine SD 15)."],
      ["passif", "Charognards", "Ils s'acharnent sur une cible à terre (avantage)."]
    ],
    texte: {
      accroche: "Il naît là où les morts s'entassent sans sépulture : champs de bataille, fosses de peste, villages brûlés.",
      comportement: "En meutes de 3 à 8. Ils fuient la lumière vive et le feu.",
      faiblesses: "Le feu (dégâts de feu doublés), l'huile de lame contre les nécrophages.",
      monstrologie: [[9, "Ils mangent les morts."], [13, "Ils craignent le feu."], [17, "Tant que les morts ne sont pas enterrés ou brûlés, il en reviendra."]],
      butin: "Griffes (ingrédient, 1 pc l'unité), et la gratitude d'un village qui pourra enfin enterrer ses morts."
    }
  },
  {
    nom: "Rusalka", categorie: "masina", type: "Créature de la Mašina (Snov)", menace: 2, B: 3, pv: 24, dp: 14,
    defense: "esquive", masina: true,
    caracs: [14, 14, 14, 10, 12, 16],
    competences: { esquive: 10, representation: 12, tromperie: 11, discretion: 11 },
    armes: [["Griffes glacées", "bagarre", 10, "1d6", 2, { type: "froid" }]],
    aptitudes: [
      ["posture", "Chant", "Chaque créature qui l'entend fait un jet de Volonté SD 15 au début de son tour. En cas d'échec, elle est <b>charmée</b> et se déplace vers l'eau."],
      ["passif", "Danse des noyées", "Les nuits de pleine lune, elle entraîne ses victimes à danser jusqu'à l'épuisement (un niveau par heure, Endurance SD 15)."],
      ["technique", "Évanescente", "Elle disparaît dans l'eau par une action. Elle ne peut pas s'en éloigner de plus de 100 m."]
    ],
    texte: {
      accroche: "Une jeune femme pâle, les cheveux mouillés, assise sur une branche au-dessus de la rivière. Elle chante. Elle est morte noyée, et elle n'a pas pardonné.",
      faiblesses: "L'armoise portée sur soi donne l'avantage contre le <i>Chant</i>. <b>Lui rendre justice</b> (retrouver qui l'a poussée à se noyer) l'apaise pour toujours.",
      monstrologie: [[13, "Son chant charme, l'armoise protège."], [17, "Elle ne quitte pas l'eau, et elle est vulnérable au soleil levant."],
        [21, "Elle cherche un coupable, et on peut la libérer."]],
      butin: "Des cheveux qui ne sèchent jamais (ingrédient rare, 1 pe)."
    }
  },
  {
    nom: "Południca (la Dame de midi)", categorie: "masina", type: "Créature de la Mašina (Svit)", menace: 3, B: 4, pv: 30,
    dp: 15, defense: "parade", masina: true,
    caracs: [16, 16, 14, 12, 14, 12],
    competences: { parade: 12, intuition: 12, histoire: 10 },
    armes: [["Faucille", "armesUneMain", 12, "1d8", 3, { type: "tranchant" }]],
    aptitudes: [
      ["passif", "La Question", "Elle pose une énigme, ou une question sur le travail des champs. Une bonne réponse la fait disparaître. Une mauvaise réponse ou un silence, et elle attaque."],
      ["passif", "Chaleur écrasante", "Les créatures à 9 m font un jet d'Endurance SD 17 au début de leur tour, sinon elles gagnent un niveau d'épuisement (le premier échec seulement, puis tous les deux échecs)."],
      ["passif", "L'heure passe", "Elle disparaît à la fin de l'heure de midi, quoi qu'il arrive. Elle reviendra le lendemain."]
    ],
    texte: {
      accroche: "Une femme grande et blanche, une faucille à la main. Elle apparaît dans les champs à l'heure la plus chaude et pose une question. Malheur à qui répond mal.",
      faiblesses: "Elle ne peut pas entrer dans l'ombre profonde (forêt, grange, cave). Répondre juste. Tenir jusqu'à la fin de l'heure.",
      monstrologie: [[9, "Il ne faut pas travailler aux champs à midi."], [13, "Elle pose une question, et l'ombre protège."],
        [17, "Elle s'en va quand l'heure passe."], [21, "C'est une fiancée morte le jour de ses noces dans un champ ; retrouver sa couronne de fleurs et la brûler l'apaise."]],
      butin: "Une faucille d'un métal inconnu, qui ne rouille jamais (sans valeur, sauf pour un érudit… ou un purificateur)."
    }
  },
  {
    nom: "Upiór (le revenant)", categorie: "masina", type: "Créature de la Mašina (Krev)", menace: 3, B: 4, pv: 32, dp: 13,
    defense: "esquive", masina: true,
    caracs: [16, 14, 12, 10, 12, 10],
    competences: { esquive: 10, athletisme: 12, discretion: 11, perception: 10 },
    armes: [
      ["Griffes", "bagarre", 12, "1d8", 3, { type: "tranchant" }],
      ["Morsure", "bagarre", 12, "1d6", 3, { type: "perforant" }]
    ],
    pa: PARTOUT(2),
    aptitudes: [
      ["passif", "Boire", "Si la morsure fait une blessure grave, il regagne autant de PV que les dégâts infligés."],
      ["passif", "Régénération", "Il regagne 3 PV au début de chacun de ses tours, sauf s'il a subi des dégâts d'argent ou de feu depuis son dernier tour."],
      ["passif", "Revenir", "À 0 PV, il s'effondre, mais il se relève à la nuit suivante, sauf si on l'achève comme il faut."]
    ],
    texte: {
      accroche: "Un mort qui sort de sa tombe la nuit pour boire le sang des vivants, à commencer par sa propre famille. Ses joues sont rouges, ses ongles longs, sa tombe toujours chaude.",
      comportement: "PA 2 partout (peau dure).",
      faiblesses: "Le jour, il dort dans sa tombe (−4 à tous ses jets s'il est réveillé). Pour l'achever, il faut lui planter un pieu de <b>tremble</b> dans le cœur et l'enterrer face contre terre, ou le brûler. L'ail sur les portes l'empêche d'entrer.",
      monstrologie: [[9, "Les morts qui reviennent boivent le sang."], [13, "Il dort le jour, le tremble et l'ail le repoussent."],
        [17, "Il revient tant qu'il n'est pas pieuté et retourné."], [21, "Il est revenu parce qu'il est mort sans confession, ou qu'un chat a sauté sur son cercueil… ou parce que quelqu'un l'a voulu."]],
      butin: "Sang noir (ingrédient de poison, 1 pe), et souvent les objets de valeur enterrés avec lui."
    }
  },
  {
    nom: "Wilkołak (le loup-garou)", categorie: "masina", type: "Créature de la Mašina (Krev)", menace: 4, B: 4, pv: 45, dp: 14,
    defense: "esquive", masina: true,
    caracs: [16, 16, 12, 8, 14, 8],
    competences: { esquive: 11, perception: 12, athletisme: 13, discretion: 10 },
    armes: [
      ["Griffes", "bagarre", 12, "1d8", 3, { type: "tranchant" }],
      ["Morsure", "bagarre", 13, "1d10", 3, { type: "perforant" }]
    ],
    pa: PARTOUT(2),
    aptitudes: [
      ["passif", "Attaques", "2 attaques de griffes par tour, ou 1 morsure."],
      ["passif", "Régénération", "Il regagne 5 PV au début de chacun de ses tours, sauf après des dégâts d'argent."],
      ["technique", "Hurlement", "Les créatures à 30 m font un jet de Volonté SD 17, sinon elles sont effrayées pendant 1 round.", { limite: "combat" }],
      ["passif", "Malédiction", "Une blessure grave infligée par sa morsure demande un jet de Résistance SD 17. En cas d'échec, la victime est maudite : la prochaine pleine lune, elle se transforme (une intrigue pour le MJ)."]
    ],
    texte: {
      accroche: "Un homme le jour, une bête la nuit. Il ne choisit pas, et il ne se souvient pas.",
      comportement: "PA 2 partout (fourrure). Perception à l'odorat.",
      faiblesses: "L'argent, l'aconit (une flèche ou une lame enduite d'aconit inflige +1d6 et empêche la régénération pendant 1 round). Le jour, il est humain, avec les caractéristiques d'un villageois.",
      monstrologie: [[13, "Argent et aconit."], [17, "Il est humain le jour, et quelqu'un au village porte des blessures étranges."],
        [21, "La malédiction peut être levée par celui qui l'a jetée, ou en portant trois nuits de suite une ceinture de peau de loup consacrée."]],
      butin: "Fourrure (si on ose la vendre), et le secret de son identité."
    }
  },
  {
    nom: "Strzyga", categorie: "masina", type: "Créature de la Mašina (Prah)", menace: 4, B: 5, pv: 50, dp: 14,
    defense: "esquive", masina: true,
    caracs: [16, 18, 10, 8, 14, 8],
    competences: { esquive: 12, athletisme: 14, perception: 12, discretion: 11 },
    armes: [["Griffes", "bagarre", 13, "1d10", 3, { type: "tranchant" }]],
    pa: PARTOUT(3),
    aptitudes: [
      ["passif", "Deux attaques", "Elle fait 2 attaques de griffes par tour."],
      ["technique", "Bond", "Elle saute jusqu'à 12 m et attaque à l'arrivée, avec avantage."],
      ["passif", "Fureur de la nuit", "La nuit, elle a l'avantage à toutes ses attaques. Le jour, elle reste dans sa crypte."],
      ["technique", "Cri", "Les créatures à 9 m font un jet de Résistance SD 19, sinon elles sont étourdies 1 round.", { limite: "combat" }],
      ["passif", "Second cœur", "Elle ne meurt pas à 0 PV. Elle s'effondre et revient la nuit suivante, tant que son second cœur bat."]
    ],
    texte: {
      accroche: "On raconte qu'elle est née avec deux cœurs et deux âmes. Quand elle est morte, une seule âme est partie. L'autre a faim.",
      comportement: "PA 3 partout (chair desséchée).",
      faiblesses: "Il faut ouvrir sa tombe le jour, trouver son second cœur et le brûler. Les anciens l'enterraient face contre terre, une faucille sur la gorge.",
      monstrologie: [[13, "Elle chasse la nuit et dort dans une crypte."], [17, "Deux cœurs, il faut brûler le second."],
        [21, "Une strzyga naît souvent avec des dents, ou ses deux âmes étaient liées par une malédiction de famille."]],
      butin: "Le second cœur, une fois brûlé, laisse une cendre noire très recherchée par certains mages (5 po, mais à qui la vendre sans finir au bûcher ?)."
    }
  },
  {
    nom: "Leszy (le gardien de la forêt)", categorie: "masina", type: "Créature de la Mašina (Kamen et Snov)", menace: 5, B: 6,
    pv: 80, dp: 15, defense: "blocage", masina: true,
    caracs: [20, 16, 14, 12, 16, 12],
    competences: { blocage: 14, perception: 15, survie: 18, tromperie: 14, discretion: 15 },
    armes: [["Branches", "bagarre", 15, "2d8", 5, { type: "contondant", proprietes: ["allonge"], portee: "allonge 3 m" }]],
    pa: PARTOUT(4),
    aptitudes: [
      ["passif", "Deux attaques", "Il fait 2 attaques de branches par tour (allonge 3 m)."],
      ["passif", "Égarer", "Dans sa forêt, les voyageurs qu'il n'aime pas font un jet de Survie SD 21 chaque heure, sinon ils tournent en rond."],
      ["technique", "La voix d'un proche", "Il imite la voix d'un être aimé. Volonté SD 19, sinon la cible va vers la voix."],
      ["technique", "Racines", "Une zone de 6 m de rayon. Esquive SD 19, sinon les créatures sont entravées."],
      ["technique", "Appel de la forêt", "2d4 loups ou une nuée de corbeaux arrivent en 1d4 rounds.", { limite: "combat" }],
      ["passif", "Lié à sa forêt", "Il regagne 5 PV par round tant qu'il touche la terre de sa forêt. À 0 PV, il se dissout en feuilles mortes et revient à la saison suivante, sauf si on détruit son <b>totem</b>."]
    ],
    texte: {
      accroche: "Parfois un vieillard aux yeux verts, parfois un arbre qui marche, parfois rien qu'une voix qui vous appelle par votre nom. La forêt est à lui.",
      comportement: "Il n'est pas mauvais. Il protège sa forêt. On peut négocier avec lui : une offrande, une promesse (et malheur à qui la trahit), un service rendu à la forêt. PA 4 partout (écorce). Discrétion en forêt.",
      faiblesses: "Le feu (+1d6, et la régénération s'arrête pour 1 round). Porter ses vêtements à l'envers et les chaussures inversées donne l'avantage contre <i>Égarer</i> et <i>La voix d'un proche</i>. Son totem (un arbre ancien, un crâne de cerf orné) le rend mortel s'il est détruit.",
      monstrologie: [[13, "Il égare les voyageurs, les vêtements à l'envers protègent."], [17, "Il craint le feu et ne meurt pas sans son totem."],
        [21, "Il honore les pactes, et on peut en conclure un."]],
      butin: "Rien qu'on puisse vendre. Mais un leszy qui vous doit un service vaut plus que tout l'or d'un seigneur."
    }
  }
];

/** Règles communes rappelées sur chaque fiche selon la catégorie. */
export const RAPPELS = {
  betes: "Pas de Posture : une bête ne peut pas être lue, mais elle n'est jamais à découvert. Une bête blessée sous la moitié de ses PV fuit, sauf si elle est acculée, affamée ou protège ses petits. Localisation des quadrupèdes : 1 tête (×2), 2–5 corps, 6–7 pattes avant, 8–10 pattes arrière (blessures : tables humaines).",
  masina: "Résistance au fer : moitié des dégâts des armes de fer et d'acier (après l'armure), l'argent blesse normalement. Une blessure grave infligée par une créature de la Mašina demande un jet de Résistance SD 15, sinon +1 Corruption. Elles ciblent en priorité les personnages les plus corrompus."
};
