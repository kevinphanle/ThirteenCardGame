import React from "react";
import { Card as CardType } from "./types";
import styles from './App.module.css'


interface CardProps {
  card: CardType;
  onClick?: (card: CardType) => void;
  selected?: boolean;
}

const Card: React.FC<CardProps> = ({card, onClick, selected}) => {

  const suitColor = card.suit === "Diamonds" || card.suit === "Hearts" ? "red" : "black";

  const renderSuitArea = () => {
    let len = 0;
    let gridColumns = 1;
    let suitAreaClass = styles.suitArea;

    switch (card.rank) {
      case 'A':
        len = 1;
        gridColumns = 1;
        break;
      case '2':
        len = 2;
        gridColumns = 1;
        break;
      case '3':
        len = 3;
        gridColumns = 1;
        break;
      case '4':
        len = 4;
        gridColumns = 2;
        break;
      case '5':
        len = 5;
        suitAreaClass = `${styles.suitArea} ${styles.five}`;
        break;
      case '6':
        len = 6;
        gridColumns = 2;
        break;
      case '7':
        len = 7;
        suitAreaClass = `${styles.suitArea} ${styles.seven}`;
        break;
      case '8':
        len = 8;
        gridColumns = 2;
        break;
      case '9':
        len = 9;
        gridColumns = 3;
        break;
      case '10':
        len = 10;
        gridColumns = 3;
        break;
      case 'J':
      case 'Q':
      case 'K':
        return (
          <div className={styles.suitArea}>
            <span className={styles.rank}>{card.rank}</span>
          </div>
        );
      default:
        len = parseInt(card.rank);
        gridColumns = Math.ceil(len / 2);
    }

    return (
      <div 
        className={suitAreaClass}
        >
        {Array.from({ length: len }).map((_, index) => (
          <div 
            key={index} 
            className={`${styles.suit} ${styles[card.suit]}`}
          >
            
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      onClick={() => onClick && onClick(card)}
      className={`${styles.card} ${selected ? styles.selected : ""}`}
      style={{ color: suitColor }}
    >
      <div className={styles.topLeft}>
        <p className={styles.number}>{card.rank}</p>
        <div className={`${styles.suit} ${styles[card.suit]}`} ></div>
      </div>

      <div className={styles.centerArea}>
        {renderSuitArea()}
      </div>

      <div className={styles.bottomRight}>
        <p className={styles.number}>{card.rank}</p>
        <div className={`${styles.suit} ${styles[card.suit]}`} ></div>
      </div>
    </div>
  )
}

export default Card;