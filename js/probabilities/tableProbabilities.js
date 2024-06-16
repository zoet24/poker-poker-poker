import { players } from "../players.js";
import { Deck } from "../cards.js";
import { calculatePreDealProbs } from "./pre-deal.js";
import { calculatePostDealProbs } from "./post-deal.js";
import { toCamelCase, abbreviateHandNames } from "./helpers.js";

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
  const abbreviatedHandNames = abbreviateHandNames(handNames);
  const headers = ["Rank", "Best Hand", "Player", ...abbreviatedHandNames];
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Create a row for each player
  players.forEach((player) => {
    const row = document.createElement("tr");

    const rankCell = document.createElement("td");
    rankCell.textContent = "-";
    row.appendChild(rankCell);

    const bestHandCell = document.createElement("td");
    bestHandCell.textContent = "-";
    row.appendChild(bestHandCell);

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

export const updateProbabilityTable = async (stage, communityCards) => {
  const table = document.getElementById("probabilityTable");
  const spinnerElement = document.getElementById("spinner");
  const gameControls = document.getElementById("game-controls");

  spinnerElement.classList.add("spinner--loading");
  gameControls.classList.add("game-controls--loading");

  const minDisplayTime = 1000; // 1 second minimum display time
  const startTime = Date.now();

  const promises = players.map(async (player, index) => {
    const probabilities = await calculateProbabilities(
      stage,
      player.hand,
      communityCards
    );
    const row = table.rows[index + 1]; // +1 to skip header row

    handNames.forEach((handName, handIndex) => {
      const probKey = toCamelCase(handName) + "Prob";
      const cell = row.cells[handIndex + 3];
      cell.textContent = `${probabilities[probKey].toFixed(3)}%`;

      // Add the animation class
      cell.classList.add("updated-cell");

      // Remove the animation class after the animation completes
      setTimeout(() => {
        cell.classList.remove("updated-cell");
      }, 2000); // 2000ms matches the duration of the animation
    });
  });

  await Promise.all(promises);

  const elapsedTime = Date.now() - startTime;
  const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

  setTimeout(() => {
    spinnerElement.classList.remove("spinner--loading");
    gameControls.classList.remove("game-controls--loading");
  }, remainingTime);
};

const calculateProbabilities = async (stage, playerHand, communityCards) => {
  const deck = new Deck();

  let probabilities;
  if (stage === "pre-deal") {
    probabilities = calculatePreDealProbs();
  } else {
    probabilities = await calculatePostDealProbs(
      playerHand,
      communityCards,
      deck
    );
  }

  return probabilities;
};
