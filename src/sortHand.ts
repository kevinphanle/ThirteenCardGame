import { Card } from "./types";

// const suitOrder = ["Spades", "Clubs", "Diamonds", "Hearts"];
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

const sortHand = (hand: Card[]): Card[] => {
  return hand.sort((a, b) => {
    return rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank);
  });
};

export default sortHand;
