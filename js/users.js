class User {
  constructor(name, hand, showCards) {
    this.name = name;
    this.hand = hand;
    this.showCards = showCards;
  }
}

// Hardcoded users
const zoe = new User("Zoe", ["As", "Ks"], true); // Zoe's hand: Ace of Spades, King of Spades
const mike = new User("Mike", ["Qd", "Jd"], true); // Mike's hand: Queen of Diamonds, Jack of Diamonds
const fran = new User("Fran", ["2h", "3d"], false); // Fran's hand: 2 of hearts, 3 of Diamonds
const bron = new User("Bron", [], true); // Fran's hand: 2 of hearts, 3 of Diamonds

export const users = [zoe, mike, fran, bron];
