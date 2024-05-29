import { Card, Deck } from "../cards.js";
import { generateCombinations, isSequential } from "./helpers.js";

export const containsRoyalFlush = (cards) => {
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

export const generateRoyalFlushCombos = () => {
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

export const containsStraightFlush = (cards) => {
  const suits = ["heart", "diamond", "club", "spade"];

  for (const suit of suits) {
    const suitCards = cards.filter((card) => card.suit === suit);
    const suitCardValues = suitCards
      .map((card) => parseInt(card.value))
      .sort((a, b) => a - b);

    if (suitCardValues.length >= 5) {
      for (let i = 0; i <= suitCardValues.length - 5; i++) {
        const straightFlushSequence = suitCardValues.slice(i, i + 5);
        if (isSequential(straightFlushSequence)) {
          return true;
        }
      }
    }

    // Special case for Ace-low straight (A-2-3-4-5)
    if (
      suitCardValues.includes(14) &&
      suitCardValues.includes(2) &&
      suitCardValues.includes(3) &&
      suitCardValues.includes(4) &&
      suitCardValues.includes(5)
    ) {
      return true;
    }
  }

  return false;
};

export const generateStraightFlushCombos = () => {
  const suits = ["heart", "diamond", "club", "spade"];
  const combos = [];
  const straightFlushRanks = [
    ["10", "11", "12", "13", "14"],
    ["9", "10", "11", "12", "13"],
    ["8", "9", "10", "11", "12"],
    ["7", "8", "9", "10", "11"],
    ["6", "7", "8", "9", "10"],
    ["5", "6", "7", "8", "9"],
    ["4", "5", "6", "7", "8"],
    ["3", "4", "5", "6", "7"],
    ["2", "3", "4", "5", "6"],
    ["14", "2", "3", "4", "5"], // Ace-low straight
  ];

  for (const suit of suits) {
    for (const ranks of straightFlushRanks) {
      const straightFlushCards = ranks.map((rank) => new Card(rank, suit));
      const remainingCards = generateCombinations(
        new Deck().cards.filter(
          (card) =>
            !straightFlushCards.some(
              (sfCard) =>
                sfCard.value === card.value && sfCard.suit === card.suit
            )
        ),
        2
      );

      for (const combo of remainingCards) {
        combos.push([...straightFlushCards, ...combo]);
      }
    }
  }

  return combos;
};

export const containsFourOfAKind = (cards) => {
  const valueCount = {};

  // Count occurrences of each card value
  cards.forEach((card) => {
    if (!valueCount[card.value]) {
      valueCount[card.value] = 0;
    }
    valueCount[card.value]++;
  });

  // console.log("Value counts:", valueCount); // Debugging log

  // Check if any value appears 4 times
  const hasFourOfAKind = Object.values(valueCount).some((count) => count === 4);
  // console.log("Contains Four of a Kind:", hasFourOfAKind); // Debugging log
  return hasFourOfAKind;
};

// Generate all possible Four of a Kind combinations
export const generateFourOfAKindCombos = () => {
  const combos = [];
  const suits = ["heart", "diamond", "club", "spade"];
  const ranks = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
  ];

  for (const rank of ranks) {
    const fourOfAKindCards = suits.map((suit) => new Card(rank, suit));
    const remainingCards = generateCombinations(
      new Deck().cards.filter(
        (card) =>
          !fourOfAKindCards.some(
            (fourOfAKindCard) =>
              fourOfAKindCard.value === card.value &&
              fourOfAKindCard.suit === card.suit
          )
      ),
      3
    );

    for (const combo of remainingCards) {
      combos.push([...fourOfAKindCards, ...combo]);
    }
  }

  // console.log("Generated Four of a Kind Combos:", combos.length); // Debugging log
  return combos;
};
