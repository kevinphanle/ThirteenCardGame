import { Card, Suit, Rank } from "./types";

const suits: Suit[] = ["Clubs", "Diamonds", "Hearts", "Spades"];
const ranks: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

export function createDeck(): Card[] {
  const deck: Card[] = [];

  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      deck.push({
        suit,
        rank
      })
    })
  })

  return deck;
}