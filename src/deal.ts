import { Card } from "./types";

import sortHand from "./sortHand";

export const shuffleDeck = (deck: Card[]): Card[] => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  };
  return deck;
}

export const dealCards = (deck: Card[], numberOfPlayers: number): Card[][] => {
  const shuffledDeck = shuffleDeck([...deck]);
  const playerHands: Card[][] = Array.from({ length: numberOfPlayers }, () => []);

  for (let i = 0; i < shuffledDeck.length; i++) {
    const card = {...shuffledDeck[i], ownerIndex: i % numberOfPlayers};
    playerHands[i % numberOfPlayers].push(card);
  }

  playerHands.forEach(hand => {
    sortHand(hand);
  });

  return playerHands;
}