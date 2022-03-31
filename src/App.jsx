import { useEffect, useState } from "react";
import "./App.css";
import Board from "./Board/Board";
import Square from "./Square/Square";

const defaultSquare = () => new Array(9).fill(null);

const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function App() {
  const [squares, setSquare] = useState(defaultSquare());
  const [winner, setWinner] = useState(null);
  function handleSquareClick(index) {
    const isPLayerTurn =
      squares.filter((square) => square !== null).length % 2 === 0;
    if (isPLayerTurn && squares[index] === null) {
      let newSquares = squares;
      newSquares[index] = "x";
      setSquare([...newSquares]);
    }
  }

  useEffect(() => {
    const isComputerTurn =
      squares.filter((square) => square !== null).length % 2 === 1;
    const linesThatAre = (a, b, c) => {
      return lines.filter((sqareIndexes) => {
        const squareValues = sqareIndexes.map((index) => squares[index]);
        return (
          JSON.stringify([a, b, c].sort()) ===
          JSON.stringify(squareValues.sort())
        );
      });
    };
    const emptyIndexes = squares
      .map((square, index) => (square === null ? index : null))
      .filter((value) => value !== null);
    const computerWon = linesThatAre("o", "o", "o").length > 0;
    const playerWon = linesThatAre("x", "x", "x").length > 0;
    if (playerWon) {
      setWinner("X");
      newGame();
      return;
    } else if (computerWon) {
      setWinner("O");
    } else {
      if (squares.every((square) => square !== null)) {
        newGame();
        return;
      }
    }
    const putComputerAt = (index) => {
      let newSquares = squares;
      newSquares[index] = "o";
      setSquare([...newSquares]);
    };

    if (isComputerTurn) {
      const winingLines = linesThatAre("o", "o", null);
      if (winingLines.length > 0) {
        const winIndex = winingLines[0].filter(
          (index) => squares[index] === null
        )[0];
        putComputerAt(winIndex);
        return;
      }

      const linesToBlock = linesThatAre("x", "x", null);
      if (linesToBlock.length > 0) {
        const blockIndex = linesToBlock[0].filter(
          (index) => squares[index] === null
        )[0];
        putComputerAt(blockIndex);
        return;
      }

      const linesToContinue = linesThatAre("o", null, null);
      if (linesToContinue.length > 0) {
        putComputerAt(
          linesToContinue[0].filter((index) => squares[index] === null)[0]
        );
        return;
      }

      const randomIndex =
        emptyIndexes[Math.ceil(Math.random() * emptyIndexes.length)];
      putComputerAt(randomIndex);
    }
  }, [squares]);

  const emptyArray = defaultSquare();

  function newGame() {
    setSquare([...emptyArray]);

    if (winner !== null) {
      setWinner(null);
    }
  }
  return (
    <main>
      <Board>
        {squares.map((square, index) => (
          <Square
            x={square === "x" ? 1 : 0}
            o={square === "o" ? 1 : 0}
            onClick={() => handleSquareClick(index)}
          />
        ))}
      </Board>
      {!!winner && winner === "X" && (
        <div className="result green">You WON!</div>
      )}
      {!!winner && winner === "O" && (
        <div className="result red">You LOST.</div>
      )}
      <div className="button">
        <button className="start__btn" onClick={newGame}>
          Start new game!
        </button>
      </div>
    </main>
  );
}

export default App;
