/**
 * La Mašina — système de jeu pour Foundry VTT.
 */
import { MASINA } from "./module/config.mjs";
import { PersonnageData, PnjData } from "./module/data/actor.mjs";
import { ArmeData, ArmureData, AptitudeData, ObjetData, TraitData } from "./module/data/item.mjs";
import { MasinaActor } from "./module/documents/actor.mjs";
import { MasinaItem } from "./module/documents/item.mjs";
import { MasinaActorSheet } from "./module/sheets/actor-sheet.mjs";
import { MasinaItemSheet } from "./module/sheets/item-sheet.mjs";
import { activerCarteChat } from "./module/chat.mjs";
import * as dice from "./module/dice.mjs";

Hooks.once("init", () => {
  console.log("La Mašina | Initialisation du système");

  CONFIG.MASINA = MASINA;
  game.masina = { config: MASINA, dice };

  // Documents et modèles de données
  CONFIG.Actor.documentClass = MasinaActor;
  CONFIG.Item.documentClass = MasinaItem;
  Object.assign(CONFIG.Actor.dataModels, { personnage: PersonnageData, pnj: PnjData });
  Object.assign(CONFIG.Item.dataModels, {
    arme: ArmeData, armure: ArmureData, aptitude: AptitudeData, objet: ObjetData, trait: TraitData
  });
  CONFIG.Actor.trackableAttributes = {
    personnage: { bar: ["pv"], value: ["corruption", "epuisement"] },
    pnj: { bar: ["pv"], value: ["epuisement"] }
  };

  // Initiative : VC DEX + 1d10 ; en cas d'égalité, la meilleure Perception agit en premier
  CONFIG.Combat.initiative = { formula: "1d10 + @caracs.dex.vc + @competences.perception.total / 100", decimals: 2 };

  // États de la Mašina
  CONFIG.statusEffects = MASINA.statusEffects;

  // Fiches
  const DocumentSheetConfig = foundry.applications.apps.DocumentSheetConfig;
  DocumentSheetConfig.registerSheet(Actor, "masina", MasinaActorSheet, {
    types: ["personnage", "pnj"], makeDefault: true, label: "Fiche de La Mašina"
  });
  DocumentSheetConfig.registerSheet(Item, "masina", MasinaItemSheet, {
    makeDefault: true, label: "Fiche d'objet de La Mašina"
  });

  // Helpers Handlebars
  Handlebars.registerHelper("masinaSigne", n => {
    n = Number(n) || 0;
    return n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : "0";
  });
  Handlebars.registerHelper("masinaRange", (debut, fin) => {
    const r = [];
    for ( let i = debut; i <= fin; i++ ) r.push(i);
    return r;
  });

  // Gabarits
  foundry.applications.handlebars.loadTemplates([
    "systems/masina/templates/actor/partials/competences.hbs",
    "systems/masina/templates/actor/partials/aptitude-ligne.hbs"
  ]);
});

/* -------------------------------------------- */

Hooks.on("renderChatMessageHTML", (message, html) => activerCarteChat(message, html));
