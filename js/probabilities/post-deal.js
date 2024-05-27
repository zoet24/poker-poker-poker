import {
  generateRoyalFlushCombos,
  generateStraightFlushCombos,
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

  // Define all possible Royal Flush and Straight Flush 7-card combinations
  const allPossibleRoyalFlushCombos = generateRoyalFlushCombos();
  const allPossibleStraightFlushCombos = generateStraightFlushCombos();

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

  const possibleRoyalFlushes = validRoyalFlushCombos.length;
  const possibleStraightFlushes = validStraightFlushCombos.length;
  const totalHands = combinatorial(remainingDeck.length, 5);

  const royalFlushProb = (possibleRoyalFlushes / totalHands) * 100;
  const straightFlushProb = (possibleStraightFlushes / totalHands) * 100;

  console.log("Player hand:", playerHand);
  console.log("Total 5-card hands from remaining deck:", totalHands);
  console.log("Number of Royal Flush combinations:", possibleRoyalFlushes);
  console.log(
    "Number of Straight Flush combinations:",
    possibleStraightFlushes
  );
  console.log("Probability of Royal Flush post-deal:", royalFlushProb);
  console.log("Probability of Straight Flush post-deal:", straightFlushProb);

  return {
    royalFlushProb,
    straightFlushProb,
  };
};
