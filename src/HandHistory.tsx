import React, { useState } from "react";
import { Card as CardType } from "./types";
import Card from "./Card";
import classNames from "./App.module.css";

interface HandHistoryProps {
  handHistory: Array<{
    handType: string;
    cards: CardType[];
  }>;
  currentHandType: string | null;
}

const HandHistory: React.FC<HandHistoryProps> = ({
  handHistory,
  currentHandType,
}) => {
  const [showHistory, setShowHistory] = useState(false);

  if (handHistory.length === 0) {
    return null;
  }

  return (
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
          return <span className={classNames.noPlay}>No cards played yet</span>;
        })()}
      </div>

      {/* Expanded history */}
      {showHistory && (
        <div className={classNames.historyTimeline}>
          {[...handHistory].reverse().map((entry, index) => (
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
                  <div className={classNames.playType}>{entry.handType}</div>
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
  );
};

export default HandHistory;
