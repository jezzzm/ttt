function aiMove() { //returns board id
  // current board information
  let b = ttt.board; // n x n board with cell values
  let wins = ttt.winMatrix(b); //n x 2n + 2 matrix with updated cell values

  // priority logic
  //for params: ai = false, human = true

  // (1) check for own two in a row
  let ownTwoInRow = checkTwoInRow(false, wins);
  if (ownTwoInRow !== false) {
    console.log('going for win!');
    return ownTwoInRow;
  }
  // // (2) check for opp two in a row
  let oppTwoInRow = checkTwoInRow(true, wins);
  if (oppTwoInRow !== false) {
    console.log('blocking opponent two in a row');
    return oppTwoInRow;
  }
  // (3) check if own move can create 2x two in a rows
  let ownTwoTwos = createTwoTwos(false, wins);
  if (ownTwoTwos !== false) {
    console.log('going for own fork');
    return ownTwoTwos;
  }
  // (4) check if opp move can create 2x two in a rows -> play such that this is blocked
  let oppTwoTwos = createTwoTwos(true, wins, true);
  if (oppTwoTwos !== false) {
    console.log('identified opponents chance for two twos')
    return oppTwoTwos
  }
  // (5) play center (if imperfect ai, can play corner on first turn) TODO: toggle this
  if (typeof b[1][1] === 'number') {
    console.log('playing center');
    return b[1][1];
  }
  // (6) opposite opponent corner, (7) any corner, (8) any side
  return remainingSquares(false, wins)
}

function checkTwoInRow(player, matrix) {
  for (let i = 0; i < matrix.length; i++) {
    let row = matrix[i];
    let working = row.filter(x => x === !player); //no opp in row
    if (working.length === 0) { //first step possibility
      working = row.filter(x => typeof x === 'number');
      if (working.length === 1) { //one more to get
        return working[0];
      }
    }
  }
  return false;
}

function createTwoTwos(player, matrix, forceDefense=false) {
  //build new array of valid possibilities
  let valid = [];
  for (let i = 0; i < matrix.length; i++) {
    let row = matrix[i];
    let working = row.filter(x => x === !player); //no opp in row
    if (working.length === 0) {
      working = row.filter(x => x === player)
      if (working.length === 1) { //1x player, 2x free
        valid.push(row);
      }
    }
  }
  //search possibilties for 2 with same number
  let nums = [];
  for (let i = 0; i < valid.length; i++) {
    for (let j = 0; j < valid[0].length; j++) { // TODO: optimise
      let curr = valid[i][j];
      if (curr !== player) { //is a number
        if (nums.includes(curr)) { //matched with another row
          if (forceDefense) { //play any side
            return playFirstSide(matrix);
          }
          return curr;
        } else {
          nums.push(curr);
        }
      }
    }
  }
  return false;
}

function remainingSquares(player, matrix) {

  //(6) take first corner opposite enemy
  let cornerPairs = [[matrix[0][0], matrix[2][2]], [matrix[0][2], matrix[2][0]]];
  let oppInCorner = cornerPairs.filter(x => x.includes(!player) && !x.includes(player) && x[0] !== x[1]);
  if (oppInCorner.length > 0) {
    console.log('playing opposite corner to opponent corner');
    return oppInCorner[0].filter(x => typeof x === 'number');
  }

  // (7) take first free corner
  let allCorners = [matrix[0][0], matrix[2][2], matrix[0][2], matrix[2][0]];
  let freeCorners = allCorners.filter(x => typeof x === 'number');
  if (freeCorners.length > 0) {
    console.log('playing first available free corner');
    return freeCorners[0];
  }

  // (8) first free side
  return playFirstSide(matrix);

  //TODO: need else for 4x size
}

function playFirstSide(matrix) {
  let allSides = [matrix[0][1], matrix[1][0], matrix[1][2], matrix[2][1]];
  console.log('playing first free side');
  return allSides.filter(x => typeof x === 'number')[0];
}
