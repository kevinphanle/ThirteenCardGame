import React, { useState } from "react";
import { createDeck } from "./deck";
import { Card as CardType } from './types';
import { useGameContext } from "./GameContext";

import PlayArea from "./PlayArea";
import { dealCards } from './deal';

import classNames from './App.module.css'


const Game: React.FC = () => {
  const [deck, setDeck] = useState<CardType[]>(createDeck())
  const [playerHands, setPlayerHands] = useState<CardType[][]>([])
  const [currentPlayer, setCurrentPlayer] = useState<number>(0);
  const {setPlayedCards, setCurrentHandType, setHandHistory} = useGameContext(); 

  const handleReset = () => {
    setDeck(createDeck())
    setPlayerHands([])
    setPlayedCards([])
    setCurrentPlayer(0)
    setCurrentHandType(null)
    setHandHistory([])
  }

  const handleDeal = () => {
    setPlayerHands([])
    const hands = dealCards(deck, 4);
    setPlayerHands(hands)
    setCurrentPlayer(0)
  }

  const handlePlayCards = (cards: CardType[]) => {
    setPlayedCards((prevPlayed) => [...prevPlayed, ...cards]);
    advanceTurn();
  };

  const advanceTurn = () => {
    setCurrentPlayer((currentPlayer + 1) % playerHands.length);
  }

  return (
    <div className={classNames.board}>
      <h1>Card Game</h1>
      <button onClick={handleDeal}>Deal</button>
      <button onClick={handleReset}>Reset</button>

      <PlayArea 
        playerHands={playerHands} 
        onPlayCards={handlePlayCards}
        />
    </div>
  )
}

export default Game;