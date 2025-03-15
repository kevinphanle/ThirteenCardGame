import { Card as CardType } from "./types";

const rankOrder = [
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
  "2",
];

const findBombs = (cards: CardType[]): CardType[][] => {
  const results: CardType[][] = [];

  // Look for four of a kind
  const cardsByRank: Record<string, CardType[]> = {};
  cards.forEach((card) => {
    if (!cardsByRank[card.rank]) cardsByRank[card.rank] = [];
    cardsByRank[card.rank].push(card);
  });

  // Find four of a kind
  Object.values(cardsByRank).forEach((sameRankCards) => {
    if (sameRankCards.length === 4) {
      results.push([...sameRankCards]);
    }
  });

  // Find consecutive pairs (min 3 pairs)
  // Group by rank first
  const pairRanks: string[] = [];
  Object.entries(cardsByRank).forEach(([rank, cards]) => {
    if (cards.length >= 2) {
      pairRanks.push(rank);
    }
  });

  // Sort pair ranks by index in rankOrder
  pairRanks.sort((a, b) => rankOrder.indexOf(a) - rankOrder.indexOf(b));

  // Look for consecutive sequences of at least 3 pairs
  for (let i = 0; i <= pairRanks.length - 3; i++) {
    let sequenceLength = 1;
    while (
      i + sequenceLength < pairRanks.length &&
      rankOrder.indexOf(pairRanks[i + sequenceLength]) ===
        rankOrder.indexOf(pairRanks[i + sequenceLength - 1]) + 1
    ) {
      sequenceLength++;
    }

    if (sequenceLength >= 3) {
      // We found at least 3 consecutive pairs
      const bomb: CardType[] = [];
      for (let j = 0; j < sequenceLength; j++) {
        const rank = pairRanks[i + j];
        bomb.push(...cardsByRank[rank].slice(0, 2));
      }
      results.push(bomb);
    }
  }

  // Sort bombs by "power" - shorter bombs (four of a kind) first, then by rank
  return results.sort((a, b) => {
    if (a.length === 4 && b.length > 4) return -1;
    if (a.length > 4 && b.length === 4) return 1;
    return rankOrder.indexOf(a[0].rank) - rankOrder.indexOf(b[0].rank);
  });
};

export default findBombs;
