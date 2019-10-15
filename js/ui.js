//read from last element in the moves array as pushed to by the game logic
//functions to adjust ai, triggered in the ttt game object

//listeners/elements
let reset = document.getElementById('reset');
reset.addEventListener('click', doReset);
let notice = document.getElementById('notice');

let expand = document.getElementById('expand');
expand.addEventListener('click', () => changeBoard(1));

let reduce = document.getElementById('reduce');
reduce.addEventListener('click', () => changeBoard(-1));

let board = document.getElementById('board');

//initial board setup
for (let i = 0; i <= 8; i++) { //change to length of
  let el = getSquare(i);
  el.className = 'free';
  let id = parseInt(el.id.slice(2)); //strip off 'sq' and create int
  el.addEventListener('click', () => squareClick(id));
}


// functions for listener callbacks
function squareClick(id) {
  let outcome = ttt.play(id);
  console.log(ttt.status);
  let [player, row, col] = ttt.moves.slice(-1)[0]; // one liner for this??
  //console.log(player, row, col)
  let name = player ? `P1` : `P2`; // TODO: user selection
  //let notice = document.getElementById('notice');
  let el = getSquare(id);

  if (outcome === 1) { //update board, show message for valid move
    el.classList.remove('free');
    player ? el.classList.add('p-one') : el.classList.add('p-two');
    msg(`${name} played valid move at R:${row}, C:${col}.`);
  } else if (outcome === 0) { //message to show for invalid move
    msg('Invalid move! You cannot choose a square already taken');
  } else if (outcome !== undefined){ //game is over
    player ? el.classList.add('p-one') : el.classList.add('p-two');
    if (outcome === true || outcome === false) { //player wins
      msg(`${name} is the winner!`);
      drawLine();

    } else { //draw
      msg(`Draw!`);
    }
  }
}

function doReset() {
  updateChildren();
  msg('Game has been reset');
}

function changeBoard(dir) {
  let newSize = ttt.board.length + dir;
  if (newSize >= 3) {
    updateChildren(newSize);
    board.style = `grid-template: repeat(${newSize}, 1fr) /repeat(${newSize}, 1fr)`;
    msg(`Board is now ${newSize}x${newSize}`);
  } else {
    msg('Board cannot be less than 3x3.');
  }

}

//helpers
function getSquare(id) {
  return document.getElementById(`sq${id}`);
}

function msg(str) { //update text of message area
  notice.innerText = str + '\n' + notice.innerText;
}

function updateChildren(side=ttt.board.length) { //side is side length of square
  ttt.reset(side);
  while (board.firstChild) { //remove existing
    board.removeChild(board.firstChild);
  }
  let frag = document.createDocumentFragment(); // to update dom once only
  for (let i = 0; i < side * side; i ++) {
    let el = document.createElement('div');
    el.className = 'free';
    el.id = `sq${i}`;
    el.addEventListener('click', () => squareClick(i));
    frag.appendChild(el);
  }
  board.appendChild(frag);
}

function drawLine() {

}
