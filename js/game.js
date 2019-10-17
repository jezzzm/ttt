const statusCodes = {
  INVALID: 0,
  VALID: 1,
  DRAW: null,
  PLAYER1WIN: true,
  PLAYER2WIN: false,
  COMPLETE: -1
}

const ttt = {

  //GAME PROPS /////////////////////////////////////////////////////////////////
  board: [], //main board which is updated as players make moves
  boardID: [], //copy of current board which keeps IDs of each cell for later reference
  player: true, //true for player 1, false for player 2 (or computer).
  turnCount: 0,
  moves: [], // shape: [[player, row, col],...]
  status: statusCodes.VALID, //game status - see statusCodes obj
  score: [0,0], //player one, player two
  winAxis: null, //index of winning axis

  // GAMEPLAY LOGIC ////////////////////////////////////////////////////////////
  play: function(pos) { //update game board if valid, log to console if not
    if (this.status === 0 || this.status === 1) { // can only play if game isn't over
      let coords = this.validMove(pos);
      if (!coords) { //invalid move
        return this.status = statusCodes.INVALID;
      }
      this.moves.push([this.player, ...coords]);
      this.board[coords[0]][coords[1]] = this.player; //update board
      let [result, axis] = this.winCheck(); //if win: [true or false, winning axis on board], else [null, null]
      this.winAxis = axis;
      if (result === null) {
        this.turnCount++
        if (this.turnCount === this.board.length ** 2) { //this is the last move that may be played - draw
          return this.status = statusCodes.DRAW;
        }
        this.player = !this.player //toggle to next player
        return this.status = statusCodes.VALID;
      } else { //game is over, winner is true or false
        result ? this.score[0]++ : this.score[1]++;
        return this.status = result;
      }
    } else {
      return this.status = statusCodes.COMPLETE;
    }
  },

  // MOVE VALIDATION ///////////////////////////////////////////////////////////
  validMove: function(pos) { //must be played on 'empty' square
    let coords = this.getSquare(pos);
    let sq = this.board[coords[0]][coords[1]];
    return sq === true || sq === false ? false : coords;

  },

  // WIN LOGIC /////////////////////////////////////////////////////////////////
  winCheck: function() { // if it returns 'o' or 'x' we have a winner
    let all = this.winMatrix(this.board);
    return this.checkRows(all);
  },

  winMatrix: function(matrix) {  //shape: R: sideLength(sL), C: 2x sL + 2
    return [...matrix, ...this.transpose(matrix), ...this.diagonals(matrix)];
  },

  checkRows: function(matrix) {
    for (let i = 0; i < matrix.length; i++) {
      let winner = this.checkRow(matrix[i]);
      if (winner !== null) {
        return [winner, i];
      }
    }
    return [null, null]; //if no match on current board
  },

  checkRow: function(row) {
    let checked = row.filter(x => x !== row[0]) //only add if not same as first item
    return checked.length === 0 ? row[0] : null; //we have match if nothing in array
  },

  transpose: (matrix) => matrix[0].map((_, i) => matrix.map(x => x[i])),

  diagonals: function(matrix) {
    let diagonals = [[],[]]; // only ever 2 winning diagonals
    for (let i = 0; i < matrix.length; i++) {
      diagonals[0].push(matrix[i][i]); //top left to bottom right
      diagonals[1].push(matrix[i][matrix[0].length - 1 - i]); //top right to bottom left
    }
    return diagonals;
  },

  //HELPER METHODS /////////////////////////////////////////////////////////////
  getSquare: function(pos) { //input pos 0 -> n^2 - 1, return coords as [row, col]
    let side = this.board[0].length;
    let multiplier = Math.floor(pos/side);
    return [multiplier, pos - side * multiplier];
  },

  copyNestedArray: (arr) => arr.map(x => x.slice()), //prevent reference to OG arr

  createBoard: function(side) {
    let count = 0;
    return [...Array(side)].map((_, i) => {
      let row = [];
      for (let j = 0; j < side; j++) {
        row.push(side * i + count);
        count++
      }
      count = 0;
      return row;
    });
  },

  reset: function(side=this.board.length) {
    this.turnCount = 0;
    this.player = true;
    this.status = 1;
    this.moves = [];
    this.winAxis = null;
    this.board = this.createBoard(side);
    this.boardID = this.copyNestedArray(this.winMatrix(this.board));
  },

  resetScore: function() {
    this.score = [0,0];
  }
};
