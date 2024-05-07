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

export function getPlayerHandRank(player, communityCards) {
  // Combine player's cards and cards on the table
  const allCards = [...player.hand, ...communityCards];

  // Ensure there are exactly 7 cards
  if (allCards.length !== 7) return null;

  // Sort the cards by their values
  allCards.sort((x, y) => parseInt(x.value) - parseInt(y.value));

  // Initialize variables for hand evaluation
  let maxCardValue = -1;
  let dupCount = 1,
    seqCount = 1,
    seqCountMax = 1;
  let seqMaxValue = -1;
  let duplicates = [];

  // Iterate over the cards to evaluate hand
  for (let i = 0; i < 6; i++) {
    const currCardValue = parseInt(allCards[i].value);
    const nextCardValue = parseInt(allCards[i + 1].value);

    // Check for duplicates
    if (currCardValue === nextCardValue) {
      dupCount++;
    } else if (dupCount > 1) {
      duplicates.push([dupCount, currCardValue]);
      dupCount = 1;
    }

    // Check for sequences
    if (currCardValue + 1 === nextCardValue) {
      seqCount++;
    } else if (currCardValue !== nextCardValue) {
      if (seqCount > seqCountMax) {
        seqCountMax = seqCount;
        seqMaxValue = currCardValue;
      }
      seqCount = 1;
    }

    // Update max card value
    maxCardValue = nextCardValue;
  }

  // Check sequence count for last card
  if (seqCount > seqCountMax) {
    seqCountMax = seqCount;
    seqMaxValue = maxCardValue;
  }

  // Evaluate hand rank based on rules
  let rankName,
    rank,
    rankCards = [];

  // Checks for Royal King: rank: 900
  if (
    allCards[6].value === "14" &&
    allCards[5].value === "13" &&
    allCards[4].value === "12" &&
    allCards[3].value === "11" &&
    allCards[2].value === "10" &&
    allCards[6].suit === allCards[5].suit &&
    allCards[6].suit === allCards[4].suit &&
    allCards[6].suit === allCards[3].suit &&
    allCards[6].suit === allCards[2].suit
  ) {
    rankName = "Royal King";
    rank = 900;

    rankCards.push(...allCards.slice(2));
  } else {
    // Checks for Straight Flush, rank: [800, 900)
    for (const suit of suits) {
      const suitCards = allCards.filter((x) => x.suit === suit);
      console.log("suitCards", suitCards);
      if (suitCards.length >= 5) {
        let counter = 1;
        let lastValue = -1;
        const straightFlushCards = [];
        for (let i = 0; i < suitCards.length - 1; i++) {
          if (
            parseInt(suitCards[i].value) + 1 ===
            parseInt(suitCards[i + 1].value)
          ) {
            counter++;
            lastValue = parseInt(suitCards[i + 1].value);
            straightFlushCards.push(suitCards[i]);
          } else {
            counter = 1;
            straightFlushCards.length = 0;
          }
        }

        if (counter >= 5) {
          rankName = "Straight Flush";
          rank = 800 + (lastValue / 14) * 99;
          rankCards.push(...straightFlushCards);
        } else if (
          counter === 4 &&
          lastValue === 5 &&
          suitCards[suitCards.length - 1].value === "14"
        ) {
          rankName = "Straight Flush";
          rank = 835.3571; // The result of: 800 + 5 / 14 * 99
          rankCards.push(...straightFlushCards);
        }
      }
    }
  }

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