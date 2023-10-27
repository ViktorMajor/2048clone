// Game state variables
let score = 0;
let best = 0;
const rows = 4;
const columns = 4;
let winShown = false;
let board;

// Initialize the game when the window loads
window.onload = function () {
  setGame();
};

const gameBoard = document.getElementById("board");

// Set up the game board
function setGame() {
  // Initializing the board with zeros
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  // Populating the game board with tiles
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      let num = board[r][c];
      updateTile(tile, num);
      gameBoard.appendChild(tile);
    }
  }
  setTwo();
  setTwo();
}

// Check if the board has an empty tile
function hasEmptyTile() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] == 0) {
        return true;
      }
    }
  }
  return false;
}

// Check if the board has possible moves
function hasPossibleMoves() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return true;
      }
      if (c < columns - 1 && board[r][c] === board[r][c + 1]) {
        return true;
      }
      if (r < rows - 1 && board[r][c] === board[r + 1][c]) {
        return true;
      }
    }
  }
  return false;
}

// Set a "2" on a random empty tile
function setTwo() {
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;
  while (!found) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);

    if (board[r][c] == 0) {
      board[r][c] = 2;
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      tile.innerText = "2";
      tile.classList.add("x2");
      found = true;
    }
  }

  if (!hasPossibleMoves()) {
    lose();
  }
}

// Update the appearance of a tile based on its number
function updateTile(tile, num) {
  tile.innerText = "";
  tile.classList.value = "";
  tile.classList.add("tile");
  if (num > 0) {
    tile.innerText = num;
    if (num <= 4096) {
      tile.classList.add("x" + num.toString());
    } else {
      tile.classList.add("x8192");
    }
  }
  win();
}

const scoreNum = document.getElementById("score-num");

// Handle arrow key inputs to slide tiles
document.addEventListener("keyup", (e) => {
  if (messageContainer.style.display === "none") {
    e.preventDefault();
    switch (e.code) {
      case "ArrowLeft":
        slideLeft();
        break;
      case "ArrowRight":
        slideRight();
        break;
      case "ArrowUp":
        slideUp();
        break;
      case "ArrowDown":
        slideDown();
        break;
      default:
        break;
    }
    scoreNum.innerText = score;
    setTwo();
  }
});

// Remove zeros from a row
function filterZero(row) {
  return row.filter((num) => num !== 0);
}

// Slide and combine tiles in a row
function slide(row) {
  row = filterZero(row);

  for (i = 0; i < row.length - 1; i++) {
    if (row[i] == row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }

  row = filterZero(row);
  while (row.length < columns) {
    row.push(0);
  }

  return row;
}

// Slide tiles to the desired direction
function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    row = slide(row);
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    row.reverse();
    row = slide(row);
    row.reverse();
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    row = slide(row);
    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    row.reverse();
    row = slide(row);
    row.reverse();
    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
}

// Initializes a new game
function setNewGame() {
  // Set an empty 4x4 board
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  
  // Check and set the best score
  bestScore();
  
  // Reset the current score
  score = 0;

  // Update the display of each tile on the board
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
  
  // Place two initial tiles with value '2' on the board
  setTwo();
  setTwo();

  // Update the displayed score
  scoreNum.innerText = score;
  
  // Reset the win flag
  winShown = false;
  
  // Clear any previous win/lose message
  deleteMessage();
}

// Update and display the best score if current score exceeds it
function bestScore() {
  if (score > best) {
    best = score;
    document.getElementById("best-num").innerText = best;
  }
}

// Select the message container and initially hide it
const messageContainer = document.getElementById("message");
messageContainer.style.display = "none";

// Function to display a win message when a player reaches 2048
function win() {
  if (board.flat().includes(2048) && !winShown) {
    messageContainer.style.display = "block";
    messageContainer.innerHTML = ` <p>Congratulations! You win! Continue playing?</p>
    <div id= buttons >
      <button onclick ="deleteMessage()" >Yes!</button>
      <button onclick ="setNewGame()" >No</button>
    </div>`;
    winShown = true;
  }
}

// Function to clear the win/lose message
function deleteMessage() {
  messageContainer.style.display = "none";
  messageContainer.innerText = "";
}

// Function to display a lose message when there are no more valid moves
function lose() {
  messageContainer.style.display = "flex";
  messageContainer.innerHTML = `<p>Game over!</p>
    <button onclick ="setNewGame()">Try again!</button>`;
}

// Event listener to handle theme toggling (between dark and light modes)
document.addEventListener("DOMContentLoaded", function () {
  const modeToggle = document.getElementById("mode-toggle");

  modeToggle.addEventListener("click", function () {
    const body = document.body;

    // Switch between light and dark themes
    if (body.classList.contains("light-mode")) {
      body.classList.remove("light-mode");
      body.classList.add("dark-mode");
      modeToggle.innerText = "Light mode";
    } else {
      body.classList.remove("dark-mode");
      body.classList.add("light-mode");
      modeToggle.innerText = "Dark mode";
    }
  });
});
