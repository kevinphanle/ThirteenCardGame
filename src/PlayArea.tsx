import React from "react";
import { Card as CardType } from "./types";
import Player from "./Player";
import classNames from "./App.module.css";
import { useGameContext } from "./GameContext";
import { getHandType } from "./HandTypeUtils";
import HandHistory from "./HandHistory";

interface PlayAreaProps {
  playerHands: CardType[][];
  onPlayCards: (playerIndex: number, cards: CardType[]) => void;
}

const PlayArea: React.FC<PlayAreaProps> = ({ playerHands, onPlayCards }) => {
  const {
    currentHandType,
    setCurrentHandType,
    handHistory,
    currentPlayer,
    setCurrentPlayer,
  } = useGameContext();

  const handlePlayCards = (cards: CardType[]) => {
    const handType = getHandType(cards);
    setCurrentHandType(handType);
    onPlayCards(currentPlayer, cards);
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
      {/* Center play area */}
      <div className={classNames.centerPlayArea}>
        {/* Top player (player 2) */}
        <div className={classNames.topPlayer}>
          <Player
            initialHand={playerHands[2] || []}
            onPlayCards={handlePlayCards}
            isCurrentPlayer={currentPlayer === 2}
            playerIndex={2}
            onPass={handlePass}
            isUserControlled={false}
          />
        </div>

        {/* Left player (player 3) */}
        <div className={classNames.leftPlayer}>
          <Player
            initialHand={playerHands[3] || []}
            onPlayCards={handlePlayCards}
            isCurrentPlayer={currentPlayer === 3}
            playerIndex={3}
            onPass={handlePass}
            isUserControlled={false}
          />
        </div>
        <HandHistory
          handHistory={handHistory}
          currentHandType={currentHandType}
        />

        {/* Right player (player 1) */}
        <div className={classNames.rightPlayer}>
          <Player
            initialHand={playerHands[1] || []}
            onPlayCards={handlePlayCards}
            isCurrentPlayer={currentPlayer === 1}
            playerIndex={1}
            onPass={handlePass}
            isUserControlled={false}
          />
        </div>

        {/* Bottom player (user - player 0) */}
        <div className={classNames.bottomPlayer}>
          <Player
            initialHand={playerHands[0] || []}
            onPlayCards={handlePlayCards}
            isCurrentPlayer={currentPlayer === 0}
            playerIndex={0}
            onPass={handlePass}
            isUserControlled={true}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayArea;
