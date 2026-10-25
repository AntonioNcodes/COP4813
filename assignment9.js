"use strict";

// ASSIGNMENT 9: INTERACTIVE MINI GOLF
// PART 1: SETUP AND GAME VARIABLES

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

const BALL_COLORS = [
    "#ffffff",
    "#ff5252",
    "#ffd740",
    "#40c4ff",
    "#e040fb",
    "#69f0ae",
    "#ff9100"
];

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

let ballColorIndex = 0;
let ballColor = BALL_COLORS[ballColorIndex];

let openingFrames = 180;
let lastSafePosition = { x: 100, y: 400 };
let boostNextShot = false;

// Create a level with a starting ball and hole.
function createLevel(number) {
    ball = {
        x: 100,
        y: 400,
        radius: 12,
        dx: 0,
        dy: 0
    };

    hole = {
        x: 780,
        y: 120,
        radius: 19
    };

    rocks = [];
    powerUps = [];

    if (number === 1) {
        rocks.push(
            { x: 360, y: 260, radius: 25 }
        );

        powerUps.push(
            { x: 240, y: 300, type: "star", collected: false },
            { x: 500, y: 150, type: "coin", collected: false }
        );
    }

    if (number === 2) {
        hole.y = 100;

        rocks.push(
            { x: 310, y: 200, radius: 27 },
            { x: 470, y: 320, radius: 30 },
            { x: 630, y: 210, radius: 25 }
        );

        powerUps.push(
            { x: 260, y: 260, type: "star", collected: false },
            { x: 520, y: 120, type: "coin", collected: false },
            { x: 650, y: 330, type: "boost", collected: false }
        );
    }

    if (number === 3) {
        hole = {
            x: 790,
            y: 100,
            radius: 19
        };

        rocks.push(
            { x: 280, y: 180, radius: 25 },
            { x: 420, y: 330, radius: 30 },
            { x: 560, y: 180, radius: 27 },
            { x: 680, y: 300, radius: 28 }
        );

        powerUps.push(
            { x: 230, y: 300, type: "star", collected: false },
            { x: 480, y: 420, type: "coin", collected: false },
            { x: 690, y: 150, type: "boost", collected: false }
        );
    }

    lastSafePosition = {
        x: ball.x,
        y: ball.y
    };

    updateScoreboard();
}

// Update the numbers displayed in the HTML.
function updateScoreboard() {
    levelDisplay.textContent = "Level " + level + " of 3";
    shotDisplay.textContent = shots;
    totalDisplay.textContent = totalShots;
    powerDisplay.textContent = powerUpsCollected;
    coinDisplay.textContent = coinsCollected;
}


 // PART 2: DRAW THE COURSE, POWER-UPS, AND BALL

function drawCourse() {
    // Grass background
    const grass = ctx.createLinearGradient(0, 0, W, H);
    grass.addColorStop(0, "#39834b");
    grass.addColorStop(1, "#174d2b");

    ctx.fillStyle = grass;
    ctx.fillRect(0, 0, W, H);

    // Putting area
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

    // Draw the hole and rim
    ctx.fillStyle = "#16351f";
    ctx.beginPath();
    ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
    ctx.fill();

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

    // Flag
    ctx.fillStyle = "#ff4545";
    ctx.beginPath();
    ctx.moveTo(hole.x, hole.y - 55);
    ctx.lineTo(hole.x + 30, hole.y - 43);
    ctx.lineTo(hole.x, hole.y - 32);
    ctx.closePath();
    ctx.fill();

    // Draw rocks
    for (const rock of rocks) {
        ctx.fillStyle = "#737b80";
        ctx.beginPath();
        ctx.arc(rock.x, rock.y, rock.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#d6dadd";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Draw power-ups
    const styles = {
        star: { color: "#ffbf00", symbol: "★" },
        coin: { color: "#f5a623", symbol: "$" },
        boost: { color: "#20c9df", symbol: "⚡" }
    };

    for (const item of powerUps) {
        if (item.collected) continue;

        const style = styles[item.type];

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

    // Level label
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

    // Shiny ball using the current color
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
    gradient.addColorStop(1, "#555555");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 1;
    ctx.stroke();
}

// Show the aiming line while dragging backward.
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
        ball.x + dx / distance * length,
        ball.y + dy / distance * length
    );
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px Arial";
    ctx.textAlign = "left";

    ctx.fillText(
        "Power: " + Math.round(length / MAX_DRAG * 100) + "%",
        22,
        H - 22
    );
}


 // PART 3: POINTER CONTROLS AND BALL COLOR

function getPointerPosition(event) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left) * W / rect.width,
        y: (event.clientY - rect.top) * H / rect.height
    };
}

canvas.addEventListener("pointerdown", function (event) {
    if (demoActive || moving || levelComplete || gameComplete) {
        return;
    }

    const position = getPointerPosition(event);

    const distance = Math.hypot(
        position.x - ball.x,
        position.y - ball.y
    );

    // Only start aiming if the player clicks the ball.
    if (distance <= ball.radius + 15) {
        dragging = true;
        pointerX = position.x;
        pointerY = position.y;

        // Assignment requirement: respond to a click by changing color.
        ballColorIndex =
            (ballColorIndex + 1) % BALL_COLORS.length;

        ballColor = BALL_COLORS[ballColorIndex];

        canvas.setPointerCapture(event.pointerId);

        statusText.textContent =
            "Ball color changed! Drag backward and release to shoot.";
    }
});

canvas.addEventListener("pointermove", function (event) {
    if (!dragging) return;

    const position = getPointerPosition(event);

    pointerX = position.x;
    pointerY = position.y;
});

canvas.addEventListener("pointerup", function () {
    if (!dragging) return;

    dragging = false;

    const dx = ball.x - pointerX;
    const dy = ball.y - pointerY;
    const distance = Math.hypot(dx, dy);

    if (distance < 8) {
        statusText.textContent =
            "Drag farther backward to take your shot.";
        return;
    }

    const power = Math.min(distance, MAX_DRAG);
    const speed = power / MAX_DRAG * MAX_SPEED;

    ball.dx = dx / distance * speed;
    ball.dy = dy / distance * speed;

    // Apply a collected boost to this shot.
    if (boostNextShot) {
        ball.dx *= 1.4;
        ball.dy *= 1.4;

        boostNextShot = false;
    }

    shots++;
    totalShots++;
    moving = true;

    lastSafePosition = {
        x: ball.x,
        y: ball.y
    };

    updateScoreboard();

    statusText.textContent =
        "Shot taken! Watch the ball roll.";
});

canvas.addEventListener("pointercancel", function () {
    dragging = false;
});


 // PART 4: BALL PHYSICS AND POWER-UPS

function updateBall() {
    if (!moving || demoActive || levelComplete || gameComplete) {
        return;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce off the course walls.
    if (ball.x - ball.radius < 10) {
        ball.x = 10 + ball.radius;
        ball.dx = Math.abs(ball.dx) * 0.8;
    }

    if (ball.x + ball.radius > W - 10) {
        ball.x = W - 10 - ball.radius;
        ball.dx = -Math.abs(ball.dx) * 0.8;
    }

    if (ball.y - ball.radius < 10) {
        ball.y = 10 + ball.radius;
        ball.dy = Math.abs(ball.dy) * 0.8;
    }

    if (ball.y + ball.radius > H - 10) {
        ball.y = H - 10 - ball.radius;
        ball.dy = -Math.abs(ball.dy) * 0.8;
    }

    // Bounce off rocks.
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

    // Collect power-ups.
    for (const item of powerUps) {
        if (item.collected) continue;

        const distance = Math.hypot(
            ball.x - item.x,
            ball.y - item.y
        );

        if (distance < ball.radius + 16) {
            item.collected = true;
            powerUpsCollected++;

            if (item.type === "star") {
                // A star makes the next shot stronger.
                boostNextShot = true;
                statusText.textContent =
                    "Super Shot collected! Your next shot is stronger.";
            }

            if (item.type === "boost") {
                ball.dx *= 1.4;
                ball.dy *= 1.4;

                statusText.textContent = "Speed boost collected!";
            }

            if (item.type === "coin") {
                coinsCollected++;
                statusText.textContent = "Bonus coin collected!";
            }

            updateScoreboard();
        }
    }

    lastSafePosition = {
        x: ball.x,
        y: ball.y
    };

    // Friction gradually slows the ball down.
    ball.dx *= FRICTION;
    ball.dy *= FRICTION;

    const speed = Math.hypot(ball.dx, ball.dy);
    const distanceToHole = Math.hypot(
        ball.x - hole.x,
        ball.y - hole.y
    );

    // Sink the ball when it reaches the hole slowly enough.
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

    // Stop the ball when it nearly stops rolling.
    if (
        Math.abs(ball.dx) < STOP_SPEED &&
        Math.abs(ball.dy) < STOP_SPEED
    ) {
        ball.dx = 0;
        ball.dy = 0;
        moving = false;

        statusText.textContent =
            "Ball stopped. Aim your next shot!";
    }
}


 // PART 5: RESTART AND LEVEL PROGRESSION

function startNewLevel() {
    moving = false;
    dragging = false;

    levelComplete = false;
    gameComplete = false;

    boostNextShot = false;
    ballColorIndex = 0;
    ballColor = BALL_COLORS[ballColorIndex];

    createLevel(level);

    nextButton.disabled = true;

    statusText.textContent =
        "Level " + level +
        ": Click the ball, drag backward, and release to shoot.";
}

function restartGame() {
    level = 1;
    shots = 0;
    totalShots = 0;
    powerUpsCollected = 0;
    coinsCollected = 0;

    demoActive = false;
    openingFrames = 0;

    startNewLevel();

    statusText.textContent =
        "Game restarted! Aim for the hole.";
}

function goToNextLevel() {
    if (!levelComplete || gameComplete) {
        return;
    }

    level++;
    shots = 0;

    startNewLevel();
}

// Connect the HTML buttons to their functions.
resetButton.addEventListener("click", restartGame);

nextButton.addEventListener("click", goToNextLevel);



 // PART 6: OPENING ANIMATION AND GAME LOOP

function runOpeningAnimation() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce off the canvas boundaries.
    if (
        ball.x - ball.radius <= 10 ||
        ball.x + ball.radius >= W - 10
    ) {
        ball.dx *= -1;
    }

    if (
        ball.y - ball.radius <= 10 ||
        ball.y + ball.radius >= H - 10
    ) {
        ball.dy *= -1;
    }

    // Change the ball's color periodically during the animation.
    if (openingFrames % 20 === 0) {
        ballColorIndex =
            (ballColorIndex + 1) % BALL_COLORS.length;

        ballColor = BALL_COLORS[ballColorIndex];
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
        "ASSIGNMENT 9",
        W / 2,
        235
    );

    ctx.font = "16px Arial";

    ctx.fillText(
        "Part 1: Animation | Part 2: Mouse Interaction",
        W / 2,
        270
    );

    ctx.textAlign = "left";
}

function drawCompletionScreen() {
    ctx.fillStyle = "rgba(10, 35, 20, 0.88)";
    ctx.fillRect(150, 195, 600, 120);

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "bold 28px Arial";

    ctx.fillText(
        gameComplete ? "YOU WON!" : "LEVEL COMPLETE!",
        W / 2,
        240
    );

    ctx.font = "17px Arial";

    ctx.fillText(
        "Shots this level: " + shots +
        " | Total shots: " + totalShots,
        W / 2,
        275
    );

    ctx.textAlign = "left";
}

function gameLoop() {
    if (demoActive) {
        runOpeningAnimation();
    } else {
        updateBall();
    }

    ctx.clearRect(0, 0, W, H);

    drawCourse();
    drawAim();
    drawBall();

    if (demoActive) {
        drawOpeningScreen();
    }

    if (levelComplete || gameComplete) {
        drawCompletionScreen();
    }

    requestAnimationFrame(gameLoop);
}

function initializeGame() {
    createLevel(level);

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

    nextButton.disabled = true;

    statusText.textContent =
        "Welcome! Watch the opening animation.";

    gameLoop();
}

// Start the game.
initializeGame();

