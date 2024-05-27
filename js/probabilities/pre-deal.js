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

  console.log("Total 7-card hands:", totalHands);
  console.log("Number of Royal Flush combinations:", royalFlushes);
  console.log("Probability of Royal Flush pre-deal:", royalFlushProb);

  return {
    royalFlushProb,
    straightFlushProb,
  };
};
