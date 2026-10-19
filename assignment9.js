"use strict";

// ============================================
// MINI GOLF - ASSIGNMENT 9
// ============================================

const canvas = document.getElementById("golfCanvas");
const ctx = canvas.getContext("2d");

const statusText = document.getElementById("golfStatus");
const levelDisplay = document.getElementById("levelDisplay");
const shotCountDisplay = document.getElementById("shotCount");
const totalShotsDisplay = document.getElementById("totalShots");
const powerUpCountDisplay = document.getElementById("powerUpCount");
const coinCountDisplay = document.getElementById("coinCount");
const resetButton = document.getElementById("resetGolf");
const nextLevelButton = document.getElementById("nextLevel");

const W = canvas.width;
const H = canvas.height;

let level = 1;
let shots = 0;
let totalShots = 0;
let powerUpsCollected = 0;
let coinsCollected = 0;

let ball;
let hole;
let obstacles = [];
let bunkers = [];
let waterHazards = [];
let powerUps = [];

let moving = false;
let dragging = false;
let demoActive = true;
let demoFrames = 180;
let levelComplete = false;
let gameComplete = false;

let boostNextShot = false;
let magnetActive = false;
let waterShieldActive = false;

let pointerX = 0;
let pointerY = 0;
let lastSafePosition = { x: 100, y: 400 };

const MAX_DRAG = 110;
const MAX_SPEED = 11;
const STOP_SPEED = 0.12;

function createLevel(n) {
    ball = { x: 100, y: 400, radius: 12, dx: 0, dy: 0 };
    hole = { x: 775, y: 125, radius: 18 };

    obstacles = [];
    bunkers = [];
    waterHazards = [];
    powerUps = [];

    boostNextShot = false;
    magnetActive = false;
    waterShieldActive = false;

    if (n === 1) {
        bunkers.push({ x: 390, y: 280, rx: 75, ry: 38 });

        powerUps.push(
            { x: 210, y: 250, type: "coin", collected: false },
            { x: 270, y: 335, type: "star", collected: false }
        );
    }

    if (n === 2) {
        hole.y = 100;

        bunkers.push(
            { x: 330, y: 275, rx: 70, ry: 36 },
            { x: 600, y: 330, rx: 65, ry: 32 }
        );

        obstacles.push(
            { x: 360, y: 170, radius: 24 },
            { x: 510, y: 250, radius: 28 },
            { x: 660, y: 170, radius: 22 }
        );

        powerUps.push(
            { x: 470, y: 390, type: "boost", collected: false },
            { x: 690, y: 240, type: "magnet", collected: false },
            { x: 430, y: 100, type: "coin", collected: false }
        );
    }

    if (n === 3) {
        hole = { x: 790, y: 100, radius: 18 };

        bunkers.push(
            { x: 280, y: 300, rx: 65, ry: 34 },
            { x: 600, y: 370, rx: 75, ry: 35 }
        );

        obstacles.push(
            { x: 330, y: 175, radius: 25 },
            { x: 470, y: 290, radius: 28 },
            { x: 650, y: 175, radius: 24 },
            { x: 720, y: 300, radius: 22 }
        );

        waterHazards.push({ x: 510, y: 135, rx: 95, ry: 48 });

        powerUps.push(
            { x: 380, y: 410, type: "star", collected: false },
            { x: 690, y: 420, type: "boost", collected: false },
            { x: 400, y: 100, type: "shield", collected: false },
            { x: 580, y: 220, type: "coin", collected: false }
        );
    }

    lastSafePosition = { x: ball.x, y: ball.y };
    updateScoreboard();
}

function updateScoreboard() {
    levelDisplay.textContent = "Level " + level + " of 3";
    shotCountDisplay.textContent = shots;
    totalShotsDisplay.textContent = totalShots;
    powerUpCountDisplay.textContent = powerUpsCollected;
    coinCountDisplay.textContent = coinsCollected;
}

// Draw the golf course
function drawCourse() {
    const grass = ctx.createLinearGradient(0, 0, W, H);
    grass.addColorStop(0, "#397b48");
    grass.addColorStop(1, "#205b37");

    ctx.fillStyle = grass;
    ctx.fillRect(0, 0, W, H);

    // Fairway
    ctx.fillStyle = "#80bd70";
    ctx.beginPath();
    ctx.ellipse(450, 270, 350, 220, -0.05, 0, Math.PI * 2);
    ctx.fill();

    // Stripes
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(450, 270, 350, 220, -0.05, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = "rgba(255,255,255,0.09)";
    for (let x = 120; x < 850; x += 90) {
        ctx.fillRect(x, 40, 42, 460);
    }
    ctx.restore();

    // Water
    for (const water of waterHazards) {
        ctx.fillStyle = "#258ac0";
        ctx.beginPath();
        ctx.ellipse(water.x, water.y, water.rx, water.ry, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#8ee5ff";
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    // Sand
    for (const sand of bunkers) {
        ctx.fillStyle = "#e9d6a2";
        ctx.beginPath();
        ctx.ellipse(sand.x, sand.y, sand.rx, sand.ry, -0.2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Rocks
    for (const rock of obstacles) {
        ctx.fillStyle = "#777e82";
        ctx.beginPath();
        ctx.arc(rock.x, rock.y, rock.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#d0d5d8";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Green around the hole
    ctx.fillStyle = "#a8d98b";
    ctx.beginPath();
    ctx.ellipse(hole.x, hole.y, 65, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hole and flag
    ctx.fillStyle = "#142319";
    ctx.beginPath();
    ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(hole.x, hole.y);
    ctx.lineTo(hole.x, hole.y - 65);
    ctx.stroke();

    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.moveTo(hole.x, hole.y - 65);
    ctx.lineTo(hole.x + 38, hole.y - 53);
    ctx.lineTo(hole.x, hole.y - 40);
    ctx.closePath();
    ctx.fill();

    // Power-up icons
    const icons = {
        star: "★",
        boost: "⚡",
        magnet: "M",
        shield: "S",
        coin: "$"
    };

    const colors = {
        star: "#ffcb35",
        boost: "#26c6da",
        magnet: "#bb86fc",
        shield: "#258ac0",
        coin: "#ffb300"
    };

    for (const item of powerUps) {
        if (item.collected) continue;

        ctx.fillStyle = colors[item.type];
        ctx.beginPath();
        ctx.arc(item.x, item.y, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(icons[item.type], item.x, item.y);
    }

    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";

    // Course information and border
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px Arial";
    ctx.fillText("MINI GOLF | LEVEL " + level, 22, 30);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, W - 4, H - 4);
}

// Draw the ball
function drawBall() {
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(ball.x + 4, ball.y + 5, 14, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    const gradient = ctx.createRadialGradient(
        ball.x - 4, ball.y - 5, 1,
        ball.x, ball.y, ball.radius * 1.4
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.7, "#f4f4ee");
    gradient.addColorStop(1, "#b7c0b8");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#aab5aa";
    ctx.stroke();
}

// Draw aiming line
function drawAim() {
    if (!dragging || moving || demoActive) return;

    const dx = ball.x - pointerX;
    const dy = ball.y - pointerY;
    const distance = Math.hypot(dx, dy);

    if (distance < 3) return;

    const length = Math.min(distance, MAX_DRAG);

    ctx.save();
    ctx.strokeStyle = "#fff4a8";
    ctx.lineWidth = 3;
    ctx.setLineDash([7, 5]);

    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y);
    ctx.lineTo(
        ball.x + dx / distance * length,
        ball.y + dy / distance * length
    );
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Arial";
    ctx.fillText(
        "Power: " + Math.round(length / MAX_DRAG * 100) + "%",
        22, H - 25
    );
}


function getCanvasPosition(event) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left) * W / rect.width,
        y: (event.clientY - rect.top) * H / rect.height
    };
}

canvas.addEventListener("pointerdown", function (event) {
    if (demoActive || moving || levelComplete || gameComplete) return;

    const p = getCanvasPosition(event);

    if (Math.hypot(p.x - ball.x, p.y - ball.y) <= ball.radius + 16) {
        dragging = true;
        pointerX = p.x;
        pointerY = p.y;
        canvas.setPointerCapture(event.pointerId);

        statusText.textContent = "Drag backward to aim, then release!";
    }
});

canvas.addEventListener("pointermove", function (event) {
    if (!dragging) return;

    const p = getCanvasPosition(event);
    pointerX = p.x;
    pointerY = p.y;
});

canvas.addEventListener("pointerup", function (event) {
    if (!dragging) return;

    const p = getCanvasPosition(event);
    pointerX = p.x;
    pointerY = p.y;
    dragging = false;

    shoot();
});

canvas.addEventListener("pointercancel", function () {
    dragging = false;
});

function shoot() {
    const dx = ball.x - pointerX;
    const dy = ball.y - pointerY;
    const distance = Math.hypot(dx, dy);

    if (distance < 8) {
        statusText.textContent = "Drag farther to shoot.";
        return;
    }

    let speed = Math.min(distance, MAX_DRAG) / MAX_DRAG * MAX_SPEED;

    if (boostNextShot) {
        speed = Math.min(speed * 1.5, 14);
        boostNextShot = false;
    }

    ball.dx = dx / distance * speed;
    ball.dy = dy / distance * speed;

    shots++;
    totalShots++;
    moving = true;

    magnetActive = false;
    lastSafePosition = { x: ball.x, y: ball.y };

    updateScoreboard();
    statusText.textContent = "Shot " + shots + "! Watch the ball roll.";
}

function isInsideEllipse(x, y, item) {
    return ((x - item.x) / item.rx) ** 2 +
           ((y - item.y) / item.ry) ** 2 <= 1;
}

function isOnSand(x, y) {
    return bunkers.some(s => isInsideEllipse(x, y, s));
}

function isInWater(x, y) {
    return waterHazards.some(w => isInsideEllipse(x, y, w));
}

function moveBall() {
    if (!moving || demoActive || levelComplete || gameComplete) return;

    // Hole magnet attracts the ball while it is moving
    if (magnetActive) {
        const dx = hole.x - ball.x;
        const dy = hole.y - ball.y;
        const distance = Math.hypot(dx, dy);

        if (distance > 0 && distance < 250) {
            ball.dx += dx / distance * 0.12;
            ball.dy += dy / distance * 0.12;

            const speed = Math.hypot(ball.dx, ball.dy);

            if (speed > 9) {
                ball.dx = ball.dx / speed * 9;
                ball.dy = ball.dy / speed * 9;
            }
        }
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce off boundaries
    if (ball.x - ball.radius < 10) {
        ball.x = 10 + ball.radius;
        ball.dx = Math.abs(ball.dx) * 0.75;
    }

    if (ball.x + ball.radius > W - 10) {
        ball.x = W - 10 - ball.radius;
        ball.dx = -Math.abs(ball.dx) * 0.75;
    }

    if (ball.y - ball.radius < 10) {
        ball.y = 10 + ball.radius;
        ball.dy = Math.abs(ball.dy) * 0.75;
    }

    if (ball.y + ball.radius > H - 10) {
        ball.y = H - 10 - ball.radius;
        ball.dy = -Math.abs(ball.dy) * 0.75;
    }

    // Bounce off rocks
    for (const rock of obstacles) {
        const dx = ball.x - rock.x;
        const dy = ball.y - rock.y;
        const distance = Math.hypot(dx, dy);
        const minimum = ball.radius + rock.radius;

        if (distance < minimum && distance > 0) {
            const nx = dx / distance;
            const ny = dy / distance;

            ball.x = rock.x + nx * minimum;
            ball.y = rock.y + ny * minimum;

            const dot = ball.dx * nx + ball.dy * ny;

            if (dot < 0) {
                ball.dx = (ball.dx - 2 * dot * nx) * 0.75;
                ball.dy = (ball.dy - 2 * dot * ny) * 0.75;
            }
        }
    }

    // Water hazard and one-use shield
    if (isInWater(ball.x, ball.y)) {
        ball.x = lastSafePosition.x;
        ball.y = lastSafePosition.y;
        ball.dx = 0;
        ball.dy = 0;
        moving = false;
        magnetActive = false;

        if (waterShieldActive) {
            waterShieldActive = false;
            statusText.textContent = "Water shield saved you! No penalty!";
        } else {
            shots++;
            totalShots++;
            statusText.textContent = "Water hazard! One penalty shot added.";
        }

        updateScoreboard();
        return;
    }

    // Collect power-ups
    for (const item of powerUps) {
        if (item.collected) continue;

        if (Math.hypot(ball.x - item.x, ball.y - item.y) < ball.radius + 16) {
            item.collected = true;
            powerUpsCollected++;

            if (item.type === "star") {
                boostNextShot = true;
                statusText.textContent = "STAR! Your next shot gets 50% more power.";
            } else if (item.type === "boost") {
                ball.dx *= 1.8;
                ball.dy *= 1.8;

                const speed = Math.hypot(ball.dx, ball.dy);

                if (speed > 14) {
                    ball.dx = ball.dx / speed * 14;
                    ball.dy = ball.dy / speed * 14;
                }

                statusText.textContent = "SPEED BOOST! The ball accelerates!";
            } else if (item.type === "magnet") {
                magnetActive = true;
                statusText.textContent = "HOLE MAGNET! Pulling the ball toward the hole.";
            } else if (item.type === "shield") {
                waterShieldActive = true;
                statusText.textContent = "WATER SHIELD activated! One hazard protected.";
            } else if (item.type === "coin") {
                coinsCollected++;
                statusText.textContent = "BONUS COIN collected!";
            }

            updateScoreboard();
        }
    }

    lastSafePosition = { x: ball.x, y: ball.y };

    // Sand slows the ball more than grass
    const friction = isOnSand(ball.x, ball.y) ? 0.955 : 0.986;
    ball.dx *= friction;
    ball.dy *= friction;

    const speed = Math.hypot(ball.dx, ball.dy);
    const holeDistance = Math.hypot(ball.x - hole.x, ball.y - hole.y);

    // Sink the ball if it reaches the hole at low speed
    if (holeDistance < hole.radius && speed < 4.5) {
        ball.x = hole.x;
        ball.y = hole.y;
        ball.dx = 0;
        ball.dy = 0;
        moving = false;
        magnetActive = false;
        levelComplete = true;

        if (level === 3) {
            gameComplete = true;
            statusText.textContent =
                "YOU WON! All three levels completed in " + totalShots + " shots!";
        } else {
            nextLevelButton.disabled = false;
            statusText.textContent =
                "Level " + level + " complete! Click Next Level.";
        }

        updateScoreboard();
        return;
    }

    if (Math.abs(ball.dx) < STOP_SPEED &&
        Math.abs(ball.dy) < STOP_SPEED) {
        ball.dx = 0;
        ball.dy = 0;
        moving = false;
        magnetActive = false;
        statusText.textContent = "Ball stopped. Aim your next shot!";
    }
}
4. assignment9.js — Part 3: Opening animation and game loop
Paste this at the bottom of the same JavaScript file.


javascript

function startPlaying() {
    demoActive = false;
    moving = false;

    ball.x = 100;
    ball.y = 400;
    ball.dx = 0;
    ball.dy = 0;

    statusText.textContent =
        "Level " + level + ": Drag backward from the ball to shoot.";
}

function resetGame() {
    level = 1;
    shots = 0;
    totalShots = 0;
    powerUpsCollected = 0;
    coinsCollected = 0;

    moving = false;
    dragging = false;
    levelComplete = false;
    gameComplete = false;

    boostNextShot = false;
    magnetActive = false;
    waterShieldActive = false;

    demoActive = true;
    demoFrames = 180;

    nextLevelButton.disabled = true;

    createLevel(1);

    // Automatic diagonal bouncing animation
    ball.dx = 4;
    ball.dy = -3;
    moving = true;

    statusText.textContent = "Welcome! Watch the ball bounce...";
}

nextLevelButton.addEventListener("click", function () {
    if (!levelComplete || gameComplete) return;

    level++;
    shots = 0;
    levelComplete = false;

    nextLevelButton.disabled = true;
    createLevel(level);

    statusText.textContent =
        "Level " + level + " started! Aim carefully.";
});

resetButton.addEventListener("click", resetGame);

function animate() {
    if (demoActive) {
        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.x - ball.radius < 10 ||
            ball.x + ball.radius > W - 10) {
            ball.dx *= -1;
        }

        if (ball.y - ball.radius < 10 ||
            ball.y + ball.radius > H - 10) {
            ball.dy *= -1;
        }

        demoFrames--;

        if (demoFrames <= 0) {
            startPlaying();
        }
    } else {
        moveBall();
    }

    ctx.clearRect(0, 0, W, H);

    drawCourse();
    drawAim();
    drawBall();

    if (demoActive) {
        ctx.fillStyle = "rgba(10,35,20,0.85)";
        ctx.fillRect(190, 210, 520, 85);

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.font = "bold 25px Arial";
        ctx.fillText("WELCOME TO MINI GOLF", W / 2, 245);

        ctx.font = "16px Arial";
        ctx.fillText("Get ready! Your game starts soon.", W / 2, 275);
        ctx.textAlign = "start";
    }

    if (levelComplete || gameComplete) {
        ctx.fillStyle = "rgba(10,35,20,0.88)";
        ctx.fillRect(190, 205, 520, 115);

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.font = "bold 27px Arial";

        ctx.fillText(
            gameComplete ? "YOU WON!" : "LEVEL COMPLETE!",
            W / 2, 245
        );

        ctx.font = "16px Arial";
        ctx.fillText(
            "Level shots: " + shots + " | Total shots: " + totalShots,
            W / 2, 277
        );

        ctx.textAlign = "start";
    }

    requestAnimationFrame(animate);
}

// Start the game
resetGame();
animate();
