class Player {
  constructor(name, hand, showCards) {
    this.name = name;
    this.hand = hand;
    this.showCards = showCards;
  }
}

// Hardcoded Players
const zoe = new Player("Zoe", [], true);
const mike = new Player("Mike", [], false);
const fran = new Player("Fran", [], false);
const bron = new Player("Bron", [], false);
const char = new Player("Char", [], false);
const henry = new Player("Mushy Peas", [], false);

// export const players = [zoe, mike];
export const players = [zoe, mike, fran, bron, char, henry];
