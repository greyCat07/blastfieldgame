let gameStarted = false;
let currentPlayer = 1;
let remainingLives = [0, 3]; // Index 0 is unused

document.getElementById('singlePlayerBtn').addEventListener('click', startGame);

function startGame() {
  gameStarted = true;
  currentPlayer = 1;
  updatePlayerBoardVisibility();
  const player1TimerElement = document.getElementById('player1Timer');
  const player1Timer = createTimer(player1TimerElement);
  player1Timer.start();
}

function updatePlayerBoardVisibility() {
  const playerBoard = document.querySelector('.player-board');
  if (gameStarted) {
    playerBoard.style.display = 'block';
  } else {
    playerBoard.style.display = 'none';
  }
}

function createTimer(element) {
  let startTime = Date.now();

  function update() {
    const elapsedTime = Date.now() - startTime;
    const seconds = Math.floor(elapsedTime / 1000);
    element.textContent = `Time: ${seconds}s`;

    if (seconds >= 10) {
      gameStarted = false;
      currentPlayer = 1;
      showTimeUpMessage();
      updatePlayerBoardVisibility();
      resetPlayerTimer(element);
      restartGame();
      return;
    }

    if (remainingLives[currentPlayer] <= 0) {
      gameStarted = false;
      showGameOverMessage();
      updatePlayerBoardVisibility();
      resetPlayerTimer(element);
      restartGame();
      return;
    }
  }

  const timer = {
    start() {
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
  alert('Time is up! Game over.');
}

function showGameOverMessage() {
  alert('You have lost all your lives. Game over.');
}

function resetPlayerTimer(element) {
  element.textContent = 'Time: 0s';
}

function restartGame() {
  // Logic to restart the game
}
