/**
 * Données des compendiums d'équipement, tirées du chapitre « L'équipement ».
 */

// [nom, compétence, catégorie, dégâts, type, poids, prix, propriétés, extra]
export const ARMES = [
  ["Mains nues", "bagarre", "courante", "1", "contondant", 0, "—", [], {}],
  ["Gantelet clouté", "bagarre", "courante", "1d4", "contondant", 0.5, "1 pe", [], {}],
  ["Couteau", "petitesLames", "courante", "1d4", "perforant", 0.3, "5 pc", ["finesse", "legere", "lancer"], { portee: "6/18 m" }],
  ["Dague", "petitesLames", "courante", "1d4", "perforant", 0.5, "1 pe", ["finesse", "legere", "lancer"], { portee: "6/18 m" }],
  ["Serpe", "petitesLames", "courante", "1d4", "tranchant", 1, "5 pc", ["legere"], {}],
  ["Hachette", "petitesLames", "courante", "1d6", "tranchant", 1, "1 pe", ["legere", "lancer"], { portee: "6/18 m" }],
  ["Sax (long couteau)", "petitesLames", "guerre", "1d6", "tranchant", 1, "2 pe", ["finesse", "legere"], {}],
  ["Gourdin", "armesUneMain", "courante", "1d4", "contondant", 1, "2 pf", ["legere"], {}],
  ["Masse d'armes", "armesUneMain", "courante", "1d6", "contondant", 2, "2 pe", [], {}],
  ["Épée courte", "armesUneMain", "guerre", "1d6", "perforant", 1, "4 pe", ["finesse", "legere"], {}],
  ["Épée longue", "armesUneMain", "guerre", "1d8", "tranchant", 1.5, "1 po", ["polyvalente"], { degatsDeuxMains: "1d10" }],
  ["Hache d'armes", "armesUneMain", "guerre", "1d8", "tranchant", 2, "3 pe", ["polyvalente", "crochet"], { degatsDeuxMains: "1d10" }],
  ["Marteau de guerre", "armesUneMain", "guerre", "1d8", "contondant", 2, "3 pe", ["polyvalente"], { degatsDeuxMains: "1d10" }],
  ["Morgenstern", "armesUneMain", "guerre", "1d8", "perforant", 2, "3 pe", [], {}],
  ["Fléau d'armes", "armesUneMain", "guerre", "1d8", "contondant", 2, "3 pe", ["briseGarde"], {}],
  ["Pic de guerre", "armesUneMain", "guerre", "1d8", "perforant", 1.5, "2 pe", ["perceArmure"], {}],
  ["Massue", "armesLourdes", "courante", "1d8", "contondant", 5, "5 pc", ["deuxMains", "lourde"], {}],
  ["Maillet", "armesLourdes", "guerre", "2d6", "contondant", 5, "2 pe", ["deuxMains", "lourde"], {}],
  ["Hache danoise", "armesLourdes", "guerre", "1d12", "tranchant", 3.5, "4 pe", ["deuxMains", "lourde", "crochet"], {}],
  ["Grande épée", "armesLourdes", "guerre", "2d6", "tranchant", 3, "3 po", ["deuxMains", "lourde", "rare"], {}],
  ["Bâton", "armesHast", "courante", "1d6", "contondant", 2, "5 pf", ["polyvalente"], { degatsDeuxMains: "1d8" }],
  ["Fourche", "armesHast", "courante", "1d6", "perforant", 2.5, "3 pc", ["deuxMains", "allonge"], {}],
  ["Lance", "armesHast", "courante", "1d6", "perforant", 1.5, "5 pc", ["lancer", "polyvalente"], { portee: "6/18 m", degatsDeuxMains: "1d8" }],
  ["Trident", "armesHast", "guerre", "1d6", "perforant", 2, "1 pe", ["lancer", "polyvalente"], { portee: "6/18 m", degatsDeuxMains: "1d8" }],
  ["Coutille", "armesHast", "guerre", "1d10", "tranchant", 3, "3 pe", ["deuxMains", "lourde", "allonge"], {}],
  ["Vouge", "armesHast", "guerre", "1d10", "tranchant", 3, "3 pe", ["deuxMains", "lourde", "allonge", "crochet"], {}],
  ["Pique", "armesHast", "guerre", "1d10", "perforant", 8, "2 pe", ["deuxMains", "lourde", "allonge", "perceArmure"], {}],
  ["Arc court", "arc", "courante", "1d6", "perforant", 1, "1 pe", ["munitions", "deuxMains"], { portee: "24/96 m" }],
  ["Arc long", "arc", "guerre", "1d8", "perforant", 1.5, "3 pe", ["munitions", "deuxMains", "lourde"], { portee: "45/180 m", forMin: 13 }],
  ["Arc composite des steppes", "arc", "guerre", "1d8", "perforant", 1, "1 po", ["munitions", "deuxMains", "rare"], { portee: "30/120 m", description: "<p>Utilisable à cheval.</p>" }],
  ["Arbalète légère", "arbalete", "courante", "1d8", "perforant", 2.5, "1 po", ["munitions", "chargement", "deuxMains", "perceArmure"], { portee: "24/96 m" }],
  ["Arbalète lourde", "arbalete", "guerre", "1d10", "perforant", 8, "2 po", ["munitions", "rechargement", "deuxMains", "lourde", "perceArmure"], { portee: "30/120 m" }],
  ["Arbalète de poing", "arbalete", "guerre", "1d6", "perforant", 1.5, "3 po", ["munitions", "chargement", "legere", "rare"], { portee: "9/36 m" }],
  ["Fronde", "armesJet", "courante", "1d4", "contondant", 0, "2 pf", ["munitions"], { portee: "9/36 m" }],
  ["Couteau de lancer", "armesJet", "courante", "1d4", "perforant", 0.2, "5 pc", ["finesse", "lancer"], { portee: "6/18 m" }],
  ["Javelot", "armesJet", "courante", "1d6", "perforant", 1, "5 pc", ["lancer"], { portee: "9/36 m" }],
  ["Francisque (hache de jet)", "armesJet", "guerre", "1d6", "tranchant", 1, "1 pe", ["lancer", "briseGarde"], { portee: "6/18 m" }],
  ["Bolas", "armesJet", "guerre", "0", "", 1, "5 pc", ["special", "lancer"], { portee: "6/18 m",
    description: "<p>Si l'attaque touche, la cible fait un jet d'Esquive contre le total de l'attaque. En cas d'échec, elle tombe à terre et est entravée jusqu'à ce qu'elle se libère (une action et un jet d'Athlétisme SD 13).</p>" }],
  ["Filet", "armesJet", "guerre", "0", "", 1.5, "5 pc", ["special", "lancer"], { portee: "1,5/4,5 m",
    description: "<p>Si l'attaque touche, la cible (de taille Moyenne ou plus petite) est entravée. Se libérer demande une action et un jet d'Athlétisme ou d'Acrobaties SD 13. On peut aussi trancher le filet : 5 dégâts tranchants le détruisent.</p>" }]
];

// [nom, catégorie, couvre, PA, DEX max, FOR min, désav. discrétion, poids, prix, extra]
export const ARMURES = [
  ["Peaux et fourrures", "legere", ["torse", "bras", "jambes"], 1, null, 0, false, 4, "5 pc", {}],
  ["Gambison matelassé", "legere", ["torse", "bras"], 2, null, 0, false, 4, "1 pe", { sousCouche: true }],
  ["Cuir bouilli", "legere", ["torse"], 3, null, 0, false, 6, "3 pe", {}],
  ["Broigne (cuir et anneaux)", "intermediaire", ["torse", "bras"], 4, 3, 0, false, 10, "1 po", {}],
  ["Cotte de mailles", "intermediaire", ["torse", "bras"], 5, 2, 0, true, 12, "3 po", {}],
  ["Haubert (mailles longues)", "lourde", ["torse", "bras", "jambes"], 6, 1, 13, true, 18, "5 po", {}],
  ["Écailles / lamellaire", "lourde", ["torse", "bras", "jambes"], 7, 0, 13, true, 22, "8 po", {}],
  ["Calotte de cuir", "casque", ["tete"], 1, null, 0, false, 0.5, "5 pc", {}],
  ["Casque à nasal", "casque", ["tete"], 3, null, 0, false, 1.5, "1 pe", {}],
  ["Casque fermé (à masque)", "casque", ["tete"], 5, null, 0, false, 2.5, "1 po", { particularite: "−2 en Perception" }],
  ["Brassards de cuir (la paire)", "piece", ["bras"], 2, null, 0, false, 1, "5 pc", {}],
  ["Jambières de cuir (la paire)", "piece", ["jambes"], 2, null, 0, false, 1.5, "5 pc", {}],
  ["Chausses de mailles", "piece", ["jambes"], 4, null, 0, true, 5, "1 po", {}]
];

// [nom, DP, particularité, FOR min, poids, prix]
export const BOUCLIERS = [
  ["Targe (petit bouclier)", 1, "Permet la Parade", 0, 1.5, "5 pc"],
  ["Bouclier rond", 2, "Permet le Blocage à distance", 0, 3, "1 pe"],
  ["Grand bouclier (pavois)", 3, "Désavantage en Acrobaties", 13, 6, "3 pe"]
];
