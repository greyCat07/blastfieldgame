<!DOCTYPE html>
<html>
<head>
  <title>BLAST FIELD</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #ffffff;
      text-align: center;
      background-image: url('backgroudblast.png');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }
    
    h1 {
      color: #ffffff;
    }
    
    .button {
      display: inline-block;
      margin: 10px;
      padding: 10px 20px;
      font-size: 18px;
      text-align: center;
      text-decoration: none;
      background-color: #4CAF50;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    
    .button:hover {
      background-color: #45a049;
    }
    
    .board-container {
      display: flex;
      justify-content: center;
    }
    
    .player-board {
      margin: 20px;
      display: none;
      position: relative;
    }
    
    .player-label {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .timer {
      font-size: 16px;
      margin-bottom: 5px;
      position: absolute;
      left: 10px;
      text-align: left;
    }
    
    .hearts {
      font-size: 18px;
      position: absolute;
      right: 10px;
      text-align: right;
      color: red;
    }
    
    .board-row {
      display: flex;
    }
    
    .board-cell {
      width: 50px;
      height: 50px;
      border: 1px solid #ffffff;
      margin: 2px;
      background-color: #fff;
    }
    
    .board-info {
      margin-top: 10px;
    }
    
    .start-cell {
      background-image: url('player.png');
      background-size: cover;
    }
    
    .flag-cell {
      background-image: url('flag.png');
      background-size: cover;
    }

    .bomb-cell {
      background-image: url('bomb.png');
      background-size: cover;
    }

    .exit-button {
      display: none;
    }
  </style>
</head>
<body>
  <h1>BLAST FIELD</h1>
  <p id="gameModeText">GAME OBJECTIVE: REACH THE FLAG WITHIN 10 SECONDS WHILE AVOIDING HIDDEN BOMBS</p>
  <button class="button" id="singlePlayerBtn">Play</button>
  <button class="button exit-button" id="exitBtn">Exit</button>
  <button class="button exit-button" id="startBtn">Start</button>

  <div class="board-container">
    <div class="player-board">
      <h2 class="player-label">PLAYER 1</h2>
      <div class="board">
        <!-- Player 1 board goes here -->
      </div>
      <div class="timer" id="player1Timer"></div>
      <div class="hearts" id="player1Hearts">❤️ ❤️ ❤️</div>
    </div>
  </div>

  <script src="function.js"></script>
</body>
</html>
