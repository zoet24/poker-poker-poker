import { players } from "./players.js";
import { Deck } from "./cards.js";

const suitSymbols = {
  spade: "\u2660", // ♠
  heart: "\u2665", // ♥
  diamond: "\u2666", // ♦
  club: "\u2663", // ♣
};

class Game {
  constructor() {
    this.deck = new Deck();
    this.players = players;
    this.communityCards = [];
    this.discardPile = [];
  }

  startGame() {
    this.deck.shuffleDeck();
    console.log("Initial deck:", this.deck);
    console.log("Initial players:", this.players);
    console.log("Initial community cards:", this.communityCards);
    console.log("Initial discard pile:", this.discardPile);
  }

  dealPlayerCards() {
    // Deal two cards to each player
    this.players.forEach((player) => {
      player.hand.push(this.deck.drawCard());
      player.hand.push(this.deck.drawCard());

      const playerCards = document.getElementById(
        `cards-player-${player.name.replace(/\s/g, "").toLowerCase()}`
      );

      player.hand.forEach((card, i) => {
        const cardElement = playerCards.children[i];
        cardElement.classList.remove("card-outline");

        if ((card.suit == "heart") | (card.suit == "diamond")) {
          cardElement.classList.add("card-red");
        }
        cardElement.textContent = card.value + suitSymbols[card.suit];

        if (!player.showCards) {
          cardElement.classList.add("card-hidden");
        }
      });
    });

    console.log("dealPlayerCards deck:", this.deck);
    console.log("dealPlayerCards players:", this.players);
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
    console.log("dealFlop players:", this.players);
    console.log("dealFlop community cards:", this.communityCards);
    console.log("dealFlop discard pile:", this.discardPile);
  }

  dealTurn() {
    // Burn one card, reveal turn card
    this.discardPile.push(this.deck.drawCard());
    this.communityCards.push(this.deck.drawCard());

    console.log("dealTurn deck:", this.deck);
    console.log("dealTurn players:", this.players);
    console.log("dealTurn community cards:", this.communityCards);
    console.log("dealTurn discard pile:", this.discardPile);
  }

  dealRiver() {
    // Burn one card, reveal river card
    this.discardPile.push(this.deck.drawCard());
    this.communityCards.push(this.deck.drawCard());

    console.log("dealRiver deck:", this.deck);
    console.log("dealRiver players:", this.players);
    console.log("dealRiver community cards:", this.communityCards);
    console.log("dealRiver discard pile:", this.discardPile);
  }
}

const game = new Game();

const startGameBtn = document.getElementById("startGameBtn");
const dealPlayerCardsBtn = document.getElementById("dealPlayerCardsBtn");
const dealFlopBtn = document.getElementById("dealFlopBtn");
const dealTurnBtn = document.getElementById("dealTurnBtn");
const dealRiverBtn = document.getElementById("dealRiverBtn");

// Attach event listeners
startGameBtn.addEventListener("click", startGame);
dealPlayerCardsBtn.addEventListener("click", dealPlayerCards);
dealFlopBtn.addEventListener("click", dealFlop);
dealTurnBtn.addEventListener("click", dealTurn);
dealRiverBtn.addEventListener("click", dealRiver);

function startGame() {
  game.startGame();
}

function dealPlayerCards() {
  game.dealPlayerCards();
}

function dealFlop() {
  game.dealFlop();
}

function dealTurn() {
  game.dealTurn();
}

function dealRiver() {
  game.dealRiver();
}

// Play a game
// game.startGame();
// game.dealPlayerCards();
// game.dealFlop();
// game.dealTurn();
// game.dealRiver();
