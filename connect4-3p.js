class Game {
  constructor(height, width, ...players) {
    this.height = height;
    this.width = width;
    this.playerList = [...players];
    this.playerIndex = 0;
    this.currPlayer = this.playerList[this.playerIndex];
    this.board = [];
    this.gameRunning = true;
  }

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById('board');
  
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));
  
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }
  }
  
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {

    let piece = this.currPlayer.makePiece();

    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    this.gameRunning = false;
    alert(msg);
  }

  handleClick(evt) {
    if (!this.gameRunning) return;

    // get x from ID of clicked cell
    const x = +evt.target.id;
  
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.color} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players

    // increase index
    this.playerIndex = this.playerIndex < this.playerList.length - 1 ? this.playerIndex += 1 : 0;
    this.currPlayer = this.playerList[this.playerIndex];
  }

  checkForWin() {
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }

    let boundWin = _win.bind(this);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (boundWin(horiz) || boundWin(vert) || boundWin(diagDR) || boundWin(diagDL)) {
          return true;
        }
      }
    }
  }

}

class Player {

  constructor(color) {
    this.color = color;
  }

  makePiece() {

    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.color;

    return piece;

  }

} 

function makePlayers() {
  let playerList = [];

  let p1Input = document.querySelector(".p1Color").value
  let p2Input = document.querySelector(".p2Color").value

  playerList.push(new Player(p1Input))
  playerList.push(new Player(p2Input))

  playerList.push(new Player("black"))
  
  return playerList;
}

function clearBoard() {
  let board = document.getElementById('board');
  board.innerHTML = '';
}

function clearInputs() {
  
  document.querySelector(".p1Color").value = ""
  document.querySelector(".p2Color").value = ""
}

function newGame() {
  clearBoard();

  let playerList = makePlayers();
  let game = new Game(6, 7, ...playerList);
  game.makeBoard();
  game.makeHtmlBoard();
  clearInputs();
}

document
  .getElementById('new-game')
  .addEventListener('click', newGame);
