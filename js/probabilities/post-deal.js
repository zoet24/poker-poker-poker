import {
  generateRoyalFlushCombos,
  generateStraightFlushCombos,
  generateFourOfAKindCombos,
} from "./hands.js";
import { combinatorial } from "./helpers.js";

const calculateHandProbabilities = (hand, remainingDeck, generateCombos) => {
  const allPossibleCombos = generateCombos();
  const validCombos = allPossibleCombos.filter((combo) => {
    return hand.every((card) =>
      combo.some((c) => c.value === card.value && c.suit === card.suit)
    );
  });

  const possibleHands = validCombos.length;
  const cardsToDraw = 7 - hand.length;
  const totalHands = combinatorial(remainingDeck.length, cardsToDraw);

  return (possibleHands / totalHands) * 100;
};

export const calculatePostDealProbs = (playerHand, communityCards, deck) => {
  const currentHand = playerHand.concat(communityCards);

  const remainingDeck = deck.cards.filter(
    (card) =>
      !currentHand.some(
        (knownCard) =>
          knownCard.value === card.value && knownCard.suit === card.suit
      )
  );

  const royalFlushProb = calculateHandProbabilities(
    currentHand,
    remainingDeck,
    generateRoyalFlushCombos
  );

  const straightFlushProb = calculateHandProbabilities(
    currentHand,
    remainingDeck,
    generateStraightFlushCombos
  );

  const fourOfAKindProb = calculateHandProbabilities(
    currentHand,
    remainingDeck,
    generateFourOfAKindCombos
  );

  console.log("Player hand:", playerHand);
  console.log("Community cards:", communityCards);
  console.log(
    "Total hands from remaining deck:",
    combinatorial(remainingDeck.length, 7 - currentHand.length)
  );
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
