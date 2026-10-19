import { MASINA } from "../config.mjs";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;
const TextEditor = foundry.applications.ux.TextEditor.implementation;

const T = "systems/masina/templates/actor";

/**
 * Fiche de personnage et de PNJ.
 */
export class MasinaActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {

  static DEFAULT_OPTIONS = {
    classes: ["masina", "sheet", "actor"],
    position: { width: 900, height: 860 },
    window: { resizable: true },
    form: { submitOnChange: true },
    actions: {
      jetCompetence: MasinaActorSheet._onJetCompetence,
      jetCarac: MasinaActorSheet._onJetCarac,
      jetAttaque: MasinaActorSheet._onJetAttaque,
      jetDefense: MasinaActorSheet._onJetDefense,
      jetSurvie: MasinaActorSheet._onJetSurvie,
      lireAdversaire: MasinaActorSheet._onLireAdversaire,
      itemCreer: MasinaActorSheet._onItemCreer,
      itemEditer: MasinaActorSheet._onItemEditer,
      itemSupprimer: MasinaActorSheet._onItemSupprimer,
      itemBasculer: MasinaActorSheet._onItemBasculer,
      itemChat: MasinaActorSheet._onItemChat,
      blessureAjouter: MasinaActorSheet._onBlessureAjouter,
      blessureTirer: MasinaActorSheet._onBlessureTirer,
      blessureSupprimer: MasinaActorSheet._onBlessureSupprimer,
      reparer: MasinaActorSheet._onReparer,
      deVie: MasinaActorSheet._onDeVie,
      reposLong: MasinaActorSheet._onReposLong,
      finCombat: MasinaActorSheet._onFinCombat,
      pvSuggeres: MasinaActorSheet._onPvSuggeres,
      choisirPortrait: MasinaActorSheet._onChoisirPortrait
    }
  };

  static PARTS = {
    header: { template: `${T}/header.hbs` },
    tabs: { template: "templates/generic/tab-navigation.hbs" },
    principal: { template: `${T}/principal.hbs`, scrollable: [""] },
    combat: { template: `${T}/combat.hbs`, scrollable: [""] },
    roulement: { template: `${T}/roulement.hbs`, scrollable: [""] },
    equipement: { template: `${T}/equipement.hbs`, scrollable: [""] },
    histoire: { template: `${T}/histoire.hbs`, scrollable: [""] }
  };

  static TABS = {
    primary: {
      tabs: [
        { id: "principal", icon: "fa-solid fa-dice-d10", label: "Personnage" },
        { id: "combat", icon: "fa-solid fa-khanda", label: "Combat" },
        { id: "roulement", icon: "fa-solid fa-dharmachakra", label: "Roulement" },
        { id: "equipement", icon: "fa-solid fa-sack", label: "Équipement" },
        { id: "histoire", icon: "fa-solid fa-feather", label: "Histoire" }
      ],
      initial: "principal"
    }
  };

  /* -------------------------------------------- */
  /*  Contexte                                    */
  /* -------------------------------------------- */

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const actor = this.actor;
    const sys = actor.system;
    const estPJ = actor.type === "personnage";

    Object.assign(context, {
      actor,
      system: sys,
      source: sys._source,
      systemFields: sys.schema.fields,
      config: MASINA,
      estPJ,
      estMJ: game.user.isGM,
      editable: this.isEditable,
      tabs: this._prepareTabs("primary"),
      epuisementActuel: String(sys._source.epuisement ?? 0)
    });

    // Choix des listes déroulantes
    context.choix = {
      races: Object.fromEntries(Object.entries(MASINA.races).map(([k, v]) => [k, v.label])),
      classes: { "": "—", ...Object.fromEntries(Object.entries(MASINA.classes).map(([k, v]) => [k, v.label])) },
      lateralites: MASINA.lateralites,
      rangs: Object.fromEntries(Object.entries(MASINA.rangs).map(([k, v]) => [k, `${v.label} (B ${v.B})`])),
      marques: { "": "— pas de marque —", ...Object.fromEntries(Object.entries(MASINA.marques).map(([k, v]) => [k, v.label])) },
      epuisement: Object.fromEntries(MASINA.epuisement.map((e, i) => [i, i ? `${i} — ${e}` : "0 — aucun"]))
    };

    // Caractéristiques
    context.caracs = Object.entries(sys.caracs).map(([cle, c]) => ({ cle, ...c,
      modTexte: c.mod >= 0 ? `+${c.mod}` : `−${Math.abs(c.mod)}` }));

    // Compétences groupées par caractéristique
    context.groupes = Object.entries(MASINA.caracs).map(([cle, c]) => ({
      cle, label: c.label,
      competences: Object.entries(sys.competences).filter(([, s]) => s.carac === cle).map(([k, s]) => ({
        cle: k, ...s, cfg: MASINA.competences[k],
        tags: [MASINA.competences[k].base ? "★" : "", MASINA.competences[k].cout === 2 ? "×2" : "",
          MASINA.competences[k].maitre ? "🔒" : ""].filter(Boolean).join(" ")
      }))
    }));

    // Objets
    const items = actor.items.contents.sort((a, b) => (a.sort || 0) - (b.sort || 0));
    context.armes = items.filter(i => i.type === "arme").map(i => {
      const s = sys.competences[i.system.competence];
      const att = (s?.total ?? 0) + (i.system.qualiteCfg?.attaque ?? 0) + actor.bonusAttaquePosture;
      const mod = actor.modDegats(i) + (i.system.qualiteCfg?.degats ?? 0);
      return { item: i, attaque: att >= 0 ? `+${att}` : `−${Math.abs(att)}`,
        degats: `${i.system.degats}${mod ? (mod > 0 ? ` + ${mod}` : ` − ${Math.abs(mod)}`) : ""}` };
    });
    context.armures = items.filter(i => i.type === "armure");
    context.objets = items.filter(i => i.type === "objet");
    context.traits = items.filter(i => i.type === "trait");
    const aptitudes = items.filter(i => i.type === "aptitude")
      .sort((a, b) => (a.system.niveau - b.system.niveau) || a.name.localeCompare(b.name));
    context.roulement = aptitudes.filter(i => i.system.equipee && i.system.genre !== "passif");
    context.passifs = aptitudes.filter(i => i.system.genre === "passif");
    context.apprises = aptitudes.filter(i => !i.system.equipee && i.system.genre !== "passif");

    // Posture active
    context.postures = { "": "— aucune (à découvert) —" };
    if ( !estPJ ) for ( const [k, p] of Object.entries(MASINA.posturesSbires) ) context.postures[k] = p.label;
    for ( const a of aptitudes.filter(i => i.system.equipee && ["posture", "technique"].includes(i.system.genre)) ) {
      context.postures[a.id] = `${a.name} (${a.system.genreLabel})`;
    }

    // Zones du corps
    context.zones = Object.entries(sys.zones).map(([cle, z]) => ({ cle, ...z,
      blessures: z.blessures.map((b, index) => ({ ...b, index })),
      options: MASINA.blessures[MASINA.zones[cle].type].map(([nom], i) => ({ value: i, label: `${i + 1}. ${nom}` })),
      directeur: estPJ && (
        (cle === "brasD" && ["droitier", "ambidextre"].includes(sys.identite.lateralite))
        || (cle === "brasG" && ["gaucher", "ambidextre"].includes(sys.identite.lateralite)))
    }));
    context.zonesParCle = Object.fromEntries(context.zones.map(z => [z.cle, z]));

    // Marques de la Mašina
    if ( estPJ ) {
      context.marques = Object.entries(sys.marques).map(([cle, m]) => ({ cle, ...m }));
      context.corruption = Array.fromRange(10, 1).map(n => ({ n, coche: sys.corruption >= n }));
      context.classeLabel = MASINA.classes[sys.identite.classe]?.label ?? "—";
      context.aideDefense = MASINA.classes[sys.identite.classe]?.aideDefense ?? "";
      context.regard = MASINA.races[sys.identite.race]?.regard ?? "";
    }
    else {
      context.aideDefense = MASINA.classes[sys.classe]?.aideDefense ?? "";
    }

    // Textes enrichis
    const enrich = html => TextEditor.enrichHTML(html ?? "", { secrets: actor.isOwner, relativeTo: actor });
    context.enrichi = {
      notes: await enrich(sys.notes),
      histoire: estPJ ? await enrich(sys.histoire) : "",
      liens: estPJ ? await enrich(sys.liens) : "",
      description: !estPJ ? await enrich(sys.description) : ""
    };
    return context;
  }

  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);
    if ( context.tabs?.[partId] ) context.tab = context.tabs[partId];
    return context;
  }

  /**
   * Les blessures sont stockées dans des tableaux : on fusionne les champs modifiés
   * dans le tableau complet avant la mise à jour.
   */
  _processFormData(event, form, formData) {
    const data = super._processFormData(event, form, formData);
    const zones = data.system?.zones;
    if ( zones ) for ( const [k, z] of Object.entries(zones) ) {
      if ( z.blessures && !Array.isArray(z.blessures) ) {
        const liste = foundry.utils.deepClone(this.actor.system._source.zones[k].blessures);
        for ( const [i, b] of Object.entries(z.blessures) ) if ( liste[Number(i)] ) Object.assign(liste[Number(i)], b);
        z.blessures = liste;
      }
    }
    return data;
  }

  /* -------------------------------------------- */
  /*  Actions                                     */
  /* -------------------------------------------- */

  static _onJetCompetence(event, target) {
    return this.actor.jetCompetence(target.dataset.cle, { rapide: event.shiftKey });
  }

  static _onJetCarac(event, target) {
    return this.actor.jetCarac(target.dataset.cle, { rapide: event.shiftKey });
  }

  static _onJetAttaque(event, target) {
    const item = this.actor.items.get(target.closest("[data-item-id]").dataset.itemId);
    return this.actor.jetAttaque(item, { rapide: event.shiftKey });
  }

  static async _onJetDefense(event, target) {
    const attaque = await foundry.applications.api.DialogV2.prompt({
      window: { title: "Total de l'attaque" },
      content: `<div class="form-group"><label>Total du jet d'attaque à battre</label><input type="number" name="attaque" value="15" autofocus></div>`,
      ok: { label: "Valider", callback: (ev, button) => Number(button.form.elements.attaque.value) || 0 },
      rejectClose: false
    });
    if ( attaque === null || attaque === undefined ) return;
    return this.actor.jetDefense(attaque);
  }

  static _onJetSurvie() {
    return this.actor.jetCompetence("resistance", { sd: 13, titre: "Jet de survie (Résistance)" });
  }

  static _onLireAdversaire() {
    return this.actor.lireAdversaire();
  }

  static async _onItemCreer(event, target) {
    const type = target.dataset.type;
    const noms = { arme: "Nouvelle arme", armure: "Nouvelle armure", aptitude: "Nouvelle aptitude",
      objet: "Nouvel objet", trait: "Nouveau trait" };
    const data = { name: noms[type] ?? "Nouvel objet", type };
    if ( target.dataset.genre ) data.system = { genre: target.dataset.genre };
    const [item] = await this.actor.createEmbeddedDocuments("Item", [data]);
    item?.sheet.render(true);
  }

  static _onItemEditer(event, target) {
    const item = this.actor.items.get(target.closest("[data-item-id]").dataset.itemId);
    item?.sheet.render(true);
  }

  static async _onItemSupprimer(event, target) {
    const item = this.actor.items.get(target.closest("[data-item-id]").dataset.itemId);
    if ( !item ) return;
    const ok = await foundry.applications.api.DialogV2.confirm({
      window: { title: "Supprimer" }, content: `<p>Supprimer <b>${item.name}</b> ?</p>`, rejectClose: false
    });
    if ( ok ) return item.delete();
  }

  static async _onItemBasculer(event, target) {
    const item = this.actor.items.get(target.closest("[data-item-id]").dataset.itemId);
    const champ = target.dataset.champ;
    if ( !item || !champ ) return;
    const valeur = !foundry.utils.getProperty(item.system, champ);
    if ( champ === "equipee" && item.type === "aptitude" && valeur && item.system.genre !== "passif"
      && !item.system.horsEmplacement ) {
      const r = this.actor.system.roulement;
      if ( r && r.utilises >= r.max ) {
        return ui.notifications.warn(`Roulement plein : ${r.utilises} / ${r.max} emplacements. Retirez d'abord une compétence (au repos long).`);
      }
    }
    return item.update({ [`system.${champ}`]: valeur });
  }

  static async _onItemChat(event, target) {
    const item = this.actor.items.get(target.closest("[data-item-id]").dataset.itemId);
    return item?.afficherDansLeChat();
  }

  static async _onBlessureAjouter(event, target) {
    const zone = target.dataset.zone;
    const select = this.element.querySelector(`select[data-blessure-zone="${zone}"]`);
    const index = Number(select?.value);
    if ( !Number.isInteger(index) || select.value === "" ) return;
    const [nom, effet] = MASINA.blessures[MASINA.zones[zone].type][index];
    const liste = foundry.utils.deepClone(this.actor.system._source.zones[zone].blessures);
    liste.push({ nom, effet, soignee: false, repos: 0 });
    return this.actor.update({ [`system.zones.${zone}.blessures`]: liste });
  }

  static async _onBlessureTirer(event, target) {
    const zone = target.dataset.zone;
    const roll = await new Roll("1d6").evaluate();
    const [nom, effet] = MASINA.blessures[MASINA.zones[zone].type][roll.total - 1];
    const liste = foundry.utils.deepClone(this.actor.system._source.zones[zone].blessures);
    liste.push({ nom, effet, soignee: false, repos: 0 });
    await this.actor.update({ [`system.zones.${zone}.blessures`]: liste });
    return roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `Blessure grave (${MASINA.zones[zone].label}) : <b>${nom}</b>. ${effet}.` });
  }

  static async _onBlessureSupprimer(event, target) {
    const { zone, index } = target.dataset;
    const liste = foundry.utils.deepClone(this.actor.system._source.zones[zone].blessures);
    liste.splice(Number(index), 1);
    return this.actor.update({ [`system.zones.${zone}.blessures`]: liste });
  }

  static _onReparer(event, target) {
    const zone = target.dataset.zone;
    const updates = {};
    for ( const k of zone ? [zone] : Object.keys(MASINA.zones) ) updates[`system.zones.${k}.usure`] = 0;
    return this.actor.update(updates);
  }

  static _onDeVie() {
    return this.actor.depenserDeVie();
  }

  static _onReposLong() {
    return this.actor.reposLong();
  }

  static _onFinCombat() {
    return this.actor.finCombat();
  }

  static _onPvSuggeres() {
    const pv = this.actor.system.pvSuggeres;
    return this.actor.update({ "system.pv.max": pv, "system.pv.value": pv });
  }

  static _onChoisirPortrait(event, target) {
    if ( !this.isEditable ) return;
    const FilePicker = foundry.applications.apps.FilePicker.implementation;
    return new FilePicker({
      type: "image",
      current: this.actor.img,
      callback: path => this.actor.update({ img: path })
    }).browse();
  }
}
