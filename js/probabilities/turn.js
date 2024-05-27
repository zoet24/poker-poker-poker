import { combinatorial, generateCombinations } from "./helpers.js";
import { containsRoyalFlush, containsStraightFlush } from "./hands.js";

export const calculateTurnProbs = (playerHand, communityCards, deck) => {
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

  const totalHands = remainingDeck.length; // 1 card left to draw (the river)
  const possibleRiverHands = generateCombinations(remainingDeck, 1);

  let possibleRoyalFlushes = 0;
  let possibleStraightFlushes = 0;

  for (const riverCard of possibleRiverHands) {
    const combinedHand = [...playerHand, ...communityCards, ...riverCard];
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
  console.log("Total 1-card hands from remaining deck:", totalHands);
  console.log("Number of Royal Flush combinations:", possibleRoyalFlushes);
  console.log(
    "Number of Straight Flush combinations:",
    possibleStraightFlushes
  );
  console.log("Probability of Royal Flush after turn:", royalFlushProb);
  console.log("Probability of Straight Flush after turn:", straightFlushProb);

  return {
    royalFlushProb,
    straightFlushProb,
  };
};
