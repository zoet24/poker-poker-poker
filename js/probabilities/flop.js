import { containsRoyalFlush, containsStraightFlush } from "./hands.js";
import {
  combinatorial,
  generateCombinations,
  isSequential,
} from "./helpers.js";

export const calculateFlopProbs = (playerHand, communityCards, deck) => {
  const remainingDeck = deck.cards.filter(
    (card) =>
      !playerHand.some(
        (playerCard) =>
          playerCard.value === card.value && playerCard.suit === playerCard.suit
      ) &&
      !communityCards.some(
        (communityCard) =>
          communityCard.value === card.value &&
          communityCard.suit === communityCard.suit
      )
  );

  const totalHands = combinatorial(remainingDeck.length, 2); // 2 cards left to draw
  const possibleTurnRiverHands = generateCombinations(remainingDeck, 2);

  let possibleRoyalFlushes = 0;
  let possibleStraightFlushes = 0;

  for (const turnRiverCards of possibleTurnRiverHands) {
    const combinedHand = [...playerHand, ...communityCards, ...turnRiverCards];
    if (containsRoyalFlush(combinedHand)) {
      possibleRoyalFlushes++;
    }
    if (containsStraightFlush(combinedHand)) {
      possibleStraightFlushes++;
    }
  }

  const royalFlushProb = (possibleRoyalFlushes / totalHands) * 100;
  const straightFlushProb = (possibleStraightFlushes / totalHands) * 100;

  console.log("Player hand:", playerHand);
  console.log("Community cards:", communityCards);
  console.log("Total 2-card hands from remaining deck:", totalHands);
  console.log("Number of Royal Flush combinations:", possibleRoyalFlushes);
  console.log(
    "Number of Straight Flush combinations:",
    possibleStraightFlushes
  );
  console.log("Probability of Royal Flush after flop:", royalFlushProb);
  console.log("Probability of Straight Flush after flop:", straightFlushProb);

  return {
    royalFlushProb,
    straightFlushProb,
  };
};
