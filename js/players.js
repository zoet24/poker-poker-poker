class Player {
  constructor(name, hand, showCards) {
    this.name = name;
    this.hand = hand;
    this.showCards = showCards;
  }
}

// Hardcoded Players
const zoe = new Player("Zoe", [], true);
const mike = new Player("Mike", [], true);
const fran = new Player("Fran", [], true);
const bron = new Player("Bron", [], true);
const char = new Player("Char", [], true);
const henry = new Player("Mushy Peas", [], true);

export const players = [zoe, mike, fran, bron, char, henry];
