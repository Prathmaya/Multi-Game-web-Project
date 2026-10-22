const canvas = document.getElementById("gamecanvas");
const ctx = canvas.getContext("2d");

let gameLoopId;
let score = 0;
let highscore = parseInt(localStorage.getItem("space_high_score")) || 0;

const player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 40,
    width: 30,
    height: 30,
    speed: 6
};

let bullets = [];
let enemies = [];
let stars = Array.from({ length: 50 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 0.5,
    speed: Math.random() * 2 + 1
}));

const keys = {};

window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if ((e.code === "Space" || e.key === " ") && window.currentGame === "space") {
        e.preventDefault();
        if (bullets.length < 5) {
            bullets.push({
                x: player.x + player.width / 2 - 2,
                y: player.y,
                width: 4,
                height: 12,
                speed: 8
            });
        }
    }
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function updateSpace() {
    if ((keys["ArrowLeft"] || keys["a"] || keys["A"]) && player.x > 0) {
        player.x -= player.speed;
    }
    if ((keys["ArrowRight"] || keys["d"] || keys["D"]) && player.x + player.width < canvas.width) {
        player.x += player.speed;
    }

    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });

    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
        }
    }

    if (Math.random() < 0.04 && enemies.length < 8) {
        enemies.push({
            x: Math.random() * (canvas.width - 25),
            y: -25,
            width: 25,
            height: 25,
            speed: Math.random() * 2 + 1.5
        });
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].y += enemies[i].speed;
        for (let j = bullets.length - 1; j >= 0; j--) {
            let b = bullets[j];
            let e = enemies[i];
            if (
                b && e &&
                b.x < e.x + e.width &&
                b.x + b.width > e.x &&
                b.y < e.y + e.height &&
                b.y + b.height > e.y
            ) {
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                score += 10;
                if (score > highscore) {
                    highscore = score;
                    localStorage.setItem("space_high_score", highscore);
                }
                break;
            }
        }
        if (enemies[i] && enemies[i].y > canvas.height) {
            score = 0;
            enemies = [];
            bullets = [];
            player.x = canvas.width / 2 - 15;
            break;
        }
    }

    const scoreVal = document.getElementById("score");
    if (scoreVal) {
        scoreVal.innerText = `${score} | Best: ${highscore}`;
    }
}

function drawSpace() {
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    stars.forEach(star => {
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });

    ctx.fillStyle = "#7b00ff";
    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y);
    ctx.lineTo(player.x, player.y + player.height);
    ctx.lineTo(player.x + player.width, player.y + player.height);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#9a0d0d";
    bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));
    ctx.fillStyle = "#30b618";
    enemies.forEach(e => ctx.fillRect(e.x, e.y, e.width, e.height));
}
window.initSpaceGame = function () {
    window.currentGame = "space";
    score = 0;
    bullets = [];
    enemies = [];
};
