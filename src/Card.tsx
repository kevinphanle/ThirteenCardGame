import React from "react";
import { Card as CardType } from "./types";
import styles from "./App.module.css";

interface CardProps {
  card: CardType;
  onClick?: (card: CardType) => void;
  selected?: boolean;
}

const Card: React.FC<CardProps> = ({ card, onClick, selected }) => {
  const suitColor =
    card.suit === "Diamonds" || card.suit === "Hearts" ? "red" : "black";

  const renderSuitArea = () => {
    let len = 0;
    let suitAreaClass = styles.suitArea;
    const obj = {
      J: "jack",
      Q: "queen",
      K: "king",
    };

    switch (card.rank) {
      case "A":
        len = 1;
        suitAreaClass = `${styles.suitArea} ${styles.ace}`;
        break;
      case "2":
        len = 2;
        suitAreaClass = `${styles.suitArea} ${styles.two}`;
        break;
      case "3":
        len = 3;
        suitAreaClass = `${styles.suitArea} ${styles.three}`;
        break;
      case "4":
        len = 4;
        suitAreaClass = `${styles.suitArea} ${styles.four}`;
        break;
      case "5":
        len = 5;
        suitAreaClass = `${styles.suitArea} ${styles.five}`;
        break;
      case "6":
        len = 6;
        suitAreaClass = `${styles.suitArea} ${styles.six}`;
        break;
      case "7":
        len = 7;
        suitAreaClass = `${styles.suitArea} ${styles.seven}`;
        break;
      case "8":
        len = 8;
        suitAreaClass = `${styles.suitArea} ${styles.eight}`;
        break;
      case "9":
        len = 9;
        suitAreaClass = `${styles.suitArea} ${styles.nine}`;
        break;
      case "10":
        len = 10;
        suitAreaClass = `${styles.suitArea} ${styles.ten}`;
        break;
      case "J":
      case "Q":
      case "K":
        suitAreaClass = `${styles.suitArea} ${styles[obj[card.rank]]}`;
        return (
          <div className={suitAreaClass}>
            <div
              className={`${styles.suit} ${styles[card.suit]} ${
                styles[obj[card.rank]]
              }`}
            ></div>
          </div>
        );
      default:
        len = parseInt(card.rank);
    }

    return (
      <div className={suitAreaClass}>
        {Array.from({ length: len }).map((_, index) => (
          <div
            key={index}
            className={`${styles.suit} ${styles[card.suit]}`}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <div
      onClick={() => onClick && onClick(card)}
      className={`${styles.card} ${selected ? styles.selected : ""} ${
        card.hidden ? styles.hidden : ""
      }`}
      style={{ color: suitColor }}
    >
      {card.hidden ? (
        <div className={styles.cardBack}>
          <div className={styles.cardBackPattern}></div>
        </div>
      ) : (
        <React.Fragment>
          <div className={styles.topLeft}>
            <p className={styles.number}>{card.rank}</p>
            <div className={`${styles.suit} ${styles[card.suit]}`}></div>
          </div>

          <div className={styles.centerArea}>{renderSuitArea()}</div>

          <div className={styles.bottomRight}>
            <p className={styles.number}>{card.rank}</p>
            <div className={`${styles.suit} ${styles[card.suit]}`}></div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default Card;
