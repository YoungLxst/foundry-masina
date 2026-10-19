import { MASINA } from "./config.mjs";

const { DialogV2 } = foundry.applications.api;
export const renderTemplate = (...args) => foundry.applications.handlebars.renderTemplate(...args);
export const signe = n => (n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : "+0");

/* -------------------------------------------- */
/*  Fenêtre de jet                              */
/* -------------------------------------------- */

/**
 * Demande au joueur les modificateurs d'un jet.
 * @param {object} options
 * @param {string} options.titre
 * @param {number|null} [options.sd]          SD proposé par défaut
 * @param {boolean} [options.avecSD=true]     Afficher le choix du SD
 * @param {number} [options.mode=0]           1 = avantage, −1 = désavantage
 * @param {string} [options.extra]            HTML supplémentaire (champs nommés)
 * @returns {Promise<object|null>}            Les valeurs du formulaire, ou null si annulé
 */
export async function dialogueJet({ titre, sd = null, avecSD = true, mode = 0, extra = "" } = {}) {
  const difficultes = Object.entries(MASINA.difficultes).map(([v, label]) => ({
    value: Number(v), label, selected: Number(v) === sd }));
  if ( (sd !== null) && !difficultes.some(d => d.selected) ) difficultes.push({ value: sd, label: `SD ${sd}`, selected: true });
  difficultes.sort((a, b) => a.value - b.value);
  const content = await renderTemplate("systems/masina/templates/dialog/jet.hbs", {
    sd, avecSD, mode, extra, difficultes
  });
  return DialogV2.wait({
    window: { title: titre },
    classes: ["masina", "masina-dialog"],
    content,
    rejectClose: false,
    buttons: [{
      action: "lancer",
      label: "Lancer",
      icon: "fa-solid fa-dice-d10",
      default: true,
      callback: (event, button) => {
        const data = new foundry.applications.ux.FormDataExtended(button.form).object;
        data.mode = Number(data.mode) || 0;
        data.bonus = Number(data.bonus) || 0;
        data.sd = (data.sd === "" || data.sd === null || data.sd === undefined) ? null : Number(data.sd);
        return data;
      }
    }, {
      action: "annuler",
      label: "Annuler",
      icon: "fa-solid fa-xmark",
      callback: () => null
    }]
  });
}

/* -------------------------------------------- */
/*  Le jet de base                              */
/* -------------------------------------------- */

/**
 * Jet = base + 1d10. Sur 10 naturel on relance et on ajoute, sur 1 naturel on relance et on retire.
 * Avec avantage ou désavantage, on lance 2d10 et on garde le meilleur ou le pire.
 * @param {number} base   VC + compétence + modificateurs
 * @param {number} mode   1 = avantage, −1 = désavantage, 0 = normal
 */
export async function lancerD10(base, mode = 0) {
  const de = mode > 0 ? "2d10kh" : mode < 0 ? "2d10kl" : "1d10";
  const formule = base >= 0 ? `${de} + ${base}` : `${de} - ${Math.abs(base)}`;
  const roll = await new Roll(formule).evaluate();
  const terme = roll.dice[0];
  const nat = terme.total;
  const faces = terme.results.map(r => ({ valeur: r.result, gardee: r.active !== false }));
  let relance = null;
  let total = roll.total;
  if ( nat === 10 || nat === 1 ) {
    relance = await new Roll("1d10").evaluate();
    total += (nat === 10 ? 1 : -1) * relance.total;
  }
  return { roll, relance, nat, faces, total, base, mode };
}

/* -------------------------------------------- */
/*  Messages                                    */
/* -------------------------------------------- */

/**
 * Crée le message de chat d'un jet.
 * @param {object} options
 * @param {Actor} options.actor
 * @param {object} options.resultat       Le retour de lancerD10
 * @param {string} options.titre
 * @param {string} [options.sousTitre]
 * @param {Array<{label:string, valeur:number}>} [options.details]
 * @param {number|null} [options.sd]
 * @param {string} [options.contenu]      HTML ajouté sous le résultat
 * @param {Array} [options.boutons]       {action, label, icon}
 * @param {object} [options.flags]        Données stockées dans flags.masina
 * @param {object} [options.messageData]  Données supplémentaires du message (whisper…)
 */
export async function messageJet({ actor, resultat, titre, sousTitre = "", details = [], sd = null,
  contenu = "", boutons = [], flags = {}, messageData = {} }) {
  const degre = (sd !== null) ? MASINA.degreReussite(resultat.total, sd) : null;
  const html = await renderTemplate("systems/masina/templates/chat/jet.hbs", {
    titre, sousTitre, sd, degre, contenu, boutons,
    details: details.filter(d => d.valeur !== 0 || d.toujours).map(d => ({ ...d, texte: signe(d.valeur) })),
    faces: resultat.faces,
    nat: resultat.nat,
    mode: resultat.mode,
    relance: resultat.relance ? {
      valeur: resultat.relance.total,
      signe: resultat.nat === 10 ? "+" : "−",
      label: resultat.nat === 10 ? "10 naturel : on relance et on ajoute" : "1 naturel : on relance et on retire"
    } : null,
    total: resultat.total
  });
  const rolls = [resultat.roll, resultat.relance].filter(Boolean);
  const data = {
    speaker: ChatMessage.getSpeaker({ actor }),
    content: html,
    rolls,
    sound: CONFIG.sounds.dice,
    flags: { masina: { ...flags, total: resultat.total, nat: resultat.nat, degre: degre?.cle ?? null } },
    ...messageData
  };
  appliquerRollMode(data);
  return ChatMessage.create(data);
}

/** Applique le mode de jet choisi dans le chat (public, privé…), si l'API existe. */
export function appliquerRollMode(data) {
  try {
    const mode = game.settings.get("core", "rollMode");
    if ( !data.whisper && ChatMessage.applyRollMode ) ChatMessage.applyRollMode(data, mode);
  } catch(err) { /* paramètre absent : jet public */ }
  return data;
}

/** Message simple (sans jet de d10). */
export async function messageSimple({ actor = null, titre, contenu, rolls = [], flags = {}, messageData = {} }) {
  const html = await renderTemplate("systems/masina/templates/chat/simple.hbs", { titre, contenu });
  return ChatMessage.create({
    speaker: actor ? ChatMessage.getSpeaker({ actor }) : ChatMessage.getSpeaker(),
    content: html,
    rolls,
    sound: rolls.length ? CONFIG.sounds.dice : undefined,
    flags: { masina: flags },
    ...messageData
  });
}

/* -------------------------------------------- */
/*  Dégâts                                      */
/* -------------------------------------------- */

/**
 * Multiplie le dé d'arme de base : 1d8 ×3 → 3d8. Les dés en plus et les modificateurs ne sont jamais multipliés.
 * @param {string} de
 * @param {number} mult
 */
export function multiplierDe(de, mult) {
  const m = /^\s*(\d*)d(\d+)\s*$/i.exec(de ?? "");
  if ( m ) return `${(Number(m[1]) || 1) * mult}d${m[2]}`;
  const n = Number(de);
  if ( Number.isFinite(n) ) return String(n * mult);
  return mult > 1 ? `(${de}) * ${mult}` : de;
}

/** Récupère les acteurs visés par le joueur (cibles), sinon les jetons contrôlés. */
export function acteursCibles() {
  const cibles = [...game.user.targets].map(t => t.actor).filter(Boolean);
  return cibles;
}

export function acteursControles() {
  const ctrl = canvas?.tokens?.controlled?.map(t => t.actor).filter(Boolean) ?? [];
  if ( ctrl.length ) return ctrl;
  return game.user.character ? [game.user.character] : [];
}
