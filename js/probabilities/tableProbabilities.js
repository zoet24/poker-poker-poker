import { players } from "../players.js";
import { Card, Deck } from "../cards.js";
import { calculatePreDealProbs } from "./pre-deal.js";
import { calculatePostDealProbs } from "./post-deal.js";
// import { calculateFlopProbs } from "./flop.js";
// import { calculateTurnProbs } from "./turn.js";
import { toCamelCase } from "./helpers.js";

const handNames = [
  "Royal Flush",
  "Straight Flush",
  "Four Of A Kind",
  "Full House",
  "Flush",
  "Straight",
  "Three Of A Kind",
  "Two Pair",
  "One Pair",
  "High Card",
];

export const createProbabilityTable = (tableId) => {
  const table = document.getElementById(tableId);

  // Create table header
  const headerRow = document.createElement("tr");
  const headers = ["Player", ...handNames];
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
    handNames.forEach(() => {
      const cell = document.createElement("td");
      cell.textContent = "0%"; // Placeholder for probabilities
      row.appendChild(cell);
    });

    table.appendChild(row);
  });
};

export const updateProbabilityTable = (stage, communityCards) => {
  const table = document.getElementById("probabilityTable");

  players.forEach((player, index) => {
    const probabilities = calculateProbabilities(
      stage,
      player.hand,
      communityCards
    );
    const row = table.rows[index + 1]; // +1 to skip header row

    handNames.forEach((handName, handIndex) => {
      const probKey = toCamelCase(handName) + "Prob";
      row.cells[handIndex + 1].textContent = `${probabilities[probKey].toFixed(
        3
      )}%`;
    });
  });
};

const calculateProbabilities = (stage, playerHand, communityCards) => {
  const deck = new Deck();

  if (stage === "pre-deal") {
    return calculatePreDealProbs();
  } else {
    return calculatePostDealProbs(playerHand, communityCards, deck);
  }
};
