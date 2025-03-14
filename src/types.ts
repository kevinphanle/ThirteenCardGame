export type Suit = "Hearts" | "Diamonds" | "Spades" | "Clubs";
export type Rank =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A";

export interface Card {
  suit: Suit;
  rank: Rank;
  ownerIndex: number;
  hidden?: boolean;
}

export interface HandHistoryEntry {
  cards: Card[];
  handType: string | null;
}

export interface GameContextProps {
  playerHands: Card[][];
  setPlayerHands: React.Dispatch<React.SetStateAction<Card[][]>>;
  playedCards: Card[];
  setPlayedCards: React.Dispatch<React.SetStateAction<Card[]>>;
  currentPlayer: number;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<number>>;
  currentHandType: string | null;
  setCurrentHandType: React.Dispatch<React.SetStateAction<string | null>>;
  handHistory: HandHistoryEntry[];
  setHandHistory: React.Dispatch<React.SetStateAction<HandHistoryEntry[]>>;
}
