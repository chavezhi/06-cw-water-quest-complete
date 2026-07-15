// Game configuration and state variables
const GOAL_CANS = 20;
let currentCans = 0;
let gameActive = false;
let spawnInterval;
let timerInterval;
let timeLeft = 30;

const grid = document.querySelector('.game-grid');
const scoreDisplay = document.getElementById('current-cans');
const timerDisplay = document.getElementById('timer');
const achievementDisplay = document.getElementById('achievements');
const startButton = document.getElementById('start-game');
const winningMessages = [
  'You won! Great job saving the water!',
  'Amazing work! You collected enough cans!',
  'Victory! Your teamwork made a difference!'
];
const losingMessages = [
  'Try again! You can do it next time.',
  'Almost there! Keep practicing and try again.',
  'Try again! Every click helps you improve.'
];

function updateScore() {
  scoreDisplay.textContent = currentCans;
}

function updateTimer() {
  timerDisplay.textContent = timeLeft;
}

function showMessage(message, isWin = false) {
  achievementDisplay.textContent = message;
  achievementDisplay.style.color = isWin ? '#159A48' : '#F5402C';
}

function getRandomMessage(messages) {
  return messages[Math.floor(Math.random() * messages.length)];
}

function clearMessage() {
  achievementDisplay.textContent = '';
  achievementDisplay.style.color = '';
}

// Creates the 3x3 game grid where items will appear
function createGrid() {
  grid.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    grid.appendChild(cell);
  }
}

// Ensure the grid is created when the page loads
createGrid();

// Spawns a new item in a random grid cell
function spawnWaterCan() {
  if (!gameActive) return;
  const cells = document.querySelectorAll('.grid-cell');

  cells.forEach(cell => (cell.innerHTML = ''));

  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <div class="water-can"></div>
    </div>
  `;
}

function startGame() {
  if (gameActive) return;

  gameActive = true;
  currentCans = 0;
  timeLeft = 30;
  updateScore();
  updateTimer();
  clearMessage();
  createGrid();
  spawnWaterCan();

  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  spawnInterval = setInterval(spawnWaterCan, 1000);
  timerInterval = setInterval(() => {
    timeLeft -= 1;
    updateTimer();

    if (timeLeft <= 0) {
      endGame(currentCans >= GOAL_CANS);
    }
  }, 1000);
}

function endGame(isWin = false) {
  gameActive = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  const message = isWin ? getRandomMessage(winningMessages) : getRandomMessage(losingMessages);
  showMessage(message, isWin);
}

function handleCanClick(event) {
  const clickedCan = event.target.closest('.water-can');
  if (!gameActive || !clickedCan) return;

  clickedCan.closest('.water-can-wrapper').remove();
  currentCans += 1;
  updateScore();

  if (currentCans >= GOAL_CANS) {
    endGame(true);
    return;
  }

}

startButton.addEventListener('click', startGame);
grid.addEventListener('click', handleCanClick);
