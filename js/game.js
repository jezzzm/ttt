const statusCodes = {
  INVALID: 0,
  VALID: 1,
  DRAW: null,
  PLAYER1WIN: true,
  PLAYER2WIN: false
}
const ttt = {

  //GAME PROPS
  board: [ [0, 1, 2], [3, 4, 5], [6, 7, 8] ], //basic 3x3 board to begin
  player: true, //true for player 1, false for player 2 (or computer).
  turnCount: 0,
  moves: [], // store: [[player, row, col],...]
  status: statusCodes.VALID, //game status - see statusCodes obj

  // GAMEPLAY LOGIC
  play: function(pos) { //update game board if valid, log to console if not
    if (this.status === 0 || this.status === 1) { // can only play if game isn't over
      let coords = this.validMove(pos);
      if (!coords) { //invalid move
        return this.status = statusCodes.INVALID;
      }
      this.moves.push([this.player, ...coords]);
      this.board[coords[0]][coords[1]] = this.player;
      let result = this.winCheck();
      this.print();
      if (result === null) {
        this.turnCount++
        if (this.turnCount === 9) { //this is the last move that may be played - draw
          return this.status = statusCodes.DRAW;
        }
        this.player = !this.player //toggle to next player
        return this.status = statusCodes.VALID;
      } else { //game is over, winner is true or false
        return this.status = result;
      }
    } else {
      console.log('else');
    }
  },

  // MOVE VALIDATION

  validMove: function(pos) { //must be played on 'empty' square
    let coords = this.getSquare(pos);
    let sq = this.board[coords[0]][coords[1]];
    return sq === true || sq === false ? false : coords;

  },

  getSquare: function(pos) { //input pos 0-8, return coords as [row, col]
    let multiplier = Math.floor(pos/3);
    return [multiplier, pos - 3 * multiplier];
  },

  // WIN LOGIC

  winCheck: function() { // if it returns 'o' or 'x' we have a winner
    let all = [] // matrix of size 8 x 3 representing all winning possibilities
    all.push(...this.board, ...this.transpose(this.board), ...this.diagonals(this.board));
    return this.checkRows(all);
  },

  checkRows: function(matrix) { //doesn't need to be a square matrix
    let winner = null;
    for (let i = 0; i < matrix.length; i++) { //number of rows in matrix
      winner = this.checkRow(matrix[i]);
      if (winner !== null) {
        return winner;
      }
    }
    return winner;
  },

  checkRow: function(row) {
    let checked = row.filter(x => x !== row[0]) //only add if not same as first item
    return checked.length === 0 ? row[0] : null; //we have match if nothing in array
  },

  transpose: function(matrix) {
    //take index of columns from first row, use to map matching indices from each row to new row
    // must be square matrix
    return matrix[0].map((_, i) => matrix.map(x => x[i]));
  },

  diagonals: function(matrix) {
    let diagonals = [[],[]]; // only ever 2 winning diagonals
    for (let i = 0; i < matrix.length; i++) {
      diagonals[0].push(matrix[i][i]); //top left to bottom right
      diagonals[1].push(matrix[i][matrix[0].length - 1 - i]); //top right to bottom left
    }
    return diagonals;
  },

  //UTILITY METHODS
  print: function() {
    return console.log(this.board.join('\n'));
  },

  reset: function() {
    this.turnCount = 0;
    this.board = [ [0, 1, 2], [3, 4, 5], [6, 7, 8] ];
    this.player = true;
    this.status = 1;
    this.moves = [];
  }
}

// ttt.play(1);
// ttt.play(2);
// ttt.play(7);
// ttt.play(4);
// ttt.play(4);
// ttt.play(5);
// ttt.play(3);
// ttt.play(6);
// ttt.play(8);
// ttt.play(8);
// ttt.play(0);
