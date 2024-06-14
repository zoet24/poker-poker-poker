import {
  generateRoyalFlushCombos,
  generateStraightFlushCombos,
  generateFourOfAKindCombos,
} from "./hands.js";
import { combinatorial } from "./helpers.js";

export const calculatePostDealProbs = (playerHand, deck) => {
  const remainingDeck = deck.cards.filter(
    (card) =>
      !playerHand.some(
        (playerCard) =>
          playerCard.value === card.value && playerCard.suit === card.suit
      )
  );

  // Define all possible Royal Flush, Straight Flush, and Four of a Kind 7-card combinations
  const allPossibleRoyalFlushCombos = generateRoyalFlushCombos();
  const allPossibleStraightFlushCombos = generateStraightFlushCombos();
  const allPossibleFourOfAKindCombos = generateFourOfAKindCombos();

  // Filter combinations based on the player's hand
  const validRoyalFlushCombos = allPossibleRoyalFlushCombos.filter((combo) => {
    return playerHand.every((card) =>
      combo.some((c) => c.value === card.value && c.suit === card.suit)
    );
  });

  const validStraightFlushCombos = allPossibleStraightFlushCombos.filter(
    (combo) => {
      return playerHand.every((card) =>
        combo.some((c) => c.value === card.value && c.suit === card.suit)
      );
    }
  );

  const validFourOfAKindCombos = allPossibleFourOfAKindCombos.filter(
    (combo) => {
      return playerHand.every((card) =>
        combo.some((c) => c.value === card.value && c.suit === card.suit)
      );
    }
  );

  // Four of a kind - player has a pair: successfulCombinations = combinatorial(2, 2) * combinatorial(48, 3); // 2 remaining 4s, 3 out of remaining 48 cards
  // Four of a kind - player doesn't have a pair: successfulCombinations = combinatorial(3, 3) * combinatorial(47, 2); // 3 remaining 4s, 2 out of remaining 47 cards

  const possibleRoyalFlushes = validRoyalFlushCombos.length;
  const possibleStraightFlushes = validStraightFlushCombos.length;
  const possibleFourOfAKinds = validFourOfAKindCombos.length;
  const totalHands = combinatorial(remainingDeck.length, 5);

  const royalFlushProb = (possibleRoyalFlushes / totalHands) * 100;
  const straightFlushProb = (possibleStraightFlushes / totalHands) * 100;
  const fourOfAKindProb = (possibleFourOfAKinds / totalHands) * 100;

  console.log("Player hand:", playerHand);
  console.log("Total 5-card hands from remaining deck:", totalHands);
  console.log("Number of Royal Flush combinations:", possibleRoyalFlushes);
  console.log(
    "Number of Straight Flush combinations:",
    possibleStraightFlushes
  );
  console.log("Number of Four of a Kind combinations:", possibleFourOfAKinds);
  console.log("Probability of Royal Flush post-deal:", royalFlushProb);
  console.log("Probability of Straight Flush post-deal:", straightFlushProb);
  console.log("Probability of Four of a Kind post-deal:", fourOfAKindProb);

  return {
    royalFlushProb,
    straightFlushProb,
    fourOfAKindProb,
    fullHouseProb: 0,
    flushProb: 0,
    straightProb: 0,
    threeOfAKindProb: 0,
    twoPairProb: 0,
    onePairProb: 0,
    highCardProb: 0,
  };
};
