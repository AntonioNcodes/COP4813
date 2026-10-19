"use strict";

// MINI GOLF - SECTION 1: SETUP

const canvas = document.getElementById("golfCanvas");
const ctx = canvas.getContext("2d");

const statusText = document.getElementById("golfStatus");
const levelDisplay = document.getElementById("levelDisplay");
const shotDisplay = document.getElementById("shotCount");
const totalDisplay = document.getElementById("totalShots");
const powerDisplay = document.getElementById("powerUpCount");
const coinDisplay = document.getElementById("coinCount");
const resetButton = document.getElementById("resetGolf");
const nextButton = document.getElementById("nextLevel");

const W = canvas.width;
const H = canvas.height;

const MAX_DRAG = 110;
const MAX_SPEED = 11;
const STOP_SPEED = 0.12;

let level = 1;
let shots = 0;
let totalShots = 0;
let powerUpsCollected = 0;
let coinsCollected = 0;

let ball;
let hole;
let rocks = [];
let sand = [];
let water = [];
let powerUps = [];

let moving = false;
let dragging = false;
let demoActive = true;
let demoFrames = 180;
let levelComplete = false;
let gameComplete = false;

let boostNextShot = false;
let magnetActive = false;
let shieldActive = false;

let pointerX = 0;
let pointerY = 0;
let lastSafePosition = { x: 100, y: 400 };

function createLevel(number) {
    ball = {
        x: 100, y: 400, radius: 12,
        dx: 0, dy: 0
    };

    hole = { x: 775, y: 125, radius: 18 };

    rocks = [];
    sand = [];
    water = [];
    powerUps = [];

    boostNextShot = false;
    magnetActive = false;
    shieldActive = false;

    if (number === 1) {
        sand.push({ x: 390, y: 280, rx: 75, ry: 38 });

        powerUps.push(
            { x: 210, y: 250, type: "coin", collected: false },
            { x: 270, y: 335, type: "star", collected: false }
        );
    }

    if (number === 2) {
        hole.y = 100;

        sand.push(
            { x: 330, y: 275, rx: 70, ry: 36 },
            { x: 600, y: 330, rx: 65, ry: 32 }
        );

        rocks.push(
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

    if (number === 3) {
        hole = { x: 790, y: 100, radius: 18 };

        sand.push(
            { x: 280, y: 300, rx: 65, ry: 34 },
            { x: 600, y: 370, rx: 75, ry: 35 }
        );

        rocks.push(
            { x: 330, y: 175, radius: 25 },
            { x: 470, y: 290, radius: 28 },
            { x: 650, y: 175, radius: 24 },
            { x: 720, y: 300, radius: 22 }
        );

        water.push({ x: 510, y: 135, rx: 95, ry: 48 });

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
    shotDisplay.textContent = shots;
    totalDisplay.textContent = totalShots;
    powerDisplay.textContent = powerUpsCollected;
    coinDisplay.textContent = coinsCollected;
}

// MINI GOLF - SECTION 2: DRAW COURSE

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

    // Grass stripes
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
    for (const item of water) {
        ctx.fillStyle = "#258ac0";
        ctx.beginPath();
        ctx.ellipse(item.x, item.y, item.rx, item.ry, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#8ee5ff";
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    // Sand bunkers
    for (const item of sand) {
        ctx.fillStyle = "#e9d6a2";
        ctx.beginPath();
        ctx.ellipse(item.x, item.y, item.rx, item.ry, -0.2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Rocks
    for (const rock of rocks) {
        ctx.fillStyle = "#777e82";
        ctx.beginPath();
        ctx.arc(rock.x, rock.y, rock.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#d0d5d8";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Putting green and hole
    ctx.fillStyle = "#a8d98b";
    ctx.beginPath();
    ctx.ellipse(hole.x, hole.y, 65, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#142319";
    ctx.beginPath();
    ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
    ctx.fill();

    // Flagpole
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

    // Power-ups
    const icons = {
        star: "★", boost: "⚡",
        magnet: "M", shield: "S", coin: "$"
    };

    const colors = {
        star: "#ffb900", boost: "#26c6da",
        magnet: "#bb86fc", shield: "#258ac0",
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
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px Arial";
    ctx.fillText("MINI GOLF | LEVEL " + level, 22, 30);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, W - 4, H - 4);
}

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

// MINI GOLF - SECTION 3: CONTROLS

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
    return (
        ((x - item.x) / item.rx) ** 2 +
        ((y - item.y) / item.ry) ** 2 <= 1
    );
}

function isOnSand(x, y) {
    return sand.some(item => isInsideEllipse(x, y, item));
}

function isInWater(x, y) {
    return water.some(item => isInsideEllipse(x, y, item));
}

// MINI GOLF - SECTION 4: PHYSICS

function moveBall() {
    if (!moving || demoActive || levelComplete || gameComplete) return;

    // Magnet attracts the ball toward the hole
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

    // Bounce off course boundaries
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
    for (const rock of rocks) {
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

    // Water hazard
    if (isInWater(ball.x, ball.y)) {
        ball.x = lastSafePosition.x;
        ball.y = lastSafePosition.y;
        ball.dx = 0;
        ball.dy = 0;
        moving = false;
        magnetActive = false;

        if (shieldActive) {
            shieldActive = false;
            statusText.textContent = "Water shield saved you!";
        } else {
            shots++;
            totalShots++;
            statusText.textContent = "Water hazard! Penalty shot added.";
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
                statusText.textContent = "Super Shot! Extra power next shot.";
            } else if (item.type === "boost") {
                ball.dx *= 1.8;
                ball.dy *= 1.8;

                const speed = Math.hypot(ball.dx, ball.dy);

                if (speed > 14) {
                    ball.dx = ball.dx / speed * 14;
                    ball.dy = ball.dy / speed * 14;
                }

                statusText.textContent = "Speed boost activated!";
            } else if (item.type === "magnet") {
                magnetActive = true;
                statusText.textContent = "Hole magnet activated!";
            } else if (item.type === "shield") {
                shieldActive = true;
                statusText.textContent = "Water shield activated!";
            } else if (item.type === "coin") {
                coinsCollected++;
                statusText.textContent = "Bonus coin collected!";
            }

            updateScoreboard();
        }
    }

    lastSafePosition = { x: ball.x, y: ball.y };

    // Friction
    const friction = isOnSand(ball.x, ball.y) ? 0.955 : 0.986;
    ball.dx *= friction;
    ball.dy *= friction;

    const speed = Math.hypot(ball.dx, ball.dy);
    const distanceToHole = Math.hypot(
        ball.x - hole.x, ball.y - hole.y
    );

    // Sink the ball
    if (distanceToHole < hole.radius && speed < 4.5) {
        ball.x = hole.x;
        ball.y = hole.y;
        ball.dx = 0;
        ball.dy = 0;
        moving = false;
        magnetActive = false;
        levelComplete = true;

        if (level === 3) {
            gameComplete = true;
            nextButton.disabled = true;
            statusText.textContent =
                "YOU WON! Completed all levels in " + totalShots + " shots!";
        } else {
            nextButton.disabled = false;
            statusText.textContent =
                "Level " + level + " complete! Click Next Level.";
        }

        updateScoreboard();
        return;
    }

    // Stop when the ball slows down
    if (Math.abs(ball.dx) < STOP_SPEED &&
        Math.abs(ball.dy) < STOP_SPEED) {
        ball.dx = 0;
        ball.dy = 0;
        moving = false;
        magnetActive = false;
        statusText.textContent = "Ball stopped. Aim your next shot!";
    }
}

// MINI GOLF - SECTION 5: START AND RESET

function startPlaying() {
    demoActive = false;
    moving = false;

    ball.x = 100;
    ball.y = 400;
    ball.dx = 0;
    ball.dy = 0;

    lastSafePosition = { x: ball.x, y: ball.y };

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
    shieldActive = false;

    demoActive = true;
    demoFrames = 180;

    nextButton.disabled = true;

    createLevel(level);

    // Opening bouncing animation
    ball.dx = 4;
    ball.dy = -3;
    moving = true;

    statusText.textContent = "Welcome! Watch the ball bounce...";
}

// Restart button
resetButton.addEventListener("click", resetGame);

// Next level button
nextButton.addEventListener("click", function () {
    if (!levelComplete || gameComplete) return;

    level++;
    shots = 0;
    levelComplete = false;
    dragging = false;

    nextButton.disabled = true;

    createLevel(level);

    statusText.textContent =
        "Level " + level + " started! Aim carefully.";
});

 // MINI GOLF - SECTION 6: ANIMATION LOOP

function animate() {
    // Opening animation
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

    // Redraw the course
    ctx.clearRect(0, 0, W, H);

    drawCourse();
    drawAim();
    drawBall();

    // Welcome overlay
    if (demoActive) {
        ctx.fillStyle = "rgba(10,35,20,0.85)";
        ctx.fillRect(190, 210, 520, 85);

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.font = "bold 25px Arial";
        ctx.fillText("WELCOME TO MINI GOLF", W / 2, 245);

        ctx.font = "16px Arial";
        ctx.fillText(
            "Get ready! Your game starts soon.",
            W / 2, 275
        );

        ctx.textAlign = "start";
    }

    // Completion overlay
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
            "Level shots: " + shots +
            " | Total shots: " + totalShots,
            W / 2, 277
        );

        ctx.textAlign = "start";
    }

    requestAnimationFrame(animate);
}

// INITIALIZE THE GAME
resetGame();
animate();
