class Card {
  constructor(value, suit) {
    this.value = value;
    this.suit = suit;
  }
}

export class Deck {
  constructor() {
    this.cards = [];
    this.initializeDeck();
  }

  initializeDeck() {
    const suits = ["spade", "heart", "diamond", "club"];
    const values = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11", // J
      "12", // Q
      "13", // K
      "14", // A
    ];

    for (const suit of suits) {
      for (const value of values) {
        this.cards.push(new Card(value, suit));
      }
    }
  }

  shuffleDeck() {
    // Fisher-Yates (aka Knuth) Shuffle algorithm
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  drawCard() {
    if (this.cards.length === 0) {
      throw new Error("Deck is empty");
    }
    return this.cards.pop(); // Draw the top card from the deck
  }
}
