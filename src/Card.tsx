import React from "react";
import { Card as CardType } from "./types";
import classNames from './App.module.css'


interface CardProps {
  card: CardType;
  onClick?: (card: CardType) => void;
  selected?: boolean;
}

const Card: React.FC<CardProps> = ({card, onClick, selected}) => {

  const suits = {
    "Clubs": "♣",
    "Diamonds": "♦",
    "Hearts": "♥",
    "Spades": "♠"
  }
  const suitColor = card.suit === "Diamonds" || card.suit === "Hearts" ? "red" : "black";


  return (
    <div
      onClick={() => onClick && onClick(card)}
      className={`${classNames.card} ${selected ? classNames.selected : ""}`}
      style={{ color: suitColor }}
    >
      <div className={classNames.topLeft}>
        <p className={classNames.number}>{card.rank}</p>
        <p className={classNames.suit}>{suits[card.suit]}</p>
      </div>
      <div className={classNames.bottomRight}>
        <p className={classNames.number}>{card.rank}</p>
        <p className={classNames.suit}>{suits[card.suit]}</p>
      </div>
    </div>
  )
}

export default Card;