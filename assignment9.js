
"use strict";

// ASSIGNMENT 9: INTERACTIVE MINI GOLF
// Part 1: Setup, game variables, and levels

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

const MAX_DRAG = 100;
const MAX_SPEED = 10;
const FRICTION = 0.985;
const STOP_SPEED = 0.08;

let level = 1;
let shots = 0;
let totalShots = 0;
let powerUpsCollected = 0;
let coinsCollected = 0;

let ball;
let hole;
let rocks = [];
let powerUps = [];

let moving = false;
let dragging = false;
let demoActive = true;
let levelComplete = false;
let gameComplete = false;

let pointerX = 0;
let pointerY = 0;
let ballColor = "#ffffff";
let colorIndex = 0;

const ballColors = [
    "#ffffff",
    "#ff5252",
    "#ffd740",
    "#40c4ff",
    "#e040fb",
    "#69f0ae",
    "#ff9100"
];

function createLevel(number) {
    ball = {
        x: 100,
        y: 400,
        radius: 12,
        dx: 0,
        dy: 0
    };

    hole = {
        x: 790,
        y: 100,
        radius: 19
    };

    rocks = [];
    powerUps = [];

    if (number === 1) {
        hole = { x: 780, y: 120, radius: 19 };

        rocks.push(
            { x: 350, y: 250, radius: 25 },
            { x: 540, y: 360, radius: 28 }
        );

        powerUps.push(
            { x: 240, y: 300, type: "star", collected: false },
            { x: 490, y: 150, type: "coin", collected: false }
        );
    }

    if (number === 2) {
        hole = { x: 790, y: 90, radius: 19 };

        rocks.push(
            { x: 300, y: 190, radius: 28 },
            { x: 430, y: 330, radius: 30 },
            { x: 600, y: 200, radius: 25 },
            { x: 690, y: 350, radius: 25 }
        );

        powerUps.push(
            { x: 240, y: 250, type: "star", collected: false },
            { x: 500, y: 110, type: "coin", collected: false },
            { x: 650, y: 260, type: "boost", collected: false }
        );
    }

    if (number === 3) {
        hole = { x: 790, y: 100, radius: 19 };

        rocks.push(
            { x: 260, y: 180, radius: 25 },
            { x: 390, y: 330, radius: 30 },
            { x: 520, y: 180, radius: 27 },
            { x: 640, y: 320, radius: 30 },
            { x: 720, y: 200, radius: 22 }
        );

        powerUps.push(
            { x: 220, y: 300, type: "star", collected: false },
            { x: 470, y: 410, type: "coin", collected: false },
            { x: 680, y: 130, type: "boost", collected: false }
        );
    }

    updateScoreboard();
}

function updateScoreboard() {
    levelDisplay.textContent = "Level " + level + " of 3";
    shotDisplay.textContent = shots;
    totalDisplay.textContent = totalShots;
    powerDisplay.textContent = powerUpsCollected;
    coinDisplay.textContent = coinsCollected;
}


 // PART 2: DRAW THE COURSE, HOLE, OBSTACLES, AND BALL

function drawCourse() {
    // Green grass background
    const grass = ctx.createLinearGradient(0, 0, W, H);
    grass.addColorStop(0, "#39834b");
    grass.addColorStop(1, "#174d2b");

    ctx.fillStyle = grass;
    ctx.fillRect(0, 0, W, H);

    // Lighter putting area
    ctx.fillStyle = "#83c76c";
    ctx.beginPath();
    ctx.ellipse(450, 270, 360, 220, 0, 0, Math.PI * 2);
    ctx.fill();

    // Grass stripes
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(450, 270, 360, 220, 0, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = "rgba(255,255,255,0.08)";

    for (let x = 100; x < W; x += 80) {
        ctx.fillRect(x, 40, 35, H - 80);
    }

    ctx.restore();

    // Hole
    ctx.fillStyle = "#16351f";
    ctx.beginPath();
    ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
    ctx.fill();

    // Hole rim
    ctx.strokeStyle = "#d5e8bd";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Flagpole
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(hole.x, hole.y);
    ctx.lineTo(hole.x, hole.y - 55);
    ctx.stroke();

    // Red flag
    ctx.fillStyle = "#ff4545";
    ctx.beginPath();
    ctx.moveTo(hole.x, hole.y - 55);
    ctx.lineTo(hole.x + 30, hole.y - 43);
    ctx.lineTo(hole.x, hole.y - 32);
    ctx.closePath();
    ctx.fill();

    // Rocks
    for (const rock of rocks) {
        ctx.fillStyle = "#737b80";
        ctx.beginPath();
        ctx.arc(
            rock.x,
            rock.y,
            rock.radius,
            0,
            Math.PI * 2
        );
        ctx.fill();

        ctx.strokeStyle = "#d6dadd";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Power-ups
    const powerUpStyles = {
        star: { color: "#ffbf00", symbol: "★" },
        coin: { color: "#f5a623", symbol: "$" },
        boost: { color: "#20c9df", symbol: "⚡" }
    };

    for (const item of powerUps) {
        if (item.collected) continue;

        const style = powerUpStyles[item.type];

        ctx.fillStyle = style.color;
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
        ctx.fillText(style.symbol, item.x, item.y);
    }

    // Course label
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 17px Arial";
    ctx.fillText("MINI GOLF - LEVEL " + level, 22, 30);

    // Course boundary
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 5;
    ctx.strokeRect(3, 3, W - 6, H - 6);
}

function drawBall() {
    // Ball shadow
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(
        ball.x + 4,
        ball.y + 6,
        ball.radius + 2,
        7,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Shiny golf ball
    const gradient = ctx.createRadialGradient(
        ball.x - 4,
        ball.y - 5,
        1,
        ball.x,
        ball.y,
        ball.radius * 1.5
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.45, ballColor);
    gradient.addColorStop(1, "#777777");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(
        ball.x,
        ball.y,
        ball.radius,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.strokeStyle = "#e4e4e4";
    ctx.lineWidth = 1;
    ctx.stroke();
}

// Draw the aiming guide while dragging the ball
function drawAim() {
    if (!dragging || demoActive || moving) return;

    const dx = ball.x - pointerX;
    const dy = ball.y - pointerY;
    const distance = Math.hypot(dx, dy);

    if (distance < 3) return;

    const length = Math.min(distance, MAX_DRAG);

    ctx.save();

    ctx.strokeStyle = "#fff176";
    ctx.lineWidth = 3;
    ctx.setLineDash([7, 5]);

    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y);
    ctx.lineTo(
        ball.x + (dx / distance) * length,
        ball.y + (dy / distance) * length
    );
    ctx.stroke();

    ctx.restore();

    // Shot power indicator
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px Arial";
    ctx.textAlign = "left";

    ctx.fillText(
        "Power: " + Math.round(length / MAX_DRAG * 100) + "%",
        22,
        H - 22
    );
}


 // PART 3: MOUSE CONTROLS, AIMING, AND BALL COLOR

let isDragging = false;
let aimX = 0;
let aimY = 0;
let ballColor = "#ffffff";
let colorIndex = 0;

const ballColors = [
    "#ffffff",
    "#ff5252",
    "#ffd740",
    "#40c4ff",
    "#e040fb",
    "#69f0ae"
];

function getMousePosition(event) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left) * canvas.width / rect.width,
        y: (event.clientY - rect.top) * canvas.height / rect.height
    };
}

// Click or touch the ball to change its color.
canvas.addEventListener("pointerdown", function (event) {
    if (demoActive || moving || levelComplete || gameComplete) {
        return;
    }

    const position = getMousePosition(event);
    const distance = Math.hypot(
        position.x - ball.x,
        position.y - ball.y
    );

    if (distance <= ball.radius + 15) {
        isDragging = true;
        dragging = true;

        aimX = position.x;
        aimY = position.y;

        pointerX = position.x;
        pointerY = position.y;

        colorIndex = (colorIndex + 1) % ballColors.length;
        ballColor = ballColors[colorIndex];

        canvas.setPointerCapture(event.pointerId);

        statusText.textContent =
            "Ball color changed! Drag backward and release to shoot.";
    }
});

canvas.addEventListener("pointermove", function (event) {
    if (!isDragging) return;

    const position = getMousePosition(event);

    aimX = position.x;
    aimY = position.y;

    pointerX = position.x;
    pointerY = position.y;
});

canvas.addEventListener("pointerup", function () {
    if (!isDragging) return;

    isDragging = false;
    dragging = false;

    const distance = Math.hypot(
        ball.x - aimX,
        ball.y - aimY
    );

    if (distance < 8) {
        statusText.textContent =
            "Drag farther backward to take your shot.";
        return;
    }

    const power = Math.min(distance, MAX_DRAG);
    const speed = power / MAX_DRAG * MAX_SPEED;

    ball.dx = (ball.x - aimX) / distance * speed;
    ball.dy = (ball.y - aimY) / distance * speed;

    shots++;
    totalShots++;

    moving = true;
    lastSafePosition = { x: ball.x, y: ball.y };

    updateScoreboard();

    statusText.textContent =
        "Shot taken! Watch the ball roll toward the hole.";
});

canvas.addEventListener("pointercancel", function () {
    isDragging = false;
    dragging = false;
});


 // PART 4: BALL MOVEMENT, BOUNCING, AND PHYSICS

const FRICTION = 0.985;
const WALL_BOUNCE = 0.8;
const ROCK_BOUNCE = 0.75;

function updateBall() {
    if (!moving || demoActive || levelComplete || gameComplete) {
        return;
    }

    // Move the ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce off the left and right walls
    if (ball.x - ball.radius < 10) {
        ball.x = 10 + ball.radius;
        ball.dx = Math.abs(ball.dx) * WALL_BOUNCE;
    }

    if (ball.x + ball.radius > canvas.width - 10) {
        ball.x = canvas.width - 10 - ball.radius;
        ball.dx = -Math.abs(ball.dx) * WALL_BOUNCE;
    }

    // Bounce off the top and bottom walls
    if (ball.y - ball.radius < 10) {
        ball.y = 10 + ball.radius;
        ball.dy = Math.abs(ball.dy) * WALL_BOUNCE;
    }

    if (ball.y + ball.radius > canvas.height - 10) {
        ball.y = canvas.height - 10 - ball.radius;
        ball.dy = -Math.abs(ball.dy) * WALL_BOUNCE;
    }

    // Bounce off rocks
    for (const rock of rocks) {
        const dx = ball.x - rock.x;
        const dy = ball.y - rock.y;
        const distance = Math.hypot(dx, dy);
        const minimumDistance = ball.radius + rock.radius;

        if (distance < minimumDistance && distance > 0) {
            const nx = dx / distance;
            const ny = dy / distance;

            // Move the ball outside the rock
            ball.x = rock.x + nx * minimumDistance;
            ball.y = rock.y + ny * minimumDistance;

            // Reverse the part of velocity aimed at the rock
            const dot = ball.dx * nx + ball.dy * ny;

            if (dot < 0) {
                ball.dx -= 2 * dot * nx;
                ball.dy -= 2 * dot * ny;

                ball.dx *= ROCK_BOUNCE;
                ball.dy *= ROCK_BOUNCE;
            }
        }
    }

    // Slow the ball down naturally
    ball.dx *= FRICTION;
    ball.dy *= FRICTION;

    // Check whether the ball reaches the hole
    const distanceToHole = Math.hypot(
        ball.x - hole.x,
        ball.y - hole.y
    );

    const speed = Math.hypot(ball.dx, ball.dy);

    if (distanceToHole < hole.radius && speed < 4) {
        ball.x = hole.x;
        ball.y = hole.y;
        ball.dx = 0;
        ball.dy = 0;

        moving = false;
        levelComplete = true;

        if (level === 3) {
            gameComplete = true;
            nextButton.disabled = true;
            statusText.textContent =
                "You won! All three levels completed!";
        } else {
            nextButton.disabled = false;
            statusText.textContent =
                "Level complete! Click Next Level to continue.";
        }

        updateScoreboard();
        return;
    }

    // Stop the ball when it has almost stopped rolling
    if (Math.abs(ball.dx) < 0.08 &&
        Math.abs(ball.dy) < 0.08) {
        ball.dx = 0;
        ball.dy = 0;
        moving = false;

        statusText.textContent =
            "Ball stopped. Aim your next shot!";
    }
}

// Draw the golf ball with its current color
function drawColoredBall() {
    ctx.save();

    // Shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.beginPath();
    ctx.ellipse(
        ball.x + 4,
        ball.y + 5,
        ball.radius + 2,
        ball.radius * 0.65,
        0, 0, Math.PI * 2
    );
    ctx.fill();

    // Ball color
    const gradient = ctx.createRadialGradient(
        ball.x - 4,
        ball.y - 5,
        1,
        ball.x,
        ball.y,
        ball.radius * 1.4
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.35, ballColor);
    gradient.addColorStop(1, "#555555");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
}

// PART 5: LEVEL PROGRESSION, RESTART, AND SCORING

function startNewLevel() {
    moving = false;
    dragging = false;
    isDragging = false;

    levelComplete = false;
    gameComplete = false;

    boostNextShot = false;
    magnetActive = false;
    shieldActive = false;

    ball = {
        x: 100,
        y: 400,
        radius: 12,
        dx: 0,
        dy: 0
    };

    // Reset the ball color for the new level
    ballColor = "#ffffff";
    colorIndex = 0;

    // Set the hole position for each level
    if (level === 1) {
        hole = { x: 775, y: 125, radius: 18 };
    } else if (level === 2) {
        hole = { x: 775, y: 100, radius: 18 };
    } else {
        hole = { x: 790, y: 100, radius: 18 };
    }

    lastSafePosition = {
        x: ball.x,
        y: ball.y
    };

    // Remove old obstacles and power-ups
    rocks = [];
    sand = [];
    water = [];
    powerUps = [];

    // Level 1 course
    if (level === 1) {
        sand.push({
            x: 390, y: 280, rx: 75, ry: 38
        });

        powerUps.push(
            { x: 210, y: 250, type: "coin", collected: false },
            { x: 270, y: 335, type: "star", collected: false }
        );
    }

    // Level 2 course
    if (level === 2) {
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

    // Level 3 course
    if (level === 3) {
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

        water.push({
            x: 510, y: 135, rx: 95, ry: 48
        });

        powerUps.push(
            { x: 380, y: 410, type: "star", collected: false },
            { x: 690, y: 420, type: "boost", collected: false },
            { x: 400, y: 100, type: "shield", collected: false },
            { x: 580, y: 220, type: "coin", collected: false }
        );
    }

    nextButton.disabled = true;

    updateScoreboard();

    statusText.textContent =
        "Level " + level +
        ": Click the ball, drag backward, and release to shoot.";
}

// Restart the complete game
function restartGame() {
    level = 1;
    shots = 0;
    totalShots = 0;
    powerUpsCollected = 0;
    coinsCollected = 0;

    demoActive = false;
    demoFrames = 0;

    startNewLevel();

    statusText.textContent =
        "Welcome to Mini Golf! Aim for the hole.";
}

// Move to the next level
function goToNextLevel() {
    if (!levelComplete || gameComplete) {
        return;
    }

    level++;

    shots = 0;

    startNewLevel();
}

// Connect the buttons
resetButton.addEventListener("click", restartGame);

nextButton.addEventListener("click", goToNextLevel);


 // PART 6: ANIMATION LOOP AND GAME START

let openingFrames = 180;

function runOpeningAnimation() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce off the left and right boundaries
    if (ball.x - ball.radius <= 10 ||
        ball.x + ball.radius >= canvas.width - 10) {
        ball.dx *= -1;
    }

    // Bounce off the top and bottom boundaries
    if (ball.y - ball.radius <= 10 ||
        ball.y + ball.radius >= canvas.height - 10) {
        ball.dy *= -1;
    }

    openingFrames--;

    if (openingFrames <= 0) {
        demoActive = false;
        moving = false;

        ball.x = 100;
        ball.y = 400;
        ball.dx = 0;
        ball.dy = 0;

        lastSafePosition = {
            x: ball.x,
            y: ball.y
        };

        statusText.textContent =
            "Your turn! Click the ball, drag backward, and release.";
    }
}

function drawOpeningScreen() {
    ctx.fillStyle = "rgba(10, 35, 20, 0.85)";
    ctx.fillRect(150, 195, 600, 115);

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "bold 27px Arial";
    ctx.fillText(
        "WELCOME TO MINI GOLF",
        canvas.width / 2,
        235
    );

    ctx.font = "16px Arial";
    ctx.fillText(
        "Watch the ball bounce before you play!",
        canvas.width / 2,
        270
    );

    ctx.textAlign = "start";
}

function drawCompletionScreen() {
    ctx.fillStyle = "rgba(10, 35, 20, 0.88)";
    ctx.fillRect(150, 195, 600, 120);

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "bold 28px Arial";

    ctx.fillText(
        gameComplete ? "YOU WON!" : "LEVEL COMPLETE!",
        canvas.width / 2,
        240
    );

    ctx.font = "17px Arial";
    ctx.fillText(
        "Shots this level: " + shots +
        " | Total shots: " + totalShots,
        canvas.width / 2,
        275
    );

    ctx.textAlign = "start";
}

function gameLoop() {
    // Update the game
    if (demoActive) {
        runOpeningAnimation();
    } else {
        updateBall();
    }

    // Redraw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCourse();

    // Draw the aiming line while dragging
    if (isDragging && !demoActive) {
        ctx.save();
        ctx.strokeStyle = "#fff4a8";
        ctx.lineWidth = 3;
        ctx.setLineDash([7, 5]);

        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(aimX, aimY);
        ctx.stroke();

        ctx.restore();
    }

    drawColoredBall();

    if (demoActive) {
        drawOpeningScreen();
    }

    if (levelComplete || gameComplete) {
        drawCompletionScreen();
    }

    requestAnimationFrame(gameLoop);
}

// INITIALIZE THE GAME
function initializeGame() {
    startNewLevel();

    demoActive = true;
    moving = true;
    openingFrames = 180;

    ball.x = 100;
    ball.y = 400;
    ball.dx = 4;
    ball.dy = -3;

    lastSafePosition = {
        x: ball.x,
        y: ball.y
    };

    statusText.textContent =
        "Welcome! Watch the opening animation.";

    gameLoop();
}

initializeGame();

console.log("Mini Golf JavaScript is loading!");
