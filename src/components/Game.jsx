import React, {Component} from 'react'
import Board from './Board'
import {calculateWinner} from '../helpers'

class Game extends Component {
  constructor() {
    super()
    this.state = {
      history: [{
        squares: Array(9).fill(''),
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    let {history, stepNumber, xIsNext} = this.state
    let current = history.slice(0, stepNumber + 1)[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) {
      return
    }

    squares[i] = xIsNext ? 'X' : 'O'

    this.setState({
      history: history.concat([{squares}]),
      stepNumber: history.length,
      xIsNext: !xIsNext,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    })
  }

  render() {
    const {history, stepNumber, xIsNext} = this.state
    const current = history[stepNumber]

    const winner = calculateWinner(current.squares)
    let status
    if (winner) {
      status = 'Winner: ' + winner
    } else {
      status = 'Next player: ' + (xIsNext ? 'X' : 'O')
    }

    const moves = history.map((step, move) => {
      const desc = move ?
        'Move #' + move :
        'Game start'
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      )
    })

    return (
      <div className="game">
        <div>
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

export default Game
