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

export function getPlayerHandRank(player, communityCards) {
  // Combine player's cards and cards on the table
  const allCards = [...player.hand, ...communityCards];
  console.log("Hand:", player, allCards);

  // Ensure there are exactly 7 cards
  if (allCards.length !== 7) return null;

  // Sort the cards by their values
  allCards.sort((x, y) => parseInt(x.value) - parseInt(y.value));

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

  // Checks for STRAIGHT FLUSH, rank: [800, 900)
  // for (const suit of suits) {
  //   const suitCards = allCards.filter((x) => x.suit === suit);
  //   if (suitCards.length >= 5) {
  //     // There's no way for duplicates, since every card in the same suit is unique
  //     let counter = 1;
  //     let lastValue = -1;
  //     const straightFlushCards = [];
  //     for (let i = 0; i < suitCards.length - 1; i++) {
  //       if (
  //         parseInt(suitCards[i].value) + 1 ===
  //         parseInt(suitCards[i + 1].value)
  //       ) {
  //         counter++;
  //         lastValue = parseInt(suitCards[i + 1].value);
  //         straightFlushCards.push(suitCards[i]);
  //       } else {
  //         counter = 1;
  //         straightFlushCards.length = 0;
  //       }
  //     }

  //     if (counter >= 5) {
  //       rankName = "Straight Flush";
  //       rank = 800 + (lastValue / 14) * 99;
  //       rankCards.push(...straightFlushCards);
  //     }
  //     // Will cover situations like this: 2,3,4,5,A,A,A
  //     // In that case we should check the 3 last cards if they are Ace and have the same suit has the 4th card.

  //     // Edge case where we have: 2,3,4,5 and then somewhere 14 ( must be last card )
  //     // In that case we'll declare as Straight Flush as well with highest card 5.
  //     else if (
  //       counter === 4 &&
  //       lastValue === 5 &&
  //       suitCards[suitCards.length - 1].value === "14"
  //     ) {
  //       rankName = "Straight Flush";
  //       rank = 835.3571; // The result of: 800 + 5 / 14 * 99
  //       rankCards.push(...straightFlushCards);
  //     }
  //   }
  // }

  //   if (rankName == null) {
  //     // For the other cases we'll sort the duplicate cards in descending order by the amount
  //     duplicates.sort((x, y) => parseInt(y[0]) - parseInt(x[0]));

  //     // Checks for FOUR OF A KIND, rank: [700, 800)
  //     if (duplicates.length > 0 && duplicates[0][0] == 4) {
  //       rankName = "Four of a kind";
  //       rank =
  //         700 +
  //         (duplicates[0][1] / 14) * 50 +
  //         evaluateRankByHighestCards(
  //           allCards,
  //           parseInt(duplicates[0][1]),
  //           -1,
  //           1
  //         );

  //       suits.forEach((suit) =>
  //         rankCards.push([duplicates[0][1].toString(), suit])
  //       );
  //     }
  //   }
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
