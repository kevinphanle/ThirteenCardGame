import React from 'react';
import { Card as CardType } from './types';
import Player from './Player';
import classNames from './App.module.css';

interface PlayAreaProps {
  playerHands: CardType[][];
}

const PlayArea: React.FC<PlayAreaProps> = ({ playerHands }) => {
  return (
    <div className={classNames.playArea}>
      {playerHands.map((hand, index) => (
        <Player key={index} initialHand={hand} />
      ))}
    </div>
  );
};

export default PlayArea;