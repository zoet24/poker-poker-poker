import { players } from "./players.js";
import { Card, Deck } from "./cards.js";
import { getPlayerHandRank } from "./hands.js";

const deckElement = document.getElementById("deck");
const discardElement = document.getElementById("discard");

class Game {
  constructor() {
    this.deck = new Deck();
    this.players = players;
    this.communityCards = [];
    this.discardPile = [];
    this.communityCardSet = [
      new Card("6", "heart"),
      new Card("7", "club"),
      new Card("8", "diamond"),
      new Card("9", "diamond"),
      new Card("9", "heart"),
    ];

    if (this.communityCardSet.length > 0) {
      this.initialiseCommunityCards();
    }
  }

  initialiseCommunityCards() {
    // Remove community cards from the deck
    this.communityCardSet.forEach((card) => {
      this.deck.removeCardsFromDeck(card.value, card.suit);
    });
  }

  startGame() {
    this.deck.shuffleDeck();
    deckElement.classList.remove("card--outline");

    deckElement.textContent = "Deck (" + this.deck.cards.length + ")";
  }

  dealPlayerCards() {
    // Deal two cards to each player
    this.players.forEach((player) => {
      player.hand.push(this.deck.drawCard());
      player.hand.push(this.deck.drawCard());

      const playerCards = document.getElementById(
        `cards--player-${player.name.replace(/\s/g, "").toLowerCase()}`
      );

      player.hand.forEach((card, i) => {
        const cardElement = playerCards.children[i];
        cardElement.classList.remove("card--outline");

        if (card.getSuitColour() === "red") {
          cardElement.classList.add("card--red");
        }

        const cardValue = card.getDisplayValue();
        const suitSymbol = card.getSuitSymbol();
        cardElement.textContent = cardValue + suitSymbol;

        if (!player.showCards) {
          cardElement.classList.add("card--hidden");
        }
      });
    });

    deckElement.textContent = "Deck (" + this.deck.cards.length + ")";
  }

  dealCommunityCard(cardIndex, elementId) {
    let communityCard;

    if (this.communityCardSet.length > 0) {
      communityCard = this.communityCardSet[cardIndex];
    } else {
      communityCard = this.deck.drawCard();
    }

    this.communityCards.push(communityCard);

    const cardElement = document.getElementById(elementId);
    cardElement.classList.remove("card--outline");

    if (communityCard.getSuitColour() === "red") {
      cardElement.classList.add("card--red");
    }

    const cardValue = communityCard.getDisplayValue();
    const suitSymbol = communityCard.getSuitSymbol();
    cardElement.textContent = cardValue + suitSymbol;

    deckElement.textContent = "Deck (" + this.deck.cards.length + ")";
    discardElement.textContent = "Discard (" + this.discardPile.length + ")";
  }

  dealFlop() {
    this.discardPile.push(this.deck.drawCard());
    discardElement.classList.remove("card--outline");

    for (let i = 0; i < 3; i++) {
      this.dealCommunityCard(i, `community-card-flop${i + 1}`);
    }
  }

  dealTurn() {
    this.discardPile.push(this.deck.drawCard());
    this.dealCommunityCard(3, "community-card-turn");
  }

  dealRiver() {
    this.discardPile.push(this.deck.drawCard());
    this.dealCommunityCard(4, "community-card-river");
    this.generateResults();
  }

  generateResults() {
    let results = [];

    this.players.forEach((player) => {
      const playerHandRank = getPlayerHandRank(player, this.communityCards);
      results.push({ name: player.name, ...playerHandRank });
    });

    results.sort((a, b) => b.rank - a.rank);

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
      playerHand.innerHTML = `${result.rankName}: ${result.cards
        .map((card) => {
          const cardValue = card.getDisplayValue();
          const suitSymbol = card.getSuitSymbol();
          const suitColour = card.getSuitColour();
          const cardClass = suitColour === "red" ? "card--red" : "";
          return `<span class="${cardClass}">${cardValue}${suitSymbol}</span>`;
        })
        .join(", ")}`;

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
    const playerListContainer = document.getElementById(
      "player-list-container"
    );
    playerListContainer.innerHTML = "";

    const cards = document.querySelectorAll(".card");

    // Iterate over each card element
    cards.forEach((card) => {
      card.classList.add("card--outline");
      card.classList.remove("card--red");
      card.classList.remove("card--hidden");

      if (card.id !== "deck" && card.id !== "discard") {
        card.textContent = "";
      }
    });

    deckElement.textContent = "Deck";
    discardElement.textContent = "Discard";
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
