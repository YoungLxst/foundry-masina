import { MASINA } from "../config.mjs";

const fields = foundry.data.fields;

const entier = (initial = 0, options = {}) =>
  new fields.NumberField({ required: true, nullable: false, integer: true, initial, ...options });
const texte = (initial = "") => new fields.StringField({ required: true, blank: true, initial });

/**
 * Modèle commun aux personnages et aux PNJ.
 */
class MasinaActorBase extends foundry.abstract.TypeDataModel {

  static defineSchema() {
    const caracs = {};
    for ( const k of Object.keys(MASINA.caracs) ) {
      caracs[k] = new fields.SchemaField({ value: entier(10, { min: 1, max: 20 }) });
    }

    const competences = {};
    for ( const [k, c] of Object.entries(MASINA.competences) ) {
      competences[k] = new fields.SchemaField({
        niveau: entier(c.base ?? 0, { min: 0, max: 10 }),
        precision: texte()
      });
    }

    const zones = {};
    for ( const k of Object.keys(MASINA.zones) ) {
      zones[k] = new fields.SchemaField({
        usure: entier(0, { min: 0 }),
        blessures: new fields.ArrayField(new fields.SchemaField({
          nom: texte(),
          effet: texte(),
          soignee: new fields.BooleanField({ initial: false }),
          repos: entier(0, { min: 0, max: 3 })
        }))
      });
    }

    return {
      caracs: new fields.SchemaField(caracs),
      competences: new fields.SchemaField(competences),
      pv: new fields.SchemaField({
        value: entier(10),
        max: entier(10, { min: 0 })
      }),
      zones: new fields.SchemaField(zones),
      combat: new fields.SchemaField({
        posture: texte()
      }),
      epuisement: entier(0, { min: 0, max: 6 }),
      vitesseBonus: new fields.NumberField({ required: true, nullable: false, initial: 0 }),
      notes: new fields.HTMLField({ required: true, blank: true })
    };
  }

  /** Bonus B et malus M, définis par les sous-classes. */
  _progression() {
    return { B: 2, M: 0, emplacements: 3 };
  }

  /** Classe utilisée pour les compétences de classe et la faiblesse. */
  get classeConfig() {
    return null;
  }

  prepareDerivedData() {
    const actor = this.parent;
    const { B, M, emplacements } = this._progression();
    this.B = B;
    this.M = M;
    this.emplacements = emplacements;
    this.maxClasse = B + 4;
    this.maxAutres = B + 2;

    // Caractéristiques : VC = score ÷ 2, modificateur = VC − 5
    for ( const [k, c] of Object.entries(this.caracs) ) {
      c.vc = Math.floor(c.value / 2);
      c.mod = c.vc - 5;
      c.abbr = MASINA.caracs[k].abbr;
      c.label = MASINA.caracs[k].label;
    }

    // Compétences
    const classe = this.classeConfig;
    const competencesClasse = new Set(classe?.competences ?? []);
    // Peuples : armes naines et archerie des Premiers
    const race = this.raceCle;
    if ( race?.startsWith("nain") ) { competencesClasse.add("armesUneMain"); competencesClasse.add("armesLourdes"); }
    if ( race?.startsWith("elfe") ) competencesClasse.add("arc");
    const faiblesses = new Set(classe?.faiblesse ?? []);
    for ( const [k, s] of Object.entries(this.competences) ) {
      const cfg = MASINA.competences[k];
      s.label = cfg.label;
      s.carac = cfg.carac;
      s.estClasse = competencesClasse.has(k);
      s.faiblesse = faiblesses.has(k) && (M > 0);
      s.max = s.estClasse ? this.maxClasse : this.maxAutres;
      s.depasse = s.niveau > s.max;
      s.total = this.caracs[cfg.carac].vc + s.niveau - (s.faiblesse ? M : 0);
    }

    // Armure, bouclier, PA par zone
    const equipees = actor.items.filter(i => i.type === "armure" && i.system.equipee);
    let dexMax = null;
    let bouclier = 0;
    let forMin = 0;
    let desavDiscretion = false;
    for ( const a of equipees ) {
      const s = a.system;
      if ( s.categorie === "bouclier" ) bouclier = Math.max(bouclier, s.dp);
      if ( (s.dexMax !== null) && (s.dexMax !== undefined) ) dexMax = dexMax === null ? s.dexMax : Math.min(dexMax, s.dexMax);
      forMin = Math.max(forMin, s.forMin ?? 0);
      if ( s.desavDiscretion ) desavDiscretion = true;
    }
    this.armure = { dexMax, bouclier, forMin, desavDiscretion };

    for ( const [k, z] of Object.entries(this.zones) ) {
      const cfg = MASINA.zones[k];
      const couvrent = equipees.filter(a => (a.system.categorie !== "bouclier") && a.system.couvre[cfg.couverture]);
      let paMax = couvrent.reduce((m, a) => Math.max(m, a.system.pa), 0);
      // Superposition : un gambison sous une armure intermédiaire ou lourde ajoute +1 PA
      const sousCouche = couvrent.some(a => a.system.sousCouche);
      const corps = couvrent.some(a => ["intermediaire", "lourde"].includes(a.system.categorie));
      if ( sousCouche && corps ) paMax += 1;
      z.label = cfg.label;
      z.d10 = cfg.d10;
      z.paMax = paMax;
      z.pa = Math.max(0, paMax - z.usure);
      z.seuil = Math.ceil(this.pv.max / cfg.seuil);
      z.blessuresActives = z.blessures.filter(b => !b.soignee).length;
    }

    // Défense passive
    const vcDex = this.caracs.dex.vc;
    const dexCompte = dexMax === null ? vcDex : Math.min(vcDex, dexMax);
    this.dp = this.caracs.con.vc + dexCompte + bouclier + this._bonusDP();

    // Valeurs de classe
    const principale = classe?.principale ?? "for";
    this.sdClasse = 7 + this.caracs[principale].vc + B;
    this.sdLecture = 10 + B;
    const defense = classe?.defense ?? null;
    this.defenseClasse = defense ? { cle: defense, label: MASINA.competences[defense].label,
      total: this.competences[defense].total } : null;

    // Charge
    const FOR = this.caracs.for.value;
    let charge = 0;
    for ( const i of actor.items ) {
      const poids = Number(i.system.poids) || 0;
      const qte = i.type === "objet" ? (i.system.quantite ?? 1) : 1;
      const porteeArmure = (i.type === "armure") && i.system.equipee && (i.system.categorie !== "bouclier");
      charge += poids * qte * (porteeArmure ? 0.5 : 1);
    }
    this.charge = {
      value: Math.round(charge * 10) / 10,
      normale: FOR * 2.5,
      max: FOR * 5
    };
    this.charge.charge = this.charge.value > this.charge.normale;

    // Vitesse
    const raceCfg = MASINA.races[race] ?? null;
    let vitesse = raceCfg?.vitesse ?? 9;
    if ( (forMin > FOR) && !raceCfg?.nain ) vitesse -= 3;
    if ( this.charge.charge ) vitesse -= 3;
    vitesse += this.vitesseBonus;
    this.vitesse = Math.max(0, vitesse);

    this.epuisementEffet = MASINA.epuisement[this.epuisement] ?? "";
  }

  /** Modificateur de DP (postures des sbires). */
  _bonusDP() {
    return 0;
  }

  /** Clé du peuple de l'acteur. */
  get raceCle() {
    return null;
  }
}

/* -------------------------------------------- */

export class PersonnageData extends MasinaActorBase {

  static defineSchema() {
    const schema = super.defineSchema();

    const marques = {};
    for ( const k of Object.keys(MASINA.paliersCorruption) ) {
      marques[k] = new fields.SchemaField({
        marque: texte(),
        aggravee: new fields.BooleanField({ initial: false }),
        cachee: new fields.BooleanField({ initial: false })
      });
    }

    return {
      ...schema,
      identite: new fields.SchemaField({
        joueur: texte(),
        race: texte("humain"),
        origine: texte(),
        classe: texte("soldat"),
        voie: texte(),
        niveau: entier(1, { min: 1, max: 20 }),
        age: texte(),
        taille: texte(),
        lateralite: texte("droitier"),
        concept: texte()
      }),
      deVie: new fields.SchemaField({
        value: entier(1, { min: 0 })
      }),
      creation: new fields.SchemaField({
        gratuits: entier(0, { min: 0 })
      }),
      xp: new fields.SchemaField({
        gain: entier(0),
        depense: entier(0)
      }),
      corruption: entier(0, { min: 0, max: 10 }),
      marques: new fields.SchemaField(marques),
      argent: new fields.SchemaField({
        pf: entier(0, { min: 0 }),
        pc: entier(0, { min: 0 }),
        pe: entier(0, { min: 0 }),
        po: entier(0, { min: 0 }),
        pp: entier(0, { min: 0 })
      }),
      histoire: new fields.HTMLField({ required: true, blank: true }),
      liens: new fields.HTMLField({ required: true, blank: true })
    };
  }

  get raceCle() {
    return this.identite.race;
  }

  get classeConfig() {
    return MASINA.classes[this.identite.classe] ?? null;
  }

  _progression() {
    return MASINA.progression(this.identite.niveau);
  }

  prepareDerivedData() {
    super.prepareDerivedData();
    const classe = this.classeConfig;

    // PV suggérés au niveau 1 : maximum du dé de vie + modificateur de CON
    this.deVie.taille = classe?.deVie ?? 10;
    this.deVie.max = this.identite.niveau;
    this.pvSuggeres = this.deVie.taille + this.caracs.con.mod
      + (MASINA.races[this.raceCle]?.pvParNiveau ?? 0);

    // Points de compétence dépensés à la création
    let depenses = 0;
    for ( const [k, s] of Object.entries(this.competences) ) {
      const cfg = MASINA.competences[k];
      depenses += Math.max(0, s.niveau - (cfg.base ?? 0)) * (cfg.cout ?? 1);
    }
    const ambidextre = this.identite.lateralite === "ambidextre" ? 3 : 0;
    this.creation.depenses = depenses + ambidextre;
    this.creation.disponibles = MASINA.pointsCreation + this.creation.gratuits;

    this.xp.disponibles = this.xp.gain - this.xp.depense;

    // Paliers de corruption atteints
    for ( const [k, p] of Object.entries(MASINA.paliersCorruption) ) {
      const m = this.marques[k];
      m.seuil = p.seuil;
      m.label = p.label;
      m.atteint = this.corruption >= p.seuil;
      m.details = MASINA.marques[m.marque] ?? null;
    }

    // Roulement : aptitudes équipées qui occupent un emplacement
    const roulement = this.parent.items.filter(i => (i.type === "aptitude") && i.system.equipee
      && (i.system.genre !== "passif") && !i.system.horsEmplacement);
    this.roulement = { utilises: roulement.length, max: this.emplacements };
  }
}

/* -------------------------------------------- */

export class PnjData extends MasinaActorBase {

  static defineSchema() {
    return {
      ...super.defineSchema(),
      rang: texte("sbire"),
      classe: texte(),
      bonusB: new fields.NumberField({ required: true, nullable: true, integer: true, initial: null }),
      race: texte("humain"),
      description: new fields.HTMLField({ required: true, blank: true })
    };
  }

  get classeConfig() {
    return MASINA.classes[this.classe] ?? null;
  }

  _progression() {
    const B = this.bonusB ?? MASINA.rangs[this.rang]?.B ?? 2;
    return { B, M: 0, emplacements: 3 };
  }

  _bonusDP() {
    return MASINA.posturesSbires[this.combat.posture]?.dp ?? 0;
  }

  get raceCle() {
    return this.race;
  }
}
