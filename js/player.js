class Player {
  constructor(name, hand = [], showCards = true) {
    this.name = name;
    this.hand = hand;
    this.showCards = showCards;
  }
}

export { Player };
