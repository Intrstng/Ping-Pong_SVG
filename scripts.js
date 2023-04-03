const svgNS = "http://www.w3.org/2000/svg";
let settings;
let requestAnim = window.requestAnimationFrame ||
                  window.webkitRequestAnimationFrame ||
                  window.mozRequestAnimationFrame ||
                  window.oRequestAnimationFrame ||
                  window.msRequestAnimationFrame ||
                  function(callback) { window.setTimeout(callback, 1000 / 60); }
let requestAnimMoveLeftRacket = null;
let requestAnimMoveRightRacket = null;

function Settings(svg) {
  this.svg = svg;
  this.svgWidth = 800;
  this.svgHeight = 700;
  this.fieldMarginTop = this.svgHeight * 0.2;
  this.racketWidth = Math.floor(this.svgWidth * 0.022);
  this.racketHeight = Math.floor(this.svgHeight * 0.21);
  this.racketInitialPos1_Y = Math.floor(this.fieldMarginTop + this.svgHeight * 0.07);
  this.racketInitialPos2_Y = Math.floor(this.fieldMarginTop + this.svgHeight * 0.73 - this.racketHeight);
  this.racketPlayer1_actualPosY = this.racketInitialPos1_Y;
  this.racketPlayer2_actualPosY = this.racketInitialPos2_Y;
  this.ballSize = Math.floor(((this.svgWidth + this.svgHeight) / 2) * 0.022);
  this.racketSpeed = 8;
  this.startCountdown = 3;
  this.countdown = this.startCountdown;
  this.ballSpeed_X = randomBallDirection_X(7);
  this.ballSpeed_Y = randomBallDirection_Y(-4, 4);
  this.ballActualSpeed_X = this.ballSpeed_X;
  this.ballActualSpeed_Y = this.ballSpeed_Y;
  this.playerScoreCounter_1 = 0;
  this.playerScoreCounter_2 = 0;
  this.isCanBallMove = true;
  this.isCanRacketMove = true;
  this.isUpPressedPlayer_1 = false;
  this.isDownPressedPlayer_1 = false;
  this.isUpPressedPlayer_2 = false;
  this.isDownPressedPlayer_2 = false;
  this.isGameOver = false;
  this.isInitialStart = true;
  this.init = function() {
    this.ball = document.getElementById('ball');
    this.racket_1 = document.getElementById('racket_1');
    this.racket_2 = document.getElementById('racket_2');
    this.ballPositionStart_X = this.svgWidth / 2;
    this.ballPositionStart_Y = (this.svgHeight - this.fieldMarginTop) / 2 + this.fieldMarginTop;
    this.ballCurrentPosition = {
      currentPos_X: this.ballPositionStart_X,
      currentPos_Y: this.ballPositionStart_Y,
    };
  }
  this.updateBall = function() {
    this.ball.setAttributeNS(null, 'cx', this.ballCurrentPosition.currentPos_X);
    this.ball.setAttributeNS(null, 'cy', this.ballCurrentPosition.currentPos_Y);
  }
  this.updateRacketLeft = function() {
    this.racket_1.setAttributeNS(null, 'y', this.racketPlayer1_actualPosY);
  };
  this.updateRacketRight = function() {
    this.racket_2.setAttributeNS(null, 'y', this.racketPlayer2_actualPosY);
  };
}

function randomBallDirection_X(ballSpeed_X) {
  const randomNumber = Math.round(Math.random() * ballSpeed_X);
  const direction_X = randomNumber % 2 === 0 ? -1 : 1;
  return ballSpeed_X * direction_X;
}
function randomBallDirection_Y(min, max) {
  const randomDirection_Y = Math.round(min - 0.5 + Math.random() * (max - min + 1))
  if (randomDirection_Y >= 1 || randomDirection_Y <= -1) {
    return randomDirection_Y;
  } else return randomBallDirection_X(3);
  }

function createSvg() {
  const svg = document.createElementNS(svgNS, 'svg');
  settings = new Settings(svg);
  svg.setAttributeNS(null, 'width', settings.svgWidth);
  svg.setAttributeNS(null, 'height', settings.svgHeight);
  svg.setAttributeNS(null, 'viewbox', 0, 0, settings.svgWidth, settings.svgHeight);
  svg.setAttributeNS(null, 'id', 'pong');
  document.body.append(svg);
}
window.onload = createSvg();

function drawSvgElements() {
  // Draw controls
  function drawControls() {
    const startBtn = document.createElementNS(svgNS, 'rect');
    startBtn.setAttributeNS(null, 'id', 'start-btn');
    startBtn.setAttributeNS(null, 'x', settings.svgWidth * 0.015);
    startBtn.setAttributeNS(null, 'y', settings.fieldMarginTop * 0.25);
    startBtn.setAttributeNS(null, 'rx', settings.svgWidth * 0.015);
    startBtn.setAttributeNS(null, 'ry', settings.svgWidth * 0.015);
    startBtn.setAttributeNS(null, 'width', settings.svgWidth * 0.14);
    startBtn.setAttributeNS(null, 'height', settings.svgHeight * 0.065);
    startBtn.setAttributeNS(null, 'fill', 'rgb(255, 127, 80)');
    settings.svg.append(startBtn);
      const startBtnText = document.createElementNS(svgNS, 'text');
      settings.svg.append(startBtnText);
      const font = '"Orbitron", sans-serif';
      startBtnText.setAttributeNS(null, 'id', 'btn_text');
      startBtnText.setAttributeNS(null, 'x', settings.svgWidth * 0.015 + (settings.svgWidth * 0.14 / 2));
      startBtnText.setAttributeNS(null, 'y', settings.fieldMarginTop * 0.45);
      startBtnText.setAttributeNS(null, 'font-weight', 'bold');
      startBtnText.setAttributeNS(null, 'letter-spacing', '0.2rem');
      startBtnText.setAttributeNS(null, 'text-anchor', 'middle');
      startBtnText.setAttributeNS(null, 'font-size', '1rem');
      startBtnText.setAttributeNS(null, 'font-family', font);
      startBtnText.setAttributeNS(null, 'fill', 'rgba(33, 33, 33, 0.7)');
      startBtnText.textContent = 'Start!';
        const alarmText = document.createElementNS(svgNS, 'text');
        settings.svg.append(alarmText);
        alarmText.setAttributeNS(null, 'id', 'alarm_text');
        alarmText.setAttributeNS(null, 'x', settings.svgWidth / 2);
        alarmText.setAttributeNS(null, 'y', settings.fieldMarginTop * 0.1);
        alarmText.setAttributeNS(null, 'font-weight', 'bold');
        alarmText.setAttributeNS(null, 'letter-spacing', '0.2rem');
        alarmText.setAttributeNS(null, 'text-anchor', 'middle');
        alarmText.setAttributeNS(null, 'font-size', '0.8rem');
        alarmText.setAttributeNS(null, 'font-family', font);
        alarmText.setAttributeNS(null, 'fill', 'rgb(255, 255, 255)');
        alarmText.textContent = 'Turn off the sound on the computer if it might interfere with you now.';
  }
  drawControls()
  // Draw the score
  function drawScore() {
    const w = settings.svg.getAttributeNS(null, 'width');
    const font = '"Orbitron", sans-serif';
    const score_1 = document.createElementNS(svgNS, 'text');
    settings.svg.append(score_1);
    score_1.setAttributeNS(null, 'id', 'score_1');
    score_1.setAttributeNS(null, 'x', w / 2 - 30);
    score_1.setAttributeNS(null, 'y', settings.fieldMarginTop * 0.8);
    score_1.setAttributeNS(null, 'text-anchor', 'middle');
    score_1.setAttributeNS(null, 'font-size', '2rem');
    score_1.setAttributeNS(null, 'font-family', font);
    score_1.setAttributeNS(null, 'fill', 'rgb(41, 173, 85)');
    score_1.textContent = settings.playerScoreCounter_1;
      const colon = document.createElementNS(svgNS, 'text');
      settings.svg.append(colon);
      colon.setAttributeNS(null, 'x', w / 2);
      colon.setAttributeNS(null, 'y', settings.fieldMarginTop * 0.79);
      colon.setAttributeNS(null, 'text-anchor', 'middle');
      colon.setAttributeNS(null, 'font-size', '2rem');
      colon.setAttributeNS(null, 'font-family', font);
      colon.setAttributeNS(null, 'fill', 'rgb(255, 0, 0)');
      colon.textContent = String.fromCharCode(58);
        const score_2 = document.createElementNS(svgNS, 'text');
        settings.svg.append(score_2);
        score_2.setAttributeNS(null, 'id', 'score_2');
        score_2.setAttributeNS(null, 'x', w / 2 + 30);
        score_2.setAttributeNS(null, 'y', settings.fieldMarginTop * 0.8);
        score_2.setAttributeNS(null, 'text-anchor', 'middle');
        score_2.setAttributeNS(null, 'font-size', '2rem');
        score_2.setAttributeNS(null, 'font-family', font);
        score_2.setAttributeNS(null, 'fill', 'rgb(25, 0, 255)');
        score_2.textContent = settings.playerScoreCounter_2;
  }
  drawScore()
  //Draw field
  function drawField() {
    const field = document.createElementNS(svgNS, 'rect');
    field.setAttributeNS(null, 'id', 'field');
    field.setAttributeNS(null, 'x', 0);
    field.setAttributeNS(null, 'y', settings.fieldMarginTop);
    field.setAttributeNS(null, 'width', settings.svgWidth);
    field.setAttributeNS(null, 'height', settings.svgHeight - settings.fieldMarginTop);
    field.setAttributeNS(null, 'stroke', 'rgb(255, 255, 255)');
    field.setAttributeNS(null, 'fill', 'rgb(241, 210, 33)');
    settings.svg.append(field);
  }
  drawField()
  //Draw rackets
  function drawRacket(player) {
    const field = document.getElementById('field');
    const w = parseInt(field.getAttributeNS(null, 'width'));
    const h = parseInt(field.getAttributeNS(null, 'height'));
    const racket = document.createElementNS(svgNS, 'rect');
    if (player === 'player_1') {
      racket.setAttributeNS(null, 'id', 'racket_1');
      racket.setAttributeNS(null, 'x', 0);
      racket.setAttributeNS(null, 'y', settings.racketInitialPos1_Y);
      racket.setAttributeNS(null, 'fill', 'rgb(41, 173, 85)');
    } else if (player === 'player_2') {
      racket.setAttributeNS(null, 'id', 'racket_2');
      racket.setAttributeNS(null, 'x', w - settings.racketWidth);
      racket.setAttributeNS(null, 'y', settings.racketInitialPos2_Y);
      racket.setAttributeNS(null, 'fill', 'rgb(25, 0, 255)');
    }
    racket.setAttributeNS(null, 'width', settings.racketWidth);
    racket.setAttributeNS(null, 'height', settings.racketHeight);
    settings.svg.append(racket);
  }
  drawRacket('player_1');
  drawRacket('player_2');
  // Draw the ball
  function drawBall() {
    const field = document.getElementById('field');
    const fieldWidth = field.getAttributeNS(null, 'width');
    const fieldHeight = field.getAttributeNS(null, 'height');
    const ball = document.createElementNS(svgNS, 'circle');
    ball.setAttributeNS(null, 'id', 'ball');
    ball.setAttributeNS(null, 'cx', fieldWidth / 2);
    ball.setAttributeNS(null, 'cy', fieldHeight / 2 + settings.fieldMarginTop);
    ball.setAttributeNS(null, 'r', settings.ballSize);
    ball.setAttributeNS(null, 'fill', 'rgb(255, 0, 0)');
    settings.svg.append(ball);
  }
  drawBall();
  //Draw start countdown
  function drawStartCountdown() {
    const w = settings.svg.getAttributeNS(null, 'width');
    const field = document.getElementById('field');
    const fieldHeight = field.getAttributeNS(null, 'height');
    const startCoundownPos_Y = fieldHeight / 2 + settings.ballSize * 1.2 + settings.fieldMarginTop;
    const font = '"Orbitron", sans-serif';
    const startCountdown = document.createElementNS(svgNS, 'text');
    settings.svg.append(startCountdown);
    startCountdown.setAttributeNS(null, 'id', 'countdown');
    startCountdown.setAttributeNS(null, 'x', w / 2);
    startCountdown.setAttributeNS(null, 'y', startCoundownPos_Y);
    startCountdown.setAttributeNS(null, 'text-anchor', 'middle');
    startCountdown.setAttributeNS(null, 'font-size', '3.5rem');
    startCountdown.setAttributeNS(null, 'letter-spacing', '0.14rem');
    startCountdown.setAttributeNS(null, 'font-family', font);
    startCountdown.setAttributeNS(null, 'fill', 'rgb(255, 255, 255)');
  }
  drawStartCountdown();
  settings.init();
}
window.onload = drawSvgElements();

const curryHandler = function(duration, fn) {
  return () => startTimer(duration, fn);
}; 
const startBtnHandler = curryHandler(settings.startCountdown, startGame);
document.getElementById('start-btn').addEventListener('click', startBtnHandler);
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

const countdownSound = new Audio('http://www.pachd.com/a/button/button18.wav');
const startGameSound = new Audio('http://www.superluigibros.com/downloads/sounds/SNES/SMRPG/wav/smrpg_battle_punch.wav');
const wallHitSound = new Audio('http://web.mit.edu/sahughes/www/Sounds/m=100.mp3');
const racketHitSound = new Audio('http://www.healthfreedomusa.org/downloads/iMovie.app/Contents/Resources/iMovie%20%2708%20Sound%20Effects/Golf%20Hit%201.mp3');
const missSound = new Audio('http://www.sfu.ca/~johannac/IAT202%20Exercise3/hit.wav');
const fanfareSound = new Audio('http://www.ringophone.com/mp3poly/15959.mp3');

// function gameSoundInit(...args) {
//   for (let arg of args) {
//     arg.play();
//     arg.pause();
//   }
// }

function gameSound(item) {
  item.currentTime = 0;
  item.play();
}

function startGame() {
  settings.playerScoreCounter_1 = 0;
  settings.playerScoreCounter_2 = 0;
  settings.isCanRacketMove = true;
  moveBall();
}

function startTimer(duration, fn) {
  // gameSoundInit(countdownSound, startGameSound, wallHitSound, racketHitSound, missSound, fanfareSound);
  document.getElementById('start-btn').removeEventListener('click', startBtnHandler);
  if (!settings.isGameOver) {
    const startCountdown = document.getElementById('countdown');                            
    let timer = duration;
    const intervalStartCountdown = setInterval(function () {
      gameSound(countdownSound);
      startCountdown.textContent = timer;
      if (--timer < 0) {
        clearInterval(intervalStartCountdown);
        startCountdown.textContent = 'Start!';
        const timerStartCountdown = setTimeout(() => {
          gameSound(startGameSound);
          startCountdown.textContent = '';
          fn();
          settings.isInitialStart = false;            
          clearTimeout(timerStartCountdown);
        }, 600)
      }
    }, 600);
  }
}

function showScore(player, score) {
  const scorePlayer_1 = document.getElementById('score_1');
  const scorePlayer_2 = document.getElementById('score_2');
  const winner = document.getElementById('countdown');
  if (player === 'player1') {
    scorePlayer_1.textContent = score;
    if (score >= 5) {
      winner.textContent = 'Player 1 Wins!';
      settings.isGameOver = true;
      gameSound(fanfareSound);
      const newGameTimer = setTimeout(() => {
        refreshGameplay();
        clearTimeout(newGameTimer);
      }, 2000);
    }
  } else if (player === 'player2') {
    scorePlayer_2.textContent = score;
    if (score >= 5) {
      winner.textContent = 'Player 2 Wins!';
      settings.isGameOver = true;
      gameSound(fanfareSound);
      const newGameTimer = setTimeout(() => {
        refreshGameplay();
        clearTimeout(newGameTimer);
      }, 2000);
    }
  }
}

function restart() {
  settings.isCanBallMove = !settings.isCanBallMove;
  settings.isCanRacketMove = !settings.isCanRacketMove;
  settings.ballCurrentPosition.currentPos_X = settings.ballPositionStart_X;
  settings.ballCurrentPosition.currentPos_Y = settings.ballPositionStart_Y;
  moveBall();
}

function refreshGameplay() {
  document.getElementById('start-btn').addEventListener('click', startBtnHandler);
  document.getElementById('score_1').textContent = 0;
  document.getElementById('score_2').textContent = 0;
  document.getElementById('countdown').textContent = 'Press Start! button';
  settings.isGameOver = !settings.isGameOver;
  settings.isCanBallMove = true;
  settings.ballCurrentPosition.currentPos_X = settings.ballPositionStart_X;
  settings.ballCurrentPosition.currentPos_Y = settings.ballPositionStart_Y;
}

function keyDownHandler(e) {
  if (e.repeat == false && settings.isCanRacketMove) {
    if (e.code === 'ShiftLeft') {settings.isUpPressedPlayer_1 = true; moveLeftRacket();} 
    if (e.code === 'ControlLeft') {settings.isDownPressedPlayer_1 = true; moveLeftRacket();}
    if (e.code === 'ArrowUp') {settings.isUpPressedPlayer_2 = true; moveRightRacket();}
    if (e.code === 'ArrowDown') {settings.isDownPressedPlayer_2 = true; moveRightRacket();}
  }
}

function keyUpHandler(e) {
  switch(e.code) {
    case 'ShiftLeft': settings.isUpPressedPlayer_1 = false;
      break;
    case 'ArrowUp': settings.isUpPressedPlayer_2 = false;
      break;
    case 'ControlLeft': settings.isDownPressedPlayer_1 = false;
      break;
    case 'ArrowDown': settings.isDownPressedPlayer_2 = false;
      break;
    default: false;
  }
}

function moveBall() {
  if (settings.isCanBallMove) {
    settings.ballCurrentPosition.currentPos_X += settings.ballActualSpeed_X;
    // Checking if the ball hits the right racket
    if ((settings.ballCurrentPosition.currentPos_X + settings.ballSize > settings.svgWidth - settings.racketWidth
            && settings.ballCurrentPosition.currentPos_Y > settings.racketPlayer2_actualPosY)
        && (settings.ballCurrentPosition.currentPos_X + settings.ballSize > settings.svgWidth - settings.racketWidth
            && settings.ballCurrentPosition.currentPos_Y - settings.ballSize < settings.racketPlayer2_actualPosY + settings.racketHeight)) {
        settings.ballCurrentPosition.currentPos_X = settings.svgWidth - settings.ballSize - settings.racketWidth;
        settings.ballActualSpeed_X = -settings.ballActualSpeed_X;
        gameSound(racketHitSound);
    } else if (settings.ballCurrentPosition.currentPos_X + settings.ballSize + Math.abs(settings.ballActualSpeed_X) > settings.svgWidth) { // Right racket misses
        gameSound(missSound);
        settings.ballActualSpeed_X = -settings.ballActualSpeed_X;
        settings.ballCurrentPosition.currentPos_X = settings.svgWidth - settings.ballSize;
        settings.isCanBallMove = !settings.isCanBallMove;
        settings.isCanRacketMove = !settings.isCanRacketMove;
        settings.playerScoreCounter_1++;
        cancelAnimationFrame(requestAnimMoveLeftRacket);
        cancelAnimationFrame(requestAnimMoveRightRacket);
        showScore('player1', settings.playerScoreCounter_1);
        startTimer(settings.startCountdown, restart);
      }  
    // Checking if the ball hits the left racket
    if ((settings.ballCurrentPosition.currentPos_X - settings.ballSize < settings.racketWidth
            && settings.ballCurrentPosition.currentPos_Y > settings.racketPlayer1_actualPosY)
        && (settings.ballCurrentPosition.currentPos_X - settings.ballSize < settings.racketWidth
            && settings.ballCurrentPosition.currentPos_Y - settings.ballSize < settings.racketPlayer1_actualPosY + settings.racketHeight)) {
              settings.ballActualSpeed_X = -settings.ballActualSpeed_X;
        settings.ballCurrentPosition.currentPos_X = settings.racketWidth + settings.ballSize;
        gameSound(racketHitSound);
    } else if (settings.ballCurrentPosition.currentPos_X - settings.ballSize < 0) { // Left racket misses
        gameSound(missSound);
        settings.ballActualSpeed_X = -settings.ballActualSpeed_X;
        settings.ballCurrentPosition.currentPos_X = settings.ballSize;
        settings.isCanBallMove = !settings.isCanBallMove;
        settings.isCanRacketMove = !settings.isCanRacketMove;
        settings.playerScoreCounter_2++;
        cancelAnimationFrame(requestAnimMoveLeftRacket);
        cancelAnimationFrame(requestAnimMoveRightRacket);
        showScore('player2', settings.playerScoreCounter_2);
        startTimer(settings.startCountdown, restart);
      }
    settings.ballCurrentPosition.currentPos_Y += settings.ballActualSpeed_Y;
    // Checking if the ball is inside the bottom bound
    if (settings.ballCurrentPosition.currentPos_Y + settings.ballSize > settings.svgHeight) {
      settings.ballCurrentPosition.currentPos_Y = settings.svgHeight - settings.ballSize;  
      settings.ballActualSpeed_Y = -settings.ballActualSpeed_Y;
      gameSound(wallHitSound);
    }
    // Checking if the ball is inside the top bound
    if (settings.ballCurrentPosition.currentPos_Y - settings.ballSize < settings.fieldMarginTop) {
      settings.ballCurrentPosition.currentPos_Y = settings.fieldMarginTop + settings.ballSize;
      settings.ballActualSpeed_Y = -settings.ballActualSpeed_Y;
      gameSound(wallHitSound);
    }
    settings.updateBall();
    requestAnim(moveBall);
  }
}

function moveLeftRacket() {
  if (settings.isUpPressedPlayer_1) {
      settings.racketPlayer1_actualPosY -= settings.racketSpeed;
      if (settings.racketPlayer1_actualPosY - settings.racketSpeed <= settings.fieldMarginTop) {
        settings.racketPlayer1_actualPosY = settings.fieldMarginTop;
      }
      requestAnimMoveLeftRacket = requestAnim(moveLeftRacket);
  } else if (settings.isDownPressedPlayer_1) {
      settings.racketPlayer1_actualPosY += settings.racketSpeed;
      if (settings.racketPlayer1_actualPosY + settings.racketHeight >= settings.svgHeight) {
        settings.racketPlayer1_actualPosY = settings.svgHeight - settings.racketHeight;
      } 
      requestAnimMoveLeftRacket = requestAnim(moveLeftRacket);
  }
  settings.updateRacketLeft();
}

function moveRightRacket() {
  if (settings.isUpPressedPlayer_2) {
    settings.racketPlayer2_actualPosY -= settings.racketSpeed;
      if (settings.racketPlayer2_actualPosY - settings.racketSpeed <= settings.fieldMarginTop) {
        settings.racketPlayer2_actualPosY = settings.fieldMarginTop;
      }
      requestAnimMoveRightRacket = requestAnim(moveRightRacket);
  } else if (settings.isDownPressedPlayer_2) {
    settings.racketPlayer2_actualPosY += settings.racketSpeed;
    if (settings.racketPlayer2_actualPosY + settings.racketHeight >= settings.svgHeight) {
      settings.racketPlayer2_actualPosY = settings.svgHeight - settings.racketHeight;
    } 
    requestAnimMoveRightRacket = requestAnim(moveRightRacket);
  }
  settings.updateRacketRight();
}