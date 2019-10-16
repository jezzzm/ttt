// 0: [0, 1, 2]
// 1: [3, 4, 5]
// 2: [6, 7, 8]
// 3: [0, 3, 6]
// 4: [1, 4, 7]
// 5: [2, 5, 8]
// 6: [0, 4, 8]
// 7: [2, 4, 6]

function aiMove() {
  // current board information
  let b = ttt.board; // n x n board with cell values
  let ids = ttt.boardID; //n x 2n + 2 matrix with unchanging cell IDs
  let wins = ttt.winMatrix(b); //n x 2n + 2 matrix with updated cell values

  // priority logic
  //for params: ai = false, human = true

  // (1) check for own two in a row
  let ownTwoInRow = checkTwoInRow(false, wins); //return false if not available, id if available
  if (ownTwoInRow !== false) {
    console.log('going for win!');
    return ownTwoInRow;
  }
  // // (2) check for opp two in a row
  // // -> same fn, pass player param
  let oppTwoInRow = checkTwoInRow(true, wins);
  if (oppTwoInRow !== false) {
    console.log('blocking opponent two in a row');
    return oppTwoInRow;
  }
  // (3) check if own move can create 2x two in a rows
  // -> filter to only include rows with 1x own and 2x free, search for same id across 2 of these
  let ownTwoTwos = createTwoTwos(false, wins);
  if (ownTwoTwos !== false) {
    console.log('going for own fork');
    return ownTwoTwos;
  }
  // (4) check if opp move can create 2x two in a rows
  // -> as above, same fn, pass player param. prioritise playing (4) to create (3). and then creating (1)
  let oppTwoTwos = createTwoTwos(true, wins, true);
  if (oppTwoTwos !== false) {
    console.log('identified opponents chance for two twos')
    return oppTwoTwos
  }
  // (5) play center (if imperfect ai, can play corner on first turn)
  if (typeof b[1][1] === 'number') {
    console.log('playing center');
    return b[1][1];
  }
  // (6) -> (8)
  return remainingSquares(false, wins)
}

function checkTwoInRow(player, matrix) {
  // console.log('player: ', player);
  for (let i = 0; i < matrix.length; i++) {
    let row = matrix[i];
    let working = row.filter(x => x === !player); //no opp in row
    // console.log('current row: ', row);
    // console.log('continue if empty: ', working);
    if (working.length === 0) { //first step possibility
      working = row.filter(x => typeof x === 'number');
      // console.log('continue if one number only: ', working)
      if (working.length === 1) { //one more to get
        return working[0];
      }
    }
  }
  return false;
}

function createTwoTwos(player, matrix, forceDefense=false) {
  // console.log('player: ', player);
  let valid = [];
  //build new array of valid possibilities
  for (let i = 0; i < matrix.length; i++) {
    let row = matrix[i];
    // console.log(row);
    let working = row.filter(x => x === !player); //no opp in row
    if (working.length === 0) {
      working = row.filter(x => x === player)
      if (working.length === 1) { //1x player, 2x free
        // console.log('1 done, 2 free')
        valid.push(row);
      }
    }
  }
  // console.log(valid);
  //search possibilties for 2 with same number
  let nums = [];
  for (let i = 0; i < valid.length; i++) {
    // console.log('checking row: ', valid[i]);
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

  //(6) take first corner opposition enemy
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
}

function playFirstSide(matrix) {
  let allSides = [matrix[0][1], matrix[1][0], matrix[1][2], matrix[2][1]];
  console.log('playing first free side');
  return allSides.filter(x => typeof x === 'number')[0];
}
