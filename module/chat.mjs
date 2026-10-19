import { acteursControles } from "./dice.mjs";

/**
 * Branche les boutons des cartes de chat de La Mašina.
 * @param {ChatMessage} message
 * @param {HTMLElement} html
 */
export function activerCarteChat(message, html) {
  const flags = message.flags?.masina;
  if ( !flags ) return;
  for ( const bouton of html.querySelectorAll("[data-masina-action]") ) {
    bouton.addEventListener("click", event => {
      event.preventDefault();
      actionCarte(message, bouton.dataset.masinaAction, bouton).catch(err => {
        console.error(err);
        ui.notifications.error(err.message);
      });
    });
  }
}

/** Acteur qui se défend : une cible de l'attaque que l'on possède, sinon un jeton contrôlé. */
async function defenseur(flags) {
  for ( const c of flags.cibles ?? [] ) {
    const a = await fromUuid(c.uuid);
    if ( a?.isOwner && !game.user.isGM ) return a;
  }
  const ctrl = acteursControles();
  if ( ctrl.length ) return ctrl[0];
  // Le MJ sans jeton sélectionné : première cible de l'attaque
  if ( game.user.isGM && flags.cibles?.length ) return fromUuid(flags.cibles[0].uuid);
  return null;
}

async function actionCarte(message, action, bouton) {
  const flags = message.flags.masina;

  switch ( action ) {

    case "degats": {
      const acteur = await fromUuid(flags.acteur);
      const arme = acteur?.items.get(flags.arme);
      if ( !arme ) return ui.notifications.warn("Arme introuvable.");
      if ( !acteur.isOwner ) return ui.notifications.warn("Seul le propriétaire de l'attaquant peut lancer ses dégâts.");
      return acteur.jetDegats(arme, { critique: flags.critique, zone: flags.zone, deuxMains: flags.deuxMains,
        cibles: (flags.cibles ?? []).filter(c => c.touche) });
    }

    case "defense": {
      const acteur = await defenseur(flags);
      if ( !acteur ) return ui.notifications.warn("Sélectionnez le jeton qui se défend.");
      return acteur.jetDefense(flags.total, { attaquant: flags.acteur, distance: flags.distance });
    }

    case "riposte": {
      const acteur = await fromUuid(flags.acteur);
      if ( !acteur?.isOwner ) return ui.notifications.warn("Seul le propriétaire du défenseur peut riposter.");
      return acteur.riposte(flags.attaquant);
    }

    case "appliquer":
    case "appliquerMoitie": {
      let acteurs = [];
      if ( canvas?.tokens?.controlled?.length ) acteurs = acteursControles();
      else for ( const uuid of flags.cibles ?? [] ) {
        const a = await fromUuid(uuid);
        if ( a ) acteurs.push(a);
      }
      if ( !acteurs.length ) return ui.notifications.warn("Sélectionnez le jeton qui encaisse les dégâts.");
      for ( const a of acteurs ) {
        if ( !a.isOwner ) { ui.notifications.warn(`Vous ne contrôlez pas ${a.name}.`); continue; }
        await a.subirDegats(flags.degats, flags.zone, { perceArmure: flags.perceArmure, critique: flags.critique,
          diviser: action === "appliquerMoitie" });
      }
      return;
    }
  }
}
