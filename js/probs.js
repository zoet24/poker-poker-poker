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
  const probabilities = calculateInitialProbabilities();
  const table = document.getElementById("probabilityTable");

  players.forEach((player, index) => {
    const row = table.rows[index + 1]; // +1 to skip header row

    row.cells[1].textContent = `${probabilities.royalFlushProb.toFixed(6)}%`;
    row.cells[2].textContent = `${probabilities.straightFlushProb.toFixed(6)}%`;
    row.cells[3].textContent = `${probabilities.fourOfAKindProb.toFixed(6)}%`;
  });
};

// Calculate probabilities before any cards are dealt
const calculateInitialProbabilities = () => {
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
