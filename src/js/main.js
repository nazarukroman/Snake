const boardCanvas = document.getElementById('board');
const snakeCanvas = document.getElementById('snake');
const startButton = document.querySelector('.button--start');
const pauseButton = document.querySelector('.button--pause');
const board = boardCanvas.getContext('2d');
const snake = snakeCanvas.getContext('2d');

const CELL_SIZE = 30;
const BOARD_SIZE = {
  WIDTH: 600,
  HEIGHT: 600,
  START: 0,
};
const COLOR = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  RED: '#AA0000',
  GREEN: 'lightgreen',
  TRANSPARENT_WHITE: 'rgba(255, 255, 255, 0.5)',
};
const BUTTON_CODE = {
  SPACE: 32,
  LEFT_ARROW: 37,
  UP_ARROW: 38,
  RIGHT_ARROW: 39,
  DOWN_ARROW: 40,
};
const DIRECTION = {
  LEFT: 'left',
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
};
let currentDirection = null;
const DEFAULT_DIRECTION = DIRECTION.RIGHT;
let score = 0;
const GAME_STATUS = {
  PLAY: 0,
  NONE: 1,
  GAMEOVER: 2,
  GAMEWIN: 3,
  PAUSE: 4,
};
let currentGameStatus = GAME_STATUS.NONE;
let snakeBody = [
  {x: 300, y: 300},
  {x: 270, y: 300},
  {x: 240, y: 300},
];
let drawInterval;
boardCanvas.width = BOARD_SIZE.WIDTH;
boardCanvas.height = BOARD_SIZE.HEIGHT;

/**
 * Находим рандомное число от 0 до 600, которое делится на 30
 * @param min
 * @param max
 * @returns {number}
 */
const getRandomAppleCoordinate = (min, max) => (
  Math.round((Math.random() * (max-min) + min) / CELL_SIZE) * CELL_SIZE
);

let apple = {
  x: getRandomAppleCoordinate(BOARD_SIZE.START, BOARD_SIZE.WIDTH - CELL_SIZE),
  y: getRandomAppleCoordinate(BOARD_SIZE.START, BOARD_SIZE.HEIGHT - CELL_SIZE),
};

/**
 * Обновляем счет
 * Заменяем текст у DOM елемента
 * @param score – счет
 */
const updateScore = (score) => {
  const scoreElement = document.querySelector('.score span');
  scoreElement.textContent = score;
};

const drawMessages = () => {
  switch (currentGameStatus) {
    case GAME_STATUS.NONE:
      board.clearRect(0, 0, BOARD_SIZE.WIDTH, BOARD_SIZE.HEIGHT);
      board.fillStyle = COLOR.TRANSPARENT_WHITE;
      board.strokeStyle= COLOR.TRANSPARENT_WHITE;
      board.beginPath();
      board.moveTo(0, 0);
      board.lineTo(0, BOARD_SIZE.HEIGHT);
      board.moveTo(0, 0);
      board.lineTo(BOARD_SIZE.WIDTH, 0);
      board.moveTo(0, BOARD_SIZE.HEIGHT);
      board.lineTo(BOARD_SIZE.WIDTH, BOARD_SIZE.HEIGHT);
      board.moveTo(BOARD_SIZE.WIDTH, 0);
      board.lineTo(BOARD_SIZE.WIDTH, BOARD_SIZE.HEIGHT);
      board.stroke();
      board.font = '32px sans-serif';
      board.fillText('Press space to start', 150, 300);

      break;

    case GAME_STATUS.PLAY:
      drawBoard();
  }
};

/**
 * Рисуем поле в клеточку
 */
const drawBoard = () => {
  board.clearRect(0, 0, BOARD_SIZE.WIDTH, BOARD_SIZE.HEIGHT);
  board.strokeStyle = COLOR.TRANSPARENT_WHITE;
  board.beginPath();
  for (let i = BOARD_SIZE.START; i <= BOARD_SIZE.HEIGHT; i += CELL_SIZE) {
    board.moveTo(0, i);
    board.lineTo(BOARD_SIZE.WIDTH, i);
  }
  for (let i = 0; i <= BOARD_SIZE.HEIGHT; i += CELL_SIZE) {
    board.moveTo(i, BOARD_SIZE.START);
    board.lineTo(i, BOARD_SIZE.HEIGHT);
  }
  board.stroke();
};

/**
 * Проверяем на столкновение с телом
 * Если столкновение произошло, то отрезаем хвост
 * @param head – объект с координатами головы
 * @param arraySnake – массив координат змеи
 */
const collisionCheck = (head, arraySnake) => {
  arraySnake.forEach((item, index) => {
    if (item.x === head.x && item.y === head.y) {
      arraySnake.splice(index, arraySnake.length - index);
      score = snakeBody.length - 2;
      updateScore(score);
    }
  })
};

/**
 * Рисуем Яблоко
 */
const drawApple = () => {
  snake.fillStyle = COLOR.RED;
  snake.fillRect(apple.x , apple.y, CELL_SIZE, CELL_SIZE);
};

/**
 * Рисуем часть змейки(квадрат)
 * @param snakePart объект с координатами x, y
 */
const drawSnakePart = (snakePart) => {
  snake.fillStyle = COLOR.GREEN;
  snake.strokeStyle = COLOR.BLACK;

  snake.fillRect(snakePart.x, snakePart.y, CELL_SIZE, CELL_SIZE);
  snake.strokeRect(snakePart.x, snakePart.y, CELL_SIZE, CELL_SIZE);
};

/**
 * Рисуем целую змею из массива snakeBody
 * Находим новую голову змеи, ее координаты меняются
 * В зависимости от нажатия стрелочки
 */
const drawSnake = () => {
  drawMessages();
  if (currentDirection !== null) {
    let newHead = {x: snakeBody[0].x, y: snakeBody[0].y};
    snakeCanvas.width = BOARD_SIZE.WIDTH;
    snakeCanvas.height = BOARD_SIZE.HEIGHT;
    drawApple();

    snakeBody.forEach(drawSnakePart);

    if (currentDirection === DIRECTION.LEFT) {
      newHead.x === 0 ?
        newHead.x = BOARD_SIZE.WIDTH - CELL_SIZE :
        newHead.x -= CELL_SIZE;
    }
    if (currentDirection === DIRECTION.TOP) {
      newHead.y === BOARD_SIZE.START ?
        newHead.y = BOARD_SIZE.HEIGHT - CELL_SIZE :
        newHead.y -= CELL_SIZE;
    }
    if (currentDirection === DIRECTION.RIGHT) {
      newHead.x < BOARD_SIZE.WIDTH - CELL_SIZE ?
        newHead.x += CELL_SIZE :
        newHead.x = 0;
    }
    if (currentDirection === DIRECTION.BOTTOM) {
      newHead.y === BOARD_SIZE.HEIGHT - CELL_SIZE ?
        newHead.y = BOARD_SIZE.START :
        newHead.y += CELL_SIZE;
    }

    if (snakeBody[0].x === apple.x && snakeBody[0].y === apple.y) {
      score++;
      updateScore(score);
      apple.x = getRandomAppleCoordinate(0, BOARD_SIZE.WIDTH - CELL_SIZE);
      apple.y = getRandomAppleCoordinate(0, BOARD_SIZE.HEIGHT - CELL_SIZE);
    } else {
      snakeBody.pop();
    }

    collisionCheck(newHead, snakeBody);

    snakeBody.unshift(newHead);
  }
};

const createInterval = () => setInterval(drawSnake, 1000/6);

const handleInput = (e) => {
  e.preventDefault();
  const leftRightDirection = currentDirection !== DIRECTION.RIGHT && currentDirection !== DIRECTION.LEFT;
  const topBottomDirection = currentDirection !== DIRECTION.TOP && currentDirection !== DIRECTION.BOTTOM;

  switch (e.keyCode) {
    case BUTTON_CODE.SPACE:
      currentGameStatus = GAME_STATUS.PLAY;
      currentDirection = DEFAULT_DIRECTION;
      break;

    case BUTTON_CODE.LEFT_ARROW:
      leftRightDirection && (currentDirection = DIRECTION.LEFT);
      break;

    case BUTTON_CODE.RIGHT_ARROW:
      leftRightDirection && (currentDirection = DIRECTION.RIGHT);
      break;

    case BUTTON_CODE.UP_ARROW:
       topBottomDirection && (currentDirection = DIRECTION.TOP);
      break;

    case BUTTON_CODE.DOWN_ARROW:
        topBottomDirection && (currentDirection = DIRECTION.BOTTOM);
      break;
  }
};

const changeGameStatus = (status) => {
  switch (status) {
    case GAME_STATUS.PLAY:
      currentGameStatus = GAME_STATUS.PLAY;
      currentDirection === null && (currentDirection = DEFAULT_DIRECTION);
      clearInterval(drawInterval);
      drawInterval = createInterval();
      break;

    case GAME_STATUS.PAUSE:
      currentGameStatus = GAME_STATUS.PAUSE;
      clearInterval(drawInterval);
      break;
  }
};

window.onload = () => {
  document.addEventListener('keydown', handleInput);
  startButton.addEventListener('click', () => changeGameStatus(GAME_STATUS.PLAY));
  pauseButton.addEventListener('click', () => changeGameStatus(GAME_STATUS.PAUSE));
  drawInterval = createInterval();
};