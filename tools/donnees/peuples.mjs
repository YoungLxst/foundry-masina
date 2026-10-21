/**
 * Aptitudes de peuple, tirées du chapitre « Les peuples de la Mašina ».
 * Format : [peuple, genre, nom, effet, options]
 * options : { limite, contrepartie, defaut (⚠), variante (clan / lignée / héritage) }
 */
export const PEUPLES = {
  humain: "Humains",
  nain: "Nains",
  elfe: "Elfes",
  sangMele: "Sang-mêlé",
  gobelin: "Gobelins",
  marque: "Marqués (héritage optionnel)"
};

export const APTITUDES_PEUPLE = [
  /* Humains */
  ["humain", "passif", "Obstination",
    "Une fois par repos long, l'humain peut relancer un jet de compétence raté. Il garde le second résultat.", { limite: "jour" }],
  ["humain", "posture", "Coude à coude",
    "Les humains ont inventé le mur de boucliers. Tant qu'un allié est adjacent, le personnage et cet allié gagnent <b>+1 DP</b>. Si l'allié s'éloigne, le bonus cesse."],
  ["humain", "reflexe", "Pas encore",
    "Quand le personnage tombe à 0 PV ou subit une blessure grave, il reste <b>conscient et debout</b> jusqu'à la fin de son prochain tour. Il subit la blessure normalement, mais ses effets ne s'appliquent qu'ensuite.", { limite: "combat" }],

  /* Nains */
  ["nain", "passif", "Vision dans le noir",
    "Jusqu'à 18 m, il voit dans la lumière faible comme en plein jour, et dans l'obscurité comme dans une lumière faible (en nuances de gris)."],
  ["nain", "passif", "Résistance naine",
    "Avantage aux jets de Résistance contre le poison, et il ne subit que la moitié des dégâts de poison."],
  ["nain", "passif", "Pas lourd",
    "Une armure lourde ne réduit pas sa vitesse et ne demande pas de minimum de Force."],
  ["nain", "passif", "Armes naines",
    "Pour les haches et les marteaux, <i>Armes à une main</i> et <i>Armes lourdes</i> comptent comme des compétences de classe (maximum B + 4)."],
  ["nain", "passif", "Connaissance de la pierre",
    "Avantage aux jets sur la pierre, la maçonnerie, les tunnels et les mines (origine d'un mur, solidité d'une galerie, passage secret)."],
  ["nain", "passif", "Robustesse",
    "+1 PV maximum à chaque niveau.", { variante: "Nain des collines" }],
  ["nain", "posture", "Enraciné",
    "Le nain plante ses pieds comme une borne. Il a l'<b>avantage</b> contre tout ce qui veut le renverser, le repousser, le saisir ou l'entraîner (y compris <i>Entraîner au fond</i>).",
    { contrepartie: "Sa vitesse est réduite de moitié." }],
  ["nain", "technique", "Rancune",
    "Il attaque une créature qui l'a <b>blessé</b> pendant ce combat (elle lui a fait perdre des PV). Si l'attaque touche, elle inflige <b>+1 DA</b>. Un nain n'oublie pas.", { limite: "combat" }],

  /* Elfes */
  ["elfe", "passif", "Vision crépusculaire",
    "Jusqu'à 18 m, il voit dans la lumière faible comme en plein jour. Dans l'obscurité totale, il est aveugle comme un humain."],
  ["elfe", "passif", "Archerie des Premiers",
    "<i>Arc</i> compte toujours comme une compétence de classe (maximum B + 4)."],
  ["elfe", "passif", "Sommeil léger",
    "4 heures de repos suffisent pour un repos long. Il n'est jamais surpris pendant son sommeil s'il réussit un jet de Perception SD 13."],
  ["elfe", "passif", "Enfant des bois",
    "Avantage en Discrétion dans la nature sauvage.", { variante: "Elfe des forêts" }],
  ["elfe", "posture", "Pas des Premiers",
    "Le terrain difficile naturel (boue, roseaux, broussailles, neige) ne le ralentit pas, et il gagne <b>+1 DP</b> contre les attaques à distance."],
  ["elfe", "technique", "Tir patient",
    "Il renonce à se déplacer ce tour. Son attaque à l'arc se fait avec <b>avantage</b> et ignore le couvert partiel."],

  /* Sang-mêlé */
  ["sangMele", "passif", "Vision crépusculaire (sang-mêlé)",
    "Comme les elfes, mais jusqu'à 9 m seulement : dans la lumière faible, il voit comme en plein jour. Dans l'obscurité totale, il est aveugle comme un humain."],
  ["sangMele", "passif", "Entre deux mondes",
    "Avec une capuche, une coiffure ou un mensonge bien rodé, il peut se faire passer pour un humain (Tromperie SD 13 face à un observateur attentif). Tant qu'il n'est pas démasqué, il ne subit pas le malus de regard."],
  ["sangMele", "technique", "Double langue",
    "Il a passé sa vie à être ce qu'on attendait de lui. Il fait un jet de Tromperie ou de Persuasion avec <b>avantage</b>. En cas de réussite, la cible garde de lui un souvenir flou : elle ne saura pas le décrire plus tard.", { limite: "scene" }],
  ["sangMele", "reflexe", "Glisser entre",
    "Quand un ennemi adjacent le <b>rate</b> en mêlée, il se déplace aussitôt de 3 m sans provoquer d'attaque d'opportunité."],

  /* Gobelins */
  ["gobelin", "passif", "Vision dans le noir (gobelin)",
    "Comme les nains : jusqu'à 18 m, il voit dans la lumière faible comme en plein jour, et dans l'obscurité comme dans une lumière faible (en nuances de gris)."],
  ["gobelin", "passif", "Sens des courants",
    "Il ressent les anomalies de la Mašina (sort lancé, lieu corrompu, créature liée) à 9 m, avec un jet de Perception SD 13. Il a l'avantage aux jets de Volonté contre les effets de la Mašina."],
  ["gobelin", "passif", "Évasion agile",
    "Une fois par tour, quand il se déplace, il peut se désengager sans provoquer d'attaque d'opportunité."],
  ["gobelin", "passif", "Sang brûlant",
    "Quand on l'insulte, l'humilie ou le blesse, Volonté SD 13, sinon il réagit avec colère (il frappe, crie, ou fait quelque chose qu'il regrettera). Le joueur décide de la forme, le MJ de l'occasion.", { defaut: true }],
  ["gobelin", "technique", "Fureur des petits",
    "Il attaque une créature plus grande que lui. Si l'attaque touche, elle inflige <b>+1d4</b> dégâts. Utilisable <b>B fois par repos long</b>.", { limite: "jour" }],
  ["gobelin", "posture", "Colère froide",
    "Il laisse monter la colère, mais la tient en laisse. Chaque fois qu'il est blessé, sa prochaine attaque avant la fin de son prochain tour a l'<b>avantage</b>.",
    { contrepartie: "Il fait ses jets de <i>Sang brûlant</i> avec désavantage tant que la Posture est active." }],

  /* Marqués */
  ["marque", "passif", "Marque visible",
    "Il faut un jet de Tromperie SD 15 pour la cacher.", { defaut: true }],
  ["marque", "passif", "Corps altéré",
    "Avantage aux jets de Résistance contre le poison et la maladie."],
  ["marque", "passif", "Écho de la Mašina",
    "Il commence avec <b>1 point de Corruption</b> et ressent les anomalies de la Mašina comme un gobelin (<i>Sens des courants</i>)."],
  ["marque", "passif", "Murmures",
    "Quand il gagne de la Corruption, il fait un jet de Volonté SD 15. En cas d'échec, il entend la Mašina jusqu'au prochain repos long (désavantage en Perception).", { defaut: true }]
];
