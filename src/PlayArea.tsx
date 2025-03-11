import React, { useState } from "react";
import { Card as CardType } from "./types";
import Player from "./Player";
import classNames from "./App.module.css";
import { useGameContext } from "./GameContext";
import { getHandType } from "./HandTypeUtils";
import Card from "./Card";

interface PlayAreaProps {
  playerHands: CardType[][];
  onPlayCards: (cards: CardType[]) => void;
}

const PlayArea: React.FC<PlayAreaProps> = ({ playerHands, onPlayCards }) => {
  const [showHistory, setShowHistory] = useState(false);
  const {
    playedCards,
    currentHandType,
    setCurrentHandType,
    handHistory,
    currentPlayer,
    setCurrentPlayer,
  } = useGameContext();

  const handlePlayCards = (cards: CardType[]) => {
    const handType = getHandType(cards);
    setCurrentHandType(handType);
    onPlayCards(cards);
  };

  const handlePass = () => {
    setCurrentPlayer((currentPlayer + 1) % playerHands.length);
    handHistory.push({
      handType: "Pass",
      cards: [],
    });
  };

  return (
    <div className={classNames.gameTable}>
      {/* Top player (player 2) */}
      <div className={classNames.topPlayer}>
        <Player
          initialHand={playerHands[2] || []}
          onPlayCards={handlePlayCards}
          isCurrentPlayer={currentPlayer === 2}
          onPass={handlePass}
          isUserControlled={false}
        />
      </div>

      <div className={classNames.middleSection}>
        {/* Left player (player 3) */}
        <div className={classNames.leftPlayer}>
          <Player
            initialHand={playerHands[3] || []}
            onPlayCards={handlePlayCards}
            isCurrentPlayer={currentPlayer === 3}
            onPass={handlePass}
            isUserControlled={false}
          />
        </div>

        {/* Center play area */}
        <div className={classNames.centerPlayArea}>
          {currentHandType && (
            <div className="current-hand-type">
              Current Hand Type: {currentHandType}
            </div>
          )}

          {handHistory.length > 0 && (
            <div className={classNames.handHistoryContainer}>
              <h3 onClick={() => setShowHistory(!showHistory)}>
                Current Play {showHistory ? "▼" : "▶"}
              </h3>
              {/* ...hand history display code... */}
            </div>
          )}
        </div>

        {/* Right player (player 1) */}
        <div className={classNames.rightPlayer}>
          <Player
            initialHand={playerHands[1] || []}
            onPlayCards={handlePlayCards}
            isCurrentPlayer={currentPlayer === 1}
            onPass={handlePass}
            isUserControlled={false}
          />
        </div>
      </div>

      {/* Bottom player (user - player 0) */}
      <div className={classNames.bottomPlayer}>
        <Player
          initialHand={playerHands[0] || []}
          onPlayCards={handlePlayCards}
          isCurrentPlayer={currentPlayer === 0}
          onPass={handlePass}
          isUserControlled={true}
        />
      </div>
    </div>
  );
};

export default PlayArea;
