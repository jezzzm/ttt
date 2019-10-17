function aiMove() { //returns board id
  // current board information
  let b = ttt.board; // n x n board with cell values
  let wins = ttt.winMatrix(b); //n x 2n + 2 matrix with updated cell values

  // priority logic
  //for params: ai = false, human = true

  // (1) check for own two in a row
  let ownTwoInRow = filterAsRequired(false, wins, 'typeof', true);
  if (ownTwoInRow !== false) {
    console.log('going for win!');
    return ownTwoInRow;
  }
  // // (2) check for opp two in a row
  let oppTwoInRow = filterAsRequired(true, wins, 'typeof', true);
  if (oppTwoInRow !== false) {
    console.log('blocking opponent two in a row');
    return oppTwoInRow;
  }
  // (3) check if own move can create 2x two in a rows
  let ownTwoTwos = createTwoTwos(false, wins, b);
  if (ownTwoTwos !== false) {
    console.log('going for own fork');
    return ownTwoTwos;
  }
  // (4) check if opp move can create 2x two in a rows -> play such that this is blocked
  let oppTwoTwos = createTwoTwos(true, wins, b, true);
  if (oppTwoTwos !== false) {
    console.log('identified opponents chance for two twos')
    return oppTwoTwos;
  }
  // (5) play center (if imperfect ai, can play corner on first turn) TODO: toggle this
  if (typeof b[1][1] === 'number') { //expand, prioritise very midde if it exists
    console.log('playing center');
    return b[1][1];
  }
  // (6) opposite opponent corner, (7) any corner, (8) any side
  return remainingSquares(false, b)
}

function createTwoTwos(player, winMat, baseMat, forceDefense=false) {
  //build new array of valid possibilities
  let valid = filterAsRequired(player, winMat);
  //search possibilties for 2 with same number
  let nums = [];
  for (let i = 0; i < valid.length; i++) {
    for (let j = 0; j < valid[0].length; j++) { // TODO: optimise?
      let curr = valid[i][j];
      if (curr !== player) { //is a number
        if (nums.includes(curr)) { //matched with another row
          if (forceDefense) { //play CORRECT side TODO, currently playing any
            return playFirstSide(baseMat);
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
  let max = matrix.length - 1;
  //(6) take first corner opposite enemy
  let cornerPairs = [[matrix[0][0], matrix[max][max]], [matrix[0][max], matrix[max][0]]];
  let oppInCorner = cornerPairs.filter(x => x.includes(!player) && !x.includes(player) && x[0] !== x[1]);
  if (oppInCorner.length > 0) {
    console.log('playing opposite corner to opponent corner');
    return oppInCorner[0].filter(x => typeof x === 'number');
  }

  // (7) take first free corner
  let allCorners = [...cornerPairs[0],...cornerPairs[1]];
  let freeCorners = allCorners.filter(x => typeof x === 'number');
  if (freeCorners.length > 0) {
    console.log('playing first available free corner');
    return freeCorners[0];
  }

  // (8) first free side
  return playFirstSide(matrix);
}

//helpers
function getCentres(matrix) {
  let len = matrix.length
  let odd = len % 2 === 1;

}
function playFirstSide(matrix) {
  console.log('playing first free side');
  return getSides(matrix).filter(x => typeof x === 'number')[0];
}

function getSides(matrix) {
  let transposed = ttt.copyNestedArray(ttt.transpose(matrix)); //reuse transpose from game logic
  let max = matrix.length - 1;
  let sides = [
    ...rowInsides(matrix[0]), //top
    ...rowInsides(matrix[max]), //bottom
    ...rowInsides(transposed[0]), //left
    ...rowInsides(transposed[max]) //right
  ];
  return sides
}

rowInsides = (row) => row.slice(1, row.length - 1);

function filterAsRequired(player, matrix, searchFor=player, singleValue=false) {
  let valid = [];
  for (let i = 0; i < matrix.length; i++) {
    let row = matrix[i];
    let working = row.filter(x => x === !player); //no opp in row
    if (working.length === 0) {
      if (searchFor === player) {
        working = row.filter(x => x === searchFor)
      } else {
        working = row.filter(x => typeof x === 'number')
      }
      if (working.length === 1) { //1x player, 2x free
        if (!singleValue) {
          valid.push(row);
        } else {
          return working[0]
        }
      }
    }
  }
  if (!singleValue) {
    return valid;
  } else {
    return false;
  }

}
