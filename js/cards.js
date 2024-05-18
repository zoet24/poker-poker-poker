export class Card {
  constructor(value, suit) {
    this.value = value;
    this.suit = suit;
  }

  static suits = ["spade", "heart", "diamond", "club"];

  static suitSymbols = {
    spade: "\u2660", // ♠
    heart: "\u2665", // ♥
    diamond: "\u2666", // ♦
    club: "\u2663", // ♣
  };

  static suitColours = {
    spade: "black",
    heart: "red",
    diamond: "red",
    club: "black",
  };

  getSuitSymbol() {
    return Card.suitSymbols[this.suit];
  }

  getSuitColour() {
    return Card.suitColours[this.suit];
  }

  getDisplayValue() {
    switch (this.value) {
      case "11":
        return "J";
      case "12":
        return "Q";
      case "13":
        return "K";
      case "14":
        return "A";
      default:
        return this.value;
    }
  }
}

export class Deck {
  constructor() {
    this.cards = [];
    this.initialiseDeck();
  }

  initialiseDeck() {
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

    for (const suit of Card.suits) {
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

  removeCardsFromDeck(valueToRemove, suitToRemove) {
    this.cards = this.cards.filter(
      (card) => !(card.value === valueToRemove && card.suit === suitToRemove)
    );
  }
}
