import React from 'react';
import { Card as CardType } from './types';
import Player from './Player';
import classNames from './App.module.css';

interface PlayAreaProps {
  playerHands: CardType[][];
}

const PlayArea: React.FC<PlayAreaProps> = ({ playerHands }) => {

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
      {playerHands.map((hand, index) => (
        <Player key={index} initialHand={hand} />
      ))}
    </div>
  );
};

export default PlayArea;