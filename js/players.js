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
const fran = new Player("Fran", [], true);
const bron = new Player("Bron", [], true);

export const players = [zoe, mike, fran, bron];
