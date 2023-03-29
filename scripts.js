const svgNS = "http://www.w3.org/2000/svg";
let settings;
// let requestAnim = window.requestAnimationFrame ||
//                   window.webkitRequestAnimationFrame ||
//                   window.mozRequestAnimationFrame ||
//                   window.oRequestAnimationFrame ||
//                   window.msRequestAnimationFrame ||
//                   function(callback) { window.setTimeout(callback, 1000 / 60); }

function Settings(svg) {
  this.svg = svg;
  this.svgWidth = 800;
  this.svgHeight = 700;
  this.fieldOffsetTop = this.svgHeight * 0.2;
  this.fieldColor = 'rgb(241, 210, 33)';
  this.racketWidth = this.svgWidth * 0.022;
  this.racketHeight = this.svgHeight * 0.21;
  this.racketPlayer1_color = 'rgb(41, 173, 85)';
  this.racketPlayer2_color = 'rgb(25, 0, 255)';
  this.racketInitialPosY = this.svgHeight * 0.04;
  this.racketPlayer1_actualPosY = this.racketInitialPosY;
  this.racketPlayer2_actualPosY = this.racketInitialPosY;
  this.scoreColor = 'rgba(33, 33, 33, 0.7)';
  this.scoreFontSize = '2rem';
  this.startBtnColor = 'rgb(255, 127, 80)';
  this.ballSize = ((this.svgWidth + this.svgHeight) / 2) * 0.022;
  this.ballColor = 'rgb(255, 0, 0)';
  this.ballPositionStart_X = (this.svgWidth / 2) - this.ballSize / 2;
  this.ballPositionStart_Y = (this.svgHeight / 2) - this.ballSize / 2;
  this.ballCurrentPosition = {
    currentPos_X: this.ballPositionStart_X,
    currentPos_Y: this.ballPositionStart_Y,
  };
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
  this.update = function() {
    this.ball.style.left = this.ballCurrentPosition.currentPos_X + 'px';
    this.ball.style.top = this.ballCurrentPosition.currentPos_Y + 'px';
    this.racket_1.style.top = this.racketPlayer1_actualPosY + 'px';
    this.racket_2.style.bottom = this.racketPlayer2_actualPosY + 'px';
  };
}
function randomBallDirection_X(ballSpeed_X) {
  const randomNumber = Math.round(Math.random() * ballSpeed_X);
  const direction_X = randomNumber % 2 === 0 ? -1 : 1;
  return ballSpeed_X * direction_X;
}
function randomBallDirection_Y(min, max) {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
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
    startBtn.setAttributeNS(null, 'id', 'start_btn');
    startBtn.setAttributeNS(null, 'x', settings.svgWidth * 0.015);
    startBtn.setAttributeNS(null, 'y', settings.fieldOffsetTop * 0.25);
    startBtn.setAttributeNS(null, 'rx', settings.svgWidth * 0.015);
    startBtn.setAttributeNS(null, 'ry', settings.svgWidth * 0.015);
    startBtn.setAttributeNS(null, 'width', settings.svgWidth * 0.14);
    startBtn.setAttributeNS(null, 'height', settings.svgHeight * 0.065);
    startBtn.setAttributeNS(null, 'fill', settings.startBtnColor);
    settings.svg.append(startBtn);
      const startBtnText = document.createElementNS(svgNS, 'text');
      settings.svg.append(startBtnText);
      const font = '"Orbitron", sans-serif';
      startBtnText.setAttributeNS(null, 'id', 'btn_text');
      startBtnText.setAttributeNS(null, 'x', settings.svgWidth * 0.015 + (settings.svgWidth * 0.14 / 2));
      startBtnText.setAttributeNS(null, 'y', settings.fieldOffsetTop * 0.45);
      startBtnText.setAttributeNS(null, 'font-weight', 'bold');
      startBtnText.setAttributeNS(null, 'letter-spacing', parseInt(settings.scoreFontSize) * 0.1 + 'rem');
      startBtnText.setAttributeNS(null, 'text-anchor', 'middle');
      startBtnText.setAttributeNS(null, 'font-size', parseInt(settings.scoreFontSize) / 2 + 'rem');
      startBtnText.setAttributeNS(null, 'font-family', font);
      startBtnText.setAttributeNS(null, 'fill', 'rgba(33, 33, 33, 0.7)');
      startBtnText.textContent = 'Start!';
        const alarmText = document.createElementNS(svgNS, 'text');
        settings.svg.append(alarmText);
        alarmText.setAttributeNS(null, 'id', 'alarm_text');
        alarmText.setAttributeNS(null, 'x', settings.svgWidth / 2);
        alarmText.setAttributeNS(null, 'y', settings.fieldOffsetTop * 0.1);
        alarmText.setAttributeNS(null, 'font-weight', 'bold');
        alarmText.setAttributeNS(null, 'letter-spacing', parseInt(settings.scoreFontSize) * 0.1 + 'rem');
        alarmText.setAttributeNS(null, 'text-anchor', 'middle');
        alarmText.setAttributeNS(null, 'font-size', parseInt(settings.scoreFontSize) / 2.5 + 'rem');
        alarmText.setAttributeNS(null, 'font-family', font);
        alarmText.setAttributeNS(null, 'fill', 'rgb(255, 255, 255)');
        alarmText.textContent = 'Turn off the sound on the computer if it might interfere with you now.';
  }
  drawControls()
  // Draw the score
  function drawScore() {
    const w = settings.svg.getAttributeNS(null, 'width');
    // const h = settings.svg.getAttributeNS(null, 'height');
    const font = '"Orbitron", sans-serif';
    const score_1 = document.createElementNS(svgNS, 'text');
    settings.svg.append(score_1);
    score_1.setAttributeNS(null, 'id', 'score_1');
    score_1.setAttributeNS(null, 'x', w / 2 - 30);
    score_1.setAttributeNS(null, 'y', settings.fieldOffsetTop * 0.8);
    score_1.setAttributeNS(null, 'text-anchor', 'middle');
    score_1.setAttributeNS(null, 'font-size', settings.scoreFontSize);
    score_1.setAttributeNS(null, 'font-family', font);
    score_1.setAttributeNS(null, 'fill', settings.racketPlayer1_color);
    score_1.textContent = settings.playerScoreCounter_1;
      const colon = document.createElementNS(svgNS, 'text');
      settings.svg.append(colon);
      colon.setAttributeNS(null, 'x', w / 2);
      colon.setAttributeNS(null, 'y', settings.fieldOffsetTop * 0.77);
      colon.setAttributeNS(null, 'text-anchor', 'middle');
      colon.setAttributeNS(null, 'font-size', settings.scoreFontSize);
      colon.setAttributeNS(null, 'font-family', font);
      colon.setAttributeNS(null, 'fill', settings.ballColor);
      colon.textContent = String.fromCharCode(58);
        const score_2 = document.createElementNS(svgNS, 'text');
        settings.svg.append(score_2);
        score_2.setAttributeNS(null, 'id', 'score_2');
        score_2.setAttributeNS(null, 'x', w / 2 + 30);
        score_2.setAttributeNS(null, 'y', settings.fieldOffsetTop * 0.8);
        score_2.setAttributeNS(null, 'text-anchor', 'middle');
        score_2.setAttributeNS(null, 'font-size', settings.scoreFontSize);
        score_2.setAttributeNS(null, 'font-family', font);
        score_2.setAttributeNS(null, 'fill', settings.racketPlayer2_color);
        score_2.textContent = settings.playerScoreCounter_2;
  }
  drawScore()
   //Draw field
  function drawField() {
    const field = document.createElementNS(svgNS, 'rect');
    field.setAttributeNS(null, 'id', 'field');
    field.setAttributeNS(null, 'x', 0);
    field.setAttributeNS(null, 'y', settings.fieldOffsetTop);
    field.setAttributeNS(null, 'width', settings.svgWidth);
    field.setAttributeNS(null, 'height', settings.svgHeight - settings.fieldOffsetTop);
    field.setAttributeNS(null, 'stroke', 'rgb(255, 255, 255)');
    field.setAttributeNS(null, 'fill', settings.fieldColor);
    settings.svg.append(field);
  }
  drawField()
  //Draw start countdown
  function drawStartCountdown() {
    const w = settings.svg.getAttributeNS(null, 'width');
    const h = settings.svg.getAttributeNS(null, 'height');
    const font = '"Orbitron", sans-serif';
    const startCountdown = document.createElementNS(svgNS, 'text');
    settings.svg.append(startCountdown);
    startCountdown.setAttributeNS(null, 'id', 'countdown');
    startCountdown.setAttributeNS(null, 'x', w / 2);
    startCountdown.setAttributeNS(null, 'y', h / 2);
    startCountdown.setAttributeNS(null, 'text-anchor', 'middle');
    startCountdown.setAttributeNS(null, 'font-size', parseInt(settings.scoreFontSize) * 2.5 + 'rem');
    startCountdown.setAttributeNS(null, 'font-family', font);
    startCountdown.setAttributeNS(null, 'fill', 'rgb(255, 255, 255)');
    startCountdown.textContent = settings.countdown;
  }
  drawStartCountdown()
  //Draw rackets
  function drawRacket(player) {
    const field = document.getElementById('field');
    const w = parseInt(field.getAttributeNS(null, 'width'));
    const h = parseInt(field.getAttributeNS(null, 'height'));
    const racket = document.createElementNS(svgNS, 'rect');
    if (player === 'player_1') {
      racket.setAttributeNS(null, 'id', 'racket_1');
      racket.setAttributeNS(null, 'x', 0);
      racket.setAttributeNS(null, 'y', settings.fieldOffsetTop + settings.racketInitialPosY);
      racket.setAttributeNS(null, 'fill', settings.racketPlayer1_color);
    } else if (player === 'player_2') {
      racket.setAttributeNS(null, 'id', 'racket_2');
      racket.setAttributeNS(null, 'x', w - settings.racketWidth);
      racket.setAttributeNS(null, 'y', settings.fieldOffsetTop + h - settings.racketHeight - settings.racketInitialPosY);
      racket.setAttributeNS(null, 'fill', settings.racketPlayer2_color);
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
    const w = field.getAttributeNS(null, 'width');
    const h = field.getAttributeNS(null, 'height');
    const ball = document.createElementNS(svgNS, 'circle');
    ball.setAttributeNS(null, 'id', 'ball');
    ball.setAttributeNS(null, 'cx', w / 2);
    ball.setAttributeNS(null, 'cy', h / 2 + settings.fieldOffsetTop);
    ball.setAttributeNS(null, 'r', settings.ballSize);
    ball.setAttributeNS(null, 'fill', settings.ballColor);
    settings.svg.append(ball);
  }
  drawBall()
}
drawSvgElements()















const curryHandler = function(duration, fn) {
  return () => startTimer(duration, fn);
}; 
const startBtnHandler = curryHandler(settings.startCountdown, startGame);
document.getElementById('start_btn').addEventListener('click', startBtnHandler);

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
  moveBall(); // window.requestAnimationFrame(moveBall);
}

function startTimer(duration, fn) {
  // gameSoundInit(countdownSound, startGameSound, wallHitSound, racketHitSound, missSound, fanfareSound);
  document.getElementById('start_btn').removeEventListener('click', startBtnHandler);
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

