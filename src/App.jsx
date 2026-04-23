import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, selectedSquare, setSelectedSquare }) {
  const currentPlayer = xIsNext ? 'X' : 'O';
  const xCount = squares.filter((square) => square === 'X').length;
  const oCount = squares.filter((square) => square === 'O').length;
  const currentPlayerCount = currentPlayer === 'X' ? xCount : oCount;
  
function handleClick(i) {
  if (calculateWinner(squares)) {
    return;
  }

  if (currentPlayerCount < 3) {
    if (squares[i]) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = currentPlayer;
    onPlay(nextSquares);
    return;
  }

  if (selectedSquare === null) {
    if (squares[i] === currentPlayer) {
      setSelectedSquare(i);
    }
    return;
  }

  if (squares[i] !== null) {
    setSelectedSquare(null);
    return;
  }

  if (!isAdjacent(selectedSquare, i)) {
    setSelectedSquare(null);
    return;
  }

  const nextSquares = squares.slice();
  nextSquares[selectedSquare] = null;
  nextSquares[i] = currentPlayer;
  const centerOccupiedByCurrentPlayer = squares[4] === currentPlayer;
  const vacatesCenter = selectedSquare === 4;
  const winsMove = calculateWinner(nextSquares) === currentPlayer;
  if (centerOccupiedByCurrentPlayer && !vacatesCenter && !winsMove) {
    setSelectedSquare(null);
    return;
  }
  setSelectedSquare(null);
  onPlay(nextSquares);
}

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function isAdjacent(from, to) {

  const fromRow = Math.floor(from / 3);
  const fromCol = from % 3;
  const toRow = Math.floor(to / 3);
  const toCol = to % 3;
  const rowDiff = Math.abs(fromRow - toRow);
  const colDiff = Math.abs(fromCol - toCol);
  return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0);
}

export default function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

return (
  <div className="game">
    <div className="game-board">
      <Board
        xIsNext={xIsNext}
        squares={currentSquares}
        onPlay={handlePlay}
        selectedSquare={selectedSquare}
        setSelectedSquare={setSelectedSquare}
        />
      </div>
    <div className="game-info">
      <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}
