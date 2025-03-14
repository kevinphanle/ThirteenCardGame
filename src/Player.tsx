import React, { useState, useEffect, useCallback } from "react";
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
  playerIndex: number;
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
  playerIndex,
}) => {
  const [hand, setHand] = useState<CardType[]>(
    initialHand.map((card) => ({ ...card, hidden: !isUserControlled }))
  );
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);
  // const [handType, setHandType] = useState<string | null>(null);
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

    // setHandType(getHandType(newSelectedCards));
  };

  // const checkForPossiblePairs = (cards: CardType[]): boolean => {
  //   const rankCounts: { [key: string]: number } = {};
  //   cards.forEach((card) => {
  //     rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
  //   });

  //   return Object.values(rankCounts).some((count) => count >= 2);
  // };

  // const checkForPossibleTriples = (cards: CardType[]): boolean => {
  //   const rankCounts: { [key: string]: number } = {};
  //   cards.forEach((card) => {
  //     rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
  //   });

  //   return Object.values(rankCounts).some((count) => count >= 3);
  // };

  // const checkForPossibleStraights = (cards: CardType[]): boolean => {
  //   const sortedRanks = cards
  //     .map((card) => rankOrder.indexOf(card.rank))
  //     .sort((a, b) => a - b);

  //   let consecutiveCount = 1;

  //   for (let i = 0; i < sortedRanks.length - 1; i++) {
  //     if (sortedRanks[i] + 1 === sortedRanks[i + 1]) {
  //       consecutiveCount++;
  //       if (consecutiveCount >= 3) {
  //         return true;
  //       }
  //     } else {
  //       consecutiveCount = 1;
  //     }
  //   }
  //   return false;
  // };

  const isCardHigherWithType = (
    card: CardType,
    latestPlayedCard: CardType,
    handTypeToUse: string | null
  ): boolean => {
    const rankOrderForComparison =
      handTypeToUse === "Pair" || handTypeToUse === "Single"
        ? rankOrder
        : rankOrder.slice(0, -1);
    // Get the indices of both cards in the rank order array
    const cardRankIndex = rankOrderForComparison.indexOf(card.rank);
    const latestCardRankIndex = rankOrderForComparison.indexOf(
      latestPlayedCard.rank
    );

    // If ranks are the same, compare by suit
    if (cardRankIndex === latestCardRankIndex) {
      return (
        suitOrder.indexOf(card.suit) > suitOrder.indexOf(latestPlayedCard.suit)
      );
    }

    // Compare by rank (higher index means higher rank)
    return cardRankIndex > latestCardRankIndex;
  };

  const isCardPlayable = (cards: CardType[]): boolean => {
    const selectedHandType = getHandType(cards);

    const currentHand = [...handHistory]
      .reverse()
      .find((entry) => entry.cards.length > 0);

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
    return isCardHigherWithType(
      cards[cards.length - 1],
      currentHand.cards[currentHand.cards.length - 1],
      selectedHandType
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
    // setHandType(null);
    onPass();
  };

  const autoSelectAndPlayCards = useCallback(() => {
    // Check if everyone has passed or no cards have been played
    const startNewHand =
      handHistory.length === 0 ||
      handHistory.slice(-3).every((entry) => entry.cards.length === 0);

    // Get the current hand that needs to be beaten (last non-pass hand)
    const currentHand = [...handHistory]
      .reverse()
      .find((entry) => entry.cards.length > 0);

    const currentHandType = currentHand?.handType;

    // If we're starting a new hand, pick the lowest single card or suitable combination
    if (startNewHand) {
      // Find the lowest single card (usually 3 of spades)
      const lowestCard = hand.length > 0 ? [hand[0]] : [];

      if (lowestCard.length > 0) {
        setSelectedCards(lowestCard);
        return;
      }

      // If no cards left, pass
      passTurn();
      return;
    }

    // If we need to beat a specific hand
    if (currentHand && currentHand.cards.length > 0) {
      // Only generate combinations of the same type and length
      const matchingCombinations = findMatchingCombinations(
        hand,
        currentHandType || ""
      );

      // Filter to only keep combinations that can beat the current hand
      const playableCombinations = matchingCombinations.filter((combo) =>
        isCardHigherWithType(
          combo[combo.length - 1],
          currentHand.cards[currentHand.cards.length - 1],
          currentHandType || ""
        )
      );

      if (playableCombinations.length > 0) {
        // Choose the lowest winning combination
        const bestCombination = playableCombinations[0]; // Assuming hand is sorted
        setSelectedCards(bestCombination);
        return;
      }
    }

    // If no playable combinations found, pass
    passTurn();
  }, [hand, handHistory, isCardPlayable]);

  // Helper function to find combinations matching a specific type and length
  const findMatchingCombinations = (
    cards: CardType[],
    handType: string
  ): CardType[][] => {
    const results: CardType[][] = [];

    // Group cards by rank for efficient combination generation
    const cardsByRank: Record<string, CardType[]> = {};
    cards.forEach((card) => {
      if (!cardsByRank[card.rank]) cardsByRank[card.rank] = [];
      cardsByRank[card.rank].push(card);
    });

    // Handle different hand types
    switch (handType) {
      case "Single":
        // For singles, just return all cards
        return cards.map((card) => [card]);

      case "Pair":
        // Find all pairs
        Object.values(cardsByRank).forEach((sameRankCards) => {
          if (sameRankCards.length >= 2) {
            // Generate pairs from cards of the same rank
            results.push(sameRankCards.slice(0, 2));
          }
        });
        return results;

      case "Triple":
        // Find all triples
        Object.values(cardsByRank).forEach((sameRankCards) => {
          if (sameRankCards.length >= 3) {
            results.push(sameRankCards.slice(0, 3));
          }
        });
        return results;

      // Add more cases as needed for other hand types

      default:
        return [];
    }
  };

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
      className={`${isCurrentPlayer ? classNames.activePlayer : ""} ${
        classNames.player
      }`}
    >
      {isUserControlled && (
        <div className={classNames.userHandArea}>
          <div className={classNames.hand}>
            {hand.map((card, index) => {
              // Calculate fan position and rotation
              const totalCards = hand.length;
              const fanAngle = 60; // Total angle of the fan in degrees
              const anglePerCard = fanAngle / Math.max(totalCards - 1, 1);
              const currentAngle = -fanAngle / 2 + anglePerCard * index;
              const isSelectedCard = selectedCards.some(
                (selectedCard) =>
                  selectedCard.rank === card.rank &&
                  selectedCard.suit === card.suit
              );

              return (
                <div
                  key={index}
                  className={`${classNames.cardContainer} ${classNames.clickable}`}
                  style={{
                    transform: `translateY(${
                      isSelectedCard ? -30 : 0
                    }px) rotate(${currentAngle}deg)`,
                    zIndex: isSelectedCard ? 100 : index,
                    left: `calc(50% - ${totalCards * 10}px + ${index * 20}px)`,
                  }}
                  onClick={() => handleCardSelect(card)}
                >
                  <Card card={card} selected={isSelectedCard} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Player avatar - show for BOTH user and AI players */}
      <div
        className={`${classNames.playerAvatar} ${
          isUserControlled ? classNames.userAvatar : ""
        }`}
      >
        {isUserControlled && <button onClick={passTurn}>Pass</button>}
        <div
          className={`${classNames.avatarIcon} ${
            isCurrentPlayer ? classNames.currentPlayer : ""
          }`}
        >
          {/* Show player number/icon */}
          {isUserControlled ? "YOU" : "P" + playerIndex}
        </div>

        {isUserControlled && (
          <button
            disabled={!isCurrentPlayer || selectedCards.length == 0}
            onClick={playHand}
          >
            Play
          </button>
        )}

        {!isUserControlled && (
          <div className={classNames.cardCount}>
            <div className={classNames.cardIcon}>
              <span>{hand.length}</span>
            </div>
          </div>
        )}

        {isCurrentPlayer && !isUserControlled && (
          <div className={classNames.playerStatus}>Thinking</div>
        )}
      </div>
    </div>
  );
};

export default Player;
