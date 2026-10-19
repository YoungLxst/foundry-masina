import { MASINA } from "../config.mjs";
import { dialogueJet, lancerD10, messageJet, messageSimple, multiplierDe, signe, renderTemplate } from "../dice.mjs";

const { DialogV2 } = foundry.applications.api;

export class MasinaActor extends Actor {

  /* -------------------------------------------- */
  /*  Création                                    */
  /* -------------------------------------------- */

  async _preCreate(data, options, user) {
    if ( (await super._preCreate(data, options, user)) === false ) return false;
    const prototypeToken = {};
    if ( this.type === "personnage" ) Object.assign(prototypeToken, {
      actorLink: true, disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
      sight: { enabled: true }
    });
    prototypeToken.bar1 = { attribute: "pv" };
    this.updateSource({ prototypeToken });
  }

  /* -------------------------------------------- */
  /*  Outils                                      */
  /* -------------------------------------------- */

  /** Nom de la Posture active (pour la lecture de l'adversaire). */
  get postureActive() {
    if ( this.statuses?.has("decouvert") ) return { label: "À découvert", decouvert: true };
    const p = this.system.combat?.posture;
    if ( !p ) return { label: "Aucune Posture (à découvert)", decouvert: true };
    if ( MASINA.posturesSbires[p] ) return { label: MASINA.posturesSbires[p].label };
    const item = this.items.get(p);
    return item ? { label: item.name, item } : { label: "Aucune Posture (à découvert)", decouvert: true };
  }

  /** Bonus d'attaque lié à la posture d'un sbire. */
  get bonusAttaquePosture() {
    return MASINA.posturesSbires[this.system.combat?.posture]?.attaque ?? 0;
  }

  /** Détails d'un jet de compétence (pour l'affichage dans le chat). */
  _detailsCompetence(cle) {
    const s = this.system.competences[cle];
    const c = this.system.caracs[s.carac];
    const details = [
      { label: `VC ${c.abbr}`, valeur: c.vc, toujours: true },
      { label: s.label + (s.precision ? ` (${s.precision})` : ""), valeur: s.niveau, toujours: true }
    ];
    if ( s.faiblesse ) details.push({ label: "Faiblesse de classe (M)", valeur: -this.system.M });
    return details;
  }

  /* -------------------------------------------- */
  /*  Jets de compétence et de caractéristique    */
  /* -------------------------------------------- */

  /**
   * Jet de compétence : VC + niveau + 1d10 contre un SD.
   * @param {string} cle
   * @param {object} [options]
   * @param {number|null} [options.sd]
   * @param {boolean} [options.rapide]   Ne pas ouvrir la fenêtre de jet
   */
  async jetCompetence(cle, { sd = null, rapide = false, titre = null } = {}) {
    const s = this.system.competences[cle];
    const cfg = MASINA.competences[cle];
    if ( !s ) return null;
    if ( cfg.formation && s.niveau === 0 ) {
      ui.notifications.warn(`${s.label} ne s'improvise pas : il faut au moins 1 niveau pour tenter ce jet.`);
      return null;
    }
    const choix = rapide ? { mode: 0, bonus: 0, sd } : await dialogueJet({ titre: titre ?? `Jet de ${s.label}`, sd });
    if ( !choix ) return null;
    const details = this._detailsCompetence(cle);
    if ( choix.bonus ) details.push({ label: "Modificateur", valeur: choix.bonus });
    const resultat = await lancerD10(s.total + choix.bonus, choix.mode);
    await messageJet({
      actor: this, resultat, details, sd: choix.sd,
      titre: titre ?? s.label + (s.precision ? ` (${s.precision})` : ""),
      sousTitre: `${MASINA.caracs[s.carac].label}${s.estClasse ? " · compétence de classe" : ""}`,
      flags: { type: "competence", cle, acteur: this.uuid }
    });
    return resultat;
  }

  /** Jet de caractéristique pure : VC + 1d10. */
  async jetCarac(cle, { rapide = false } = {}) {
    const c = this.system.caracs[cle];
    const choix = rapide ? { mode: 0, bonus: 0, sd: null } : await dialogueJet({ titre: `Jet de ${c.label}` });
    if ( !choix ) return null;
    const details = [{ label: `VC ${c.abbr}`, valeur: c.vc, toujours: true }];
    if ( choix.bonus ) details.push({ label: "Modificateur", valeur: choix.bonus });
    const resultat = await lancerD10(c.vc + choix.bonus, choix.mode);
    await messageJet({ actor: this, resultat, details, sd: choix.sd, titre: c.label,
      sousTitre: "Jet de caractéristique", flags: { type: "carac", cle } });
    return resultat;
  }

  /* -------------------------------------------- */
  /*  Attaque                                     */
  /* -------------------------------------------- */

  /**
   * Attaque avec une arme : VC + compétence d'arme + 1d10 contre la DP de la cible.
   * @param {Item} arme
   */
  async jetAttaque(arme, { rapide = false } = {}) {
    const sys = arme.system;
    const s = this.system.competences[sys.competence];
    if ( !s ) return ui.notifications.warn("Cette arme n'a pas de compétence valide.");

    const zones = Object.entries(MASINA.zones).map(([k, z]) => `<option value="${k}">${z.label} (${z.viser})</option>`).join("");
    const extra = `
      <div class="form-group"><label>Zone visée</label>
        <select name="zone"><option value="">Aléatoire (1d10)</option>${zones}</select></div>
      ${sys.proprietes.polyvalente ? `<div class="form-group"><label>À deux mains (${sys.degatsDeuxMains || "—"})</label><input type="checkbox" name="deuxMains"></div>` : ""}`;
    const forTrop = sys.forMin && (this.system.caracs.for.value < sys.forMin);
    const choix = rapide ? { mode: 0, bonus: 0, zone: "" } : await dialogueJet({
      titre: `Attaque : ${arme.name}`, avecSD: false, extra, mode: forTrop ? -1 : 0 });
    if ( !choix ) return null;

    const details = this._detailsCompetence(sys.competence);
    if ( sys.qualiteCfg.attaque ) details.push({ label: sys.qualiteCfg.label, valeur: sys.qualiteCfg.attaque });
    if ( this.bonusAttaquePosture ) details.push({ label: "Posture", valeur: this.bonusAttaquePosture });
    const zone = choix.zone || null;
    if ( zone ) details.push({ label: `Viser : ${MASINA.zones[zone].label}`, valeur: MASINA.zones[zone].viser });
    if ( choix.bonus ) details.push({ label: "Modificateur", valeur: choix.bonus });
    const base = details.reduce((t, d) => t + d.valeur, 0);

    const resultat = await lancerD10(base, choix.mode);
    const critique = resultat.nat === 10;

    // Comparaison avec la DP des cibles
    const cibles = [...game.user.targets].filter(t => t.actor).map(t => {
      const dp = t.actor.system.dp ?? 0;
      return { uuid: t.actor.uuid, nom: t.name, dp, touche: resultat.total >= dp };
    });
    const maladresse = (resultat.nat === 1) && cibles.length && cibles.every(c => !c.touche);

    const contenu = await renderTemplate("systems/masina/templates/chat/attaque.hbs", {
      arme, cibles, critique, maladresse, zone: zone ? MASINA.zones[zone].label : null,
      deuxMains: !!choix.deuxMains
    });
    await messageJet({
      actor: this, resultat, details, contenu,
      titre: `Attaque : ${arme.name}`,
      sousTitre: `${s.label} · ${sys.degats}${sys.proprietesLabel ? " · " + sys.proprietesLabel : ""}`,
      boutons: [
        { action: "degats", label: "Dégâts", icon: "fa-solid fa-droplet" },
        { action: "defense", label: "Se défendre", icon: "fa-solid fa-shield-halved" }
      ],
      flags: { type: "attaque", acteur: this.uuid, arme: arme.id, critique, zone, deuxMains: !!choix.deuxMains,
        cibles, distance: sys.distance }
    });
    return resultat;
  }

  /** Modificateur de dégâts d'une arme. */
  modDegats(arme) {
    const sys = arme.system;
    if ( sys.competence === "arbalete" ) return 0;
    const f = this.system.caracs.for.mod;
    const d = this.system.caracs.dex.mod;
    return sys.proprietes.finesse ? Math.max(f, d) : f;
  }

  /**
   * Lance les dégâts d'une arme, avec localisation.
   * @param {Item} arme
   * @param {object} options
   */
  async jetDegats(arme, { critique = false, zone = null, deuxMains = false, cibles = [], multiplicateur = null,
    riposte = false, rapide = false } = {}) {
    const sys = arme.system;
    let choix = { mult: multiplicateur ?? 1, supp: "", bonus: 0, maximiser: false };
    if ( !rapide ) {
      const content = await renderTemplate("systems/masina/templates/dialog/degats.hbs", {
        critique, zone: zone ? MASINA.zones[zone].label : null, mult: multiplicateur ?? 1,
        lameVicieuse: this.system.identite?.classe === "fourbe"
      });
      choix = await DialogV2.wait({
        window: { title: `Dégâts : ${arme.name}` },
        classes: ["masina", "masina-dialog"],
        content, rejectClose: false,
        buttons: [{
          action: "lancer", label: "Lancer les dégâts", icon: "fa-solid fa-droplet", default: true,
          callback: (event, button) => {
            const o = new foundry.applications.ux.FormDataExtended(button.form).object;
            return { mult: Number(o.mult) || 1, supp: (o.supp || "").trim(), bonus: Number(o.bonus) || 0,
              maximiser: !!o.maximiser };
          }
        }, { action: "annuler", label: "Annuler", callback: () => null }]
      });
      if ( !choix ) return null;
    }

    // Localisation
    let locRoll = null;
    if ( !zone ) {
      locRoll = await new Roll("1d10").evaluate();
      zone = MASINA.localiser(locRoll.total);
    }

    // Multiplicateurs : ils s'additionnent (×2 et ×3 donnent ×4)
    let mult = choix.mult;
    const sources = [];
    if ( choix.mult > 1 ) sources.push(`×${choix.mult}`);
    if ( critique ) { mult += 1; sources.push("critique ×2"); }
    if ( zone === "tete" ) { mult += 1; sources.push("tête ×2"); }

    const de = (deuxMains && sys.degatsDeuxMains) ? sys.degatsDeuxMains : sys.degats;
    const mod = this.modDegats(arme) + (sys.qualiteCfg?.degats ?? 0) + choix.bonus;
    let formule = multiplierDe(de, mult);
    if ( choix.supp ) formule += ` + ${choix.supp}`;
    if ( mod ) formule += mod > 0 ? ` + ${mod}` : ` - ${Math.abs(mod)}`;
    const roll = await new Roll(formule).evaluate({ maximize: choix.maximiser });
    const total = Math.max(0, roll.total);

    const contenu = await renderTemplate("systems/masina/templates/chat/degats.hbs", {
      total, formule, zone: MASINA.zones[zone].label, loc: locRoll?.total ?? null,
      sources: sources.join(" · "), perceArmure: sys.proprietes.perceArmure, maximiser: choix.maximiser,
      typeDegats: sys.typeDegats, riposte,
      cibles: cibles.map(c => c.nom).join(", ")
    });
    await messageSimple({
      actor: this,
      titre: `${riposte ? "Riposte" : "Dégâts"} : ${arme.name}`,
      contenu,
      rolls: [roll, locRoll].filter(Boolean),
      flags: { type: "degats", degats: total, zone, perceArmure: sys.proprietes.perceArmure, critique,
        cibles: cibles.map(c => c.uuid) }
    });
    return { total, zone };
  }

  /* -------------------------------------------- */
  /*  Défense active                              */
  /* -------------------------------------------- */

  /**
   * Défense active (réaction) contre une attaque qui touche.
   * @param {number} attaque          Total du jet d'attaque
   * @param {object} [options]
   * @param {string} [options.attaquant]  UUID de l'attaquant (pour la riposte)
   * @param {boolean} [options.distance]  L'attaque est à distance
   */
  async jetDefense(attaque, { attaquant = null, distance = false } = {}) {
    const classe = this.system.identite?.classe ?? this.system.classe ?? "";
    const defaut = this.system.defenseClasse?.cle ?? "esquive";
    const extra = `<div class="form-group"><label>Défense</label><select name="defense">
      ${["blocage", "parade", "esquive"].map(d => `<option value="${d}" ${d === defaut ? "selected" : ""}>${MASINA.competences[d].label}</option>`).join("")}
      </select></div>`;
    const choix = await dialogueJet({ titre: `Se défendre contre ${attaque}`, avecSD: false, extra });
    if ( !choix ) return null;
    const def = choix.defense;
    const bouclier = this.system.armure.bouclier > 0;

    if ( def === "blocage" && classe !== "soldat" && !bouclier ) {
      return ui.notifications.warn("Sans bouclier, seul un Soldat peut bloquer.");
    }
    if ( def === "blocage" && distance && !bouclier ) {
      return ui.notifications.warn("Contre une attaque à distance, il faut tenir un bouclier pour bloquer.");
    }
    if ( def === "parade" && distance ) {
      return ui.notifications.warn("La Parade ne fonctionne qu'au corps à corps.");
    }

    const details = this._detailsCompetence(def);
    if ( choix.bonus ) details.push({ label: "Modificateur", valeur: choix.bonus });
    const base = details.reduce((t, d) => t + d.valeur, 0);
    const resultat = await lancerD10(base, choix.mode);
    const reussite = resultat.total >= attaque;   // l'égalité va au défenseur

    let effet;
    let riposte = false;
    if ( def === "blocage" ) {
      if ( reussite ) effet = (classe === "soldat" && resultat.total >= attaque + 5)
        ? "Blocage parfait : dégâts annulés." : "Blocage réussi : dégâts divisés par 2.";
      else if ( classe === "soldat" ) effet = (attaque < this.system.dp + 2)
        ? "Blocage raté, mais Blocage naturel (+2 DP) : l'attaque rate !"
        : "Blocage raté. Blocage naturel : +2 DP contre cette attaque, insuffisant.";
      else effet = "Blocage raté.";
    }
    else if ( def === "parade" ) {
      if ( classe === "fourbe" ) {
        if ( reussite ) { effet = "Parade réussie : attaque annulée, riposte (DA ×2 + modificateur) !"; riposte = true; }
        else effet = "Parade ratée : le Fourbe subit les dégâts maximum de l'arme ennemie.";
      }
      else effet = reussite ? "Parade réussie : dégâts divisés par 2, sans riposte." : "Parade ratée.";
    }
    else {
      effet = reussite ? (classe === "oeil"
        ? "Esquive réussie : attaque annulée, et déplacement de 1,5 m sans attaque d'opportunité."
        : "Esquive réussie : attaque annulée.") : "Esquive ratée.";
    }

    await messageJet({
      actor: this, resultat, details,
      titre: `${MASINA.competences[def].label} contre ${attaque}`,
      sousTitre: "Défense active (réaction)",
      contenu: `<p class="masina-effet ${reussite ? "ok" : "ko"}">${effet}</p>`,
      boutons: riposte ? [{ action: "riposte", label: "Riposter", icon: "fa-solid fa-khanda" }] : [],
      flags: { type: "defense", acteur: this.uuid, attaquant, reussite, defense: def }
    });
    return { resultat, reussite };
  }

  /** Riposte du Fourbe après une Parade réussie. */
  async riposte(attaquantUuid) {
    const arme = this.items.find(i => i.type === "arme" && i.system.equipee && !i.system.distance);
    if ( !arme ) return ui.notifications.warn("Aucune arme de corps à corps équipée pour riposter.");
    const cible = attaquantUuid ? await fromUuid(attaquantUuid) : null;
    const cibles = cible ? [{ uuid: cible.uuid, nom: cible.name }] : [];
    return this.jetDegats(arme, { multiplicateur: 2, cibles, riposte: true });
  }

  /* -------------------------------------------- */
  /*  Lire l'adversaire                           */
  /* -------------------------------------------- */

  /** Jet de Perception contre 10 + B de la cible pour deviner sa Posture. */
  async lireAdversaire() {
    const cibles = [...game.user.targets].filter(t => t.actor);
    if ( !cibles.length ) return ui.notifications.warn("Ciblez d'abord l'adversaire à lire (touche T).");
    const token = cibles[0];
    const cible = token.actor;
    const sd = cible.system.sdLecture;
    const resultat = await this.jetCompetence("perception", { sd, titre: `Lire ${token.name}` });
    if ( !resultat ) return;
    if ( resultat.total < sd ) return;
    const posture = cible.postureActive;
    const gms = game.users.filter(u => u.isGM).map(u => u.id);
    await messageSimple({
      actor: this,
      titre: `Posture de ${token.name}`,
      contenu: `<p>${this.name} devine la posture de <b>${token.name}</b> : <b>${posture.label}</b>.</p>`,
      messageData: { whisper: [...new Set([game.user.id, ...gms])] }
    });
  }

  /* -------------------------------------------- */
  /*  Encaisser les coups                         */
  /* -------------------------------------------- */

  /**
   * Applique des dégâts localisés : défense (÷ 2), PA de la zone, usure, PV, blessure grave.
   * @param {number} degats
   * @param {string} zone
   * @param {object} [options]
   */
  async subirDegats(degats, zone = "torse", { perceArmure = false, critique = false, diviser = false,
    sansArmure = false } = {}) {
    const sys = this.system;
    const z = sys.zones[zone];
    if ( !z ) return;
    const apresDefense = diviser ? Math.floor(degats / 2) : degats;
    let pa = sansArmure ? 0 : z.pa;
    if ( perceArmure ) pa = Math.floor(pa / 2);
    const subis = Math.max(0, apresDefense - pa);

    const updates = {};
    const lignes = [];
    lignes.push(`<b>${degats}</b> dégâts${diviser ? ` ÷ 2 = <b>${apresDefense}</b>` : ""}, `
      + `PA ${pa}${perceArmure ? " (perce-armure)" : ""} → <b>${subis}</b> subis (${z.label}).`);

    // Usure : un coup qui traverse l'armure lui retire 1 PA sur cette zone
    if ( !sansArmure && (z.pa > 0) && (apresDefense > pa) ) {
      updates[`system.zones.${zone}.usure`] = z.usure + 1;
      lignes.push(`L'armure s'abîme : PA ${z.pa} → ${z.pa - 1} sur cette zone.`);
    }
    else if ( subis === 0 ) lignes.push("Le coup glisse sur l'armure.");

    // Points de vie
    const pvAvant = sys.pv.value;
    const pvApres = pvAvant - subis;
    updates["system.pv.value"] = Math.max(0, pvApres);
    if ( subis ) lignes.push(`PV : ${pvAvant} → ${Math.max(0, pvApres)} / ${sys.pv.max}.`);

    // Blessure grave
    let blessureRoll = null;
    if ( (subis > 0) && ((subis >= z.seuil) || critique) ) {
      blessureRoll = await new Roll("1d6").evaluate();
      const [nom, effet] = MASINA.blessures[MASINA.zones[zone].type][blessureRoll.total - 1];
      const actuelles = foundry.utils.deepClone(sys._source.zones[zone].blessures);
      actuelles.push({ nom, effet, soignee: false, repos: 0 });
      updates[`system.zones.${zone}.blessures`] = actuelles;
      lignes.push(`<span class="masina-grave">Blessure grave (${critique && subis < z.seuil ? "critique" : `seuil ${z.seuil}`}) — 1d6 = ${blessureRoll.total} : <b>${nom}</b>. ${effet}.</span>`);
    }

    // 0 PV
    let statut = null;
    if ( (pvApres <= 0) && (subis > 0) && (pvAvant > 0) ) {
      if ( -pvApres >= sys.pv.max ) {
        statut = "dead";
        lignes.push(`<span class="masina-grave"><b>Mort sur le coup</b> (${-pvApres} dégâts restants ≥ PV max).</span>`);
      }
      else {
        statut = "unconscious";
        lignes.push(`<span class="masina-grave"><b>Inconscient.</b> Jets de survie : Résistance SD 13 au début de chaque tour.</span>`);
      }
    }
    else if ( (pvAvant <= 0) && (subis > 0) ) {
      lignes.push(`Déjà à 0 PV : compte comme ${critique ? "deux échecs" : "un échec"} au jet de survie.`);
    }

    await this.update(updates);
    if ( statut ) await this.toggleStatusEffect(statut, { active: true, overlay: statut === "dead" });
    await messageSimple({
      actor: this,
      titre: `${this.name} encaisse`,
      contenu: lignes.map(l => `<p>${l}</p>`).join(""),
      rolls: blessureRoll ? [blessureRoll] : []
    });
    return subis;
  }

  /* -------------------------------------------- */
  /*  Repos                                       */
  /* -------------------------------------------- */

  /** Repos court : dépenser un dé de vie (résultat + mod. CON, minimum 1). */
  async depenserDeVie() {
    const dv = this.system.deVie;
    if ( !dv || dv.value <= 0 ) return ui.notifications.warn("Plus de dé de vie disponible.");
    const roll = await new Roll(`1d${dv.taille}`).evaluate();
    const soin = Math.max(1, roll.total + this.system.caracs.con.mod);
    const pv = Math.min(this.system.pv.max, this.system.pv.value + soin);
    await this.update({ "system.deVie.value": dv.value - 1, "system.pv.value": pv });
    await messageSimple({ actor: this, titre: "Repos court", rolls: [roll],
      contenu: `<p>Dé de vie : ${roll.total} ${signe(this.system.caracs.con.mod)} (CON) → <b>+${soin} PV</b> (${pv} / ${this.system.pv.max}).</p>` });
  }

  /** Repos long : moitié des PV max, moitié des dés de vie, −1 épuisement, compétences 1/jour. */
  async reposLong() {
    const sys = this.system;
    const pv = Math.min(sys.pv.max, sys.pv.value + Math.ceil(sys.pv.max / 2));
    const updates = { "system.pv.value": pv, "system.epuisement": Math.max(0, sys.epuisement - 1) };
    if ( sys.deVie ) {
      const depenses = sys.deVie.max - sys.deVie.value;
      updates["system.deVie.value"] = Math.min(sys.deVie.max, sys.deVie.value + Math.max(1, Math.floor(depenses / 2)));
    }
    await this.update(updates);
    const aptitudes = this.items.filter(i => i.type === "aptitude" && i.system.utilisee)
      .map(i => ({ _id: i.id, "system.utilisee": false }));
    if ( aptitudes.length ) await this.updateEmbeddedDocuments("Item", aptitudes);
    await messageSimple({ actor: this, titre: "Repos long",
      contenu: `<p>PV : ${pv} / ${sys.pv.max}. Épuisement −1. Les compétences 1/jour sont de nouveau disponibles. Le Roulement peut être modifié.</p>` });
  }

  /** Fin du combat : les compétences 1/combat redeviennent disponibles. */
  async finCombat() {
    const aptitudes = this.items.filter(i => i.type === "aptitude" && i.system.utilisee && i.system.limite === "combat")
      .map(i => ({ _id: i.id, "system.utilisee": false }));
    if ( aptitudes.length ) await this.updateEmbeddedDocuments("Item", aptitudes);
    await this.update({ "system.combat.posture": "" });
    ui.notifications.info(`${this.name} : compétences 1/combat réinitialisées.`);
  }
}
