// Function to create a timer
function createTimer(element) {
  let startTime = Date.now();

  function update() {
    const elapsedTime = Date.now() - startTime;
    const seconds = Math.floor(elapsedTime / 1000);
    element.textContent = Time: ${seconds}s;

    // Check if the time limit has been reached
    if (seconds >= 10) { // Adjust the time limit as needed
      gameStarted = false;
      currentPlayer = 1;
      showTimeUpMessage();
      updatePlayerBoardVisibility();
      resetPlayerTimer();
      restartGame();
      return; // Exit the function to prevent further execution
    }

    // Check if the current player has lost all lives
    if (remainingLives[currentPlayer] <= 0) {
      gameStarted = false;
      showGameOverMessage();
      updatePlayerBoardVisibility();
      resetPlayerTimer();
      restartGame();
      return; // Exit the function to prevent further execution
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
