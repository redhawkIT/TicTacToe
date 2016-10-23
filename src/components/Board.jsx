import React, {Component, PropTypes} from 'react'
import Square from './Square'

class Board extends Component {
  renderSquare(i) {
    const squares = this.props.squares
    return <Square value={squares[i]} onClick={() => this.props.onClick(i)} />
  }
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    )
  }
}

Board.propTypes = {
  squares: PropTypes.array.isRequired
}

export default Board
