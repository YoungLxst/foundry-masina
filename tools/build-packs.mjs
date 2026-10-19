/**
 * Génère les sources JSON des compendiums (packs-src/) puis les compile en LevelDB (packs/).
 * Usage : npm install && npm run build:packs
 */
import { compilePack } from "@foundryvtt/foundryvtt-cli";
import { createHash } from "node:crypto";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { ARMES, ARMURES, BOUCLIERS } from "./donnees/equipement.mjs";
import { APTITUDES } from "./donnees/aptitudes.mjs";

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

const packs = { armes: [], armures: [], aptitudes: [] };

// Armes, rangées par compétence
const LIBELLES = { bagarre: "Bagarre", petitesLames: "Petites lames", armesUneMain: "Armes à une main",
  armesLourdes: "Armes lourdes", armesHast: "Armes d'hast", arc: "Arcs", arbalete: "Arbalètes", armesJet: "Armes de jet" };
const IMG_ARME = { bagarre: "icons/svg/fist.svg", arc: "icons/svg/target.svg", arbalete: "icons/svg/target.svg",
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
  packs.armures.push(item("armures", nom, "armure", categorie === "casque" ? "icons/svg/helmet.svg" : "icons/svg/shield.svg", {
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
