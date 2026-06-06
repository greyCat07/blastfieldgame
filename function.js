const boardSize = 5;
const gameBoard = document.getElementById('gameBoard');
const timerDisplay = document.getElementById('player1Timer');
const heartsDisplay = document.getElementById('player1Hearts');
const statusMessage = document.getElementById('statusMessage');

const menuControls = document.getElementById('menuControls');
const gameControls = document.getElementById('gameControls');
const boardWrapper = document.getElementById('boardWrapper');

const startBtn = document.getElementById('startBtn');
const singlePlayerBtn = document.getElementById('singlePlayerBtn');
const exitBtn = document.getElementById('exitBtn');
const restartBtn = document.getElementById('restartBtn');

let playerPosition = { row: 0, col: 0 };
let flagPosition = { row: boardSize - 1, col: boardSize - 1 };
let bombPositions = [];
let explodedBombs = []; // Tracks which bombs have been triggered/revealed
let remainingLives = 3;
let gameStarted = false;
let timerInterval;
let timeLeft = 10;

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

// FIX: Prevent identical bomb placements using a validation filter loop
function placeBombs() {
  bombPositions = [];
  explodedBombs = [];
  while (bombPositions.length < 3) {
    const row = Math.floor(Math.random() * boardSize);
    const col = Math.floor(Math.random() * boardSize);
    
    const isStartNode = (row === 0 && col === 0);
    const isFlagNode = (row === flagPosition.row && col === flagPosition.col);
    const isDuplicate = bombPositions.some(b => b.row === row && b.col === col);

    if (!isStartNode && !isFlagNode && !isDuplicate) {
      bombPositions.push({ row, col });
    }
  }
}

function updateBoard() {
  const cells = document.querySelectorAll('.board-cell');
  cells.forEach(cell => {
    // Reset base classes cleanly
    cell.className = 'board-cell';
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (row === playerPosition.row && col === playerPosition.col) {
      cell.classList.add('start-cell');
    } else if (row === flagPosition.row && col === flagPosition.col) {
      cell.classList.add('flag-cell');
    } else {
      // FIX: Only show bombs if they have explicitly exploded during action phase
      const isBomb = bombPositions.some(b => b.row === row && b.col === col);
      const isRevealed = explodedBombs.some(b => b.row === row && b.col === col);
      
      if (isBomb && isRevealed) {
        cell.classList.add('bomb-cell');
      }
    }
  });
}

function startGame() {
  playerPosition = { row: 0, col: 0 };
  remainingLives = 3;
  timeLeft = 10;
  
  heartsDisplay.textContent = '❤️ ❤️ ❤️';
  timerDisplay.textContent = `Time: ${timeLeft}s`;
  statusMessage.textContent = 'Navigate carefully...';
  statusMessage.className = 'status-message';
  
  placeBombs();
  createBoard();
  
  gameStarted = true;
  startTimer();
  
  // Clean up global key hooks before binding a fresh session loop
  document.removeEventListener('keydown', handleMovement);
  document.addEventListener('keydown', handleMovement);
  
  restartBtn.style.display = 'none';
  startBtn.style.display = 'none';
}

function handleMovement(event) {
  if (!gameStarted) return;
  
  const key = event.key;
  let moved = false;

  if (key === 'ArrowUp' && playerPosition.row > 0) { playerPosition.row--; moved = true; }
  else if (key === 'ArrowDown' && playerPosition.row < boardSize - 1) { playerPosition.row++; moved = true; }
  else if (key === 'ArrowLeft' && playerPosition.col > 0) { playerPosition.col--; moved = true; }
  else if (key === 'ArrowRight' && playerPosition.col < boardSize - 1) { playerPosition.col++; moved = true; }

  // Only run state validations if the coordinates actually shifted
  if (moved) {
    checkCell();
    updateBoard();
  }
}

function checkCell() {
  // Scenario A: Victory Condition Achieved
  if (playerPosition.row === flagPosition.row && playerPosition.col === flagPosition.col) {
    endGame(true, '🎉 You Win! Mission Accomplished.');
    return;
  }

  // Scenario B: Hit an unexploded bomb
  const hitBombIndex = bombPositions.findIndex(b => b.row === playerPosition.row && b.col === playerPosition.col);
  
  if (hitBombIndex !== -1) {
    const alreadyExploded = explodedBombs.some(b => b.row === playerPosition.row && b.col === playerPosition.col);
    
    if (!alreadyExploded) {
      // Register explosion visually
      explodedBombs.push(bombPositions[hitBombIndex]);
      remainingLives--;
      updateHearts();

      if (remainingLives <= 0) {
        endGame(false, '💥 BOOM! Game Over.');
      } else {
        statusMessage.textContent = '⚠️ Ouch! You hit a bomb! Shift coordinates!';
        statusMessage.className = 'status-message lose-text';
        
        // OPTIONAL GAMEPLAY MECHANIC: Send player back to spawn on hit to break pinning loops
        playerPosition = { row: 0, col: 0 };
      }
    }
  }
}

function updateHearts() {
  heartsDisplay.textContent = '❤️ '.repeat(Math.max(0, remainingLives));
}

// FIX: Transformed into a clean countdown system rather than an additive timer
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    
    if (timeLeft <= 0) {
      endGame(false, "⏳ Time's Up! You ran out of power.");
    }
  }, 1000);
}

function endGame(isWin, customMsg) {
  gameStarted = false;
  clearInterval(timerInterval);
  document.removeEventListener('keydown', handleMovement);
  
  statusMessage.textContent = customMsg;
  statusMessage.className = `status-message ${isWin ? 'win-text' : 'lose-text'}`;
  
  // Reveal ALL hidden locations on the final display cycle for transparency
  explodedBombs = [...bombPositions];
  updateBoard();
  
  restartBtn.style.display = 'inline-block';
}

// UI Event Interfaces
singlePlayerBtn.addEventListener('click', () => {
  gameControls.style.display = 'block';
  boardWrapper.style.display = 'block';
  menuControls.style.display = 'none';
  createBoard(); // Show blank board layout as preparation
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
