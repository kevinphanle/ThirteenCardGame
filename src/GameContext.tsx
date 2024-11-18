import React, { createContext, useContext, useState, ReactNode } from "react";
import { Card, Card as CardType } from "./types";

interface HandHistoryEntry {
    cards: CardType[];
    handType: string | null;
}

interface GameContextProps {
    playerHands: CardType[][];
    setPlayerHands: React.Dispatch<React.SetStateAction<CardType[][]>>;
    playedCards: CardType[];
    setPlayedCards: React.Dispatch<React.SetStateAction<CardType[]>>;
    currentPlayer: number;
    setCurrentPlayer: React.Dispatch<React.SetStateAction<number>>;
    currentHandType: string | null;
    setCurrentHandType: React.Dispatch<React.SetStateAction<string | null>>;
    handHistory: HandHistoryEntry[];
    setHandHistory: React.Dispatch<React.SetStateAction<HandHistoryEntry[]>>;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [playerHands, setPlayerHands] = useState<CardType[][]>([]);
    const [playedCards, setPlayedCards] = useState<CardType[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<number>(0);
    const [currentHandType, setCurrentHandType] = useState<string | null>(null);
    const [handHistory, setHandHistory] = useState<HandHistoryEntry[]>([]);

    return (
        <GameContext.Provider value={{ 
            playerHands, 
            setPlayerHands, 
            playedCards, 
            setPlayedCards, 
            currentPlayer, 
            setCurrentPlayer, 
            currentHandType, 
            setCurrentHandType,
            handHistory,
            setHandHistory
            }}>
            {children}
        </GameContext.Provider>
    );
}

export const useGameContext = (): GameContextProps => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGameContext must be used within a GameProvider");
    }
    return context;
}