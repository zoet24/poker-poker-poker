import { Card, Deck } from "../cards.js";
import { generateCombinations, isSequential } from "./helpers.js";

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
  return false;
};

export const isFlush = (cards) => {
  return false;
};

export const isStraight = (cards) => {
  return false;
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

// // Generate all possible Four of a Kind combinations
// export const generateFourOfAKindCombos = () => {
//   const combos = [];
//   const suits = ["heart", "diamond", "club", "spade"];
//   const ranks = [
//     "2",
//     "3",
//     "4",
//     "5",
//     "6",
//     "7",
//     "8",
//     "9",
//     "10",
//     "11",
//     "12",
//     "13",
//     "14",
//   ];

//   for (const rank of ranks) {
//     const fourOfAKindCards = suits.map((suit) => new Card(rank, suit));
//     const remainingCards = generateCombinations(
//       new Deck().cards.filter(
//         (card) =>
//           !fourOfAKindCards.some(
//             (fourOfAKindCard) =>
//               fourOfAKindCard.value === card.value &&
//               fourOfAKindCard.suit === card.suit
//           )
//       ),
//       3
//     );

//     for (const combo of remainingCards) {
//       combos.push([...fourOfAKindCards, ...combo]);
//     }
//   }

//   // console.log("Generated Four of a Kind Combos:", combos.length); // Debugging log
//   return combos;
// };

// export const generateFullHouseCombos = (currentHand, deck) => {
//   const remainingDeck = deck.cards.filter(
//     (card) =>
//       !currentHand.some(
//         (knownCard) =>
//           knownCard.value === card.value && knownCard.suit === card.suit
//       )
//   );

//   const cardsToDraw = 7 - currentHand.length;
//   const allPossibleHands = generateCombinations(remainingDeck, cardsToDraw).map(
//     (combo) => [...currentHand, ...combo]
//   );

//   const fullHouseCombos = allPossibleHands.filter(isValidFullHouse);
//   return fullHouseCombos;
// };

// const isValidFullHouse = (cards) => {
//   const valueCount = {};
//   cards.forEach((card) => {
//     valueCount[card.value] = (valueCount[card.value] || 0) + 1;
//   });

//   let threeOfAKindValues = [];
//   let pairValues = [];

//   for (const value in valueCount) {
//     if (valueCount[value] === 3) {
//       threeOfAKindValues.push(value);
//     } else if (valueCount[value] === 2) {
//       pairValues.push(value);
//     }
//   }

//   return threeOfAKindValues.length > 0 && pairValues.length > 0;
// };
