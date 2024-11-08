export type Suit = "Hearts" | "Diamonds" | "Spades" | "Clubs";
export type Rank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A"

export interface Card {
  suit: Suit;
  rank: Rank;
}