import { isSequential } from "./helpers.js";

export const isRoyalFlush = (cards) => {
  const suits = new Set(cards.map((card) => card.suit));
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

export const isStraightFlush = (cards) => {
  const suits = new Set(cards.map((card) => card.suit));

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

export const isFourOfAKind = (cards) => {
  const valueCount = {};

  // Count occurrences of each card value
  cards.forEach((card) => {
    if (!valueCount[card.value]) {
      valueCount[card.value] = 0;
    }
    valueCount[card.value]++;
  });

  // Check if any value appears 4 times
  const isFourOfAKind = Object.values(valueCount).some((count) => count === 4);
  return isFourOfAKind;
};

export const isFullHouse = (cards) => {
  const valueCount = {};

  // Count occurrences of each card value
  cards.forEach((card) => {
    if (!valueCount[card.value]) {
      valueCount[card.value] = 0;
    }
    valueCount[card.value]++;
  });

  const counts = Object.values(valueCount);

  // Check if there's a Three of a Kind
  const hasThreeOfAKind = counts.some((count) => count === 3);

  // Check if there are at least two different pairs (including the possibility of another Three of a Kind)
  const pairCount = counts.filter((count) => count >= 2).length;

  return hasThreeOfAKind && pairCount >= 2;
};

export const isFlush = (cards) => {
  const suitCount = {};

  // Count occurrences of each suit
  cards.forEach((card) => {
    if (!suitCount[card.suit]) {
      suitCount[card.suit] = 0;
    }
    suitCount[card.suit]++;
  });

  // Check if any suit appears at least 5 times
  return Object.values(suitCount).some((count) => count >= 5);
};

export const isStraight = (cards) => {
  const values = cards
    .map((card) => parseInt(card.value))
    .sort((a, b) => a - b);

  // Remove duplicates
  const uniqueValues = [...new Set(values)];

  // Check for the normal straight (e.g., 5-6-7-8-9)
  for (let i = 0; i < uniqueValues.length - 4; i++) {
    if (
      uniqueValues[i + 4] - uniqueValues[i + 3] === 1 &&
      uniqueValues[i + 3] - uniqueValues[i + 2] === 1 &&
      uniqueValues[i + 2] - uniqueValues[i + 1] === 1 &&
      uniqueValues[i + 1] - uniqueValues[i] === 1
    ) {
      return true;
    }
  }

  // Check for the wheel straight (A-2-3-4-5)
  const hasWheelStraight =
    uniqueValues.includes(14) &&
    uniqueValues.includes(2) &&
    uniqueValues.includes(3) &&
    uniqueValues.includes(4) &&
    uniqueValues.includes(5);

  return hasWheelStraight;
};

export const isThreeOfAKind = (cards) => {
  const valueCount = {};

  // Count occurrences of each card value
  cards.forEach((card) => {
    if (!valueCount[card.value]) {
      valueCount[card.value] = 0;
    }
    valueCount[card.value]++;
  });

  // Check if any value appears 3 times
  const isThreeOfAKind = Object.values(valueCount).some((count) => count === 3);
  return isThreeOfAKind;
};

export const isTwoPair = (cards) => {
  const valueCount = {};

  // Count occurrences of each card value
  cards.forEach((card) => {
    if (!valueCount[card.value]) {
      valueCount[card.value] = 0;
    }
    valueCount[card.value]++;
  });

  // Check if there are exactly two different values that each appear 2 times
  const pairs = Object.values(valueCount).filter((count) => count === 2);
  return pairs.length === 2;
};

export const isOnePair = (cards) => {
  const valueCount = {};

  // Count occurrences of each card value
  cards.forEach((card) => {
    if (!valueCount[card.value]) {
      valueCount[card.value] = 0;
    }
    valueCount[card.value]++;
  });

  // Check if any value appears exactly 2 times
  const isOnePair = Object.values(valueCount).some((count) => count === 2);
  return isOnePair;
};
