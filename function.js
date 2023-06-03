  // Game constants
  const BOARD_SIZE = 10;
  const MAX_LIVES = 3;

  // Game variables
  let gameStarted = false;
  let currentPlayer = 1;
  let player1Timer;

  // Game board
  const board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
  const playerPositions = { 1: { x: 0, y: 0 }, 2: { x: BOARD_SIZE - 1, y: BOARD_SIZE - 1 } };
  let remainingLives = { 1: MAX_LIVES, 2: MAX_LIVES, 3: MAX_LIVES };

  // Function to create the game board
  function createBoard(boardElement) {
    for (let i = 0; i < BOARD_SIZE; i++) {
      const row = document.createElement('div');
      row.classList.add('board-row');

      for (let j = 0; j < BOARD_SIZE; j++) {
        const cell = document.createElement('div');
        cell.classList.add('board-cell');
        if (i === 0 && j === 0) {
        cell.classList.add('start-cell');
        }
        if (i === 9 && j === 9) {
          cell.classList.add('flag-cell');
        }
        cell.dataset.x = j;
        cell.dataset.y = i;

        row.appendChild(cell);
      }

      boardElement.appendChild(row);
    }
  }

  // Function to make the tiles clickable
  function makeTilesClickable(boardElement, moveCallback) {
    const cells = boardElement.querySelectorAll('.board-cell');
    cells.forEach(cell => {
      cell.addEventListener('click', () => {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        moveCallback(x, y);
      });
    });
  }

  // Function to start the game
  function startGame() {
    gameStarted = true;
    currentPlayer = 1;
    placeBombs();
    updatePlayerBoardVisibility();
    updatePlayerTimer();
  }

  // Function to exit the game
  function exitGame() {
    gameStarted = false;
    currentPlayer = 1;
    resetBoard();
    resetPlayerPositions();
    resetRemainingLives();
    resetPlayerTimer();
    updatePlayerBoardVisibility();
  }

  // Function to reset the board
  function resetBoard() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        board[i][j] = 0;
      }
    }
  }

  // Function to reset player positions
  function resetPlayerPositions() {
    playerPositions[1].x = 0;
    playerPositions[1].y = 0;
    playerPositions[2].x = BOARD_SIZE - 1;
    playerPositions[2].y = BOARD_SIZE - 1;
  }

  // Function to reset remaining lives
  function resetRemainingLives() {
    remainingLives[1] = MAX_LIVES;
    remainingLives[2] = MAX_LIVES;
    remainingLives[3] = MAX_LIVES
  }

  // Function to reset player timer
  function resetPlayerTimer() {
    if (player1Timer) {
      player1Timer.stop();
      player1Timer = null;
    }
  }

  // Function to restart the game
  function restartGame() {
    resetBoard();
    resetPlayerPositions();
    resetRemainingLives();
    updatePlayerBoardVisibility();
    startGame();
  }

  // Function to update the visibility of player boards
  function updatePlayerBoardVisibility() {
    const player1Board = document.querySelector('.player-board:nth-child(1)');

    if (gameStarted) {
      player1Board.style.display = currentPlayer === 1 ? 'block' : 'none';
    } else {
      player1Board.style.display = 'none';
    }
  }

  // Function to update the player timer
  function updatePlayerTimer() {
    if (player1Timer) {
      player1Timer.stop();
      player1Timer = null;
    }

    if (gameStarted) {
      if (currentPlayer === 1) {
        const player1TimerElement = document.getElementById('player1Timer');
        player1Timer = createTimer(player1TimerElement);
        player1Timer.start();
      } 
    }
  }

  // Function to create a timer
  function createTimer(element) {
  let startTime = Date.now();

  function update() {
    const elapsedTime = Date.now() - startTime;
    const seconds = Math.floor(elapsedTime / 1000);
    element.textContent = `Time: ${seconds}s`;
    
    // Check if the time limit has been reached
    if (seconds >= 10) {
      gameStarted = false;
      currentPlayer = 1;
      showTimeUpMessage();
      updatePlayerBoardVisibility();
      resetPlayerTimer();
    }
  }

  const timer = {
    start() {
      // Update the start time
      startTime = Date.now();
      update();
      this.intervalId = setInterval(update, 1000);
    },
    stop() {
      clearInterval(this.intervalId);
    }
  };

  return timer;
}

function showTimeUpMessage() {
  alert('Time is up! Player ' + currentPlayer + ' did not finish the game.');
}

  // Function to handle the player move
  function movePlayer(x, y) {
  if (!gameStarted) {
    return;
  }

  const currentPlayerPosition = playerPositions[currentPlayer];

  if (x === currentPlayerPosition.x && y === currentPlayerPosition.y) {
    return;
  }

  const isValidMove = validateMove(x, y);

  if (isValidMove) {
    // Check if the move leads to a valid path
    const pathExists = checkPathExists(x, y);

    if (pathExists) {
      currentPlayerPosition.x = x;
      currentPlayerPosition.y = y;
      updatePlayerPositionOnBoard();
      checkGameOver();
      switchPlayer();
      updatePlayerTimer();
    }
  }
}

// Function to check if a path exists from the current position to the destination
function checkPathExists(destX, destY) {
const visited = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false));

return backtrack(playerPositions[currentPlayer].x, playerPositions[currentPlayer].y, destX, destY, visited);
}

// Backtracking function to check if a path exists using depth-first search
function backtrack(x, y, destX, destY, visited) {
// Base case: destination reached
if (x === destX && y === destY) {
  return true;
}

// Mark the current cell as visited
visited[y][x] = true;

// Check all possible adjacent cells
const dx = [1, 0, -1, 0];
const dy = [0, 1, 0, -1];

for (let i = 0; i < 4; i++) {
  const newX = x + dx[i];
  const newY = y + dy[i];

  // Check if the new position is valid and not visited
  if (isValidPosition(newX, newY) && !visited[newY][newX] && validateMove(newX, newY)) {
    // Recursively backtrack to the new position
    if (backtrack(newX, newY, destX, destY, visited)) {
      return true;
    }
  }
}

// No path found, backtrack
visited[y][x] = false;
return false;
}

// Function to check if a position is valid
function isValidPosition(x, y) {
return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
}

  // Function to validate the player move
  function validateMove(x, y) {
    const currentPlayerPosition = playerPositions[currentPlayer];
    const dx = Math.abs(x - currentPlayerPosition.x);
    const dy = Math.abs(y - currentPlayerPosition.y);

    if (dx <= 1 && dy <= 1) {
      return true;
    }

    return false;
  }

  // Function to randomly place bombs on the board
  function placeBombs() {
    const totalBombs = Math.floor(BOARD_SIZE * BOARD_SIZE * 1); // Adjust the bomb density as needed
    let bombsPlaced = 0;

    while (bombsPlaced < totalBombs) {
      const x = Math.floor(Math.random() * BOARD_SIZE);
      const y = Math.floor(Math.random() * BOARD_SIZE);

      if (board[y][x] !== 1 && (x !== 0 || y !== 0)) {
        board[y][x] = 1;
        bombsPlaced++;
      }
    }
  }
  
  // Function to update the player position on the board
  function updatePlayerPositionOnBoard() {
    const playerBoardElement = document.querySelector('.player-board:nth-child(' + currentPlayer + ') .board');
    const cells = playerBoardElement.querySelectorAll('.board-cell');

    cells.forEach(cell => {
      const x = parseInt(cell.dataset.x);
      const y = parseInt(cell.dataset.y);

      if (x === playerPositions[currentPlayer].x && y === playerPositions[currentPlayer].y) {
        cell.classList.add('start-cell');

        if (board[y][x] === 1) {
          cell.classList.add('bomb-cell');
          remainingLives[currentPlayer]--;

          if (remainingLives[currentPlayer] <= 0) {
            gameStarted = false;
            currentPlayer = 1;
            showGameOverMessage();
            updatePlayerBoardVisibility();
            resetPlayerTimer();
            restartGame();
            return;
          }
        } else {
          cell.classList.remove('bomb-cell');
        }
      } else {
        cell.classList.remove('start-cell');
        cell.classList.remove('bomb-cell');
      }
    });

    // Update hearts
    const heartsElement = document.querySelector('.player-board:nth-child(' + currentPlayer + ') .hearts');
    heartsElement.innerHTML = generateHeartIcons(remainingLives[currentPlayer]);

    // Check if the game is over
    checkGameOver();
  }

  function generateHeartIcons(lives) {
    let hearts = '';
    for (let i = 0; i < lives; i++) {
      hearts += '❤️ '; // Heart icon
    }
    return hearts;
  }

  // Function to check if the game is over
  function checkGameOver() {
  const currentPlayerPosition = playerPositions[currentPlayer];

  if (currentPlayerPosition.x === BOARD_SIZE - 1 && currentPlayerPosition.y === BOARD_SIZE - 1) {
    if (board[currentPlayerPosition.y][currentPlayerPosition.x] === 1) {
    remainingLives[currentPlayer]--;

    if (remainingLives[currentPlayer] <= 0) {
      if (currentPlayer === 1) {
        showGameOverMessage();
        restartGame();
      } else {
        showGameLostMessage();
        restartGame();
      }
      return;
    }
  }
  
    
    if (currentPlayer === 1 && currentPlayerPosition.x === BOARD_SIZE - 1 && currentPlayerPosition.y === BOARD_SIZE - 1) {
    showGameWonMessage();
    exitGame();
    return;
  }

  }
}


  // Function to show the game over message
  function showGameOverMessage() {
    alert('Game Over! Player ' + currentPlayer + ' has lost all lives.');
  }

  function showGameLostMessage() {
    alert('Game Over! Player ' + currentPlayer + ' has lost.');
  }

  // Function to show the game won message
  function showGameWonMessage() {
    alert('Congratulations! Player 1 has reached the flag.');
  }

  // Event listeners for buttons
  document.getElementById('singlePlayerBtn').addEventListener('click', () => {
    startGame();
  });

  document.getElementById('exitBtn').addEventListener('click', () => {
    exitGame();
  });

  document.getElementById('startBtn').addEventListener('click', () => {
  restartGame();
});

  // Create the game board
  const player1Board = document.querySelector('.player-board:nth-child(1) .board');

  createBoard(player1Board);

  // Make the tiles clickable
  makeTilesClickable(player1Board, movePlayer);
