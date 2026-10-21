import { MASINA } from "../config.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;
const TextEditor = foundry.applications.ux.TextEditor.implementation;

/**
 * Fiche commune à tous les objets : armes, armures, aptitudes, objets et traits.
 */
export class MasinaItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {

  static DEFAULT_OPTIONS = {
    classes: ["masina", "sheet", "item"],
    position: { width: 560, height: 620 },
    window: { resizable: true },
    form: { submitOnChange: true },
    actions: {
      choisirImage: MasinaItemSheet._onChoisirImage
    }
  };

  static PARTS = {
    form: { template: "systems/masina/templates/item/item-sheet.hbs", scrollable: [""] }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const item = this.item;
    const sys = item.system;
    const enrich = html => TextEditor.enrichHTML(html ?? "", { secrets: item.isOwner, relativeTo: item });

    Object.assign(context, {
      item,
      system: sys,
      source: sys._source,
      systemFields: sys.schema.fields,
      config: MASINA,
      editable: this.isEditable,
      estType: Object.fromEntries(["arme", "armure", "aptitude", "objet", "trait"].map(t => [t, item.type === t])),
      choix: {
        competencesArme: Object.fromEntries(Object.entries(MASINA.competences).filter(([, c]) => c.arme)
          .map(([k, c]) => [k, c.label])),
        categoriesArme: MASINA.categoriesArme,
        qualites: Object.fromEntries(Object.entries(MASINA.qualites).map(([k, q]) => [k, q.label])),
        categoriesArmure: MASINA.categoriesArmure,
        genres: MASINA.genresAptitude,
        limites: MASINA.limitesAptitude,
        peuples: MASINA.peuplesAptitude,
        classes: { "": "—", ...Object.fromEntries(Object.entries(MASINA.classes).map(([k, c]) => [k, c.label])) },
        sources: { peuple: "Peuple", classe: "Classe", voie: "Voie", autre: "Autre" }
      },
      proprietes: Object.entries(MASINA.proprietesArme).map(([cle, label]) => ({
        cle, label, coche: sys.proprietes?.[cle] ?? false
      })),
      couvertures: Object.entries(MASINA.couvertures).map(([cle, label]) => ({
        cle, label, coche: sys.couvre?.[cle] ?? false
      })),
      enrichi: {
        description: await enrich(sys.description),
        effet: await enrich(sys.effet),
        contrepartie: await enrich(sys.contrepartie)
      }
    });
    return context;
  }

  static _onChoisirImage() {
    if ( !this.isEditable ) return;
    const FilePicker = foundry.applications.apps.FilePicker.implementation;
    return new FilePicker({
      type: "image",
      current: this.item.img,
      callback: path => this.item.update({ img: path })
    }).browse();
  }
}
