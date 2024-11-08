import React, { useState } from "react";
import { createDeck } from "./deck";
import { Card as CardType } from './types';

import Card from './Card';
import Player from './Player';
import PlayArea from "./PlayArea";
import { shuffleDeck, dealCards } from './deal';

import classNames from './App.module.css'


const Game: React.FC = () => {
  const [deck, setDeck] = useState<CardType[]>(createDeck())
  const [playerHands, setPlayerHands] = useState<CardType[][]>([])

  const handleShuffle = () => {
    setDeck(shuffleDeck([...deck]))
    console.log(deck)
  }

  const handleReset = () => {
    setDeck(createDeck())
    setPlayerHands([])
  }

  const handleDeal = () => {
    setPlayerHands([])
    console.log(playerHands)
    const hands = dealCards(deck, 4);
    console.log(hands)
    setPlayerHands(hands)
  }

  const handleClick = (card: CardType) => {
    console.log("card clicked: ", card)
  }

  return (
    <div className={classNames.board}>
      <h1>Card Game</h1>
      <button onClick={handleShuffle}>Shuffle Deck</button>
      <button onClick={handleDeal}>Deal</button>
      <button onClick={handleReset}>Reset</button>



      <PlayArea playerHands={playerHands} />
    </div>
  )
}

export default Game;