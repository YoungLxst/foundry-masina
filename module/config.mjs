/**
 * Configuration de La Mašina : tout ce qui vient directement des règles.
 * Modifier les règles ici plutôt que dans le code.
 */
export const MASINA = {};

/* -------------------------------------------- */
/*  Caractéristiques                            */
/* -------------------------------------------- */

MASINA.caracs = {
  for: { abbr: "FOR", label: "Force" },
  dex: { abbr: "DEX", label: "Dextérité" },
  con: { abbr: "CON", label: "Constitution" },
  int: { abbr: "INT", label: "Intelligence" },
  sag: { abbr: "SAG", label: "Sagesse" },
  cha: { abbr: "CHA", label: "Charisme" }
};

/* -------------------------------------------- */
/*  Compétences                                 */
/* -------------------------------------------- */

/**
 * base : niveau de départ (compétences ★ = 2, langue maternelle = 4)
 * cout : coût par niveau à la création (×2 pour Médecine, Herboristerie, Langue de Fer)
 * precision : la compétence a une spécialité libre (langue, artisanat)
 * formation : ne s'improvise pas (jet impossible au niveau 0)
 * maitre : demande un maître pour l'apprendre
 */
MASINA.competences = {
  // Force
  athletisme:   { label: "Athlétisme", carac: "for", base: 2 },
  bagarre:      { label: "Bagarre", carac: "for", base: 2, arme: true, melee: true },
  armesLourdes: { label: "Armes lourdes", carac: "for", arme: true, melee: true },
  blocage:      { label: "Blocage", carac: "for" },
  // Dextérité
  esquive:      { label: "Esquive", carac: "dex", base: 2 },
  discretion:   { label: "Discrétion", carac: "dex", base: 2 },
  acrobaties:   { label: "Acrobaties", carac: "dex" },
  escamotage:   { label: "Escamotage", carac: "dex" },
  equitation:   { label: "Équitation", carac: "dex" },
  parade:       { label: "Parade", carac: "dex" },
  armesUneMain: { label: "Armes à une main", carac: "dex", arme: true, melee: true },
  petitesLames: { label: "Petites lames", carac: "dex", arme: true, melee: true },
  armesHast:    { label: "Armes d'hast", carac: "dex", arme: true, melee: true },
  arc:          { label: "Arc", carac: "dex", arme: true },
  arbalete:     { label: "Arbalète", carac: "dex", arme: true },
  armesJet:     { label: "Armes de jet", carac: "dex", arme: true },
  // Constitution
  endurance:    { label: "Endurance", carac: "con", base: 2 },
  resistance:   { label: "Résistance", carac: "con" },
  // Intelligence
  connaissanceLocale: { label: "Connaissance locale", carac: "int", base: 2 },
  langue1:      { label: "Langue maternelle", carac: "int", base: 4, precision: true, formation: true },
  langue2:      { label: "Langue", carac: "int", precision: true, formation: true },
  langue3:      { label: "Langue", carac: "int", precision: true, formation: true },
  lettres:      { label: "Lettres", carac: "int", formation: true },
  histoire:     { label: "Histoire et légendes", carac: "int" },
  monstrologie: { label: "Monstrologie", carac: "int" },
  medecine:     { label: "Médecine", carac: "int", cout: 2 },
  herboristerie:{ label: "Herboristerie", carac: "int", cout: 2 },
  artisanat1:   { label: "Artisanat", carac: "int", precision: true },
  artisanat2:   { label: "Artisanat", carac: "int", precision: true },
  mecanismes:   { label: "Mécanismes", carac: "int" },
  tactique:     { label: "Tactique", carac: "int" },
  langueFer:    { label: "Langue de Fer", carac: "int", cout: 2, formation: true, maitre: true },
  // Sagesse
  perception:   { label: "Perception", carac: "sag", base: 2 },
  intuition:    { label: "Intuition", carac: "sag" },
  survie:       { label: "Survie", carac: "sag" },
  pistage:      { label: "Pistage", carac: "sag" },
  dressage:     { label: "Dressage", carac: "sag" },
  volonte:      { label: "Volonté", carac: "sag" },
  // Charisme
  persuasion:   { label: "Persuasion", carac: "cha", base: 2 },
  tromperie:    { label: "Tromperie", carac: "cha" },
  intimidation: { label: "Intimidation", carac: "cha" },
  marchandage:  { label: "Marchandage", carac: "cha" },
  etiquette:    { label: "Étiquette", carac: "cha" },
  basFonds:     { label: "Bas-fonds", carac: "cha" },
  representation:{ label: "Représentation", carac: "cha" },
  commandement: { label: "Commandement", carac: "cha" }
};

/** Points de compétence à la création. */
MASINA.pointsCreation = 30;

/* -------------------------------------------- */
/*  Classes                                     */
/* -------------------------------------------- */

MASINA.classes = {
  soldat: {
    label: "Soldat",
    deVie: 12,
    principale: "for",
    defense: "blocage",
    competences: ["athletisme", "bagarre", "blocage", "armesUneMain", "armesLourdes", "armesHast",
      "endurance", "equitation", "intimidation", "tactique", "commandement", "survie"],
    faiblesse: ["perception"],
    sauvegardes: ["athletisme", "endurance"],
    aideDefense: "Blocage : dégâts ÷ 2, annulés si le jet dépasse l'attaque de 5. Échec : +2 DP contre cette attaque (Blocage naturel)."
  },
  fourbe: {
    label: "Fourbe",
    deVie: 8,
    principale: "dex",
    defense: "parade",
    competences: ["acrobaties", "discretion", "escamotage", "parade", "petitesLames", "armesUneMain",
      "arbalete", "mecanismes", "tromperie", "basFonds", "intuition", "persuasion"],
    faiblesse: ["resistance", "athletisme"],
    sauvegardes: ["esquive", "tactique"],
    aideDefense: "Parade (mêlée) : attaque annulée + riposte DA ×2 + modificateur. Échec : dégâts maximum de l'arme ennemie."
  },
  oeil: {
    label: "Œil Aiguisé",
    deVie: 10,
    principale: "dex",
    defense: "esquive",
    competences: ["arc", "arbalete", "armesJet", "esquive", "perception", "discretion", "survie",
      "pistage", "dressage", "monstrologie", "herboristerie", "intuition"],
    faiblesse: ["bagarre", "armesUneMain", "petitesLames", "armesLourdes", "armesHast"],
    sauvegardes: ["esquive", "athletisme"],
    aideDefense: "Esquive : attaque annulée, puis déplacement de 1,5 m sans attaque d'opportunité."
  }
};

/**
 * Progression commune aux trois classes : B, M et emplacements de Roulement.
 * @param {number} niveau
 */
MASINA.progression = niveau => {
  const n = Math.clamp(Number(niveau) || 1, 1, 20);
  const B = n >= 17 ? 6 : n >= 13 ? 5 : n >= 9 ? 4 : n >= 5 ? 3 : 2;
  const M = n >= 13 ? 0 : n >= 7 ? 1 : 2;
  const emplacements = n >= 17 ? 7 : n >= 13 ? 6 : n >= 9 ? 5 : n >= 5 ? 4 : 3;
  return { B, M, emplacements };
};

/* -------------------------------------------- */
/*  Peuples                                     */
/* -------------------------------------------- */

MASINA.races = {
  humain:        { label: "Humain", vitesse: 9, regard: "Aucun malus" },
  nainCollines:  { label: "Nain des collines", vitesse: 7.5, pvParNiveau: 1, nain: true, regard: "Toléré" },
  nainMontagnes: { label: "Nain des montagnes", vitesse: 7.5, nain: true, regard: "Toléré" },
  elfeForets:    { label: "Elfe des forêts", vitesse: 9, regard: "Haï (−2)" },
  elfeRuines:    { label: "Elfe des ruines", vitesse: 9, regard: "Haï (−2)" },
  sangMele:      { label: "Sang-mêlé", vitesse: 9, regard: "Rejeté une fois démasqué (−2)" },
  gobelin:       { label: "Gobelin", vitesse: 9, petite: true, regard: "Chassé (−2)" }
};

MASINA.lateralites = {
  droitier: "Droitier",
  gaucher: "Gaucher",
  ambidextre: "Ambidextre (3 points)"
};

/* -------------------------------------------- */
/*  PNJ                                         */
/* -------------------------------------------- */

MASINA.rangs = {
  sbire: { label: "Sbire", B: 2 },
  veteran: { label: "Vétéran", B: 3 },
  chef: { label: "Chef redoutable", B: 4 }
};

MASINA.posturesSbires = {
  offensive: { label: "Offensive", attaque: 2, dp: -2 },
  defensive: { label: "Défensive", attaque: -2, dp: 2 }
};

/* -------------------------------------------- */
/*  Jets                                        */
/* -------------------------------------------- */

MASINA.difficultes = {
  9: "Simple (9)",
  13: "Courante (13)",
  15: "Difficile (15)",
  17: "Experte (17)",
  21: "Héroïque (21)",
  24: "Incroyable (24)",
  29: "Légendaire (29)"
};

/** Résultat d'un jet selon l'écart avec le SD. */
MASINA.degreReussite = (total, sd) => {
  const ecart = total - sd;
  if ( ecart >= 5 ) return { cle: "exceptionnelle", label: "Réussite exceptionnelle", reussite: true };
  if ( ecart >= 0 ) return { cle: "reussite", label: "Réussite", reussite: true };
  if ( ecart >= -2 ) return { cle: "prix", label: "Réussite à un prix ?", reussite: false };
  if ( ecart >= -4 ) return { cle: "echec", label: "Échec", reussite: false };
  return { cle: "grave", label: "Échec grave", reussite: false };
};

/* -------------------------------------------- */
/*  Armes                                       */
/* -------------------------------------------- */

MASINA.categoriesArme = {
  courante: "Courante",
  guerre: "Guerre"
};

MASINA.proprietesArme = {
  deuxMains: "À deux mains",
  allonge: "Allonge",
  briseGarde: "Brise-garde",
  chargement: "Chargement",
  crochet: "Crochet",
  finesse: "Finesse",
  lancer: "Lancer",
  legere: "Légère",
  lourde: "Lourde",
  munitions: "Munitions",
  perceArmure: "Perce-armure",
  polyvalente: "Polyvalente",
  rechargement: "Rechargement",
  rare: "Rare",
  special: "Spécial"
};

MASINA.qualites = {
  fer: { label: "Fer", attaque: 0, degats: 0 },
  acier: { label: "Acier (+1 dégâts)", attaque: 0, degats: 1 },
  acierNain: { label: "Acier nain (+1 att., +1 dég.)", attaque: 1, degats: 1 },
  argent: { label: "Argent (plaquée)", attaque: 0, degats: 0 }
};

/* -------------------------------------------- */
/*  Armures                                     */
/* -------------------------------------------- */

MASINA.categoriesArmure = {
  legere: "Légère",
  intermediaire: "Intermédiaire",
  lourde: "Lourde",
  casque: "Casque",
  piece: "Pièce d'armure",
  bouclier: "Bouclier"
};

/* -------------------------------------------- */
/*  Localisation et blessures                   */
/* -------------------------------------------- */

MASINA.zones = {
  tete:   { label: "Tête", d10: "1", couverture: "tete", type: "tete", seuil: 4, viser: -4 },
  torse:  { label: "Torse", d10: "2–4", couverture: "torse", type: "torse", seuil: 2, viser: -1 },
  brasD:  { label: "Bras droit", d10: "5", couverture: "bras", type: "bras", seuil: 4, viser: -2 },
  brasG:  { label: "Bras gauche", d10: "6", couverture: "bras", type: "bras", seuil: 4, viser: -2 },
  jambeD: { label: "Jambe droite", d10: "7–8", couverture: "jambes", type: "jambe", seuil: 4, viser: -2 },
  jambeG: { label: "Jambe gauche", d10: "9–10", couverture: "jambes", type: "jambe", seuil: 4, viser: -2 }
};

MASINA.couvertures = {
  tete: "Tête",
  torse: "Torse",
  bras: "Bras",
  jambes: "Jambes"
};

/** Zone touchée selon le d10 de localisation. */
MASINA.localiser = d10 => {
  if ( d10 <= 1 ) return "tete";
  if ( d10 <= 4 ) return "torse";
  if ( d10 === 5 ) return "brasD";
  if ( d10 === 6 ) return "brasG";
  if ( d10 <= 8 ) return "jambeD";
  return "jambeG";
};

MASINA.blessures = {
  tete: [
    ["Commotion", "Étourdi 1 round, puis désavantage en Perception"],
    ["Œil blessé", "Désavantage aux attaques à distance et en Perception visuelle"],
    ["Mâchoire brisée", "Désavantage en Persuasion et en Tromperie, ne mange que de la bouillie"],
    ["Arcade ouverte", "Le sang coule dans les yeux : −2 aux attaques jusqu'à un jet de Médecine SD 13"],
    ["Oreille arrachée", "Désavantage en Perception auditive. +1 en Intimidation, pour toujours"],
    ["Fracture du crâne", "Étourdi 1 round, puis désavantage à tous les jets"]
  ],
  torse: [
    ["Côtes fêlées", "Désavantage en Athlétisme et en Endurance"],
    ["Hémorragie", "Saignement 1d4 par round jusqu'à un jet de Médecine SD 15"],
    ["Souffle coupé", "Étourdi 1 round"],
    ["Organe touché", "Désavantage en Endurance et en Résistance, saignement 1 par round"],
    ["Clavicule brisée", "Ni arme à deux mains ni bouclier"],
    ["Entaille spectaculaire", "Aucun malus. +1 en Intimidation, pour toujours"]
  ],
  bras: [
    ["Bras entaillé", "Désavantage aux attaques avec ce bras"],
    ["Main brisée", "Lâche ce qu'il tient, ne peut plus rien tenir de cette main"],
    ["Muscle déchiré", "−2 à tous les jets de Force"],
    ["Doigts coupés", "−2 aux attaques avec ce bras, permanent"],
    ["Épaule démise", "Bras inutilisable jusqu'à un jet de Médecine SD 13 (puis guérison normale)"],
    ["Estafilade", "Aucun malus, une cicatrice de plus"]
  ],
  jambe: [
    ["Jambe entaillée", "Vitesse divisée par 2"],
    ["Genou touché", "Tombe à terre. Vitesse divisée par 2"],
    ["Tendon tranché", "Ne peut plus courir ni sauter. Désavantage en Esquive"],
    ["Cheville tordue", "−3 m de vitesse, désavantage en Acrobaties"],
    ["Artère de la cuisse", "Saignement 1d6 par round jusqu'à un jet de Médecine SD 15"],
    ["Estafilade", "Aucun malus, une cicatrice de plus"]
  ]
};

/* -------------------------------------------- */
/*  Corruption et marques de la Mašina          */
/* -------------------------------------------- */

MASINA.paliersCorruption = { p3: { seuil: 3, label: "Touché" }, p5: { seuil: 5, label: "Marqué" },
  p7: { seuil: 7, label: "Lié" }, p9: { seuil: 9, label: "Au bord" } };

MASINA.marques = {
  dych:  { label: "Dých (le souffle)", signe: "Respiration lente, peau froide", donne: "Retient son souffle 10 fois plus longtemps · avantage en Endurance", prend: "Les animaux le fuient : désavantage en Dressage" },
  teplo: { label: "Teplo (la chaleur)", signe: "Yeux de braise, corps brûlant", donne: "Ne souffre jamais du froid · avantage en Résistance contre les maladies", prend: "Insulté ou blessé : Volonté SD 13 ou réaction violente" },
  snov:  { label: "Snov (le rêve)", signe: "Pupilles voilées, regard lointain", donne: "Un rêve-indice par repos long", prend: "Désavantage en Volonté contre les illusions et les effets sur l'esprit" },
  kamen: { label: "Kamen (la pierre)", signe: "Plaques de peau grise et dure", donne: "PA 1 naturel partout (sans armure)", prend: "−1,5 m de vitesse · désavantage pour nager" },
  ten:   { label: "Těn (l'ombre)", signe: "Ombre en retard sur ses gestes", donne: "Avantage en Discrétion dans l'ombre", prend: "−2 en Perception en plein soleil" },
  zvuk:  { label: "Zvuk (le son)", signe: "Voix qui résonne comme dans une crypte", donne: "+2 en Intimidation et Représentation", prend: "Ne peut pas chuchoter : désavantage en Discrétion quand il parle" },
  prah:  { label: "Prah (l'entropie)", signe: "Ce qu'il touche se fane, rouille ou caille", donne: "Avantage pour détecter mort, maladie et poison", prend: "Usure d'armure doublée (−2 PA)" },
  krev:  { label: "Krev (le sang)", signe: "Veines noires sous la peau", donne: "1/combat : sacrifier 5 PV pour l'avantage à un jet", prend: "+1 dégât par round de saignement" },
  svit:  { label: "Svit (la lumière)", signe: "Yeux qui luisent dans le noir", donne: "Vision dans le noir à 9 m", prend: "Désavantage en Discrétion de nuit" },
  mj:    { label: "Au choix du MJ", signe: "—", donne: "—", prend: "—" }
};

/* -------------------------------------------- */
/*  Aptitudes (Roulement)                       */
/* -------------------------------------------- */

MASINA.genresAptitude = {
  posture: "Posture",
  technique: "Technique",
  reflexe: "Réflexe",
  passif: "Passif"
};

MASINA.limitesAptitude = {
  aucune: "—",
  combat: "1/combat",
  jour: "1/jour"
};

/* -------------------------------------------- */
/*  États (effets de statut des jetons)         */
/* -------------------------------------------- */

MASINA.statusEffects = [
  { id: "decouvert", name: "À découvert", img: "icons/svg/target.svg" },
  { id: "prone", name: "À terre", img: "icons/svg/falling.svg" },
  { id: "blind", name: "Aveuglé", img: "icons/svg/blind.svg" },
  { id: "cache", name: "Caché", img: "icons/svg/invisible.svg" },
  { id: "charme", name: "Charmé", img: "icons/svg/heal.svg" },
  { id: "effraye", name: "Effrayé", img: "icons/svg/terror.svg" },
  { id: "empoisonne", name: "Empoisonné", img: "icons/svg/poison.svg" },
  { id: "entrave", name: "Entravé", img: "icons/svg/net.svg" },
  { id: "etourdi", name: "Étourdi", img: "icons/svg/daze.svg" },
  { id: "unconscious", name: "Inconscient", img: "icons/svg/unconscious.svg" },
  { id: "paralyse", name: "Paralysé", img: "icons/svg/paralysis.svg" },
  { id: "ralenti", name: "Ralenti", img: "icons/svg/downgrade.svg" },
  { id: "saignement", name: "Saignement", img: "icons/svg/blood.svg" },
  { id: "dead", name: "Mort", img: "icons/svg/skull.svg" }
];

MASINA.epuisement = [
  "",
  "Désavantage aux jets de compétence hors combat",
  "Vitesse divisée par 2",
  "Désavantage aux attaques et aux défenses",
  "PV maximum divisés par 2",
  "Vitesse 0",
  "Mort"
];
