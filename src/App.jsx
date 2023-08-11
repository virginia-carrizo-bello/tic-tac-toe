import { useState } from 'react'
import './App.css'
import { TURNS } from './constant.js'
import confetti from 'canvas-confetti'
import { checkWinner, checkEndGame } from './logic/board'
import { WinnerModal } from './components/WinnerModal'
import { Board } from './components/Board'
import { Turn } from './components/Turn'
import { saveGame } from './logic/storage'

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) :
      Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  })

  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGame()
  }

  const updateBoard = (index) => {
    if (board[index] || winner) return

    const newTurn = turn == TURNS.O ? TURNS.X : TURNS.O
    setTurn(newTurn)

    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    //Guardar la partida
    saveGame({
      board: newBoard,
      turn: newTurn
    })

    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      confetti()
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  }

  return (
    <>
      <main className='board'>
        <h1>Tic tac toe</h1>
        <button onClick={resetGame}>Reset game</button>

        <Board board={board} updateBoard={updateBoard} />

        <Turn turn={turn} />

        <WinnerModal winner={winner} resetGame={resetGame} />
      </main>
    </>
  )
}

export default App
