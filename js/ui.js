//read from last element in the moves array as pushed to by the game logic
//functions to adjust ai, triggered in the ttt game object

//listeners/elements
let reset = document.getElementById('reset')
reset.addEventListener('click', doReset);
let notice = document.getElementById('notice');


for (let i = 0; i <= 8; i++) { //change to length of
  let el = getSquare(i);
  let id = parseInt(el.id.slice(2)) //strip off 'sq' and create int
  el.addEventListener('click', () => squareClick(id));
}


// functions for listener callbacks
function squareClick(id) {
  let outcome = ttt.play(id);
  console.log(ttt.status);
  let [player, row, col] = ttt.moves.slice(-1)[0]; // one liner for this??
  //console.log(player, row, col)
  let name = player ? `Player One` : `Player Two`; // TODO: user selection
  //let notice = document.getElementById('notice');
  let el = getSquare(id);

  if (outcome === 1) { //update board, show message for valid move
    el.classList.remove('free');
    player ? el.classList.add('p-one') : el.classList.add('p-two');
    notice.innerText = `${name} played valid move at row ${row}, column ${col}.`
  } else if (outcome === 0) { //message to show for invalid move
    notice.innerText = 'Invalid move! You cannot choose a square already taken'
  } else if (outcome !== undefined){ //game is over
    player ? el.classList.add('p-one') : el.classList.add('p-two');
    if (outcome === true || outcome === false) { //player wins
      notice.innerText = `${name} is the winner!`

    } else { //draw
      notice.innerText = `Draw!`
    }
  }
}

function doReset() {
  for (let i = 0; i <= 8; i++) {
    let el = getSquare(i);
    el.className = 'free';
  }

  notice.innerText = 'Game has been reset'
  ttt.reset();
}

function getSquare(id) {
  return document.getElementById(`sq${id}`)
}
