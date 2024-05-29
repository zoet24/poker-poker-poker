import { combinatorial } from "./helpers.js";

export const calculatePreDealProbs = () => {
  // Total number of possible 7-card hands from a deck of 52 cards
  const totalHands = combinatorial(52, 7);

  // Royal Flush
  const royalFlushes = 4 * 1 * combinatorial(47, 2); // 4 suits, 1 combination, remaining 2 cards can be anything
  const royalFlushProb = (royalFlushes / totalHands) * 100;

  // Straight Flush
  const straightFlushes = 4 * 9 * combinatorial(47, 2); // 4 suits, 9 combinations, remaining 2 cards can be anything
  const straightFlushProb = (straightFlushes / totalHands) * 100;

  // Four of a Kind
  const fourOfAKindCombos = 13 * combinatorial(48, 3); // 13 ranks, 3 remaining cards can be any of the remaining 48 cards
  const fourOfAKindProb = (fourOfAKindCombos / totalHands) * 100;

  console.log("Number of Four of a Kind combinations:", fourOfAKindCombos);
  console.log("Probability of Four of a Kind pre-deal:", fourOfAKindProb);

  return {
    royalFlushProb,
    straightFlushProb,
    fourOfAKindProb,
  };
};
