import { useState } from 'react'

const BOARD_SIZE = 10
const MINE_COUNT = 15

function createBoard() {
  const board = Array(BOARD_SIZE).fill(null).map(() =>
    Array(BOARD_SIZE).fill(null).map(() => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0
    }))
  )

  let minesPlaced = 0
  while (minesPlaced < MINE_COUNT) {
    const row = Math.floor(Math.random() * BOARD_SIZE)
    const col = Math.floor(Math.random() * BOARD_SIZE)
    if (!board[row][col].isMine) {
      board[row][col].isMine = true
      minesPlaced++
    }
  }

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (!board[row][col].isMine) {
        let count = 0
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue
            const nr = row + dr
            const nc = col + dc
            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
              if (board[nr][nc].isMine) count++
            }
          }
        }
        board[row][col].adjacentMines = count
      }
    }
  }

  return board
}

function revealCell(board, row, col) {
  const newBoard = board.map(r => r.map(cell => ({ ...cell })))
  const cell = newBoard[row][col]

  if (cell.isRevealed || cell.isFlagged) return newBoard

  cell.isRevealed = true

  if (cell.adjacentMines === 0 && !cell.isMine) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = row + dr
        const nc = col + dc
        if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
          revealCell(newBoard, nr, nc)
        }
      }
    }
  }

  return newBoard
}

function checkWin(board) {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = board[row][col]
      if (!cell.isMine && !cell.isRevealed) return false
    }
  }
  return true
}

export default function App() {
  const [board, setBoard] = useState(() => createBoard())
  const [gameStatus, setGameStatus] = useState('playing')

  const handleLeftClick = (row, col) => {
    if (gameStatus !== 'playing') return

    const cell = board[row][col]
    if (cell.isMine) {
      setBoard(board.map(r => r.map(c => ({ ...c, isRevealed: true }))))
      setGameStatus('lost')
      return
    }

    const newBoard = revealCell(board, row, col)
    setBoard(newBoard)

    if (checkWin(newBoard)) {
      setGameStatus('won')
    }
  }

  const handleRightClick = (e, row, col) => {
    e.preventDefault()
    if (gameStatus !== 'playing') return

    const newBoard = board.map(r => r.map(cell => ({ ...cell })))
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged
    setBoard(newBoard)
  }

  const resetGame = () => {
    setBoard(createBoard())
    setGameStatus('playing')
  }

  const getCellContent = (cell) => {
    if (cell.isFlagged) return '🚩'
    if (!cell.isRevealed) return ''
    if (cell.isMine) return '💣'
    if (cell.adjacentMines > 0) return cell.adjacentMines
    return ''
  }

  const getStatusMessage = () => {
    if (gameStatus === 'won') return '🎉 You Won!'
    if (gameStatus === 'lost') return '💥 Game Over!'
    return ''
  }

  const getNumberColor = (number) => {

    switch(number){

        case 1:
            return "#2196F3";

        case 2:
            return "#4CAF50";

        case 3:
            return "#F44336";

        case 4:
            return "#3F51B5";

        case 5:
            return "#795548";

        case 6:
            return "#009688";

        case 7:
            return "#000000";

        case 8:
            return "#9E9E9E";

        default:
            return "white";
    }

  }

  return (
    <div className="game-container">
      <h1>💣 Minesweeper</h1>
      <div className="status">{getStatusMessage()}</div>
      <div className="controls">
        <button onClick={resetGame}>🔄 New Game</button>
      </div>
      <div className="board-wrapper">
        <div className="board" onContextMenu={(e) => e.preventDefault()}>
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`cell ${cell.isRevealed ? 'revealed' : ''} ${cell.isMine && cell.isRevealed ? 'mine' : ''}`}
                onClick={() => handleLeftClick(rowIndex, colIndex)}
                onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
              >
                <span
                  style={{
                    color: getNumberColor(cell.adjacentMines)
                  }}
                > 
                  {getCellContent(cell)}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
      </div>
  )
}