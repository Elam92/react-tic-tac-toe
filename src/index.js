import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Functional Component.
function Square(props) {
  var className = "square";
  if(props.winner) {
    className = "square winner";
  }
  
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    var winPos = false;
    if(this.props.winner != null && this.props.winner.indexOf(i) > -1) {
      winPos = true;
    }
    return (
      <Square key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            winner={winPos}
      />);
  }

  createBoard() {
    var rows = [];
    for(var i = 0; i < 3; i++) {
      var squares = []
      for(var j = 0; j < 3; j++) {
        squares.push(this.renderSquare((3*i)+j));
      }
      rows.push(<div key={i} className="board-row">{squares}</div>);
    }
    return rows;
  }

  render() {
    return (
        this.createBoard()
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        isX: true
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    
    // If winner or if space is already occupied.
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        isX : !this.state.xIsNext
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // Renders the move list.
    const moves = history.map((step, move) => {
      const isX = (step.isX) ? 'X' : 'O';
      const desc = move ? 'Go to move #' + move + ' (' + isX + '\'s turn)' : 'Go to game start';
      // Highlight current move.
      const curMov = (move === this.state.stepNumber) ? 'move-current' : '';
      return (
        <li key={move}>
          <button className={curMov} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    // The status of whose turn it is or if there is a winner.
    let status;
    if (winner) {
      status = 'Winner: ' + winner.winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    var board = React.createElement(Board, {
      squares: current.squares, 
      onClick: (i) => this.handleClick(i),
      winner: winner ? winner.position : null
    }, null);
    return (
      <div className="game">
        <div className="game-board">
          {board}
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
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
      return { winner: squares[a], position: lines[i] };
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
