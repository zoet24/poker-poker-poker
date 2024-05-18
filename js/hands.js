// Royal flush: 900
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

// Straight flush: 800 - 900
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

// Four of a kind: 700 - 800
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

// Full house: 600 - 700
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

// Flush: 500 - 600
const getFlushRank = (cards) => {
  const suits = {};
  cards.forEach((card) => {
    suits[card.suit] = (suits[card.suit] || 0) + 1;
  });

  // Check if there is a suit with at least 5 cards
  for (const suit in suits) {
    if (suits[suit] >= 5) {
      const flushCards = cards
        .filter((card) => card.suit === suit)
        .sort((a, b) => parseInt(b.value) - parseInt(a.value));
      const topFiveFlushCards = flushCards.slice(0, 5); // Take the highest 5 cards of the flush

      // Calculate the rank based on the highest card in the flush
      const highestCardValue = parseInt(topFiveFlushCards[0].value);
      const flushRank = 500 + (highestCardValue / 14) * 99;

      return {
        rankName: "Flush",
        rank: flushRank,
        cards: topFiveFlushCards,
      };
    }
  }

  return null;
};

// Straight: 400 - 500
const getStraightRank = (cards) => {
  // Extract values and sort them
  let values = cards.map((card) => parseInt(card.value)).sort((a, b) => a - b);

  // Remove duplicates
  values = [...new Set(values)];

  let bestStraight = null;

  // Check for standard straight (5 consecutive values)
  for (let i = 0; i <= values.length - 5; i++) {
    if (
      values[i] + 1 === values[i + 1] &&
      values[i + 1] + 1 === values[i + 2] &&
      values[i + 2] + 1 === values[i + 3] &&
      values[i + 3] + 1 === values[i + 4]
    ) {
      const highestCardValue = values[i + 4];
      const straightRank = 400 + (highestCardValue / 14) * 99;

      const straightValues = [
        values[i],
        values[i + 1],
        values[i + 2],
        values[i + 3],
        values[i + 4],
      ];
      const straightCards = [];
      const usedValues = new Set();

      for (const value of straightValues) {
        for (const card of cards) {
          if (parseInt(card.value) === value && !usedValues.has(value)) {
            straightCards.push(card);
            usedValues.add(value);
            break;
          }
        }
      }

      bestStraight = {
        rankName: "Straight",
        rank: straightRank,
        cards: straightCards,
      };
    }
  }

  // Special case for wheel straight (A-2-3-4-5)
  if (
    values.includes(14) &&
    values.includes(2) &&
    values.includes(3) &&
    values.includes(4) &&
    values.includes(5)
  ) {
    const straightRank = 400 + (5 / 14) * 99;

    const straightCards = cards.filter((card) =>
      ["14", "2", "3", "4", "5"].includes(card.value)
    );

    const wheelStraight = {
      rankName: "Straight",
      rank: straightRank,
      cards: straightCards,
    };

    if (!bestStraight || wheelStraight.rank > bestStraight.rank) {
      bestStraight = wheelStraight;
    }
  }

  return bestStraight;
};

// Three of a kind: 300 - 400
const getThreeOfAKindRank = (cards) => {
  const valueCount = {};
  cards.forEach((card) => {
    valueCount[card.value] = (valueCount[card.value] || 0) + 1;
  });

  let threeOfAKindValue = null;

  for (const value in valueCount) {
    if (valueCount[value] === 3) {
      threeOfAKindValue = value;
      break;
    }
  }

  if (threeOfAKindValue) {
    const threeOfAKindCards = cards.filter(
      (card) => card.value === threeOfAKindValue
    );
    const kickerCandidates = cards
      .filter((card) => card.value !== threeOfAKindValue)
      .sort((a, b) => parseInt(b.value) - parseInt(a.value));

    const kickers = kickerCandidates.slice(0, 2); // Take the highest two kickers

    // Calculate the rank taking into account the three of a kind and the two kickers
    const threeOfAKindRank = 300 + (parseInt(threeOfAKindValue) / 14) * 99;
    const finalRank =
      threeOfAKindRank +
      (parseInt(kickers[0].value) / 14) * (99 / 14) +
      (parseInt(kickers[1].value) / 14) * (99 / 28);

    return {
      rankName: "Three of a Kind",
      rank: finalRank,
      cards: [...threeOfAKindCards, ...kickers],
    };
  }

  return null;
};

// Two pair: 200 - 300
const getTwoPairRank = (cards) => {
  const valueCount = {};
  cards.forEach((card) => {
    valueCount[card.value] = (valueCount[card.value] || 0) + 1;
  });

  let pairs = [];
  for (const value in valueCount) {
    if (valueCount[value] === 2) {
      pairs.push(value);
    }
  }

  if (pairs.length >= 2) {
    pairs.sort((a, b) => parseInt(b) - parseInt(a)); // Sort pairs descending

    const highestPairValue = pairs[0];
    const secondHighestPairValue = pairs[1];

    const highestPairCards = cards.filter(
      (card) => card.value === highestPairValue
    );
    const secondHighestPairCards = cards.filter(
      (card) => card.value === secondHighestPairValue
    );
    const kickerCandidates = cards
      .filter(
        (card) =>
          card.value !== highestPairValue &&
          card.value !== secondHighestPairValue
      )
      .sort((a, b) => parseInt(b.value) - parseInt(a.value));

    const kicker = kickerCandidates[0]; // Take the highest kicker

    // Calculate the rank taking into account the pairs and the kicker
    const highestPairRank = 200 + (parseInt(highestPairValue) / 14) * 99;
    const finalRank =
      highestPairRank +
      (parseInt(secondHighestPairValue) / 14) * (99 / 14) +
      (parseInt(kicker.value) / 14) * (99 / 28);

    return {
      rankName: "Two Pair",
      rank: finalRank,
      cards: [...highestPairCards, ...secondHighestPairCards, kicker],
    };
  }

  return null;
};

// One pair: 100 - 200
const getOnePairRank = (cards) => {
  const valueCount = {};
  cards.forEach((card) => {
    valueCount[card.value] = (valueCount[card.value] || 0) + 1;
  });

  let pairValue = null;

  for (const value in valueCount) {
    if (valueCount[value] === 2) {
      pairValue = value;
      break;
    }
  }

  if (pairValue) {
    const pairCards = cards.filter((card) => card.value === pairValue);
    const kickerCandidates = cards
      .filter((card) => card.value !== pairValue)
      .sort((a, b) => parseInt(b.value) - parseInt(a.value));

    const kickers = kickerCandidates.slice(0, 3); // Take the highest three kickers

    // Calculate the rank taking into account the pair and the three kickers
    const pairRank = 100 + (parseInt(pairValue) / 14) * 99;
    const finalRank =
      pairRank +
      (parseInt(kickers[0].value) / 14) * (99 / 14) +
      (parseInt(kickers[1].value) / 14) * (99 / 28) +
      (parseInt(kickers[2].value) / 14) * (99 / 56);

    return {
      rankName: "One Pair",
      rank: finalRank,
      cards: [...pairCards, ...kickers],
    };
  }

  return null;
};

// Highest card: < 100
const getHighCardRank = (cards) => {
  const sortedCards = cards.sort(
    (a, b) => parseInt(b.value) - parseInt(a.value)
  );
  const topFiveCards = sortedCards.slice(0, 5);

  // Calculate the rank based on the highest card and other high cards
  const highestCardValue = parseInt(topFiveCards[0].value);
  const highCardRank = (highestCardValue / 14) * 99;
  const finalRank =
    highCardRank +
    (parseInt(topFiveCards[1].value) / 14) * (99 / 14) +
    (parseInt(topFiveCards[2].value) / 14) * (99 / 28) +
    (parseInt(topFiveCards[3].value) / 14) * (99 / 56) +
    (parseInt(topFiveCards[4].value) / 14) * (99 / 112);

  return {
    rankName: "High Card",
    rank: finalRank,
    cards: topFiveCards,
  };
};

export function getPlayerHandRank(player, communityCards) {
  // Combine player's cards and cards on the table
  const allCards = [...player.hand, ...communityCards];

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
                  } else {
                    const flush = getFlushRank(allCards);
                    if (flush && (!rankName || flush.rank > rank)) {
                      rankName = flush.rankName;
                      rank = flush.rank;
                      rankCards = flush.cards;
                    } else {
                      const straight = getStraightRank(allCards);
                      if (straight && (!rankName || straight.rank > rank)) {
                        rankName = straight.rankName;
                        rank = straight.rank;
                        rankCards = straight.cards;
                      } else {
                        const threeOfAKind = getThreeOfAKindRank(allCards);
                        if (
                          threeOfAKind &&
                          (!rankName || threeOfAKind.rank > rank)
                        ) {
                          rankName = threeOfAKind.rankName;
                          rank = threeOfAKind.rank;
                          rankCards = threeOfAKind.cards;
                        } else {
                          const twoPair = getTwoPairRank(allCards);
                          if (twoPair && (!rankName || twoPair.rank > rank)) {
                            rankName = twoPair.rankName;
                            rank = twoPair.rank;
                            rankCards = twoPair.cards;
                          } else {
                            const onePair = getOnePairRank(allCards);
                            if (onePair && (!rankName || onePair.rank > rank)) {
                              rankName = onePair.rankName;
                              rank = onePair.rank;
                              rankCards = onePair.cards;
                            } else {
                              const highCard = getHighCardRank(allCards);
                              if (
                                highCard &&
                                (!rankName || highCard.rank > rank)
                              ) {
                                rankName = highCard.rankName;
                                rank = highCard.rank;
                                rankCards = highCard.cards;
                              }
                            }
                          }
                        }
                      }
                    }
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
  }

  return {
    rankName,
    rank,
    cards: rankCards,
  };
}
