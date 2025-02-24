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

interface HandHistoryEntry {
  handType: string;
  cards: CardType[];
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

  const defaultHand = [
    { rank: "A", suit: "Hearts" },
    { rank: "2", suit: "Hearts" },
    { rank: "3", suit: "Hearts" },
    { rank: "4", suit: "Hearts" },
    { rank: "5", suit: "Hearts" },
    { rank: "6", suit: "Hearts" },
    { rank: "7", suit: "Hearts" },
    { rank: "8", suit: "Hearts" },
    { rank: "9", suit: "Hearts" },
    { rank: "10", suit: "Hearts" },
    { rank: "J", suit: "Hearts" },
    { rank: "Q", suit: "Hearts" },
    { rank: "K", suit: "Hearts" },
  ];
  return (
    <div className={classNames.playArea}>
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
          {showHistory
            ? // Show full history
              handHistory.map((entry, entryIndex) => (
                <div key={entryIndex} className="entry">
                  <span>Hand Type: {entry.handType}</span>
                  {entry.cards.map((card: CardType, cardIndex: number) => (
                    <div
                      className={classNames.cardContainer}
                      key={cardIndex}
                      style={{ marginLeft: `${cardIndex * 30}px` }}
                    >
                      <Card key={cardIndex} card={{ ...card, hidden: false }} />
                    </div>
                  ))}
                </div>
              ))
            : (() => {
                const lastNonPassEntry = [...handHistory]
                  .reverse()
                  .find((entry) => entry.cards.length > 0);

                if (!lastNonPassEntry) return null;
                return (
                  <div className="entry">
                    <span>Hand Type: {lastNonPassEntry.handType}</span>
                    {lastNonPassEntry.cards.map(
                      (card: CardType, cardIndex: number) => (
                        <div
                          className={classNames.cardContainer}
                          key={cardIndex}
                          style={{ marginLeft: `${cardIndex * 30}px` }}
                        >
                          <Card
                            key={cardIndex}
                            card={{ ...card, hidden: false }}
                          />
                        </div>
                      )
                    )}
                  </div>
                );
              })()}
        </div>
      )}
      {playerHands.map((hand, index) => {
        const positionClass =
          index === 0
            ? "bottom"
            : index === 1
            ? "top"
            : index === 2
            ? "left"
            : "right";
        const isUserControlled = index === 0;
        return (
          <div
            key={index}
            className={`${classNames.playerHand} ${classNames[positionClass]}`}
          >
            <Player
              initialHand={hand}
              onPlayCards={handlePlayCards}
              isCurrentPlayer={index === currentPlayer}
              onPass={handlePass}
              isUserControlled={isUserControlled}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PlayArea;
