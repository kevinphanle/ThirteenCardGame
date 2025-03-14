import React, { useState } from "react";
import { createDeck } from "./deck";
import { Card as CardType } from "./types";
import { useGameContext } from "./GameContext";

import PlayArea from "./PlayArea";
import { dealCards } from "./deal";

import classNames from "./App.module.css";

const Game: React.FC = () => {
  const [deck, setDeck] = useState<CardType[]>(createDeck());
  const {
    playerHands,
    setPlayerHands,
    setPlayedCards,
    setCurrentHandType,
    setHandHistory,
    currentPlayer,
    setCurrentPlayer,
  } = useGameContext();

  const handleReset = () => {
    setDeck(createDeck());
    setPlayerHands([]);
    setPlayedCards([]);
    setCurrentPlayer(0);
    setCurrentHandType(null);
    setHandHistory([]);
  };

  const handleDeal = () => {
    setPlayerHands([]);
    const hands = dealCards(deck, 4);
    setPlayerHands(hands);
    setCurrentPlayer(findPlayerWith3OfSpades(hands));
  };

  const findPlayerWith3OfSpades = (hands: CardType[][]): number => {
    return hands.findIndex((hand) =>
      hand.some((card) => card.rank === "3" && card.suit === "Spades")
    );
  };

  const handlePlayCards = (cards: CardType[]) => {
    setPlayedCards((prevPlayed) => [...prevPlayed, ...cards]);
    advanceTurn();
  };

  const advanceTurn = () => {
    setCurrentPlayer((currentPlayer + 1) % playerHands.length);
  };

  return (
    <div className={classNames.board}>
      <div className={classNames.header}>
        <h1>Thirteen</h1>
        <div className={classNames.btnContainer}>
          <button
            onClick={handleDeal}
            disabled={playerHands.length > 0}
            className={playerHands.length > 0 ? classNames.disabledBtn : ""}
          >
            Deal
          </button>
          <button
            onClick={handleReset}
            disabled={playerHands.length === 0}
            className={playerHands.length === 0 ? classNames.disabledBtn : ""}
          >
            Reset
          </button>
        </div>
      </div>

      {playerHands.length > 0 && (
        <PlayArea playerHands={playerHands} onPlayCards={handlePlayCards} />
      )}
    </div>
  );
};

export default Game;
