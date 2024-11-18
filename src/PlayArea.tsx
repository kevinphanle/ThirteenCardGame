import React from 'react';
import { Card as CardType } from './types';
import Player from './Player';
import classNames from './App.module.css';
import { useGameContext } from './GameContext';
import { getHandType } from './HandTypeUtils';

interface PlayAreaProps {
  playerHands: CardType[][];
  onPlayCards: (cards: CardType[]) => void;
}

const PlayArea: React.FC<PlayAreaProps> = ({ playerHands, onPlayCards }) => {
  const { playedCards, currentHandType, setCurrentHandType, handHistory, currentPlayer, setCurrentPlayer } = useGameContext();

  const handlePlayCards = (cards: CardType[]) => {
    const handType = getHandType(cards);
    setCurrentHandType(handType);
    onPlayCards(cards);
  }

  const handlePass = () => {
    setCurrentPlayer((currentPlayer + 1) % playerHands.length);
  }

  const defaultHand = [
    { rank: 'A', suit: 'Hearts' },
    { rank: '2', suit: 'Hearts' },
    { rank: '3', suit: 'Hearts' },
    { rank: '4', suit: 'Hearts' },
    { rank: '5', suit: 'Hearts' },
    { rank: '6', suit: 'Hearts' },
    { rank: '7', suit: 'Hearts' },
    { rank: '8', suit: 'Hearts' },
    { rank: '9', suit: 'Hearts' },
    { rank: '10', suit: 'Hearts' },
    { rank: 'J', suit: 'Hearts' },
    { rank: 'Q', suit: 'Hearts' },
    { rank: 'K', suit: 'Hearts' },
  ]
  return (
    <div className={classNames.playArea}>
      <div className="play-area">
        {
          playedCards.map((card, index) => (
            <div key={index} className={classNames.playedCard}>
              <span>{card.rank}</span>
              <span>{card.suit}</span>
            </div>
          ))
        }

        {currentHandType && <div className="current-hand-type">Current Hand Type: {currentHandType}</div>}

        { handHistory.length > 0 && <div className="hand-history">
          <h3>Hand History</h3>
          {handHistory.map((entry, index) => (
            <div key={index} className="entry">
              <span>Hand Type: {entry.handType}</span>
              {entry.cards.map((card, cardIndex) => (
                <span key={cardIndex}>{card.rank} {card.suit}</span>
              ))}
            </div>
          ))}
        </div>}
      </div>
      {playerHands.map((hand, index) => (
        <Player 
          key={index} 
          initialHand={hand} 
          onPlayCards={handlePlayCards}
          isCurrentPlayer={index === currentPlayer}
          onPass={handlePass}
          />
      ))}
    </div>
  );
};

export default PlayArea;