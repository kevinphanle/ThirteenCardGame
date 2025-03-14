import React, { createContext, useContext, useState, ReactNode } from "react";
import { Card as CardType, GameContextProps, HandHistoryEntry } from "./types";

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [playerHands, setPlayerHands] = useState<CardType[][]>([]);
  const [playedCards, setPlayedCards] = useState<CardType[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<number>(0);
  const [currentHandType, setCurrentHandType] = useState<string | null>(null);
  const [handHistory, setHandHistory] = useState<HandHistoryEntry[]>([]);

  return (
    <GameContext.Provider
      value={{
        playerHands,
        setPlayerHands,
        playedCards,
        setPlayedCards,
        currentPlayer,
        setCurrentPlayer,
        currentHandType,
        setCurrentHandType,
        handHistory,
        setHandHistory,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = (): GameContextProps => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
