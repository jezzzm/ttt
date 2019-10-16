//read from last element in the moves array as pushed to by the game logic
//functions to adjust ai, triggered in the ttt game object

//listeners/elements
let ai = document.getElementById('ai');
ai.addEventListener('change', toggleAI);

let p1 = document.getElementById('p1-name');
p1.addEventListener('change', () => updateName());
let p2 = document.getElementById('p2-name');
p2.addEventListener('change', () => updateName());
let p1Score = document.getElementById('p1-score');
let p2Score = document.getElementById('p2-score');
let result = document.getElementById('result');
let currentTurn = document.getElementById('current');

let board = document.getElementById('board');
let resetPop = document.getElementById('reset-pop'); //TODO: these
let dismiss = document.getElementById('dismiss');
dismiss.addEventListener('click', () => resetPop.style = "display: none");
let newGame = document.getElementById('newgame');
newGame.addEventListener('click', () => {
  doReset();
  resetPop.style = "display: none";
})

let aiPop = document.getElementById('ai-pop');
document.getElementById('continue').addEventListener('click', doAIToggle);
document.getElementById('cancel').addEventListener('click', cancelAIToggle);

document.getElementById('reset').addEventListener('click', doReset);
let notice = document.getElementById('notice');
document.getElementById('expand').addEventListener('click', () => changeBoard(1));
document.getElementById('reduce').addEventListener('click', () => changeBoard(-1));

let logText = document.getElementById('log-toggle');
logText.addEventListener('click', toggleLog);

//initial board setup
updateChildren(3); //create board w side length 3

let p1Name = 'P1';
let p2Name = 'P2'
let p2Old = p2Name;

// functions for listener callbacks
function squareClick(id) {
  let outcome = ttt.play(id);
  let [player, row, col] = ttt.moves.slice(-1)[0];
  let name = player ? p1Name : p2Name; // TODO: user selection
  let el = getSquare(id);

  if (outcome === 1) { //update board, show message for valid move
    el.classList.remove('free');
    player ? el.classList.add('p-one') : el.classList.add('p-two');
    player ? currentTurn.innerText = p2Name: currentTurn.innerText = p1Name;
    msg(`${name} played valid move at (Row:${row}, Col:${col}).`);
    if (ai.checked && player) {
      window.setTimeout(squareClick, 300, aiMove()); //trigger AI's move
    }
  } else if (outcome === 0) { //message to show for invalid move
    msg('Invalid move! You cannot choose a square already taken');
  } else if (outcome === -1) { //game already over
      document.getElementById('winner').innerText = name;
      resetPop.style = "display: block";
  } else{ //game finishes this move
    let squares = document.querySelectorAll('section > div');
    squares.forEach(x => x.classList.remove('free'));
    player ? el.classList.add('p-one') : el.classList.add('p-two');
    result.style = 'display: none';
    if (outcome === true || outcome === false) { //player wins
      msg(`${name} is the winner!`);
      outcome ? currentTurn.innerText = `${p1Name} wins!`: currentTurn.innerText = `${p2Name} wins!`;
      p1Score.innerText = ttt.score[0];
      p2Score.innerText = ttt.score[1];
      animateWin(); // TODO: this
    } else { //game is a draw
      currentTurn.innerText = 'Draw!'
      msg(`Draw!`);
    }
  }
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

function updateName() {
  let val = event.target.value;
  let player = event.target.id.slice(1,2);
  if (player === '1') {
    p1Name = val
  } else {
    p2Name = val
    p2Old = val;
  }
  msg(`P${player} name changed to ${val}.`)
}

function toggleAI() {
  aiPop.style = "display: block";
}

function doAIToggle() {
  doReset();
  ttt.resetScore();
  p1Score.innerText = ttt.score[0];
  p2Score.innerText = ttt.score[1];
  if (p2.disabled) {
    p2.placeholder = p2Old;
    msg('Mode changed to human vs. human');
    p2.disabled = false;
  } else {
    p2.placeholder = "Computer";
    msg('Mode changed to human vs. computer');
    p2.disabled = true;
  }
  aiPop.style = "display: none";
}

function toggleLog() {
  let logDiv = document.querySelector('.log');
  let currentHeight = window.getComputedStyle(logDiv).height;
  if (currentHeight === "23px") { //change p to 100%
    logDiv.style.height = "100%";
    logText.innerHTML = '&#8595; Game Log'
  } else { //minimise p to 25px
    logDiv.style.height = "23px";
    logText.innerHTML = '&#8593; Game Log'

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

function doReset() {
  updateChildren();
  result.style = 'display: block';
  current.innerText = p1Name;
  msg('Game has been reset');
}

function cancelAIToggle() {
  ai.checked = false;
  aiPop.style = "display: none"
}

function animateWin() {
  let ids = ttt.boardID[ttt.winAxis];
  ids.forEach(id => {
    let el = getSquare(id);
    el.classList.add('highlight');
  });
}
