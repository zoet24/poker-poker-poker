import { players } from "./players.js";

export const createProbabilityTable = (tableId) => {
  const table = document.getElementById(tableId);

  // Create table header
  const headerRow = document.createElement("tr");
  const headers = ["Player", "Royal Flush"];
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
    ["Royal Flush"].forEach(() => {
      const cell = document.createElement("td");
      cell.textContent = "0%"; // Placeholder for probabilities
      row.appendChild(cell);
    });

    table.appendChild(row);
  });
};

// Calculate probabilities before any cards are dealt
export const updateProbabilityTable = (stage, communityCards, deckSize) => {
  const probabilities = calculateProbabilities(stage, communityCards, deckSize);
  const table = document.getElementById("probabilityTable");

  players.forEach((player, index) => {
    const row = table.rows[index + 1]; // +1 to skip header row
    row.cells[1].textContent = `${probabilities[
      player.name
    ].royalFlushProb.toFixed(6)}%`;
  });
};

// Calculate probabilities based on the game stage and current community cards
const calculateProbabilities = (stage, communityCards, deckSize) => {
  const probabilities = {};

  console.log(stage, communityCards, deckSize);

  players.forEach((player) => {
    const playerProbabilities = {
      royalFlushProb: calculateRoyalFlushProb(stage, deckSize),
    };

    probabilities[player.name] = playerProbabilities;
  });

  return probabilities;
};

// Helper function to calculate factorial
const factorial = (() => {
  const cache = {};
  return (n) => {
    if (n === 0) return 1;
    if (cache[n]) return cache[n];
    cache[n] = n * factorial(n - 1);
    return cache[n];
  };
})();

// Helper function to calculate combinatorial nCr (n choose r)
const combinatorial = (n, r) => {
  if (r > n) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
};

// Calculate the probability of a Royal Flush pre-deal
const calculateRoyalFlushProb = (stage, deckSize) => {
  if (stage !== "pre-deal") return 0;

  const numberOfRoyalFlushes = 4; // One for each suit
  const totalHands = combinatorial(deckSize, 5);

  const probability = (numberOfRoyalFlushes / totalHands) * 100;
  console.log("Pre-deal Probability of Royal Flush:", probability);

  return probability;
};
