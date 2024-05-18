function evaluateRankByHighestCards(
  cards,
  excludeCardValue = -1,
  excludeCardValue2 = -1,
  limitCheck = 7,
  normalize = 433175
) {
  let sum = 0;
  let i = 0;
  const fixedSize = cards.length - 1;

  for (let j = fixedSize; j >= 0; j--) {
    const cardValue = parseInt(cards[j].value);

    if (cardValue === excludeCardValue || cardValue === excludeCardValue2)
      continue;

    const normalizedValue = cardValue - 2; // since CardValue is an integer between [2,14]
    sum += normalizedValue * Math.pow(13, fixedSize - i);

    if (i === limitCheck - 1) break;

    i++;
  }

  return sum / normalize;
}

const suits = ["spade", "heart", "diamond", "club"];

const isRoyalFlush = (cards) => {
  const royalValues = ["10", "11", "12", "13", "14"];
  const suits = new Set(cards.map((card) => card.suit));
  const values = cards
    .map((card) => card.value)
    .sort((a, b) => parseInt(a) - parseInt(b));

  return (
    royalValues.every((value) => values.includes(value)) && suits.size === 1 // All cards must be of the same suit
  );
};

const getStraightFlushRank = (cards) => {
  const suits = ["spade", "heart", "diamond", "club"];
  let bestStraightFlush = null;

  for (const suit of suits) {
    const suitCards = cards.filter((card) => card.suit === suit);
    if (suitCards.length >= 5) {
      suitCards.sort((a, b) => parseInt(a.value) - parseInt(b.value));

      let counter = 1;
      let straightFlushCards = [suitCards[0]];

      for (let i = 0; i < suitCards.length - 1; i++) {
        if (
          parseInt(suitCards[i].value) + 1 ===
          parseInt(suitCards[i + 1].value)
        ) {
          counter++;
          straightFlushCards.push(suitCards[i + 1]);
          if (counter >= 5) {
            const currentRank =
              800 + (parseInt(suitCards[i + 1].value) / 14) * 99;
            if (!bestStraightFlush || currentRank > bestStraightFlush.rank) {
              bestStraightFlush = {
                rankName: "Straight Flush",
                rank: currentRank,
                cards: straightFlushCards.slice(-5), // Take the last 5 cards
              };
            }
          }
        } else {
          counter = 1;
          straightFlushCards = [suitCards[i + 1]];
        }
      }

      // Special case for wheel straight flush (A-2-3-4-5)
      if (suitCards.length >= 5) {
        const values = suitCards.map((card) => parseInt(card.value));
        if (
          values.includes(14) &&
          values.includes(2) &&
          values.includes(3) &&
          values.includes(4) &&
          values.includes(5)
        ) {
          const lowStraight = suitCards.filter((card) =>
            ["14", "2", "3", "4", "5"].includes(card.value)
          );
          const currentRank = 800 + (5 / 14) * 99;
          if (!bestStraightFlush || currentRank > bestStraightFlush.rank) {
            bestStraightFlush = {
              rankName: "Straight Flush",
              rank: currentRank,
              cards: lowStraight,
            };
          }
        }
      }
    }
  }

  return bestStraightFlush;
};

const getFourOfAKindRank = (cards) => {
  const valueCount = {};
  cards.forEach((card) => {
    valueCount[card.value] = (valueCount[card.value] || 0) + 1;
  });

  let fourOfAKindValue = null;
  for (const value in valueCount) {
    if (valueCount[value] === 4) {
      fourOfAKindValue = value;
      break;
    }
  }

  if (fourOfAKindValue) {
    const fourOfAKindCards = cards.filter(
      (card) => card.value === fourOfAKindValue
    );

    const kickerCandidates = cards
      .filter((card) => card.value !== fourOfAKindValue)
      .sort((a, b) => parseInt(b.value) - parseInt(a.value)); // Sort in descending order

    const kicker = kickerCandidates[0]; // Take the highest value card
    const kickerValue = parseInt(kicker.value);
    const fourOfAKindRank = 700 + (parseInt(fourOfAKindValue) / 14) * 99;
    const finalRank = fourOfAKindRank + (kickerValue / 14) * (99 / 14);

    return {
      rankName: "Four of a Kind",
      rank: finalRank,
      cards: [...fourOfAKindCards, kicker],
    };
  }
  return null;
};

const getFullHouseRank = (cards) => {
  const valueCount = {};
  cards.forEach((card) => {
    valueCount[card.value] = (valueCount[card.value] || 0) + 1;
  });

  let threeOfAKindValues = [];
  let pairValues = [];

  for (const value in valueCount) {
    if (valueCount[value] === 3) {
      threeOfAKindValues.push(value);
    } else if (valueCount[value] === 2) {
      pairValues.push(value);
    }
  }

  threeOfAKindValues.sort((a, b) => parseInt(b) - parseInt(a)); // Sort descending
  pairValues.sort((a, b) => parseInt(b) - parseInt(a)); // Sort descending

  let bestFullHouse = null;

  if (threeOfAKindValues.length > 0 && pairValues.length > 0) {
    // Case: At least one Three of a Kind and one Pair
    const bestThreeOfAKindValue = threeOfAKindValues[0];
    const bestPairValue = pairValues[0];

    const threeOfAKindCards = cards.filter(
      (card) => card.value === bestThreeOfAKindValue
    );
    const pairCards = cards.filter((card) => card.value === bestPairValue);

    const threeOfAKindRank = 600 + (parseInt(bestThreeOfAKindValue) / 14) * 99;
    const finalRank =
      threeOfAKindRank + (parseInt(bestPairValue) / 14) * (99 / 14);

    bestFullHouse = {
      rankName: "Full House",
      rank: finalRank,
      cards: [...threeOfAKindCards, ...pairCards],
    };
  }

  if (threeOfAKindValues.length > 1) {
    // Case: Two Three of a Kind sets
    const bestThreeOfAKindValue = threeOfAKindValues[0];
    const secondThreeOfAKindValue = threeOfAKindValues[1];

    const threeOfAKindCards = cards.filter(
      (card) => card.value === bestThreeOfAKindValue
    );
    const pairCards = cards.filter(
      (card) => card.value === secondThreeOfAKindValue
    );

    const threeOfAKindRank = 600 + (parseInt(bestThreeOfAKindValue) / 14) * 99;
    const finalRank =
      threeOfAKindRank + (parseInt(secondThreeOfAKindValue) / 14) * (99 / 14);

    const fullHouse = {
      rankName: "Full House",
      rank: finalRank,
      cards: [...threeOfAKindCards, ...pairCards],
    };

    if (!bestFullHouse || fullHouse.rank > bestFullHouse.rank) {
      bestFullHouse = fullHouse;
    }
  }

  return bestFullHouse;
};

export function getPlayerHandRank(player, communityCards) {
  // Combine player's cards and cards on the table
  const allCards = [...player.hand, ...communityCards];
  console.log("Hand:", player, allCards);

  // Ensure there are exactly 7 cards
  if (allCards.length !== 7) return null;

  // Sort the cards by their values
  allCards.sort(
    (a, b) =>
      parseInt(a.value) - parseInt(b.value) || a.suit.localeCompare(b.suit)
  );

  // Evaluate hand rank based on rules
  let rankName,
    rank,
    rankCards = [];

  for (let i = 0; i < allCards.length - 4; i++) {
    for (let j = i + 1; j < allCards.length - 3; j++) {
      for (let k = j + 1; k < allCards.length - 2; k++) {
        for (let l = k + 1; l < allCards.length - 1; l++) {
          for (let m = l + 1; m < allCards.length; m++) {
            const hand = [
              allCards[i],
              allCards[j],
              allCards[k],
              allCards[l],
              allCards[m],
            ];

            if (isRoyalFlush(hand)) {
              rankName = "Royal Flush";
              rank = 900;
              rankCards = hand;
              break;
            } else {
              const straightFlush = getStraightFlushRank(hand);
              if (straightFlush && (!rankName || straightFlush.rank > rank)) {
                rankName = straightFlush.rankName;
                rank = straightFlush.rank;
                rankCards = straightFlush.cards;
              } else {
                const fourOfAKind = getFourOfAKindRank(allCards);
                if (fourOfAKind && (!rankName || fourOfAKind.rank > rank)) {
                  rankName = fourOfAKind.rankName;
                  rank = fourOfAKind.rank;
                  rankCards = fourOfAKind.cards;
                } else {
                  const fullHouse = getFullHouseRank(allCards);
                  if (fullHouse && (!rankName || fullHouse.rank > rank)) {
                    rankName = fullHouse.rankName;
                    rank = fullHouse.rank;
                    rankCards = fullHouse.cards;
                    console.log("Updated best hand to Full House", rankCards);
                  }
                }
              }
            }
          }
          if (rankName === "Royal Flush") break;
        }
        if (rankName === "Royal Flush") break;
      }
      if (rankName === "Royal Flush") break;
    }
    if (rankName === "Royal Flush") break;
  }

  if (rankName) {
    console.log(`Hand is a ${rankName}`);
  } else {
    console.log("Hand is not a Royal Flush or Straight Flush");
  }

  //   if (rankName == null) {
  //     // For the other cases we'll sort the duplicate cards in descending order by the amount
  //     duplicates.sort((x, y) => parseInt(y[0]) - parseInt(x[0]));

  //
  //   // Checks for a FULL HOUSE, rank: [600, 700)
  //   // Edge case: there are 2 pairs of 2 and one Pair of 3, for example: 33322AA
  //   else if (
  //     duplicates.length > 2 &&
  //     duplicates[0][0] == 3 &&
  //     duplicates[1][0] == 2 &&
  //     duplicates[2][0] == 2
  //   ) {
  //     // In that edge case, we'll check from the two pairs what is greater.
  //     rankName = "Full House";
  //     let maxTmpValue = Math.max(duplicates[1][1], duplicates[2][1]);
  //     rank = 600 + parseInt(duplicates[0][1]) + maxTmpValue / 14;

  //     for (let i = 0; i < 3; i++)
  //       rankCards.push([duplicates[0][1].toString(), null]);

  //     for (let i = 0; i < 2; i++)
  //       rankCards.push([maxTmpValue.toString(), null]);
  //   } else if (
  //     duplicates.length > 1 &&
  //     duplicates[0][0] == 3 &&
  //     duplicates[1][0] == 2
  //   ) {
  //     rankName = "Full House";
  //     rank = 600 + parseInt(duplicates[0][1]) + duplicates[1][1] / 14;

  //     for (let i = 0; i < 3; i++)
  //       rankCards.push([duplicates[0][1].toString(), null]);

  //     for (let i = 0; i < 2; i++)
  //       rankCards.push([duplicates[1][1].toString(), null]);
  //   }

  //   // Edge case where there are 2 pairs of Three of a kind
  //   // For example if the case is 333 222 then we'll check what is better: 333 22 or 222 33.
  //   else if (
  //     duplicates.length > 1 &&
  //     duplicates[0][0] == 3 &&
  //     duplicates[1][0] == 3
  //   ) {
  //     rankName = "Full House";

  //     let rank1 = 600 + parseInt(duplicates[0][1]) + duplicates[1][1] / 14;
  //     let rank2 = 600 + parseInt(duplicates[1][1]) + duplicates[0][1] / 14;

  //     if (rank1 > rank2) {
  //       rank = rank1;
  //       for (let i = 0; i < 3; i++)
  //         rankCards.push([duplicates[0][1].toString(), null]);

  //       for (let i = 0; i < 2; i++)
  //         rankCards.push([duplicates[1][1].toString(), null]);
  //     } else {
  //       rank = rank2;
  //       for (let i = 0; i < 3; i++)
  //         rankCards.push([duplicates[1][1].toString(), null]);

  //       for (let i = 0; i < 2; i++)
  //         rankCards.push([duplicates[0][1].toString(), null]);
  //     }
  //   }
  // }

  //   // Checks for Straight, rank: [400, 500)
  //   if (seqCountMax >= 5) {
  //     rankName = "Straight";
  //     rank = 400 + (seqMaxValue / 14) * 99;

  //     for (let i = seqMaxValue; i > seqMaxValue - seqCountMax; i--) {
  //       rankCards.push([i.toString(), null]);
  //     }
  //   }
  //   // Edge case: there's seqCountMax of 4, and the highest card is 5,
  //   // Which means the sequence looks like this: 2, 3, 4, 5
  //   // In that case, we'll check if the last card is Ace to complete a sequence of 5 cards.
  //   else if (seqCountMax == 4 && seqMaxValue == 5 && maxCardValue == 14) {
  //     rankName = "Straight";

  //     // In that case the highest card of the straight will be 5, and not Ace.
  //     rank = 435.3571; // The result of 400 + 5/14 * 99

  //     rankCards.push(["14", null]);
  //     for (let i = 2; i < 5; i++) {
  //       rankCards.push([i.toString(), null]);
  //     }
  //   }

  //   // Checks for Three of a kind, rank: [300, 400)
  //   if (duplicates.length > 0 && duplicates[0][0] == 3) {
  //     rankName = "Three of a kind";
  //     rank =
  //       300 +
  //       (duplicates[0][1] / 14) * 50 +
  //       evaluateRankByHighestCards(allCards, parseInt(duplicates[0][1]));

  //     for (let i = 0; i < 3; i++) {
  //       rankCards.push([duplicates[0][1].toString(), null]);
  //     }
  //   }

  //   // Checks for Two Pairs, rank: [200, 300)
  //   else if (
  //     duplicates.length > 1 &&
  //     duplicates[0][0] == 2 &&
  //     duplicates[1][0] == 2
  //   ) {
  //     rankName = "Two Pairs";

  //     // Edge case: there are 3 pairs of Two Pairs, in that case we'll choose the higher one.
  //     if (duplicates.length > 2 && duplicates[2][0] == 2) {
  //       let threePairsValues = [
  //         duplicates[0][1],
  //         duplicates[1][1],
  //         duplicates[2][1],
  //       ];
  //       threePairsValues.sort((x, y) => y - x);

  //       // The reason for 50 is because maxCardValue/14 can be 1, and we don't want to get the score 300.
  //       // and its also the reason for /392 instead of /14 is.
  //       rank =
  //         200 +
  //         (Math.pow(threePairsValues[0], 2) / 392 +
  //           Math.pow(threePairsValues[1], 2) / 392) *
  //           50 +
  //         evaluateRankByHighestCards(
  //           allCards,
  //           parseInt(threePairsValues[0]),
  //           parseInt(threePairsValues[1])
  //         );

  //       // We need only the 2 highest pairs from the 3 pairs.
  //       rankCards.push([threePairsValues[0].toString(), null]);
  //       rankCards.push([threePairsValues[1].toString(), null]);
  //     } else {
  //       rank =
  //         200 +
  //         (Math.pow(duplicates[0][1], 2) / 392 +
  //           Math.pow(duplicates[1][1], 2) / 392) *
  //           50 +
  //         evaluateRankByHighestCards(
  //           allCards,
  //           parseInt(duplicates[0][1]),
  //           parseInt(duplicates[1][1])
  //         );

  //       for (let i = 0; i < 2; i++) {
  //         rankCards.push([duplicates[0][1].toString(), null]);
  //       }

  //       for (let i = 0; i < 2; i++) {
  //         rankCards.push([duplicates[1][1].toString(), null]);
  //       }
  //     }
  //   }

  //   // Check for One Pair, rank: [100, 200)
  //   else if (duplicates.length > 0 && duplicates[0][0] == 2) {
  //     // Pair
  //     rankName = "Pair";
  //     rank =
  //       100 +
  //       (duplicates[0][1] / 14) * 50 +
  //       evaluateRankByHighestCards(allCards, parseInt(duplicates[0][1]), -1, 3);

  //     for (let i = 0; i < 2; i++) {
  //       rankCards.push([duplicates[0][1].toString(), null]);
  //     }
  //   }

  //   // Otherwise, it's High Card, rank: [0, 100)
  //   else {
  //     rankName = "High Card";
  //     rank = evaluateRankByHighestCards(allCards, -1, -1, 5);
  //     rankCards.push([maxCardValue.toString(), null]);
  //   }

  return {
    rankName,
    rank,
    cards: rankCards,
  };
}
