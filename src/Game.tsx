import React, { useState } from "react";
import { createDeck } from "./deck";
import { Card as CardType } from "./types";
import { useGameContext } from "./GameContext";
import { getHandType } from "./HandTypeUtils";

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

  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);

  const handleReset = () => {
    setDeck(createDeck());
    setPlayerHands([]);
    setPlayedCards([]);
    setCurrentPlayer(0);
    setCurrentHandType(null);
    setHandHistory([]);
    setGameOver(false);
    setWinner(null);
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

  const handlePlayCards = (playerIndex: number, cards: CardType[]) => {
    if (gameOver) {
      return; // Ignore if game is over
    }

    // Update player's hand
    const updatedHands = [...playerHands];

    updatedHands[playerIndex] = updatedHands[playerIndex].filter(
      (card) => !cards.some((c) => c.rank === card.rank && c.suit === card.suit)
    );

    // Check for winner using the updated hands (before setting state)
    const winnerIndex = updatedHands.findIndex((hand) => hand.length === 0);

    if (winnerIndex !== -1) {
      // We have a winner
      setPlayerHands(updatedHands);
      setHandHistory((prev) => [
        ...prev,
        {
          playerIndex,
          cards,
          handType: getHandType(cards),
        },
      ]);
      setGameOver(true);
      setWinner(winnerIndex);
      return; // Don't advance turn if game is over
    }

    // No winner yet, update state and continue
    setPlayerHands(updatedHands);

    // Add played cards to history
    setHandHistory((prev) => [
      ...prev,
      {
        playerIndex,
        cards,
        handType: getHandType(cards),
      },
    ]);

    // Advance to next player
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

      {gameOver && (
        <div className={classNames.gameOverOverlay}>
          <div className={classNames.gameOverModal}>
            <h2>
              {winner !== null &&
                (winner === 0 ? "You Won! 🎉" : `Player ${winner + 1} Won!`)}
            </h2>
            <p>
              {winner === 0
                ? "Congratulations! You're the champion!"
                : "Better luck next time!"}
            </p>
            <button onClick={handleReset} className={classNames.newGameBtn}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
