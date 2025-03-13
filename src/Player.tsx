import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card as CardType } from "./types";
import classNames from "./App.module.css";
import Card from "./Card";
import { useGameContext } from "./GameContext";
import { getHandType } from "./HandTypeUtils";

import sortHand from "./sortHand";

interface PlayerProps {
  initialHand: CardType[];
  onPlayCards?: (cards: CardType[]) => void;
  isCurrentPlayer?: boolean;
  onPass: () => void;
  isUserControlled?: boolean;
}

const rankOrder = [
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
  "2",
];
const suitOrder = ["Spades", "Clubs", "Diamonds", "Hearts"];
const AI_PLAY_DELAY = 1000; // 1 second delay

const Player: React.FC<PlayerProps> = ({
  initialHand,
  onPlayCards,
  isCurrentPlayer,
  onPass,
  isUserControlled,
}) => {
  const [hand, setHand] = useState<CardType[]>(
    initialHand.map((card) => ({ ...card, hidden: !isUserControlled }))
  );
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);
  const [handType, setHandType] = useState<string | null>(null);
  const { setCurrentHandType, handHistory, setHandHistory } = useGameContext();

  useEffect(() => {
    setHand(
      sortHand(
        initialHand.map((card) => ({ ...card, hidden: !isUserControlled }))
      )
    );
  }, [initialHand, isUserControlled]);

  const handleCardSelect = (card: CardType) => {
    const isSelected = selectedCards.some(
      (selectedCard) =>
        selectedCard.rank === card.rank && selectedCard.suit === card.suit
    );

    const newSelectedCards = isSelected
      ? selectedCards.filter(
          (selectedCard) =>
            selectedCard.rank !== card.rank || selectedCard.suit !== card.suit
        )
      : [...selectedCards, card];

    setSelectedCards(newSelectedCards);

    setHandType(getHandType(newSelectedCards));
  };

  const checkForPossiblePairs = (cards: CardType[]): boolean => {
    const rankCounts: { [key: string]: number } = {};
    cards.forEach((card) => {
      rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
    });

    return Object.values(rankCounts).some((count) => count >= 2);
  };

  const checkForPossibleTriples = (cards: CardType[]): boolean => {
    const rankCounts: { [key: string]: number } = {};
    cards.forEach((card) => {
      rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
    });

    return Object.values(rankCounts).some((count) => count >= 3);
  };

  const checkForPossibleStraights = (cards: CardType[]): boolean => {
    const sortedRanks = cards
      .map((card) => rankOrder.indexOf(card.rank))
      .sort((a, b) => a - b);

    let consecutiveCount = 1;

    for (let i = 0; i < sortedRanks.length - 1; i++) {
      if (sortedRanks[i] + 1 === sortedRanks[i + 1]) {
        consecutiveCount++;
        if (consecutiveCount >= 3) {
          return true;
        }
      } else {
        consecutiveCount = 1;
      }
    }
    return false;
  };

  const checkForPossibleCombinations = (cards: CardType[]): string[] => {
    const possibleCombinations: string[] = [];

    if (checkForPossiblePairs(cards)) {
      possibleCombinations.push("Pair");
    }
    if (checkForPossibleTriples(cards)) {
      possibleCombinations.push("Triple");
    }
    // if (cards.length >= 4) {
    //   possibleCombinations.push("Quadruple");
    // }
    if (checkForPossibleStraights(cards)) {
      possibleCombinations.push("Straight");
    }

    return possibleCombinations;
  };

  const possibleCombinations = useMemo(
    () => checkForPossibleCombinations(hand),
    [hand]
  );

  const isCardHigher = (
    card: CardType,
    latestPlayedCard: CardType
  ): boolean => {
    const rankOrderForComparison =
      handType === "Pair" || handType === "Single"
        ? rankOrder
        : rankOrder.slice(0, -1);
    if (
      rankOrderForComparison.indexOf(card.rank) ===
      rankOrderForComparison.indexOf(latestPlayedCard.rank)
    ) {
      return (
        suitOrder.indexOf(card.suit) > suitOrder.indexOf(latestPlayedCard.suit)
      );
    }
    const isHigher =
      rankOrderForComparison.indexOf(card.rank) >
      rankOrderForComparison.indexOf(latestPlayedCard.rank);
    return isHigher;
  };

  const isCardPlayable = (cards: CardType[]): boolean => {
    const selectedHandType = getHandType(cards);
    const currentHand = handHistory[handHistory.length - 1];

    // if no cards have been played yet, any hand is playable
    if (handHistory.length === 0 && selectedHandType) {
      return true;
    }

    // check if everyone else has passed
    const consecutivePasses = handHistory.slice(-3).every((entry) => {
      return entry.cards.length === 0;
    });

    if (consecutivePasses && selectedHandType) {
      return true;
    }

    if (
      selectedHandType !== currentHand?.handType ||
      currentHand?.cards.length !== cards.length ||
      selectedHandType === null
    ) {
      return false;
    }

    // check last card of current hand and compare to last card of selected cards
    return isCardHigher(
      cards[cards.length - 1],
      currentHand.cards[currentHand.cards.length - 1]
    );
  };

  const playHand = () => {
    if (isCardPlayable(selectedCards)) {
      const newHand = hand.filter(
        (card) =>
          !selectedCards.some(
            (selectedCard) =>
              selectedCard.rank === card.rank && selectedCard.suit === card.suit
          )
      );
      setHand(newHand);
      if (onPlayCards) {
        const handType = getHandType(selectedCards);
        setCurrentHandType(handType);
        onPlayCards(selectedCards);
        setHandHistory([
          ...handHistory,
          { cards: selectedCards, handType: handType },
        ]);
        setSelectedCards([]);
      } else {
        console.error("onPlayCards not provided");
      }
    } else {
      console.error("Selected cards are not playable");
    }
  };

  const passTurn = () => {
    setSelectedCards([]);
    setHandType(null);
    onPass();
  };

  const autoSelectAndPlayCards = useCallback(() => {
    const generateCombinations = (hand: CardType[]): CardType[][] => {
      const results: CardType[][] = [];

      const generate = (start: number, combo: CardType[]): void => {
        for (let i = start; i < hand.length; i++) {
          const newCombo = [...combo, hand[i]];
          results.push(newCombo);
          generate(i + 1, newCombo);
        }
      };

      generate(0, []);
      return results;
    };

    const combinations = generateCombinations(hand);
    const playableCombinations = combinations.filter((combination) =>
      isCardPlayable(combination)
    );

    if (playableCombinations.length > 0) {
      const bestCombination = playableCombinations[0];
      console.log("bestCombination", bestCombination);
      setSelectedCards(bestCombination);
    } else {
      passTurn();
    }
  }, [hand, isCardPlayable]);

  useEffect(() => {
    if (isCurrentPlayer && !isUserControlled) {
      const timeoutId = setTimeout(() => {
        autoSelectAndPlayCards();
      }, AI_PLAY_DELAY);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isCurrentPlayer, isUserControlled, autoSelectAndPlayCards]);

  useEffect(() => {
    if (selectedCards.length > 0 && !isUserControlled) {
      const timeoutId = setTimeout(() => {
        playHand();
      }, AI_PLAY_DELAY);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [selectedCards, isUserControlled]);

  return (
    <div
      className={`${isCurrentPlayer ? classNames["active-player"] : ""} ${
        classNames.player
      }`}
    >
      {isUserControlled && <p>Your Hand</p>}
      {selectedCards.length > 0 && isCurrentPlayer && (
        <button onClick={playHand}>Play cards</button>
      )}

      {handType && <p>Hand Type: {handType}</p>}

      {isUserControlled && <p>Possible Combinations: {possibleCombinations}</p>}
      {isCurrentPlayer && handHistory.length > 0 && (
        <button onClick={passTurn} className={classNames.passBtn}>
          Pass
        </button>
      )}

      <div className={classNames.hand}>
        {hand.map((card, index) => (
          <div
            key={index}
            className={classNames.cardContainer}
            style={{ left: `${index * 30}px` }}
            onClick={() => handleCardSelect(card)}
          >
            <Card
              card={card}
              selected={selectedCards.some(
                (selectedCard) =>
                  selectedCard.rank === card.rank &&
                  selectedCard.suit === card.suit
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Player;
