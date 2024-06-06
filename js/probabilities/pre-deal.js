import { combinatorial } from "./helpers.js";

// https://en.wikipedia.org/wiki/Poker_probability
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

  // Full House
  const fullHouseA =
    combinatorial(13, 2) *
    combinatorial(4, 3) *
    combinatorial(4, 3) *
    combinatorial(44, 1);
  const fullHouseB =
    combinatorial(13, 1) *
    combinatorial(12, 2) *
    combinatorial(4, 3) *
    combinatorial(4, 2) *
    combinatorial(4, 2);
  const fullHouseC =
    combinatorial(13, 1) *
    combinatorial(12, 1) *
    combinatorial(11, 2) *
    combinatorial(4, 3) *
    combinatorial(4, 2) *
    combinatorial(4, 1) *
    combinatorial(4, 1);

  const fullHouseCombos = fullHouseA + fullHouseB + fullHouseC;
  const fullHouseProb = (fullHouseCombos / totalHands) * 100;

  // Flush (excluding royal flush and straight flush)
  const flushA = combinatorial(4, 1) * (combinatorial(13, 7) - 217);
  const flushB = combinatorial(4, 1) * ((combinatorial(13, 6) - 71) * 39);
  const flushC =
    combinatorial(4, 1) * ((combinatorial(13, 5) - 10) * combinatorial(39, 2));

  const flushCombos = flushA + flushB + flushC;
  const flushProb = (flushCombos / totalHands) * 100;

  // Straight (excluding royal flush and straight flush)
  const straightA = 217 * (4 ** 7 - 756 - 4 - 84);
  const straightB = 71 * 36 * 990;
  const straightC = 10 * 5 * 4 * (256 - 3) + 10 * combinatorial(5, 2) * 2268;

  const straightCombos = straightA + straightB + straightC;
  const straightProb = (straightCombos / totalHands) * 100;

  // Three of a kind
  const threeOfAKindCombos =
    (combinatorial(13, 5) - 10) *
    combinatorial(5, 1) *
    combinatorial(4, 1) *
    (combinatorial(4, 1) ** 4 - 3);
  const threeOfAKindProb = (threeOfAKindCombos / totalHands) * 100;

  // Two pair
  const twoPairA = 1277 * 10 * (6 * 62 + 24 * 63 + 6 * 64);
  const twoPairB =
    combinatorial(13, 3) * combinatorial(4, 2) ** 3 * combinatorial(40, 1);

  const twoPairCombos = twoPairA + twoPairB;
  const twoPairProb = (twoPairCombos / totalHands) * 100;

  // One pair
  const onePairCombos = (combinatorial(13, 6) - 71) * 6 * 6 * 990;
  const onePairProb = (onePairCombos / totalHands) * 100;

  // High card
  const highCardCombos = 1499 * (4 ** 7 - 756 - 4 - 84);
  const highCardProb = (highCardCombos / totalHands) * 100;

  return {
    royalFlushProb,
    straightFlushProb,
    fourOfAKindProb,
    fullHouseProb,
    flushProb,
    straightProb,
    threeOfAKindProb,
    twoPairProb,
    onePairProb,
    highCardProb,
  };
};
