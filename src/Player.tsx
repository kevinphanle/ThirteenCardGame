import React, { useEffect, useMemo } from "react";
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

  const rankOrder = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];


  const checkForStraight = (cards: CardType[]): boolean => {
    if (cards.length < 3) return false;
    // Exclude '2' from being part of a straight
    if (cards.some(card => card.rank === '2')) {
      return false;
    }

    const sortedRanks = cards
      .map(card => rankOrder.indexOf(card.rank))
      .sort((a, b) => a - b);


    for (let i = 0; i < sortedRanks.length - 1; i++) {
      let currentRank = sortedRanks[i];
      let nextRank = sortedRanks[i + 1];

      if (nextRank !== currentRank + 1) {
        return false;
      }
    }
    return true;
  }

  function checkForBomb(cards: CardType[]): boolean {
    if (cards.length == 4 && cards[0].rank === cards[1].rank && cards[1].rank === cards[2].rank && cards[2].rank === cards[3].rank) {
      return true;
    }
    return false;
  }

  const getHandType = (cards: CardType[]): string | null => {
    if (cards.length == 2 && cards[0].rank === cards[1].rank) {
      return "Pair";
    } else if (cards.length == 3 && cards[0].rank === cards[1].rank && cards[1].rank === cards[2].rank) {
      return "Triple";
    } else if (checkForStraight(cards)) {
      return "Straight";
    } else if (checkForBomb(cards)) {
      return "Bomb"
    }

    return null;
  }

  const checkForPossiblePairs = (cards: CardType[]): boolean => {
    const rankCounts: { [key: string]: number } = {};
    cards.forEach(card => {
      rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
    })

    return Object.values(rankCounts).some(count => count >= 2);
  }

  const checkForPossibleTriples = (cards: CardType[]): boolean => {
    const rankCounts: { [key: string]: number } = {};
    cards.forEach(card => {
      rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
    })

    return Object.values(rankCounts).some(count => count >= 3);
  }

  const checkForPossibleStraights = (cards: CardType[]): boolean => {
    const sortedRanks = cards
      .map(card => rankOrder.indexOf(card.rank))
      .sort((a, b) => a - b);

    console.log('sorted ranks', sortedRanks)

    let consecutiveCount = 1;

    for (let i = 0; i < sortedRanks.length - 1; i++) {
      if (sortedRanks[i] + 1 === sortedRanks[i + 1]) {
        consecutiveCount++;
        if (consecutiveCount >= 3) {
          return true;
        }
      } else {
        consecutiveCount = 1;
      }
    }
    return false;
  }

  const checkForPossibleCombinations = (cards: CardType[]): string[] => {
    const possibleCombinations: string[] = [];

    if (checkForPossiblePairs(cards)) {
      possibleCombinations.push("Pair");
    }
    if (checkForPossibleTriples(cards)) {
      possibleCombinations.push("Triple");
    }
    // if (cards.length >= 4) {
    //   possibleCombinations.push("Quadruple");
    // }
    console.log('is there a straight', checkForPossibleStraights(cards))
    if (checkForPossibleStraights(cards)) {
      possibleCombinations.push("Straight");
    }

    return possibleCombinations
  }
  
  const possibleCombinations = useMemo(() => checkForPossibleCombinations(hand), [hand]);



  return (
    <div className={classNames.player}>
      <h2>Player's Hand</h2>
      <p>Selected Cards: {selectedCards.map(card => (
        <span key={card.rank + card.suit}>{card.rank} {card.suit} </span>
      ))}</p>

      {handType && <p>Hand Type: {handType}</p>}

      <p>Possible Combinations: {possibleCombinations}</p>

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