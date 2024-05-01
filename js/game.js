import { users } from "./users.js";
import { Deck } from "./cards.js";

class Game {
  constructor() {
    this.deck = new Deck();
    this.users = users;
    this.communityCards = [];
    this.discardPile = [];
  }

  startGame() {
    //   this.deck.shuffleDeck()
    console.log("Initial deck:", this.deck);
    console.log("Initial users:", this.users);
    console.log("Initial community cards:", this.communityCards);
    console.log("Initial discard pile:", this.discardPile);
  }

  dealPlayerCards() {
    // Deal two cards to each user
    this.users.forEach((user) => {
      user.hand.push(this.deck.drawCard());
      user.hand.push(this.deck.drawCard());
    });

    console.log("dealPlayerCards deck:", this.deck);
    console.log("dealPlayerCards users:", this.users);
    console.log("dealPlayerCards community cards:", this.communityCards);
    console.log("dealPlayerCards discard pile:", this.discardPile);
  }

  dealFlop() {
    // Burn one card, reveal flop cards
    this.discardPile.push(this.deck.drawCard());
    this.communityCards.push(this.deck.drawCard());
    this.communityCards.push(this.deck.drawCard());
    this.communityCards.push(this.deck.drawCard());

    console.log("dealFlop deck:", this.deck);
    console.log("dealFlop users:", this.users);
    console.log("dealFlop community cards:", this.communityCards);
    console.log("dealFlop discard pile:", this.discardPile);
  }

  dealTurn() {
    // Burn one card, reveal turn card
    this.discardPile.push(this.deck.drawCard());
    this.communityCards.push(this.deck.drawCard());

    console.log("dealTurn deck:", this.deck);
    console.log("dealTurn users:", this.users);
    console.log("dealTurn community cards:", this.communityCards);
    console.log("dealTurn discard pile:", this.discardPile);
  }

  dealRiver() {
    // Burn one card, reveal river card
    this.discardPile.push(this.deck.drawCard());
    this.communityCards.push(this.deck.drawCard());

    console.log("dealRiver deck:", this.deck);
    console.log("dealRiver users:", this.users);
    console.log("dealRiver community cards:", this.communityCards);
    console.log("dealRiver discard pile:", this.discardPile);
  }
}

const game = new Game();

// Play a game
game.startGame();
game.dealPlayerCards();
game.dealFlop();
game.dealTurn()
game.dealRiver()