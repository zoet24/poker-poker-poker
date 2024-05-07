import { players } from "./players.js";
import { Deck } from "./cards.js";
import { getPlayerHandRank } from "./hands.js";

const suitSymbols = {
  spade: "\u2660", // ♠
  heart: "\u2665", // ♥
  diamond: "\u2666", // ♦
  club: "\u2663", // ♣
};

const deckElement = document.getElementById("deck");
const discardElement = document.getElementById("discard");

class Game {
  constructor() {
    this.deck = new Deck();
    this.players = players;
    this.communityCards = [];
    this.discardPile = [];
  }

  getCardValue(card) {
    let cardValue = card.value;

    if (card.value == "11") {
      cardValue = "J";
    } else if (card.value == "12") {
      cardValue = "Q";
    } else if (card.value == "13") {
      cardValue = "K";
    } else if (card.value == "14") {
      cardValue = "A";
    }

    return cardValue;
  }

  startGame() {
    this.deck.shuffleDeck();
    deckElement.classList.remove("card-outline");

    deckElement.textContent = "Deck (" + this.deck.cards.length + ")";
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

        const cardValue = this.getCardValue(card);

        cardElement.textContent = cardValue + suitSymbols[card.suit];

        if (!player.showCards) {
          cardElement.classList.add("card-hidden");
        }
      });
    });

    deckElement.textContent = "Deck (" + this.deck.cards.length + ")";
    console.log("dealPlayerCards deck:", this.deck);
    console.log("dealPlayerCards players:", this.players);
    console.log("dealPlayerCards community cards:", this.communityCards);
    console.log("dealPlayerCards discard pile:", this.discardPile);
  }

  dealFlop() {
    // Burn one card, reveal flop cards
    this.discardPile.push(this.deck.drawCard());
    discardElement.classList.remove("card-outline");

    for (let i = 0; i < 3; i++) {
      this.communityCards.push(this.deck.drawCard());
    }

    this.communityCards.forEach((card, i) => {
      const cardElement = document.getElementById(
        `community-card-flop${i + 1}`
      );
      cardElement.classList.remove("card-outline");

      if ((card.suit == "heart") | (card.suit == "diamond")) {
        cardElement.classList.add("card-red");
      }

      const cardValue = this.getCardValue(card);

      cardElement.textContent = cardValue + suitSymbols[card.suit];
    });

    deckElement.textContent = "Deck (" + this.deck.cards.length + ")";
    discardElement.textContent = "Discard (" + this.discardPile.length + ")";
    console.log("dealFlop deck:", this.deck);
    console.log("dealFlop players:", this.players);
    console.log("dealFlop community cards:", this.communityCards);
    console.log("dealFlop discard pile:", this.discardPile);
  }

  dealTurn() {
    // Burn one card, reveal turn card
    this.discardPile.push(this.deck.drawCard());
    const turnCard = this.deck.drawCard();
    this.communityCards.push(turnCard);

    const cardElement = document.getElementById("community-card-turn");
    cardElement.classList.remove("card-outline");

    if ((turnCard.suit == "heart") | (turnCard.suit == "diamond")) {
      cardElement.classList.add("card-red");
    }
    const cardValue = this.getCardValue(turnCard);

    cardElement.textContent = cardValue + suitSymbols[turnCard.suit];

    deckElement.textContent = "Deck (" + this.deck.cards.length + ")";
    discardElement.textContent = "Discard (" + this.discardPile.length + ")";
    console.log("dealTurn deck:", this.deck);
    console.log("dealTurn players:", this.players);
    console.log("dealTurn community cards:", this.communityCards);
    console.log("dealTurn discard pile:", this.discardPile);
  }

  dealRiver() {
    // Burn one card, reveal river card
    this.discardPile.push(this.deck.drawCard());
    const riverCard = this.deck.drawCard();
    this.communityCards.push(riverCard);

    const cardElement = document.getElementById("community-card-river");
    cardElement.classList.remove("card-outline");

    if ((riverCard.suit == "heart") | (riverCard.suit == "diamond")) {
      cardElement.classList.add("card-red");
    }

    const cardValue = this.getCardValue(riverCard);

    cardElement.textContent = cardValue + suitSymbols[riverCard.suit];

    deckElement.textContent = "Deck (" + this.deck.cards.length + ")";
    discardElement.textContent = "Discard (" + this.discardPile.length + ")";
    console.log("dealRiver deck:", this.deck);
    console.log("dealRiver players:", this.players);
    console.log("dealRiver community cards:", this.communityCards);
    console.log("dealRiver discard pile:", this.discardPile);

    let results = [];

    this.players.forEach((player) => {
      const playerHandRank = getPlayerHandRank(player, this.communityCards);
      results.push({ name: player.name, ...playerHandRank });
    });

    results.sort((a, b) => b.rank - a.rank);

    // console.log(results);

    const list = document.createElement("ul");

    // Iterate through players
    results.forEach((result) => {
      // Create list item for each player
      const listItem = document.createElement("li");

      // Player name
      const playerName = document.createElement("span");
      playerName.textContent = `Player: ${result.name}`;

      // Player rank
      const playerRank = document.createElement("span");
      playerRank.textContent = `Rank: ${result.rank}`;

      // Player hand
      const playerHand = document.createElement("span");
      playerHand.textContent = `Hand: ${result.cards}`;

      // Append name, rank, and hand to list item
      listItem.appendChild(playerName);
      listItem.appendChild(document.createElement("br")); // Line break for readability
      listItem.appendChild(playerRank);
      listItem.appendChild(document.createElement("br")); // Line break for readability
      listItem.appendChild(playerHand);

      // Append list item to list
      list.appendChild(listItem);

      document.getElementById("player-list-container").appendChild(list);
    });
  }

  resetGame() {
    // Clear players' hands
    this.players.forEach((player) => {
      player.hand = [];
    });

    // Clear community cards and discard pile
    this.communityCards = [];
    this.discardPile = [];

    // New deck
    this.deck = new Deck();

    // Reset the UI
    const cards = document.querySelectorAll(".card");

    // Iterate over each card element
    cards.forEach((card) => {
      card.classList.add("card-outline");
      card.classList.remove("card-red");
      card.classList.remove("card-hidden");

      if (card.id !== "deck" && card.id !== "discard") {
        card.textContent = "";
      }
    });

    deckElement.textContent = "Deck";
    discardElement.textContent = "Discard";
    console.log("reset deck:", this.deck);
    console.log("reset players:", this.players);
    console.log("reset community cards:", this.communityCards);
    console.log("reset discard pile:", this.discardPile);
  }
}

const game = new Game();

const startGameBtn = document.getElementById("startGameBtn");
const dealPlayerCardsBtn = document.getElementById("dealPlayerCardsBtn");
const dealFlopBtn = document.getElementById("dealFlopBtn");
const dealTurnBtn = document.getElementById("dealTurnBtn");
const dealRiverBtn = document.getElementById("dealRiverBtn");
const resetGameBtn = document.getElementById("resetGameBtn");

// Attach event listeners
startGameBtn.addEventListener("click", startGame);
dealPlayerCardsBtn.addEventListener("click", dealPlayerCards);
dealFlopBtn.addEventListener("click", dealFlop);
dealTurnBtn.addEventListener("click", dealTurn);
dealRiverBtn.addEventListener("click", dealRiver);
resetGameBtn.addEventListener("click", resetGame);

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

function resetGame() {
  game.resetGame();
}
