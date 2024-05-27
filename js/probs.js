import { players } from "./players.js";
import { Card, Deck } from "./cards.js";

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

export const updateProbabilityTable = (stage, communityCards) => {
  const table = document.getElementById("probabilityTable");

  players.forEach((player, index) => {
    const probabilities = calculateProbabilities(
      stage,
      player.hand,
      communityCards
    );
    const row = table.rows[index + 1]; // +1 to skip header row
    row.cells[1].textContent = `${probabilities.royalFlushProb.toFixed(6)}%`;
  });
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

// Function to generate all combinations of a specific length from an array
const generateCombinations = (array, length) => {
  const result = [];
  const combine = (start, prefix) => {
    if (prefix.length === length) {
      result.push(prefix);
      return;
    }
    for (let i = start; i < array.length; i++) {
      combine(i + 1, prefix.concat(array[i]));
    }
  };
  combine(0, []);
  return result;
};

// Function to check if a set of 7 cards contains a Royal Flush
const containsRoyalFlush = (cards) => {
  const suits = ["heart", "diamond", "club", "spade"];
  const royalFlushRanks = ["10", "11", "12", "13", "14"];

  for (const suit of suits) {
    const suitCards = cards.filter((card) => card.suit === suit);
    const suitCardValues = suitCards.map((card) => card.value);

    if (royalFlushRanks.every((rank) => suitCardValues.includes(rank))) {
      return true;
    }
  }
  return false;
};

const calculateProbabilities = (stage, playerHand, communityCards) => {
  const deck = new Deck();

  if (stage === "pre-deal") {
    return calculatePredealProbs();
  } else if (stage === "deal") {
    return calculatePostDealProbs(playerHand, deck);
  } else if (stage === "flop") {
    return calculateFlopProbs(playerHand, communityCards, deck);
  } else if (stage === "turn") {
    return calculateTurnProbs(playerHand, communityCards, deck);
  } else {
    return {
      royalFlushProb: 0,
    };
  }
};

const calculatePredealProbs = () => {
  const remainingDeckSize = 52;

  // Total number of possible 7-card hands from a deck of 52 cards
  const totalHands = combinatorial(52, 7);

  // Number of ways to get a Royal Flush
  // There are 4 suits, and each suit has exactly one Royal Flush combination (10, J, Q, K, A of the same suit)
  const royalFlushesPerSuit = combinatorial(47, 2); // The remaining two cards can be any of the 47 other cards
  const royalFlushes = 4 * royalFlushesPerSuit; // 4 suits

  // Probability of getting a Royal Flush
  const royalFlushProb = (royalFlushes / totalHands) * 100;

  console.log("Total 7-card hands:", totalHands);
  console.log("Number of Royal Flush combinations:", royalFlushes);
  console.log("Probability of Royal Flush pre-deal:", royalFlushProb);

  return {
    royalFlushProb,
  };
};

// Function to calculate the probability of getting a Royal Flush post-deal
const calculatePostDealProbs = (playerHand, deck) => {
  const remainingDeck = deck.cards.filter(
    (card) =>
      !playerHand.some(
        (playerCard) =>
          playerCard.value === card.value && playerCard.suit === card.suit
      )
  );

  // Define all possible Royal Flush 7-card combinations
  const allPossibleRoyalFlushCombos = generateRoyalFlushCombos();

  // Filter combinations based on the player's hand
  const validRoyalFlushCombos = allPossibleRoyalFlushCombos.filter((combo) => {
    return playerHand.every((card) =>
      combo.some((c) => c.value === card.value && c.suit === card.suit)
    );
  });

  const possibleRoyalFlushes = validRoyalFlushCombos.length;
  const totalHands = combinatorial(remainingDeck.length, 5);

  const royalFlushProb = (possibleRoyalFlushes / totalHands) * 100;

  console.log("Player hand:", playerHand);
  console.log("Total 5-card hands from remaining deck:", totalHands);
  console.log("Number of Royal Flush combinations:", possibleRoyalFlushes);
  console.log("Probability of Royal Flush post-deal:", royalFlushProb);

  return {
    royalFlushProb,
  };
};

// Function to generate all possible Royal Flush 7-card combinations
const generateRoyalFlushCombos = () => {
  const suits = ["heart", "diamond", "club", "spade"];
  const royalFlushRanks = ["10", "11", "12", "13", "14"];
  const combos = [];

  for (const suit of suits) {
    // Generate 7-card combinations that include the Royal Flush
    const royalFlushCards = royalFlushRanks.map((rank) => new Card(rank, suit));
    const remainingCards = generateCombinations(
      new Deck().cards.filter(
        (card) =>
          !royalFlushCards.some(
            (royalCard) =>
              royalCard.value === card.value && royalCard.suit === card.suit
          )
      ),
      2
    );

    for (const combo of remainingCards) {
      combos.push([...royalFlushCards, ...combo]);
    }
  }

  return combos;
};

// Function to calculate the probability of getting a Royal Flush after the flop
const calculateFlopProbs = (playerHand, communityCards, deck) => {
  const remainingDeck = deck.cards.filter(
    (card) =>
      !playerHand.some(
        (playerCard) =>
          playerCard.value === card.value && playerCard.suit === card.suit
      ) &&
      !communityCards.some(
        (communityCard) =>
          communityCard.value === card.value && communityCard.suit === card.suit
      )
  );

  const totalHands = combinatorial(remainingDeck.length, 2); // 2 cards left to draw
  const possibleTurnRiverHands = generateCombinations(remainingDeck, 2);

  let possibleRoyalFlushes = 0;

  for (const turnRiverCards of possibleTurnRiverHands) {
    const combinedHand = [...playerHand, ...communityCards, ...turnRiverCards];
    if (containsRoyalFlush(combinedHand)) {
      possibleRoyalFlushes++;
    }
  }

  const royalFlushProb = (possibleRoyalFlushes / totalHands) * 100;

  console.log("Player hand:", playerHand);
  console.log("Community cards:", communityCards);
  console.log("Total 2-card hands from remaining deck:", totalHands);
  console.log("Number of Royal Flush combinations:", possibleRoyalFlushes);
  console.log("Probability of Royal Flush after flop:", royalFlushProb);

  return {
    royalFlushProb,
  };
};

// Function to calculate the probability of getting a Royal Flush after the turn
const calculateTurnProbs = (playerHand, communityCards, deck) => {
  const remainingDeck = deck.cards.filter(
    (card) =>
      !playerHand.some(
        (playerCard) =>
          playerCard.value === card.value && playerCard.suit === card.suit
      ) &&
      !communityCards.some(
        (communityCard) =>
          communityCard.value === card.value && communityCard.suit === card.suit
      )
  );

  const totalHands = remainingDeck.length; // 1 card left to draw (the river)
  const possibleRiverHands = generateCombinations(remainingDeck, 1);

  let possibleRoyalFlushes = 0;

  for (const riverCard of possibleRiverHands) {
    const combinedHand = [...playerHand, ...communityCards, ...riverCard];
    if (containsRoyalFlush(combinedHand)) {
      possibleRoyalFlushes++;
    }
  }

  const royalFlushProb = (possibleRoyalFlushes / totalHands) * 100;

  console.log("Player hand:", playerHand);
  console.log("Community cards:", communityCards);
  console.log("Total 1-card hands from remaining deck:", totalHands);
  console.log("Number of Royal Flush combinations:", possibleRoyalFlushes);
  console.log("Probability of Royal Flush after turn:", royalFlushProb);

  return {
    royalFlushProb,
  };
};
