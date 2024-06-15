import {
  isRoyalFlush,
  isStraightFlush,
  isFourOfAKind,
  isFullHouse,
  isFlush,
  isStraight,
  isThreeOfAKind,
  isTwoPair,
  isOnePair,
} from "./hands.js";
import { generateCombinations } from "./helpers.js";

export const calculatePostDealProbs = (playerHand, communityCards, deck) => {
  const currentHand = [...playerHand, ...communityCards];

  const remainingDeck = deck.cards.filter(
    (card) =>
      !currentHand.some(
        (knownCard) =>
          knownCard.value === card.value && knownCard.suit === card.suit
      )
  );

  // Generate all possible 7-card hands
  const cardsToDraw = 7 - currentHand.length;
  const possibleHands = generateCombinations(remainingDeck, cardsToDraw).map(
    (combo) => [...currentHand, ...combo]
  );

  const possibleRoyalFlushes = [];
  const possibleStraightFlushes = [];
  const possibleFourOfAKinds = [];
  const possibleFullHouses = [];
  const possibleFlushes = [];
  const possibleStraights = [];
  const possibleThreeOfAKinds = [];
  const possibleTwoPairs = [];
  const possibleOnePairs = [];
  const possibleHighCards = [];

  possibleHands.forEach((hand) => {
    if (isRoyalFlush(hand)) {
      possibleRoyalFlushes.push(hand);
    } else if (isStraightFlush(hand)) {
      possibleStraightFlushes.push(hand);
    } else if (isFourOfAKind(hand)) {
      possibleFourOfAKinds.push(hand);
    } else if (isFullHouse(hand)) {
      possibleFullHouses.push(hand);
    } else if (isFlush(hand)) {
      possibleFlushes.push(hand);
    } else if (isStraight(hand)) {
      possibleStraights.push(hand);
    } else if (isThreeOfAKind(hand)) {
      possibleThreeOfAKinds.push(hand);
    } else if (isTwoPair(hand)) {
      possibleTwoPairs.push(hand);
    } else if (isOnePair(hand)) {
      possibleOnePairs.push(hand);
    } else {
      possibleHighCards.push(hand);
    }
  });

  // console.log("possibleRoyalFlushes", possibleRoyalFlushes);
  // console.log("possibleStraightFlushes", possibleStraightFlushes);
  console.log("possibleFourOfAKinds", possibleFourOfAKinds);
  // console.log("possibleFullHouses", possibleFullHouses);
  // console.log("possibleFlushes", possibleFlushes);
  // console.log("possibleStraights", possibleStraights);
  // console.log("possibleThreeOfAKinds", possibleThreeOfAKinds);
  // console.log("possibleTwoPairs", possibleTwoPairs);
  // console.log("possibleOnePairs", possibleOnePairs);

  const totalHands = possibleHands.length;
  const royalFlushProb = (possibleRoyalFlushes.length / totalHands) * 100;
  const straightFlushProb = (possibleStraightFlushes.length / totalHands) * 100;
  const fourOfAKindProb = (possibleFourOfAKinds.length / totalHands) * 100;
  const fullHouseProb = (possibleFullHouses.length / totalHands) * 100;
  const flushProb = (possibleFlushes.length / totalHands) * 100;
  const straightProb = (possibleStraights.length / totalHands) * 100;
  const threeOfAKindProb = (possibleThreeOfAKinds.length / totalHands) * 100;
  const twoPairProb = (possibleTwoPairs.length / totalHands) * 100;
  const onePairProb = (possibleOnePairs.length / totalHands) * 100;
  const highCardProb = (possibleHighCards.length / totalHands) * 100;

  console.log(
    royalFlushProb +
      straightFlushProb +
      fourOfAKindProb +
      fullHouseProb +
      flushProb +
      straightFlushProb +
      threeOfAKindProb +
      twoPairProb +
      onePairProb +
      highCardProb
  );

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
