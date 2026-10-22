let spaceLoopId;
let spaceScore = 0;
let spaceHighscore = parseInt(localStorage.getItem("space_high_score")) || 0;

const player = {
    x: 200 - 15,
    y: 400 - 40,
    width: 30,
    height: 30,
    speed: 5
};

let spaceBullets = [];
let spaceEnemies = [];
let spaceStars = Array.from({ length: 50 }, () => ({
    x: Math.random() * 400,
    y: Math.random() * 400,
    size: Math.random() * 2 + 0.5,
    speed: Math.random() * 2 + 1
}));

const spaceKeys = {};

window.addEventListener("keydown", (e) => {
    if (currentGame === "space") {
        spaceKeys[e.key] = true;
        if (e.code === "Space" || e.key === " ") {
            e.preventDefault();
            if (spaceBullets.length < 5) {
                spaceBullets.push({
                    x: player.x + player.width / 2 - 2,
                    y: player.y,
                    width: 4,
                    height: 12,
                    speed: 7
                });
            }
        }
    }
});

window.addEventListener("keyup", (e) => {
    if (currentGame === "space") {
        spaceKeys[e.key] = false;
    }
});

function updateSpace() {
    if ((spaceKeys["ArrowLeft"] || spaceKeys["a"] || spaceKeys["A"]) && player.x > 0) {
        player.x -= player.speed;
    }
    if ((spaceKeys["ArrowRight"] || spaceKeys["d"] || spaceKeys["D"]) && player.x + player.width < 400) {
        player.x += player.speed;
    }

    spaceStars.forEach(star => {
        star.y += star.speed;
        if (star.y > 400) {
            star.y = 0;
            star.x = Math.random() * 400;
        }
    });

    for (let i = spaceBullets.length - 1; i >= 0; i--) {
        spaceBullets[i].y -= spaceBullets[i].speed;
        if (spaceBullets[i].y < 0) {
            spaceBullets.splice(i, 1);
        }
    }

    if (Math.random() < 0.03 && spaceEnemies.length < 6) {
        spaceEnemies.push({
            x: Math.random() * (400 - 25),
            y: -25,
            width: 25,
            height: 25,
            speed: Math.random() * 2 + 1
        });
    }

    for (let i = spaceEnemies.length - 1; i >= 0; i--) {
        spaceEnemies[i].y += spaceEnemies[i].speed;
        for (let j = spaceBullets.length - 1; j >= 0; j--) {
            let b = spaceBullets[j];
            let e = spaceEnemies[i];
            if (
                b && e &&
                b.x < e.x + e.width &&
                b.x + b.width > e.x &&
                b.y < e.y + e.height &&
                b.y + b.height > e.y
            ) {
                spaceEnemies.splice(i, 1);
                spaceBullets.splice(j, 1);
                spaceScore += 10;
                if (spaceScore > spaceHighscore) {
                    spaceHighscore = spaceScore;
                    localStorage.setItem("space_high_score", spaceHighscore);
                }
                break;
            }
        }
        if (spaceEnemies[i] && spaceEnemies[i].y > 400) {
            spaceScore = 0;
            spaceEnemies = [];
            spaceBullets = [];
            player.x = 200 - 15;
            break;
        }
    }

    const scoreEl = document.getElementById("score");
    if (scoreEl && currentGame === "space") {
        scoreEl.innerText = `${spaceScore} | Best: ${spaceHighscore}`;
    }
}

function drawSpace() {
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, 0, 400, 400);

    ctx.fillStyle = "#ffffff";
    spaceStars.forEach(star => {
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
    spaceBullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

    ctx.fillStyle = "#30b618";
    spaceEnemies.forEach(e => ctx.fillRect(e.x, e.y, e.width, e.height));
}

function spaceLoop() {
    if (currentGame === "space") {
        updateSpace();
        drawSpace();
        spaceLoopId = requestAnimationFrame(spaceLoop);
    }
}

window.startSpaceGame = function () {
    spaceScore = 0;
    spaceBullets = [];
    spaceEnemies = [];
    player.x = 200 - 15;
    cancelAnimationFrame(spaceLoopId);
    spaceLoop();
};

window.stopSpaceGame = function () {
    cancelAnimationFrame(spaceLoopId);
};
