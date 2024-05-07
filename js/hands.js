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

  // High card
  rankName = "High Card";
  rank = evaluateRankByHighestCards(allCards, -1, -1, 5);
  rankCards.push([maxCardValue.toString(), null]);

  return {
    rankName,
    rank,
    cards: rankCards,
  };
}
