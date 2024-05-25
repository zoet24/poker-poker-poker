import { players } from "./players.js";

export const createProbabilityTable = (tableId) => {
  const table = document.getElementById(tableId);

  // Create table header
  const headerRow = document.createElement("tr");
  const headers = ["Player", "Royal Flush", "Straight Flush", "Four of a Kind"];
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Create a row for each player
  players.forEach((player) => {
    const row = document.createElement("tr");

    // Player name cell
    const nameCell = document.createElement("td");
    nameCell.textContent = player.name;
    row.appendChild(nameCell);

    // Probability cells
    ["Royal Flush", "Straight Flush", "Four of a Kind"].forEach(() => {
      const cell = document.createElement("td");
      cell.textContent = "0%"; // Placeholder for probabilities
      row.appendChild(cell);
    });

    table.appendChild(row);
  });
};

export const updateProbabilityTable = () => {
  const probabilities = calculatePreDealProbabilities();
  const table = document.getElementById("probabilityTable");

  players.forEach((player, index) => {
    const row = table.rows[index + 1]; // +1 to skip header row

    row.cells[1].textContent = `${probabilities.royalFlushProb.toFixed(6)}%`;
    row.cells[2].textContent = `${probabilities.straightFlushProb.toFixed(6)}%`;
    row.cells[3].textContent = `${probabilities.fourOfAKindProb.toFixed(6)}%`;
  });
};

// Calculate probabilities before any cards are dealt
const calculatePreDealProbabilities = () => {
  const totalHands = 2598960;

  const royalFlushProb = (4 / totalHands) * 100;
  const straightFlushProb = (36 / totalHands) * 100;
  const fourOfAKindProb = (624 / totalHands) * 100;

  return {
    royalFlushProb,
    straightFlushProb,
    fourOfAKindProb,
  };
};

// Calculate probabilities after the initial hands are dealt
export const calculatePostDealProbabilities = (deck, player) => {
  const totalHands = calculateRemainingCombinations(deck, player.hand, 5);
  const royalFlushCount = countRoyalFlushes(deck, player.hand);
  const straightFlushCount = countStraightFlushes(deck, player.hand);
  const fourOfAKindCount = countFourOfAKinds(deck, player.hand);

  return {
    royalFlushProb: (royalFlushCount / totalHands) * 100,
    straightFlushProb: (straightFlushCount / totalHands) * 100,
    fourOfAKindProb: (fourOfAKindCount / totalHands) * 100,
  };
};

// Helper function to calculate the total number of remaining combinations
const calculateRemainingCombinations = (deck, hand, cardsToDraw) => {
  const remainingCards = deck.cards.length;
  return combination(remainingCards, cardsToDraw);
};

// Combination formula: C(n, k) = n! / (k! * (n - k)!)
const combination = (n, k) => {
  if (k > n) return 0;
  if (k === 0 || k === n) return 1;
  let c = 1;
  for (let i = 0; i < k; i++) {
    c = (c * (n - i)) / (i + 1);
  }
  return c;
};

// Functions to count specific hands (placeholders, need to be implemented)
const countRoyalFlushes = (deck, hand) => {
  const requiredValues = ["10", "11", "12", "13", "14"];
  const suits = ["spade", "heart", "diamond", "club"];

  let count = 0;

  // Create a copy of the remaining cards in the deck
  const remainingDeck = [...deck.cards];

  // Check each suit
  suits.forEach((suit) => {
    const suitCards = hand
      .filter((card) => card.suit === suit)
      .map((card) => card.value);
    const requiredCards = requiredValues.filter(
      (value) => !suitCards.includes(value)
    );

    if (requiredCards.length <= 5 - hand.length) {
      const matchingCards = remainingDeck.filter(
        (card) => card.suit === suit && requiredCards.includes(card.value)
      );
      if (matchingCards.length === requiredCards.length) {
        count++;
      }
    }
  });

  return count;
};

const countStraightFlushes = (deck, hand) => {
  // Implement the logic to count straight flushes with the given hand and remaining deck
  return 0; // Placeholder
};

const countFourOfAKinds = (deck, hand) => {
  // Implement the logic to count four of a kinds with the given hand and remaining deck
  return 0; // Placeholder
};
