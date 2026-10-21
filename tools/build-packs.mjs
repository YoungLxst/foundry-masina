/**
 * Génère les sources JSON des compendiums (packs-src/) puis les compile en LevelDB (packs/).
 * Usage : npm install && npm run build:packs
 */
import { compilePack } from "@foundryvtt/foundryvtt-cli";
import { createHash } from "node:crypto";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { ARMES, ARMURES, BOUCLIERS } from "./donnees/equipement.mjs";
import { APTITUDES } from "./donnees/aptitudes.mjs";
import { PEUPLES, APTITUDES_PEUPLE } from "./donnees/peuples.mjs";
import { AVENTURIER } from "./donnees/aventurier.mjs";
import { BESTIAIRE, CATEGORIES, RAPPELS } from "./donnees/bestiaire.mjs";
import { MASINA } from "../module/config.mjs";

const MASINA_COMPETENCES = Object.fromEntries(Object.entries(MASINA.competences).map(([k, c]) => [k, c.carac]));

/** Identifiant stable de 16 caractères, dérivé du nom. */
const id = texte => createHash("sha1").update(texte).digest("base64url").replace(/[-_]/g, "x").slice(0, 16);
const p = t => (t ? `<p>${t}</p>` : "");

const item = (pack, name, type, img, system, sort, folder = null) => {
  const _id = id(`${pack}:${name}`);
  return { _id, _key: `!items!${_id}`, name, type, img, system, effects: [], folder, sort,
    flags: {}, ownership: { default: 0 } };
};
const dossier = (pack, name, sort, color = null) => {
  const _id = id(`${pack}:dossier:${name}`);
  return { _id, _key: `!folders!${_id}`, name, type: "Item", folder: null, sorting: "m", sort, color,
    description: "", flags: {} };
};

const packs = { armes: [], armures: [], equipement: [], aptitudes: [], peuples: [], bestiaire: [] };

// Armes, rangées par compétence
const LIBELLES = { bagarre: "Bagarre", petitesLames: "Petites lames", armesUneMain: "Armes à une main",
  armesLourdes: "Armes lourdes", armesHast: "Armes d'hast", arc: "Arcs", arbalete: "Arbalètes", armesJet: "Armes de jet" };
const IMG_ARME = { bagarre: "icons/svg/sword.svg", arc: "icons/svg/target.svg", arbalete: "icons/svg/target.svg",
  armesJet: "icons/svg/thrust.svg" };
const dossiersArmes = {};
Object.entries(LIBELLES).forEach(([k, l], i) => {
  const d = dossier("armes", l, (i + 1) * 1000);
  dossiersArmes[k] = d._id;
  packs.armes.push(d);
});
ARMES.forEach(([nom, competence, categorie, degats, typeDegats, poids, prix, props, extra], i) => {
  const proprietes = Object.fromEntries(props.map(k => [k, true]));
  packs.armes.push(item("armes", nom, "arme", IMG_ARME[competence] ?? "icons/svg/sword.svg", {
    competence, categorie, degats, typeDegats, poids, prix, proprietes, equipee: true,
    degatsDeuxMains: extra.degatsDeuxMains ?? "", portee: extra.portee ?? "", forMin: extra.forMin ?? 0,
    qualite: "fer", description: extra.description ?? ""
  }, (i + 1) * 100, dossiersArmes[competence]));
});

// Armures et boucliers
const dCorps = dossier("armures", "Armures de corps", 1000);
const dPieces = dossier("armures", "Casques et pièces", 2000);
const dBoucliers = dossier("armures", "Boucliers", 3000);
packs.armures.push(dCorps, dPieces, dBoucliers);
ARMURES.forEach(([nom, categorie, zones, pa, dexMax, forMin, desav, poids, prix, extra], i) => {
  const couvre = { tete: false, torse: false, bras: false, jambes: false };
  for ( const z of zones ) couvre[z] = true;
  const corps = ["legere", "intermediaire", "lourde"].includes(categorie);
  packs.armures.push(item("armures", nom, "armure", categorie === "casque" ? "icons/svg/shield.svg" : "icons/svg/shield.svg", {
    categorie, couvre, pa, dexMax, forMin, desavDiscretion: desav, poids, prix, dp: 0, equipee: true,
    sousCouche: !!extra.sousCouche, particularite: extra.particularite ?? "",
    description: extra.sousCouche ? "<p>Superposition : porté sous une broigne, une cotte, un haubert ou des écailles, il ajoute +1 PA aux zones qu'ils couvrent tous les deux.</p>" : ""
  }, (i + 1) * 100, corps ? dCorps._id : dPieces._id));
});
BOUCLIERS.forEach(([nom, dp, particularite, forMin, poids, prix], i) => {
  packs.armures.push(item("armures", nom, "armure", "icons/svg/shield.svg", {
    categorie: "bouclier", couvre: { tete: false, torse: false, bras: false, jambes: false }, pa: 0, dexMax: null,
    dp, forMin, particularite, desavDiscretion: false, sousCouche: false, poids, prix, equipee: true,
    description: p(particularite)
  }, (i + 1) * 100, dBoucliers._id));
});

// Aptitudes, rangées par classe puis par voie
const CLASSES = { soldat: "Soldat", fourbe: "Fourbe", oeil: "Œil Aiguisé" };
const COULEURS = { soldat: "#8a3b1f", fourbe: "#4a4f55", oeil: "#3d6b3a" };
const IMG_GENRE = { posture: "icons/svg/combat.svg", technique: "icons/svg/explosion.svg",
  reflexe: "icons/svg/lightning.svg", passif: "icons/svg/aura.svg" };
const dossiersClasses = {};
Object.entries(CLASSES).forEach(([k, l], i) => {
  const d = dossier("aptitudes", l, (i + 1) * 1000, COULEURS[k]);
  dossiersClasses[k] = d._id;
  packs.aptitudes.push(d);
});
const dossiersVoies = {};
APTITUDES.forEach((a, i) => {
  let folder = dossiersClasses[a.classe];
  if ( a.voie ) {
    const cle = `${a.classe}:${a.voie}`;
    if ( !dossiersVoies[cle] ) {
      const d = dossier("aptitudes", `${CLASSES[a.classe]} — ${a.voie}`, 10000 + i);
      d.folder = dossiersClasses[a.classe];
      dossiersVoies[cle] = d._id;
      packs.aptitudes.push(d);
    }
    folder = dossiersVoies[cle];
  }
  packs.aptitudes.push(item("aptitudes", `${a.nom}${a.voie ? "" : ""}`, "aptitude", IMG_GENRE[a.genre], {
    genre: a.genre, classe: a.classe, voie: a.voie ?? "", niveau: a.niveau, limite: a.limite ?? "aucune",
    citation: a.citation ? `« ${a.citation} »` : "", effet: p(a.effet), contrepartie: a.contrepartie ? p(`<b>Contrepartie :</b> ${a.contrepartie}`) : "",
    equipee: a.equipee ?? false, horsEmplacement: a.horsEmplacement ?? false, utilisee: false
  }, a.niveau * 100 + i, folder));
});

// Équipement d'aventurier, outils, services, montures, véhicules, marchandises
Object.entries(AVENTURIER).forEach(([categorie, objets], i) => {
  const d = dossier("equipement", categorie, (i + 1) * 1000);
  packs.equipement.push(d);
  objets.forEach(([nom, prix, poids, description], j) => {
    packs.equipement.push(item("equipement", nom, "objet", "icons/svg/item-bag.svg", {
      quantite: 1, poids, prix, description: p(description)
    }, (j + 1) * 100, d._id));
  });
});

// Aptitudes de peuple, rangées par peuple
Object.entries(PEUPLES).forEach(([cle, label], i) => {
  const d = dossier("peuples", label, (i + 1) * 1000);
  packs.peuples.push(d);
  APTITUDES_PEUPLE.filter(a => a[0] === cle).forEach(([peuple, genre, nom, effet, o = {}], j) => {
    packs.peuples.push(item("peuples", nom, "aptitude", IMG_GENRE[genre], {
      genre, classe: "", peuple, voie: o.variante ?? "", niveau: 1, limite: o.limite ?? "aucune",
      defaut: !!o.defaut, citation: "",
      effet: p((o.variante ? `<i>${o.variante} uniquement.</i> ` : "") + effet),
      contrepartie: o.contrepartie ? p(`<b>Contrepartie :</b> ${o.contrepartie}`) : "",
      equipee: false, horsEmplacement: false, utilisee: false
    }, (j + 1) * 100, d._id));
  });
});

// Bestiaire : PNJ et créatures, avec leurs armes, armures et capacités
const dossierActeur = (name, sort) => ({ ...dossier("bestiaire", name, sort), type: "Actor" });
const IMG_CATEGORIE = { hommes: "icons/svg/mystery-man.svg", betes: "icons/svg/pawprint.svg", masina: "icons/svg/terror.svg" };
const CARACS = ["for", "dex", "con", "int", "sag", "cha"];
const vc = score => Math.floor(score / 2);
const secretId = texte => `secret-${id(texte)}`;
const dossiersBestiaire = {};
Object.entries(CATEGORIES).forEach(([k, l], i) => {
  const d = dossierActeur(l, (i + 1) * 1000);
  dossiersBestiaire[k] = d._id;
  packs.bestiaire.push(d);
});
const trouver = (pack, nom) => {
  const doc = packs[pack].find(d => d.name === nom && d._key.startsWith("!items!"));
  if ( !doc ) throw new Error(`Objet introuvable dans ${pack} : ${nom}`);
  return doc;
};
BESTIAIRE.forEach((c, i) => {
  const acteurId = id(`bestiaire:${c.nom}`);
  const caracs = Object.fromEntries(CARACS.map((k, j) => [k, { value: c.caracs[j] }]));
  const VC = k => vc(caracs[k].value);
  const niveaux = Object.fromEntries(Object.keys(MASINA_COMPETENCES).map(k => [k, 0]));
  const total = k => VC(MASINA_COMPETENCES[k]) + niveaux[k];
  const fixer = (k, t, quoi) => {
    const n = t - VC(MASINA_COMPETENCES[k]);
    if ( n < 0 || n > 10 ) throw new Error(`${c.nom} : ${quoi} ${k} = ${t} impossible avec VC ${VC(MASINA_COMPETENCES[k])}`);
    niveaux[k] = n;
  };
  const fixees = new Set();
  for ( const [k, t] of Object.entries(c.competences) ) { fixer(k, t, "compétence"); fixees.add(k); }

  const items = [];
  const embarquer = (src, extraSystem = {}, nom = src.name) => {
    const _id = id(`bestiaire:${c.nom}:${nom}:${items.length}`);
    items.push({ ...structuredClone(src), _id, _key: `!actors.items!${acteurId}.${_id}`, name: nom, folder: null,
      sort: (items.length + 1) * 100, system: { ...structuredClone(src.system), ...extraSystem } });
  };

  // Armes : niveau de la compétence d'arme, puis bonus pour retomber sur les totaux du profil
  for ( const [nom, comp, attaque, de, mod, o = {}] of c.armes ) {
    if ( !fixees.has(comp) ) { fixer(comp, attaque, "attaque"); fixees.add(comp); }
    const bonusAttaque = attaque - total(comp);
    const finesse = (o.proprietes ?? []).includes("finesse");
    const modFOR = VC("for") - 5, modDEX = VC("dex") - 5;
    let base = null;
    if ( o.objet ) base = trouver("armes", o.objet);
    const proprietes = { ...(base?.system.proprietes ?? {}), ...Object.fromEntries((o.proprietes ?? []).map(p => [p, true])) };
    const calcule = comp === "arbalete" ? 0 : (proprietes.finesse || finesse) ? Math.max(modFOR, modDEX) : modFOR;
    const systeme = {
      competence: comp, degats: de, bonusAttaque, bonusDegats: mod - calcule, qualite: o.qualite ?? "fer",
      proprietes, equipee: true, portee: o.portee ?? base?.system.portee ?? "", typeDegats: o.type ?? base?.system.typeDegats ?? ""
    };
    if ( base ) embarquer(base, systeme, nom);
    else embarquer({ name: nom, type: "arme", img: "icons/svg/bones.svg", effects: [], flags: {}, ownership: { default: 0 },
      system: { categorie: "courante", degatsDeuxMains: "", forMin: 0, poids: 0, prix: "", description: "<p>Arme naturelle.</p>" } }, systeme, nom);
  }
  for ( const nom of c.armures ?? [] ) embarquer(trouver("armures", nom), { equipee: true });
  for ( const [genre, nom, effet, o = {}] of c.aptitudes ?? [] ) {
    embarquer({ name: nom, type: "aptitude", img: IMG_GENRE[genre], effects: [], flags: {}, ownership: { default: 0 },
      system: { genre, classe: "", peuple: "", voie: "", defaut: false, niveau: 1, limite: o.limite ?? "aucune", citation: "",
        effet: p(effet), contrepartie: "", equipee: genre !== "passif", horsEmplacement: true, utilisee: false } }, {}, nom);
  }

  // Description : partie publique, puis secrets du MJ
  const t = c.texte;
  let description = `<p><i>${t.accroche}</i></p><p><b>Menace ${c.menace} · ${c.type}</b></p>`;
  if ( t.comportement ) description += p(`<b>Comportement :</b> ${t.comportement}`);
  if ( RAPPELS[c.categorie] ) description += p(`<i>${RAPPELS[c.categorie]}</i>`);
  let secret = "";
  if ( t.mj ) secret += p(`<b>Pour le MJ :</b> ${t.mj}`);
  if ( t.faiblesses ) secret += p(`<b>Faiblesses :</b> ${t.faiblesses}`);
  if ( t.monstrologie?.length ) secret += `<p><b>Monstrologie :</b></p><ul>${t.monstrologie.map(([sd, x]) => `<li><b>SD ${sd}</b> : ${x}</li>`).join("")}</ul>`;
  if ( t.butin ) secret += p(`<b>Butin :</b> ${t.butin}`);
  if ( secret ) description += `<section class="secret" id="${secretId(c.nom)}">${secret}</section>`;

  const rang = { 2: "sbire", 3: "veteran", 4: "chef" }[c.B];
  const img = IMG_CATEGORIE[c.categorie];
  packs.bestiaire.push({
    _id: acteurId, _key: `!actors!${acteurId}`, name: c.nom, type: "pnj", img, folder: dossiersBestiaire[c.categorie],
    sort: (i + 1) * 100, ownership: { default: 0 }, flags: {}, effects: [], items,
    system: {
      caracs, competences: Object.fromEntries(Object.entries(niveaux).map(([k, n]) => [k, { niveau: n, precision: "" }])),
      pv: { value: c.pv, max: c.pv }, rang: rang ?? "chef", bonusB: rang ? null : c.B, classe: "", race: "humain",
      menace: c.menace, typeCreature: c.type, dpFixe: c.dp,
      paNaturel: { tete: 0, torse: 0, bras: 0, jambes: 0, ...(c.pa ?? {}) },
      defense: c.defense ?? "", resistanceFer: !!c.masina, description, notes: "",
      combat: { posture: "" }, epuisement: 0, vitesseBonus: 0
    },
    prototypeToken: {
      name: c.nom, actorLink: false, disposition: c.menace === 0 ? 0 : -1, displayName: 20, displayBars: 20,
      bar1: { attribute: "pv" }, texture: { src: img }
    }
  });
});

// Vérifie l'unicité des identifiants (deux aptitudes peuvent porter le même nom dans deux classes)
for ( const [nom, docs] of Object.entries(packs) ) {
  const vus = new Map();
  for ( const d of docs ) {
    if ( vus.has(d._id) ) throw new Error(`Identifiant en double dans ${nom} : ${d.name} / ${vus.get(d._id)}`);
    vus.set(d._id, d.name);
  }
}

// Écriture des sources puis compilation
for ( const [nom, docs] of Object.entries(packs) ) {
  const src = `packs-src/${nom}`;
  rmSync(src, { recursive: true, force: true });
  mkdirSync(src, { recursive: true });
  for ( const d of docs ) {
    const fichier = d.name.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9]+/g, "_");
    writeFileSync(`${src}/${fichier}_${d._id}.json`, JSON.stringify(d, null, 2) + "\n");
  }
  rmSync(`packs/${nom}`, { recursive: true, force: true });
  await compilePack(src, `packs/${nom}`, { log: false });
  console.log(`${nom} : ${docs.length} documents`);
}
