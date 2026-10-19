import { MASINA } from "../config.mjs";

const fields = foundry.data.fields;

const nombre = (initial = 0, options = {}) =>
  new fields.NumberField({ required: true, nullable: false, initial, ...options });
const texte = (initial = "") => new fields.StringField({ required: true, blank: true, initial });
const bool = (initial = false) => new fields.BooleanField({ initial });

/** Champs communs : description, poids, prix. */
class MasinaItemBase extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField({ required: true, blank: true }),
      poids: nombre(0, { min: 0 }),
      prix: texte()
    };
  }
}

/* -------------------------------------------- */

export class ArmeData extends MasinaItemBase {
  static defineSchema() {
    const proprietes = {};
    for ( const k of Object.keys(MASINA.proprietesArme) ) proprietes[k] = bool();
    return {
      ...super.defineSchema(),
      competence: texte("armesUneMain"),
      categorie: texte("courante"),
      degats: texte("1d6"),
      degatsDeuxMains: texte(),
      typeDegats: texte(),
      portee: texte(),
      forMin: nombre(0, { min: 0, integer: true }),
      qualite: texte("fer"),
      proprietes: new fields.SchemaField(proprietes),
      equipee: bool(true)
    };
  }

  prepareDerivedData() {
    this.qualiteCfg = MASINA.qualites[this.qualite] ?? MASINA.qualites.fer;
    this.competenceLabel = MASINA.competences[this.competence]?.label ?? "—";
    this.proprietesLabel = Object.entries(this.proprietes).filter(([, v]) => v)
      .map(([k]) => MASINA.proprietesArme[k]).join(", ");
    this.distance = !MASINA.competences[this.competence]?.melee;
  }
}

/* -------------------------------------------- */

export class ArmureData extends MasinaItemBase {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      categorie: texte("legere"),
      couvre: new fields.SchemaField({
        tete: bool(), torse: bool(true), bras: bool(), jambes: bool()
      }),
      pa: nombre(0, { min: 0, integer: true }),
      dexMax: new fields.NumberField({ required: true, nullable: true, integer: true, initial: null }),
      dp: nombre(0, { min: 0, integer: true }),
      forMin: nombre(0, { min: 0, integer: true }),
      desavDiscretion: bool(),
      sousCouche: bool(),
      particularite: texte(),
      equipee: bool(true)
    };
  }

  prepareDerivedData() {
    this.couvreLabel = Object.entries(this.couvre).filter(([, v]) => v)
      .map(([k]) => MASINA.couvertures[k]).join(", ");
  }
}

/* -------------------------------------------- */

export class AptitudeData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      genre: texte("posture"),
      classe: texte(),
      voie: texte(),
      niveau: nombre(1, { min: 1, max: 20, integer: true }),
      limite: texte("aucune"),
      citation: texte(),
      effet: new fields.HTMLField({ required: true, blank: true }),
      contrepartie: new fields.HTMLField({ required: true, blank: true }),
      equipee: bool(false),
      horsEmplacement: bool(false),
      utilisee: bool(false)
    };
  }

  prepareDerivedData() {
    this.genreLabel = MASINA.genresAptitude[this.genre] ?? this.genre;
    this.limiteLabel = this.limite === "aucune" ? "" : MASINA.limitesAptitude[this.limite];
  }
}

/* -------------------------------------------- */

export class ObjetData extends MasinaItemBase {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      quantite: nombre(1, { min: 0, integer: true })
    };
  }
}

/* -------------------------------------------- */

export class TraitData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      source: texte("peuple"),
      description: new fields.HTMLField({ required: true, blank: true })
    };
  }
}
