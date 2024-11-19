import React, { useEffect, useMemo } from "react";
import { Card as CardType } from "./types";
import classNames from './App.module.css'
import Card from "./Card";
import { useGameContext } from "./GameContext";
import { getHandType } from "./HandTypeUtils";

import sortHand from "./sortHand";

interface PlayerProps {
  initialHand: CardType[];
  onPlayCards?: (cards: CardType[]) => void;
  isCurrentPlayer?: boolean;
  onPass: () => void;
}

const rankOrder = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2'];
const suitOrder = ['Spades', 'Clubs', 'Diamonds', 'Hearts'];

const Player: React.FC<PlayerProps> = ({ initialHand, onPlayCards, isCurrentPlayer, onPass}) => {
  const [hand, setHand] = React.useState<CardType[]>(initialHand);
  const [selectedCards, setSelectedCards] = React.useState<CardType[]>([]);
  const [handType, setHandType] = React.useState<string | null>(null);
  const {playedCards, currentHandType, setCurrentHandType, handHistory, setHandHistory} = useGameContext();

  useEffect(() => {
    setHand(sortHand(initialHand));
  }, [initialHand]);

  const handleCardSelect = (card: CardType) => {
    const isSelected = selectedCards.some(selectedCard => selectedCard.rank === card.rank && selectedCard.suit === card.suit);

    const newSelectedCards = isSelected 
      ? selectedCards.filter(selectedCard => selectedCard.rank !== card.rank || selectedCard.suit !== card.suit) 
      : [...selectedCards, card];

    setSelectedCards(newSelectedCards);

    setHandType(getHandType(newSelectedCards));
  };

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
    if (checkForPossibleStraights(cards)) {
      possibleCombinations.push("Straight");
    }

    return possibleCombinations
  }
  
  const possibleCombinations = useMemo(() => checkForPossibleCombinations(hand), [hand]);

  const isCardHigher = (card: CardType, latestPlayedCard: CardType): boolean => {
    const rankOrderForComparison = handType === 'Single' ? rankOrder : rankOrder.slice(0, -1);
    if (rankOrderForComparison.indexOf(card.rank) === rankOrderForComparison.indexOf(latestPlayedCard.rank)) {
      return suitOrder.indexOf(card.suit) > suitOrder.indexOf(latestPlayedCard.suit);
    }
    const isHigher = rankOrderForComparison.indexOf(card.rank) > rankOrderForComparison.indexOf(latestPlayedCard.rank)
    return isHigher;
  }

  const isCardPlayable = (cards: CardType[]): boolean => {
    if (handHistory.length === 0) return true;

    const selectedHandType = getHandType(cards);
    const currentHand = handHistory[handHistory.length - 1];

    if (selectedHandType !== currentHand.handType || currentHand.cards.length !== cards.length) {
      return false;
    }

    if (playedCards.length === 0) return true;
    // check last card of current hand and compare to last card of selected cards
    return isCardHigher(cards[cards.length - 1], currentHand.cards[currentHand.cards.length - 1]);
  }

  const playHand = () => {
    if (isCardPlayable(selectedCards)) {
      const newHand = hand.filter(card => !selectedCards.some(selectedCard => selectedCard.rank === card.rank && selectedCard.suit === card.suit));
      console.log('selected cards', selectedCards);
      setHand(newHand);
      if (onPlayCards) {
        const handType = getHandType(selectedCards);
        setCurrentHandType(handType);
        onPlayCards(selectedCards);
        setHandHistory([...handHistory, {cards: selectedCards, handType: handType}]);
        setSelectedCards([]);
      } else {
        console.error('onPlayCards not provided');
      }
    } else {
      console.error('Selected cards are not playable');
    }
  }

  const passTurn = () => {
    setSelectedCards([]);
    setHandType(null);
    onPass();
  }

  return (
    <div className={`${isCurrentPlayer ? classNames['active-player'] : ''} ${classNames.player}`}>
      <h2>Player's Hand</h2>
      {selectedCards.length > 0 && isCurrentPlayer && 
        <button onClick={playHand}>Play cards</button>
      }

      {handType && <p>Hand Type: {handType}</p>}

      <p>Possible Combinations: {possibleCombinations}</p>
      {isCurrentPlayer && handHistory.length > 0 && 
        <button onClick={passTurn} className={classNames.passBtn}>Pass</button>
      }

      <div className={classNames.hand}>
        {
          hand.map((card, index) => (
            <Card 
              key={index} 
              card={card} 
              onClick={handleCardSelect}
              selected={selectedCards.some(selectedCard => selectedCard.rank === card.rank && selectedCard.suit === card.suit)}
              />
          ))
        }
      </div>
    </div>
  )
}

export default Player;