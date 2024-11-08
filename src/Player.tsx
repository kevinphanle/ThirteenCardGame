import React, { useEffect } from "react";
import { Card as CardType } from "./types";
import classNames from './App.module.css'
import Card from "./Card";

import sortHand from "./sortHand";

interface PlayerProps {
  initialHand: CardType[];
}

const Player: React.FC<PlayerProps> = ({ initialHand }) => {
  const [hand, setHand] = React.useState<CardType[]>(initialHand);
  const [selectedCards, setSelectedCards] = React.useState<CardType[]>([]);
  const [handType, setHandType] = React.useState<string | null>(null);

  useEffect(() => {
    setHand(sortHand(initialHand));
  }, [initialHand]);

  const handleClick = (card: CardType) => {
    console.log("card clicked: ", card);
    const isSelected = selectedCards.some(selectedCard => selectedCard.rank === card.rank && selectedCard.suit === card.suit);

    const newSelectedCards = isSelected 
      ? selectedCards.filter(selectedCard => selectedCard.rank !== card.rank || selectedCard.suit !== card.suit) 
      : [...selectedCards, card];

    setSelectedCards(newSelectedCards);

    setHandType(getHandType(newSelectedCards));
  };

  const getHandType = (cards: CardType[]): string | null => {
    if (cards.length == 2 && cards[0].rank === cards[1].rank) {
      return "Pair";
    } else if (cards.length == 3 && cards[0].rank === cards[1].rank && cards[1].rank === cards[2].rank) {
      return "Triple";
    }

    return null;
  }


  return (
    <div className={classNames.player}>
      <h2>Player's Hand</h2>
      <p>Selected Cards: {selectedCards.map(card => (
        <span key={card.rank + card.suit}>{card.rank} {card.suit} </span>
      ))}</p>
      {handType && <p>Hand Type: {handType}</p>}
      <div className={classNames.hand}>
        {
          hand.map((card, index) => (
            <Card 
              key={index} 
              card={card} 
              onClick={handleClick}
              selected={selectedCards.some(selectedCard => selectedCard.rank === card.rank && selectedCard.suit === card.suit)}
              />
          ))
        }
      </div>
    </div>
  )
}

export default Player;