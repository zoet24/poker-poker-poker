import { players } from "./players.js";
import { Card, Deck } from "./cards.js";
import { getPlayerHandRank } from "./hands.js";
import {
  createProbabilityTable,
  updateProbabilityTable,
} from "./probabilities/tableProbabilities.js";

const deckElement = document.getElementById("deck");
const discardElement = document.getElementById("discard");
const playerListContainer = document.getElementById("player-list-container");
const probabilityTableId = "probabilityTable";

const buttonStart = document.getElementById("startGameBtn");
const buttonDealPlayer = document.getElementById("dealPlayerCardsBtn");
const buttonDealFlop = document.getElementById("dealFlopBtn");
const buttonDealTurn = document.getElementById("dealTurnBtn");
const buttonDealRiver = document.getElementById("dealRiverBtn");

class Game {
  constructor() {
    this.deck = new Deck();
    this.players = players;
    this.communityCards = [];
    this.discardPile = [];
    this.communityCardSet = [
      // new Card("10", "heart"),
      // new Card("10", "spade"),
      // new Card("10", "diamond"),
      // new Card("14", "club"),
      // new Card("14", "heart"),
    ];

    if (this.communityCardSet.length > 0) {
      this.initialiseCommunityCards();
    }

    this.attachEventListeners();
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
    buttonStart.setAttribute("disabled", "");
    buttonDealPlayer.removeAttribute("disabled", "");

    // Create and update the probability table
    createProbabilityTable(probabilityTableId);
    updateProbabilityTable("pre-deal", []);
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
    buttonDealPlayer.setAttribute("disabled", "");
    buttonDealFlop.removeAttribute("disabled", "");

    updateProbabilityTable("deal", []);
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
    buttonDealFlop.setAttribute("disabled", "");
    buttonDealTurn.removeAttribute("disabled", "");

    for (let i = 0; i < 3; i++) {
      this.dealCommunityCard(i, `community-card-flop${i + 1}`);
    }

    updateProbabilityTable("flop", this.communityCards);
  }

  dealTurn() {
    this.discardPile.push(this.deck.drawCard());
    this.dealCommunityCard(3, "community-card-turn");

    buttonDealTurn.setAttribute("disabled", "");
    buttonDealRiver.removeAttribute("disabled", "");

    updateProbabilityTable("turn", this.communityCards);
  }

  dealRiver() {
    this.discardPile.push(this.deck.drawCard());
    this.dealCommunityCard(4, "community-card-river");

    buttonDealRiver.setAttribute("disabled", "");

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
    document.getElementById("probabilityTable").innerHTML = "";
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
    buttonStart.removeAttribute("disabled", "");
    buttonDealPlayer.setAttribute("disabled", "");
    buttonDealFlop.setAttribute("disabled", "");
    buttonDealTurn.setAttribute("disabled", "");
    buttonDealRiver.setAttribute("disabled", "");
  }

  attachEventListeners() {
    document
      .getElementById("startGameBtn")
      .addEventListener("click", () => this.startGame());
    document
      .getElementById("dealPlayerCardsBtn")
      .addEventListener("click", () => this.dealPlayerCards());
    document
      .getElementById("dealFlopBtn")
      .addEventListener("click", () => this.dealFlop());
    document
      .getElementById("dealTurnBtn")
      .addEventListener("click", () => this.dealTurn());
    document
      .getElementById("dealRiverBtn")
      .addEventListener("click", () => this.dealRiver());
    document
      .getElementById("resetGameBtn")
      .addEventListener("click", () => this.resetGame());
  }
}

const game = new Game();
