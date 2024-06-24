import { players } from "./players.js";
import { Deck } from "./cards.js";
import { getPlayerHandRank } from "./hands.js";
import {
  createProbabilityTable,
  updateProbabilityTable,
} from "./probabilities/tableProbabilities.js";

const deckElement = document.getElementById("deck");
const burnElement = document.getElementById("burn");
const probabilityTableId = "probabilityTable";

const addPlayerBtn = document.getElementById("addPlayerBtn");
const removePlayerBtn = document.getElementById("removePlayerBtn");
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
    this.burnPile = [];
    this.communityCardSet = [];

    if (this.communityCardSet.length > 0) {
      this.initialiseCommunityCards();
    }

    this.attachEventListeners();
  }

  initialiseCommunityCards() {
    this.communityCardSet.forEach((card) => {
      this.deck.removeCardsFromDeck(card.value, card.suit);
    });
  }

  updateDeckAndBurnCounts() {
    deckElement.textContent = `Deck (${this.deck.cards.length})`;
    burnElement.textContent = `Burn (${this.burnPile.length})`;
  }

  updateCardElement(cardElement, card) {
    cardElement.classList.remove("card--outline");
    cardElement.classList.toggle("card--red", card.getSuitColour() === "red");
    cardElement.textContent = `${card.getDisplayValue()}${card.getSuitSymbol()}`;
  }

  startGame() {
    this.deck.shuffleDeck();
    this.updateDeckAndBurnCounts();
    deckElement.classList.remove("card--outline");

    addPlayerBtn.setAttribute("disabled", "");
    removePlayerBtn.setAttribute("disabled", "");
    buttonStart.setAttribute("disabled", "");
    buttonDealPlayer.removeAttribute("disabled", "");

    createProbabilityTable(probabilityTableId);
    updateProbabilityTable("pre-deal", []);
  }

  dealPlayerCards() {
    this.players.forEach((player) => {
      player.hand = [this.deck.drawCard(), this.deck.drawCard()];
      const playerCards = document.getElementById(
        `cards--player-${player.name.replace(/\s/g, "").toLowerCase()}`
      );

      player.hand.forEach((card, i) => {
        this.updateCardElement(playerCards.children[i], card);
        if (!player.showCards) {
          playerCards.children[i].classList.add("card--hidden");
        }
      });
    });

    this.updateDeckAndBurnCounts();
    buttonDealPlayer.setAttribute("disabled", "");
    buttonDealFlop.removeAttribute("disabled", "");

    updateProbabilityTable("deal", []);
  }

  dealCommunityCard(cardIndex, elementId) {
    const communityCard =
      this.communityCardSet.length > 0
        ? this.communityCardSet[cardIndex]
        : this.deck.drawCard();

    this.communityCards.push(communityCard);
    this.updateCardElement(document.getElementById(elementId), communityCard);
    this.updateDeckAndBurnCounts();
  }

  dealFlop() {
    this.burnPile.push(this.deck.drawCard());
    burnElement.classList.remove("card--outline");

    [
      "community-card-flop1",
      "community-card-flop2",
      "community-card-flop3",
    ].forEach((id, index) => this.dealCommunityCard(index, id));

    buttonDealFlop.setAttribute("disabled", "");
    buttonDealTurn.removeAttribute("disabled", "");

    updateProbabilityTable("flop", this.communityCards);
  }

  dealTurn() {
    this.burnPile.push(this.deck.drawCard());
    this.dealCommunityCard(3, "community-card-turn");

    buttonDealTurn.setAttribute("disabled", "");
    buttonDealRiver.removeAttribute("disabled", "");

    updateProbabilityTable("turn", this.communityCards);
  }

  dealRiver() {
    this.burnPile.push(this.deck.drawCard());
    this.dealCommunityCard(4, "community-card-river");

    buttonDealRiver.setAttribute("disabled", "");

    this.generateResults();
  }

  generateResults() {
    const results = this.players.map((player) => ({
      name: player.name,
      ...getPlayerHandRank(player, this.communityCards),
    }));

    results.sort((a, b) => b.rank - a.rank);

    const table = document.getElementById("probabilityTable");

    const handNameToIndex = {
      "Royal Flush": 3,
      "Straight Flush": 4,
      "Four Of A Kind": 5,
      "Full House": 6,
      Flush: 7,
      Straight: 8,
      "Three Of A Kind": 9,
      "Two Pair": 10,
      "One Pair": 11,
      "High Card": 12,
    };

    results.forEach((result, index) => {
      const row = table.rows[index + 1];

      row.cells[0].textContent = result.rank.toFixed(3);
      row.cells[1].innerHTML = result.cards
        .map((card) => {
          const cardClass = card.getSuitColour() === "red" ? "card--red" : "";
          return `<span class="${cardClass}">${card.getDisplayValue()}${card.getSuitSymbol()}</span>`;
        })
        .join(" ");
      row.cells[2].textContent = result.name;

      const handTypeIndex = handNameToIndex[result.rankName];
      if (handTypeIndex !== undefined) {
        row.cells[handTypeIndex].classList.add("highlight-winner");
      }
    });

    this.sortTable(0);
  }

  sortTable(columnIndex) {
    const table = document.getElementById("probabilityTable");
    let switching = true;

    while (switching) {
      switching = false;
      const rows = table.rows;

      for (let i = 1; i < rows.length - 1; i++) {
        const x = rows[i].getElementsByTagName("td")[columnIndex];
        const y = rows[i + 1].getElementsByTagName("td")[columnIndex];

        if (parseFloat(x.innerHTML) < parseFloat(y.innerHTML)) {
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
        }
      }
    }
  }

  resetGame() {
    this.players.forEach((player) => {
      player.hand = [];
    });
    this.communityCards = [];
    this.burnPile = [];
    this.deck = new Deck();

    document.getElementById("probabilityTable").innerHTML = "";

    document.querySelectorAll(".card").forEach((card) => {
      card.classList.add("card--outline");
      card.classList.remove("card--red", "card--hidden");
      if (!["deck", "burn"].includes(card.id)) {
        card.textContent = "";
      }
    });

    deckElement.textContent = "Deck";
    burnElement.textContent = "Burn";
    addPlayerBtn.removeAttribute("disabled");
    removePlayerBtn.removeAttribute("disabled");
    buttonStart.removeAttribute("disabled");
    buttonDealPlayer.setAttribute("disabled", "");
    buttonDealFlop.setAttribute("disabled", "");
    buttonDealTurn.setAttribute("disabled", "");
    buttonDealRiver.setAttribute("disabled", "");
  }

  attachEventListeners() {
    buttonStart.addEventListener("click", () => this.startGame());
    buttonDealPlayer.addEventListener("click", () => this.dealPlayerCards());
    buttonDealFlop.addEventListener("click", () => this.dealFlop());
    buttonDealTurn.addEventListener("click", () => this.dealTurn());
    buttonDealRiver.addEventListener("click", () => this.dealRiver());
    document
      .getElementById("resetGameBtn")
      .addEventListener("click", () => this.resetGame());
  }
}

const game = new Game();
