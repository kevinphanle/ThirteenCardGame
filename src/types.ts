export type Suit = "Hearts" | "Diamonds" | "Spades" | "Clubs";
export type Rank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A"

export interface Card {
  suit: Suit;
  rank: Rank;
  ownerIndex: number;
  hidden?: boolean;
}

export interface GameContextProps {
  playerHands: CardType[][];
  setPlayerHands: React.Dispatch<React.SetStateAction<CardType[][]>>;
  playedCards: CardType[];
  setPlayedCards: React.Dispatch<React.SetStateAction<CardType[]>>;
  currentPlayer: number;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<number>>;
  currentHandType: string | null;
  setCurrentHandType: React.Dispatch<React.SetStateAction<string | null>>;
  handHistory: HandHistoryEntry[];
  setHandHistory: React.Dispatch<React.SetStateAction<HandHistoryEntry[]>>;
}