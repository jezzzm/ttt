//elements and listeners
ele = (id) => document.getElementById(id); //jezQuery

let ai = ele('ai');
ai.addEventListener('change', () => {
  aiPop.style.display = 'block';
  event.target.style = 'pointer-events: none';
});

ele('p1-name').addEventListener('change', () => nameChange(true));
let p2 = ele('p2-name');
p2.addEventListener('change', () => nameChange(false));
let [p1Score, p2Score] = [ele('p1-score'), ele('p2-score')];
let [result, currentTurn] = [ele('result'), ele('current')];

let board = ele('board');
let resetPop = ele('reset-pop');
ele('dismiss').addEventListener('click', () => resetPop.style.display = 'none');
ele('newgame').addEventListener('click', doReset);

let aiPop = ele('ai-pop');
ele('continue').addEventListener('click', toggleAI);
ele('cancel').addEventListener('click', cancelAIToggle);

let helpPop = ele('help-pop');
ele('instructions').addEventListener('click', () => helpPop.style.display = 'block');
ele('dismiss-help').addEventListener('click', () => helpPop.style.display = 'none');
ele('reset').addEventListener('click', doReset);
let notice = ele('notice');
ele('expand').addEventListener('click', () => resizeBoard(1));
ele('reduce').addEventListener('click', () => resizeBoard(-1));

let [p1Name, p2Name] = ['P1', 'P2'];
let p2Old = p2Name;

// gameplay functions
function squareClick(id) {
  let outcome = ttt.play(id);
  let [player, row, col] = ttt.moves.slice(-1)[0];
  let name = player ? p1Name : p2Name;
  let el = getDiv(id);

  if (outcome === 1) {
    doValidMove(player, el, name, row, col);
  } else if (outcome === -1) { //game already over, show popup to prompt new game
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

// secondary ui functions
function resizeBoard(dir) {
  let newSize = ttt.board.length + dir;
  if (newSize >= 3) {
    updateBoard(newSize);
    board.style.cssText = `grid-template: repeat(${newSize}, 1fr) /repeat(${newSize}, 1fr)`;
  }
}

function nameChange(name) {
  let val = event.target.value;
  if ((name && ttt.player) || (!name && !ttt.player)) { //current player was the one who changed name
    currentTurn.innerText = val; //reflect in ui
  }
  name ? p1Name = val : p2Name = val;
  p2Old = p2Name;
}

function toggleAI() {
  doReset();
  ttt.resetScore();
  updateScore(...ttt.score);
  ai.style = ''; //reset pointer event prevention
  if (p2.disabled) { // toggle interactivity with P2 input field
    p2.placeholder = p2Old;
    p2Old === 'P2' ? p2.value = '' : p2.value = p2Old; //don't input name if it was never changed
  } else {
    p2.placeholder = "Computer";
    p2.value = "Computer";
  }
  p2.disabled = !p2.disabled;
  aiPop.style.display = 'none';
}

//helpers
getDiv = (id) => ele(`sq${id}`);

updateScore = (s1, s2) => [p1Score.innerText, p2Score.innerText] = [s1, s2];

animateWin = () => ttt.boardID[ttt.winAxis].forEach(id => getDiv(id).classList.add('highlight'));

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
  ai.style = ''; //reset pointer event prevention
  ai.checked = false; //undo check
  aiPop.style.display = 'none';
}

//initial board setup
updateBoard(3); //create board w side length 3
