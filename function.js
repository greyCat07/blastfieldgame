const boardSize = 5;
const gameBoard = document.getElementById('gameBoard');
const timerDisplay = document.getElementById('player1Timer');
const heartsDisplay = document.getElementById('player1Hearts');
const startBtn = document.getElementById('startBtn');
const singlePlayerBtn = document.getElementById('singlePlayerBtn');
const exitBtn = document.getElementById('exitBtn');
const restartBtn = document.getElementById('restartBtn');

let playerPosition = { row: 0, col: 0 };
let flagPosition = { row: boardSize - 1, col: boardSize - 1 };
let bombPositions = [];
let remainingLives = 3;
let gameStarted = false;
let timerInterval;

function createBoard() {
  gameBoard.innerHTML = '';
  for (let i = 0; i < boardSize; i++) {
    const row = document.createElement('div');
    row.className = 'board-row';
    for (let j = 0; j < boardSize; j++) {
      const cell = document.createElement('div');
      cell.className = 'board-cell';
      cell.dataset.row = i;
      cell.dataset.col = j;
      row.appendChild(cell);
    }
    gameBoard.appendChild(row);
  }
  updateBoard();
}

function placeBombs() {
  bombPositions = [];
  while (bombPositions.length < 3) {
    const row = Math.floor(Math.random() * boardSize);
    const col = Math.floor(Math.random() * boardSize);
    if ((row !== 0 || col !== 0) && (row !== flagPosition.row || col !== flagPosition.col)) {
      bombPositions.push({ row, col });
    }
  }
}

function updateBoard() {
  const cells = document.querySelectorAll('.board-cell');
  cells.forEach(cell => {
    cell.className = 'board-cell';
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    if (row === playerPosition.row && col === playerPosition.col) {
      cell.classList.add('start-cell');
    } else if (row === flagPosition.row && col === flagPosition.col) {
      cell.classList.add('flag-cell');
    } else if (bombPositions.some(b => b.row === row && b.col === col)) {
      if (!gameStarted) {
        cell.classList.add('bomb-cell');
      }
    }
  });
}

function startGame() {
  playerPosition = { row: 0, col: 0 };
  remainingLives = 3;
  heartsDisplay.textContent = '❤️ ❤️ ❤️';
  placeBombs();
  createBoard();
  gameStarted = true;
  startTimer();
  document.addEventListener('keydown', handleMovement);
  restartBtn.style.display = 'none';
  startBtn.style.display = 'none';
}

function handleMovement(event) {
  if (!gameStarted) return;
  const key = event.key;
  if (key === 'ArrowUp' && playerPosition.row > 0) playerPosition.row--;
  else if (key === 'ArrowDown' && playerPosition.row < boardSize - 1) playerPosition.row++;
  else if (key === 'ArrowLeft' && playerPosition.col > 0) playerPosition.col--;
  else if (key === 'ArrowRight' && playerPosition.col < boardSize - 1) playerPosition.col++;

  checkCell();
  updateBoard();
}

function checkCell() {
  if (playerPosition.row === flagPosition.row && playerPosition.col === flagPosition.col) {
    alert('You Win!');
    endGame();
  } else if (bombPositions.some(b => b.row === playerPosition.row && b.col === playerPosition.col)) {
    remainingLives--;
    updateHearts();
    if (remainingLives <= 0) {
      alert('Game Over!');
      endGame();
    }
  }
}

function updateHearts() {
  heartsDisplay.textContent = '❤️ '.repeat(remainingLives);
}

function startTimer() {
  let startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    const seconds = Math.floor(elapsedTime / 1000);
    timerDisplay.textContent = `Time: ${seconds}s`;
    if (seconds >= 10) {
      alert("Time's up!");
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameStarted = false;
  clearInterval(timerInterval);
  document.removeEventListener('keydown', handleMovement);
  restartBtn.style.display = 'inline-block';
}

singlePlayerBtn.addEventListener('click', () => {
  startBtn.style.display = 'inline-block';
  exitBtn.style.display = 'inline-block';
  singlePlayerBtn.style.display = 'none';
});

startBtn.addEventListener('click', () => {
  startGame();
});

exitBtn.addEventListener('click', () => {
  location.reload();
});

restartBtn.addEventListener('click', () => {
  startGame();
});
