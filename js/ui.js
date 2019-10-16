//elements and listeners
let ai = ele('ai');
ai.addEventListener('change', () => aiPop.style.display = 'block');

ele('p1-name').addEventListener('change', nameChange);
let p2 = ele('p2-name');
p2.addEventListener('change', nameChange);
let p1Score = ele('p1-score');
let p2Score = ele('p2-score');
let result = ele('result');
let currentTurn = ele('current');

let board = ele('board');
let resetPop = ele('reset-pop'); //TODO: these
ele('dismiss').addEventListener('click', () => resetPop.style.display = 'none');
ele('newgame').addEventListener('click', () => {
  doReset();
  resetPop.style = "display: none";
})

let aiPop = ele('ai-pop');
ele('continue').addEventListener('click', toggleAI);
ele('cancel').addEventListener('click', cancelAIToggle);

ele('reset').addEventListener('click', doReset);
let notice = ele('notice');
ele('expand').addEventListener('click', () => changeBoard(1));
ele('reduce').addEventListener('click', () => changeBoard(-1));

//initial board setup
updateBoard(3); //create board w side length 3

let p1Name = 'P1';
let p2Name = 'P2'
let p2Old = p2Name;

// act upon playing square
function squareClick(id) {
  let outcome = ttt.play(id);
  let [player, row, col] = ttt.moves.slice(-1)[0];
  let name = player ? p1Name : p2Name;
  let el = getDiv(id);

  if (outcome === 1) {
    doValidMove(player, el, name, row, col);
  } else if (outcome === -1) { //game already over, show popup to prompt new game
      ele('winner').innerText = name;
      resetPop.style.display = 'block';
  } else if (outcome !== 0){
    doLastMove(player, el, name, outcome);
  }
}

function doValidMove(player, el, name, row, col) {
  el.classList.remove('free');
  player ? el.classList.add('p-one') : el.classList.add('p-two');
  player ? currentTurn.innerText = p2Name: currentTurn.innerText = p1Name;
  ai.checked && player ? window.setTimeout(squareClick, 300, aiMove()): null; //trigger AI's move, 300ms delay
}

function doLastMove(player, el, name, outcome) {
  let squares = document.querySelectorAll('section > div');
  squares.forEach(x => x.classList.remove('free'));
  player ? el.classList.add('p-one') : el.classList.add('p-two');
  result.style.display = 'none';
  if (outcome === true || outcome === false) { //player wins
    outcome ? currentTurn.innerText = `${p1Name} wins!`: currentTurn.innerText = `${p2Name} wins!`;
    updateScore(...ttt.score);
    animateWin()
  } else { //game is a draw
    currentTurn.innerText = 'Draw!'
  }
}

// secondary functions
function changeBoard(dir) {
  let newSize = ttt.board.length + dir;
  if (newSize >= 3) {
    updateBoard(newSize);
    board.style.cssText = `grid-template: repeat(${newSize}, 1fr) /repeat(${newSize}, 1fr)`;
  }
}

function nameChange() {
  let val = event.target.value;
  let player = event.target.id.slice(1,2); //unique part of id
  if (player === '1') {
    p1Name = val;
  } else {
    p2Name = val;
    p2Old = p2Name;
  }
}

function toggleAI() {
  doReset();
  ttt.resetScore();
  updateScore(...ttt.score)
  if (p2.disabled) {
    p2.placeholder = p2Old;
    p2.value = p2Old;
    p2.disabled = false;
  } else {
    p2.placeholder = "Computer";
    p2.value = "Computer";
    p2.disabled = true;
  }
  aiPop.style.display = 'none';
}

//helpers
function getDiv(id) {
  return ele(`sq${id}`);
}

function updateScore(score1, score2) {
  p1Score.innerText = score1;
  p2Score.innerText = score2;
}

function updateBoard(side=ttt.board.length) { //side is side length of square
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
  updateBoard();
  result.style.display = 'block';
  aiPop.style.display = 'none';
  resetPop.style.display = 'none';
  current.innerText = p1Name;
}

function cancelAIToggle() {
  ai.checked = false;
  aiPop.style.display = 'none';
}

function animateWin() {
  let ids = ttt.boardID[ttt.winAxis];
  ids.forEach(id => getDiv(id).classList.add('highlight'));
}

function ele(id) { //jezQuery
  return document.getElementById(id);
}
