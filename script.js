let board
let score = 0
let best = 0
let rows = 4
let columns = 4

window.onload = function() {
  setGame()
}


function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement('div')
      tile.id = r.toString() + '-' + c.toString()
      let num = board[r][c];
      updateTile(tile, num);
      document.getElementById('board').appendChild(tile)
    }
  }
  setTwo()
  setTwo()
}

function hasEmptyTile(){
  for( let r = 0; r <rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] == 0) {
        return true
      }
    }
  }
  return false
}

function setTwo() {
  if (!hasEmptyTile()) {
    return
  }
  let found = false
  while (!found) {
    let r = Math.floor(Math.random() * rows)
    let c = Math.floor(Math.random() * columns)

    if (board [r][c] == 0) {
      board[r][c] = 2
      let tile = document.getElementById(r.toString() + '-' + c.toString())
      tile.innerText = '2'
      tile.classList.add('x2')
      found = true
    }
  }
}


function updateTile (tile, num) {
 tile.innerText = ''
 tile.classList.value = ''
 tile.classList.add('tile')
  if (num > 0) {
    tile.innerText = num
    if (num <= 4096) {
     tile.classList.add('x' +num.toString())
    } else {
     tile.classList.add ('x8192')
    }
  }
}

// Az érintőképernyős események feliratkozása
document.addEventListener('touchstart', handleTouchStart, false)
document.addEventListener('touchmove', handleTouchMove, false)

// A billentyűzet események feliratkozása
document.addEventListener('keyup', handleKeyUp, false)

// A felhasználó első érintése
var xDown = null
var yDown = null

// Az érintés kezelése
function handleTouchStart(evt) {
  xDown = evt.touches[0].clientX
  yDown = evt.touches[0].clientY
}

// Az ujj húzásának kezelése
function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return
  }

  var xUp = evt.touches[0].clientX
  var yUp = evt.touches[0].clientY

  var xDiff = xDown - xUp
  var yDiff = yDown - yUp

  // Ellenőrizzük, hogy melyik irányba mozgott az ujj
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      slideLeft()
    } else {
      slideRight()
    }
  } else {
    if (yDiff > 0) {
      slideUp()
    } else {
      slideDown()
    }
  }

  // Az érintés utáni visszaállítás
  xDown = null
  yDown = null
};

// A billentyűzet események kezelése
function handleKeyUp(evt) {
  if (evt.code == 'ArrowLeft') {
    slideLeft()
  } else if (evt.code == 'ArrowRight') {
    slideRight()
  } else if (evt.code == 'ArrowUp') {
    slideUp()
  } else if (evt.code == 'ArrowDown') {
    slideDown()
  }
  document.getElementById('score-num').innerText = score
  setTwo()
}


function filterZero (row) {
  return row.filter(num => num !== 0)
}

function slide(row) {
  row = filterZero(row)

  for ( i = 0; i < row.length-1; i++) {
    if (row[i] == row[i+1]) {
      row[i] *= 2
      row[i+1] = 0
      score += row[i]
    }
  }

  row = filterZero(row)
  while (row.length < columns) {
    row.push(0)
  }

  return row
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board [r]
    row = slide(row)
    board [r] = row

    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + '-' + c.toString())  
      let num = board[r][c]
      updateTile (tile, num)
    }
  }
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = board [r]
    row.reverse()
    row = slide(row)
    row.reverse()
    board [r] = row

    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + '-' + c.toString())  
      let num = board[r][c]
      updateTile (tile, num)
    }
  }
}

function slideUp() {
  for (let c =0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]]
    row = slide(row)
    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r]
      let tile = document.getElementById(r.toString() + '-' + c.toString())  
      let num = board[r][c]
      updateTile (tile, num)
    }
  }
}

function slideDown() {
  for (let c =0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]]
    row.reverse()
    row = slide(row)
    row.reverse()
    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r]
      let tile = document.getElementById(r.toString() + '-' + c.toString())  
      let num = board[r][c]
      updateTile (tile, num)
    }
  }
}


function setNewGame() {
  board = [    
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]
  bestScore()
  score = 0
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + '-' + c.toString())
      let num = board[r][c]
      updateTile(tile, num)
    }
  }
  setTwo()
  setTwo()
  document.getElementById('score-num').innerText = score
}

function bestScore () {
  if (score > best) {
    best = score
    document.getElementById('best-num').innerText = best
  } 
}