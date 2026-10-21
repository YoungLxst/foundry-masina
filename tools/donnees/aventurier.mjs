/**
 * Équipement d'aventurier et suite du chapitre « L'équipement » :
 * matériel, outils, services, montures, véhicules, bateaux et marchandises.
 * Format des objets : [nom, prix, poids en kg, description facultative]
 */

const D = {
  allumeFeu: "Allumer une torche prend une action ; un feu de camp, une minute (plus longtemps sous la pluie).",
  antidote: "Préparé par un herboriste contre <b>un</b> poison connu (une morsure de vouivre, la ciguë…). Il donne l'avantage aux jets de Résistance contre ce poison pendant 1 heure. On le fabrique avec Herboristerie (SD 15).",
  baume: "Appliquer le baume prend une minute. Il rend 1d6 PV. Une créature ne peut en bénéficier qu'une fois par repos long. On le fabrique avec Herboristerie (SD 13). <i>Il n'y a pas de potion magique : la guérison prend du temps.</i>",
  bestiaire: "Un recueil de créatures, souvent faux à moitié. Le lire donne l'avantage aux jets de Monstrologie sur les créatures qu'il décrit (il faut savoir lire).",
  cadenas: "L'ouvrir sans clé demande un jet de Mécanismes SD 15 avec des crochets.",
  chausse: "Couvrent une zone de 1,5 m × 1,5 m. Une créature qui y entre sans ralentir fait un jet d'Esquive SD 13. En cas d'échec, elle subit 1 dégât perforant, s'arrête, et perd 3 m de vitesse jusqu'à ce qu'elle soit soignée.",
  corde: "2 PV. On la rompt avec un jet d'Athlétisme SD 17.",
  fers: "S'en libérer demande un jet d'Acrobaties SD 20, les briser un jet d'Athlétisme SD 20, les crocheter un jet de Mécanismes SD 15.",
  barbelees: "+1d4 dégâts lorsqu'on les arrache. La cible saigne (1 dégât par round) tant qu'on ne l'a pas soignée (Médecine SD 13).",
  huile: "Jetée sur une cible et enflammée, elle inflige 1d6 dégâts de feu de plus. Versée au sol sur 1,5 m × 1,5 m, elle brûle 2 rounds et inflige 1d6 à qui y entre ou y finit son tour.",
  huileLame: "Une préparation contre <b>une famille de créatures</b> (nécrophages, bêtes, spectres…), à choisir à l'achat. On l'applique en une action. Pendant 1 minute, l'arme inflige +1d6 dégâts à ces créatures. On la fabrique avec Herboristerie (SD 15) et il faut connaître la créature (Monstrologie SD 13).",
  torche: "Lumière vive 6 m, lumière faible 6 m de plus. Dure 1 heure.",
  lampe: "Lumière vive 4,5 m, lumière faible 4,5 m de plus. Dure 6 heures (1 flasque d'huile).",
  lanterne: "Lumière vive 9 m, lumière faible 9 m de plus. Dure 6 heures (1 flasque d'huile).",
  piege: "Se pose en une action. La créature qui marche dessus fait un jet d'Esquive SD 13. En cas d'échec, elle subit 2d4 dégâts perforants et ne peut plus s'éloigner au-delà de la chaîne. Se libérer demande une action et un jet d'Athlétisme SD 13 ; chaque échec inflige 1 dégât.",
  poison: "Enduire une arme ou 3 munitions prend une action. La première créature touchée fait un jet de Résistance SD 15. En cas d'échec, elle subit 2d6 dégâts de poison ; en cas de réussite, la moitié. Le poison sèche au bout d'1 minute.",
  poix: "On l'enflamme et on le lance (<i>Armes de jet</i>, 6/18 m). Si l'attaque touche, la cible subit 1d4 dégâts de feu au début de chacun de ses tours jusqu'à ce qu'elle utilise une action pour l'éteindre (Acrobaties SD 10).",
  somnifere: "Versé dans une boisson. Celui qui le boit fait un jet de Résistance SD 15 ; en cas d'échec, il dort 1d4 heures.",
  trousse: "Une utilisation stabilise une créature à 0 PV sans jet. Elle donne aussi +2 aux jets de Médecine. <b>Sans trousse, on fait ses jets de Médecine avec désavantage.</b>",
  outils: c => `Nécessaires pour la compétence ${c}. Sans les bons outils, le jet se fait avec désavantage (ou il est impossible, selon le MJ).`,
  nonDresse: "Monture non dressée au combat : au premier coup ou au premier bruit violent, le cavalier fait un jet de Dressage SD 13, ou la monture panique."
};

export const AVENTURIER = {
  "Sacs et contenants": [
    ["Sac à dos", "2 pc", 2.5], ["Sacoche", "5 pf", 0.5], ["Sac de toile", "1 pf", 0.3],
    ["Carquois (20 flèches)", "1 pc", 0.5], ["Étui à carreaux (20)", "1 pc", 0.5],
    ["Gourde en peau (2 l)", "5 pf", 2.5, "2,5 kg pleine."], ["Outre de vin ou de bière (2 l)", "1 pc", 2.5, "2,5 kg pleine."],
    ["Fiole de terre cuite", "2 pf", 0], ["Fiole de verre", "5 pc", 0], ["Tonnelet (20 l)", "2 pc", 5], ["Coffre ferré", "1 pe", 12]
  ],
  "Camp et voyage": [
    ["Couverture de laine", "5 pf", 1.5], ["Peau de couchage", "1 pc", 3], ["Tente de toile (2 personnes)", "1 pe", 10],
    ["Rations (1 jour)", "3 pf", 1, "Pain dur, viande séchée, fromage."], ["Gamelle et cuillère", "3 pf", 0.5],
    ["Marmite de fer", "3 pc", 4], ["Allume-feu (silex, briquet, amadou)", "5 pf", 0.5, D.allumeFeu],
    ["Torche", "1 pf", 0.5, D.torche], ["Lampe à huile", "3 pf", 0.5, D.lampe], ["Lanterne de corne", "2 pc", 1, D.lanterne],
    ["Huile (flasque)", "1 pf", 0.5, D.huile], ["Cape à capuche", "1 pc", 1.5]
  ],
  "Outils et matériel": [
    ["Corde de chanvre (15 m)", "2 pc", 5, D.corde], ["Grappin", "1 pe", 2], ["Crampons et pitons (10)", "3 pc", 2],
    ["Pelle", "2 pc", 2.5], ["Pioche", "3 pc", 5], ["Pied-de-biche", "3 pc", 2.5], ["Marteau", "1 pc", 1.5],
    ["Chaîne (3 m)", "5 pc", 5], ["Fers et chaînes (entraves)", "1 pe", 3, D.fers], ["Cadenas et clé", "1 pe", 0.5, D.cadenas],
    ["Chausse-trappes (sac de 20)", "3 pc", 1, D.chausse], ["Piège à mâchoires", "1 pe", 10, D.piege],
    ["Pierre à aiguiser", "2 pf", 0.5], ["Matériel de pêche", "1 pc", 2], ["Miroir de bronze poli", "1 pe", 0.3]
  ],
  "Écriture": [
    ["Tablette de cire et stylet", "2 pc", 0.5], ["Parchemin (une feuille)", "1 pc", 0], ["Encre et plume", "3 pc", 0],
    ["Livre manuscrit", "1 po et plus", 2.5], ["Bestiaire (Monstrologie)", "2 po, rare", 3, D.bestiaire]
  ],
  "Soins, remèdes et poisons": [
    ["Trousse de soins (10 usages)", "5 pc", 1.5, D.trousse], ["Baume cicatrisant", "1 pe", 0, D.baume],
    ["Antidote", "3 pe", 0, D.antidote], ["Huile de lame", "2 pe", 0, D.huileLame], ["Poison de lame", "1 po", 0, D.poison],
    ["Somnifère", "5 pe", 0, D.somnifere], ["Pot de poix", "2 pc", 2, D.poix]
  ],
  "Munitions": [
    ["Flèches (20)", "5 pc", 0.5], ["Flèches barbelées (10)", "1 pe", 0.3, D.barbelees],
    ["Carreaux (20)", "1 pe", 0.75], ["Billes de fronde (20)", "1 pf", 0.75]
  ],
  "Vêtements": [
    ["Vêtements communs", "2 pc", 1.5], ["Vêtements de voyage", "5 pc", 2], ["Vêtements fins", "1 po", 3],
    ["Bottes de cuir", "3 pc", 1.5], ["Fourrures d'hiver", "1 pe", 4]
  ],
  "Outils de métier": [
    ["Crochets de voleur", "2 pe", 0.5, D.outils("Mécanismes")],
    ["Kit d'herboriste", "1 pe", 1.5, D.outils("Herboristerie")],
    ["Matériel d'empoisonneur", "1 po", 1, D.outils("Herboristerie (poisons)")],
    ["Trousse de chirurgien (scies, aiguilles, fers)", "3 pe", 2, D.outils("Médecine") + " Obligatoire pour soigner une blessure grave."],
    ["Kit de déguisement", "5 pe", 1.5, D.outils("Tromperie")],
    ["Matériel de faussaire", "1 po", 2, D.outils("Lettres et Tromperie")],
    ["Outils de forgeron", "5 pe", 8, D.outils("Artisanat (forge)")],
    ["Outils de maçon", "2 pe", 4, D.outils("Artisanat (maçonnerie)")],
    ["Outils de charpentier", "2 pe", 3, D.outils("Artisanat (menuiserie)")],
    ["Outils de tanneur", "1 pe", 2.5, D.outils("Artisanat (tannerie)")],
    ["Matériel de brasseur", "3 pe", 5, D.outils("Artisanat (brasserie)")],
    ["Outils de bijoutier", "1 po", 1, D.outils("Artisanat (orfèvrerie)")],
    ["Ustensiles de cuisine", "2 pc", 4, D.outils("Artisanat (cuisine)")],
    ["Instrument de musique", "3 pc à 1 po", 1.5, "Flûte, tambour, lyre, cornemuse… (0,5 à 3 kg). " + D.outils("Représentation")],
    ["Jeu de dés, osselets ou tablier de jeu", "2 pf à 1 pc", 0, D.outils("Escamotage et Intuition")]
  ],
  "Services": [
    ["Bain chaud", "2 pf", 0], ["Écurie et fourrage (par nuit)", "3 pf", 0],
    ["Barbier-chirurgien", "5 pc", 0, "Recoudre, arracher une dent."], ["Rebouteux ou guérisseuse de village", "2 pc (ou un poulet)", 0],
    ["Réparation d'armure (par point de PA)", "10 % du prix", 0], ["Aiguisage d'une lame", "2 pf", 0],
    ["Passage en bac", "1 pf par personne, 5 pf par cheval", 0], ["Péage seigneurial", "1 pc", 0],
    ["Messager (par jour de route)", "3 pc", 0], ["Lettre écrite par un scribe", "5 pc", 0],
    ["Guide local (par jour)", "3 pc", 0], ["Mercenaire aguerri (par jour)", "1 pe", 0]
  ],
  "Montures et animaux": [
    ["Âne ou mule", "3 pe", 0, "Vitesse 12 m · charge 200 kg. Têtu mais infatigable. " + D.nonDresse],
    ["Poney", "4 pe", 0, "Vitesse 12 m · charge 110 kg. Monture des nains et des gobelins. " + D.nonDresse],
    ["Cheval de trait", "6 pe", 0, "Vitesse 12 m · charge 270 kg. Ne supporte pas le combat."],
    ["Cheval de selle", "1 po", 0, "Vitesse 18 m · charge 220 kg. " + D.nonDresse],
    ["Destrier (cheval de guerre)", "5 po", 0, "Vitesse 18 m · charge 270 kg. Dressé au combat, ne panique pas."],
    ["Chien de chasse ou molosse", "5 pc", 0, "Vitesse 12 m. Dressage : pistage, garde."],
    ["Faucon dressé", "2 po, rare", 0, "Vol 18 m. Dressage."],
    ["Barde (armure de cheval)", "4 × le prix de l'armure", 0, "Une armure pour cheval coûte 4 fois le prix de l'armure équivalente et pèse 2 fois plus."]
  ],
  "Équipement de monte et véhicules": [
    ["Selle de monte", "5 pc", 12], ["Selle de bât", "3 pc", 7],
    ["Selle de guerre", "1 pe", 15, "Avantage pour rester en selle."], ["Mors et bride", "1 pc", 0.5],
    ["Fontes (sacoches de selle)", "2 pc", 4], ["Fourrage (par jour)", "2 pf", 5],
    ["Charrette à bras", "3 pc", 40], ["Charrette (1 cheval)", "1 pe", 100], ["Chariot (2 chevaux)", "4 pe", 200],
    ["Traîneau", "1 pe", 150]
  ],
  "Bateaux": [
    ["Barque", "5 pc", 0, "2 km/h · équipage 1 · 3 passagers. Rames."],
    ["Bateau de rivière", "2 pe", 0, "3 km/h · équipage 2 · 8 passagers. Rames, perche, voile carrée."],
    ["Knörr (navire marchand)", "15 po", 0, "4 km/h · équipage 8 · 20 passagers. Voile, robuste en haute mer."],
    ["Drakkar", "30 po", 0, "5 km/h · équipage 40 · 60 passagers. Rames et voile, faible tirant d'eau."]
  ],
  "Marchandises": [
    ["Blé ou orge (1 kg)", "1 pf", 1], ["Œufs (une douzaine)", "1 pf", 0.6], ["Farine (1 kg)", "2 pf", 1], ["Poulet", "2 pf", 2],
    ["Sel (1 kg)", "5 pf", 1], ["Fer brut (1 kg)", "1 pc", 1], ["Fromage entier", "1 pc", 2],
    ["Toile de lin (1 m²)", "3 pc", 0.3], ["Cuivre (1 kg)", "5 pc", 1], ["Chèvre", "5 pc", 0],
    ["Mouton", "1 pe", 0], ["Laine fine teinte (1 m²)", "1 pe", 0.5], ["Cochon", "3 pe", 0], ["Poivre (100 g)", "3 pe", 0.1],
    ["Vache", "1 po", 0], ["Argent métal (1 kg)", "1 po", 1], ["Bœuf de labour", "3 po", 0], ["Soie (1 m²)", "3 po", 0.1],
    ["Or (1 kg)", "50 po", 1], ["Platine (1 kg)", "50 pp", 1]
  ]
};
