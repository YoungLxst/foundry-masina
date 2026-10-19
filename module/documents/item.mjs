import { renderTemplate } from "../dice.mjs";

export class MasinaItem extends Item {

  /** Image par défaut selon le type. */
  static IMAGES = {
    arme: "icons/svg/sword.svg",
    armure: "icons/svg/shield.svg",
    aptitude: "icons/svg/combat.svg",
    objet: "icons/svg/item-bag.svg",
    trait: "icons/svg/aura.svg"
  };

  async _preCreate(data, options, user) {
    if ( (await super._preCreate(data, options, user)) === false ) return false;
    if ( !data.img || data.img === Item.DEFAULT_ICON ) {
      const img = MasinaItem.IMAGES[this.type];
      if ( img ) this.updateSource({ img });
    }
  }

  /** Publie la description de l'objet (ou l'effet de l'aptitude) dans le chat. */
  async afficherDansLeChat() {
    const content = await renderTemplate("systems/masina/templates/chat/item.hbs", {
      item: this, system: this.system
    });
    return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: this.actor }), content });
  }
}
