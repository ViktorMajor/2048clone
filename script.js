let score = 0;
let best = 0;
const rows = 4;
const columns = 4;
let winShown = false;
let board;

window.onload = function () {
  setGame();
};

const gameBoard = document.getElementById("board");

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

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

function filterZero(row) {
  return row.filter((num) => num !== 0);
}

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

function setNewGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  bestScore();
  score = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
  setTwo();
  setTwo();
  scoreNum.innerText = score;
  winShown = false;
  deleteMessage();
}

function bestScore() {
  if (score > best) {
    best = score;
    document.getElementById("best-num").innerText = best;
  }
}

const messageContainer = document.getElementById("message");
messageContainer.style.display = "none";

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

function deleteMessage() {
  messageContainer.style.display = "none";
  messageContainer.innerText = "";
}

function lose() {
  messageContainer.style.display = "flex";
  messageContainer.innerHTML = `<p>Game over!</p>
    <button onclick ="setNewGame()">Try again!</button>`;
}

document.addEventListener("DOMContentLoaded", function () {
  const modeToggle = document.getElementById("mode-toggle");

  modeToggle.addEventListener("click", function () {
    const body = document.body;

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
