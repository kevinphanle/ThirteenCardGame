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
                Game History {showHistory ? "▼" : "▶"}
              </h3>

              {/* Current play - always visible */}
              <div className={classNames.currentPlay}>
                {(() => {
                  // Find the last non-pass entry
                  const lastNonPassEntry = [...handHistory]
                    .reverse()
                    .find((entry) => entry.cards.length > 0);

                  if (lastNonPassEntry) {
                    return (
                      <>
                        <div className={classNames.currentPlayInfo}>
                          <span className={classNames.handType}>
                            {lastNonPassEntry.handType}
                          </span>
                        </div>
                        <div className={classNames.currentPlayCards}>
                          {lastNonPassEntry.cards.map((card, cardIndex) => (
                            <div
                              className={classNames.currentCardContainer}
                              key={cardIndex}
                              style={{
                                marginLeft: cardIndex > 0 ? "-40px" : "0",
                              }}
                            >
                              <Card card={{ ...card, hidden: false }} />
                            </div>
                          ))}
                        </div>
                      </>
                    );
                  }
                  return (
                    <span className={classNames.noPlay}>
                      No cards played yet
                    </span>
                  );
                })()}
              </div>

              {/* Expanded history */}
              {showHistory && (
                <div className={classNames.historyTimeline}>
                  {handHistory.map((entry, index) => (
                    <div
                      key={index}
                      className={`${classNames.historyEntry} ${
                        entry.handType === "Pass"
                          ? classNames.passEntry
                          : classNames.playEntry
                      }`}
                    >
                      <div className={classNames.playerIndicator}>
                        Player {(index % 4) + 1}
                      </div>
                      {entry.handType === "Pass" ? (
                        <div className={classNames.passIndicator}>PASS</div>
                      ) : (
                        <div className={classNames.playDetails}>
                          <div className={classNames.playType}>
                            {entry.handType}
                          </div>
                          <div className={classNames.historyCards}>
                            {entry.cards.map((card, cardIndex) => (
                              <div
                                className={classNames.miniCardContainer}
                                key={cardIndex}
                                style={{
                                  marginLeft: cardIndex > 0 ? "-25px" : "0",
                                }}
                              >
                                <Card
                                  key={cardIndex}
                                  card={{ ...card, hidden: false }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
