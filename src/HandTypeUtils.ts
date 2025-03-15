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

export const checkForStraight = (cards: CardType[]): boolean => {
  if (cards.length < 3) return false;
  // Exclude '2' from being part of a straight
  if (cards.some((card) => card.rank === "2")) {
    return false;
  }

  const sortedRanks = cards
    .map((card) => rankOrder.indexOf(card.rank))
    .sort((a, b) => a - b);

  for (let i = 0; i < sortedRanks.length - 1; i++) {
    const currentRank = sortedRanks[i];
    const nextRank = sortedRanks[i + 1];

    if (nextRank !== currentRank + 1) {
      return false;
    }
  }
  return true;
};

export const checkForBomb = (cards: CardType[]): boolean => {
  // Case 1: Four of a kind
  if (
    cards.length === 4 &&
    cards.every((card) => card.rank === cards[0].rank)
  ) {
    return true;
  }

  // Case 2: At least 3 consecutive pairs (e.g., 334455)
  if (cards.length >= 6 && cards.length % 2 === 0) {
    // Group cards by rank
    const cardsByRank: Record<string, CardType[]> = {};
    for (const card of cards) {
      if (!cardsByRank[card.rank]) {
        cardsByRank[card.rank] = [];
      }
      cardsByRank[card.rank].push(card);
    }

    // Check if each rank appears exactly twice
    const ranks = Object.keys(cardsByRank);
    if (ranks.length !== cards.length / 2) {
      return false;
    }

    if (!ranks.every((rank) => cardsByRank[rank].length === 2)) {
      return false;
    }

    // Get the indices of these ranks in the rank order
    const rankIndices = ranks
      .map((rank) => rankOrder.indexOf(rank))
      .sort((a, b) => a - b);

    // Check if they form a sequence
    for (let i = 0; i < rankIndices.length - 1; i++) {
      if (rankIndices[i + 1] !== rankIndices[i] + 1) {
        return false;
      }
    }

    return true;
  }

  return false;
};

export const getHandType = (cards: CardType[]): string | null => {
  if (cards.length === 1) {
    return "Single";
  } else if (cards.length === 2 && cards[0].rank === cards[1].rank) {
    return "Pair";
  } else if (
    cards.length === 3 &&
    cards[0].rank === cards[1].rank &&
    cards[1].rank === cards[2].rank
  ) {
    return "Triple";
  } else if (checkForStraight(cards)) {
    return "Straight";
  } else if (checkForBomb(cards)) {
    return "Bomb";
  }
  return null;
};
