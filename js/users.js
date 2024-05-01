class User {
  constructor(name, hand, showCards) {
    this.name = name;
    this.hand = hand;
    this.showCards = showCards;
  }
}

// Hardcoded users
const zoe = new User("Zoe", [], true);
const mike = new User("Mike", [], true);
const fran = new User("Fran", [], true);
const bron = new User("Bron", [], true);

export const users = [zoe, mike, fran, bron];
