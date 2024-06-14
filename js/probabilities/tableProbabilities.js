import { players } from "../players.js";
import { Card, Deck } from "../cards.js";
import { calculatePreDealProbs } from "./pre-deal.js";
import { calculatePostDealProbs } from "./post-deal.js";
import { calculateFlopProbs } from "./flop.js";
import { calculateTurnProbs } from "./turn.js";

export const createProbabilityTable = (tableId) => {
  const table = document.getElementById(tableId);

  // Create table header
  const headerRow = document.createElement("tr");
  const headers = [
    "Player",
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
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    // th.classList.add("rotated-header");
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
    [
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
    ].forEach(() => {
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
    row.cells[1].textContent = `${probabilities.royalFlushProb.toFixed(3)}%`;
    row.cells[2].textContent = `${probabilities.straightFlushProb.toFixed(3)}%`;
    row.cells[3].textContent = `${probabilities.fourOfAKindProb.toFixed(3)}%`;
    row.cells[4].textContent = `${probabilities.fullHouseProb.toFixed(3)}%`;
    row.cells[5].textContent = `${probabilities.flushProb.toFixed(3)}%`;
    row.cells[6].textContent = `${probabilities.straightProb.toFixed(3)}%`;
    row.cells[7].textContent = `${probabilities.threeOfAKindProb.toFixed(3)}%`;
    row.cells[8].textContent = `${probabilities.twoPairProb.toFixed(3)}%`;
    row.cells[9].textContent = `${probabilities.onePairProb.toFixed(3)}%`;
    row.cells[10].textContent = `${probabilities.highCardProb.toFixed(3)}%`;
  });
};

const calculateProbabilities = (stage, playerHand, communityCards) => {
  const deck = new Deck();

  if (stage === "pre-deal") {
    return calculatePreDealProbs();
  } else if (stage === "deal") {
    return calculatePostDealProbs(playerHand, communityCards, deck);
  } else if (stage === "flop") {
    return calculateFlopProbs(playerHand, communityCards, deck);
  } else if (stage === "turn") {
    return calculateTurnProbs(playerHand, communityCards, deck);
  } else {
    return {
      royalFlushProb: 0,
      straightFlushProb: 0,
      fourOfAKindProb: 0,
      fullHouseProb: 0,
      flushProb: 0,
      straightProb: 0,
      threeOfAKindProb: 0,
      twoPairProb: 0,
      onePairProb: 0,
      highCardProb: 0,
    };
  }
};
