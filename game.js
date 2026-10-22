let currentGame = "snake";
let snakeInterval = null;

const canvas = document.getElementById("gamecanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gridsize = 20;
const tilecount = canvas.width / gridsize;
let snake = [{ x: 10, y: 10 }];
let dx = 1;
let dy = 0;
let foodX = 5;
let foodY = 5;
let snakeScore = 0;

function switchGame(gameName) {
    currentGame = gameName;
    document.getElementById("score").innerText = "0";
    document.getElementById("btn-snake").classList.remove("active");
    document.getElementById("btn-space").classList.remove("active");

    clearInterval(snakeInterval);
    if (typeof stopSpaceGame === "function") stopSpaceGame();

    if (gameName === "snake") {
        document.getElementById("btn-snake").classList.add("active");
        document.getElementById("controls-text").innerText = "Use arrow keys or WASD to move the snake.";
        resetSnakeGame();
        snakeInterval = setInterval(runSnake, 100);
    } else if (gameName === "space") {
        document.getElementById("btn-space").classList.add("active");
        document.getElementById("controls-text").innerText = "Use arrow keys to move and spacebar to shoot.";
        if (typeof startSpaceGame === "function") startSpaceGame();
    }
}

function runSnake() {
    updateSnake();
    drawSnake();
}

function updateSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    if (head.x < 0) head.x = tilecount - 1;
    if (head.x >= tilecount) head.x = 0;
    if (head.y < 0) head.y = tilecount - 1;
    if (head.y >= tilecount) head.y = 0;
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetSnakeGame();
            return;
        }
    }
    snake.unshift(head);
    if (head.x === foodX && head.y === foodY) {
        snakeScore += 10;
        scoreElement.innerText = snakeScore;
        generateFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#7300ff";
    snake.forEach((part) => {
        ctx.fillRect(part.x * gridsize, part.y * gridsize, gridsize - 2, gridsize - 2);
    });
    ctx.fillStyle = "#ff0055";
    ctx.fillRect(foodX * gridsize, foodY * gridsize, gridsize - 2, gridsize - 2);
}

function generateFood() {
    foodX = Math.floor(Math.random() * tilecount);
    foodY = Math.floor(Math.random() * tilecount);
}

function resetSnakeGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 1;
    dy = 0;
    snakeScore = 0;
    scoreElement.innerText = snakeScore;
    generateFood();
}

window.addEventListener("keydown", (e) => {
    if (currentGame === "snake") {
        if ((e.key === "ArrowUp" || e.key === "w") && dy !== 1) {
            dx = 0; dy = -1;
        } else if ((e.key === "ArrowDown" || e.key === "s") && dy !== -1) {
            dx = 0; dy = 1;
        } else if ((e.key === "ArrowLeft" || e.key === "a") && dx !== 1) {
            dx = -1; dy = 0;
        } else if ((e.key === "ArrowRight" || e.key === "d") && dx !== -1) {
            dx = 1; dy = 0;
        }
    }
});
resetSnakeGame();
snakeInterval = setInterval(runSnake, 100);
