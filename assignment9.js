"use strict";
// Assignment 9 - Interactive Mini Golf

const canvas = document.getElementById("golfCanvas");
const ctx = canvas.getContext("2d");

const statusText = document.getElementById("golfStatus");
const resetButton = document.getElementById("resetGolf");
const nextLevelButton = document.getElementById("nextLevel");

const levelDisplay = document.getElementById("levelDisplay");
const shotCountDisplay = document.getElementById("shotCount");
const totalShotsDisplay = document.getElementById("totalShots");
const powerUpCountDisplay = document.getElementById("powerUpCount");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let level = 1;
let shots = 0;
let totalShots = 0;
let powerUpsCollected = 0;

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

let pointerX = 0;
let pointerY = 0;

let lastSafePosition = { x: 100, y: 400 };

const MAX_DRAG = 110;
const MAX_SPEED = 11;
const GRASS_FRICTION = 0.986;
const SAND_FRICTION = 0.955;
const BOUNCE = 0.75;
const STOP_SPEED = 0.12;

function createLevel(number) {
    ball = {
        x: 100,
        y: 400,
        radius: 12,
        dx: 0,
        dy: 0
    };

    hole = { x: 775, y: 125, radius: 18 };

    obstacles = [];
    bunkers = [];
    waterHazards = [];
    powerUps = [];
    boostNextShot = false;

    if (number === 1) {
        bunkers.push({ x: 390, y: 280, rx: 75, ry: 38 });

        powerUps.push({
            x: 270,
            y: 335,
            type: "star",
            collected: false
        });
    }

    if (number === 2) {
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

        powerUps.push({
            x: 470,
            y: 390,
            type: "boost",
            collected: false
        });
    }

    if (number === 3) {
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

        waterHazards.push({
            x: 510,
            y: 135,
            rx: 95,
            ry: 48
        });

        powerUps.push(
            { x: 380, y: 410, type: "star", collected: false },
            { x: 690, y: 420, type: "boost", collected: false }
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
}

function drawCourse() {
    const grass = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
    grass.addColorStop(0, "#397b48");
    grass.addColorStop(1, "#205b37");

    ctx.fillStyle = grass;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Fairway
    ctx.fillStyle = "#80bd70";
    ctx.beginPath();
    ctx.ellipse(450, 270, 350, 220, -0.05, 0, Math.PI * 2);
    ctx.fill();

    // Fairway stripes
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
        ctx.ellipse(
            water.x, water.y, water.rx, water.ry,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        ctx.strokeStyle = "#8ee5ff";
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    // Sand traps
    for (const sand of bunkers) {
        ctx.fillStyle = "#e9d6a2";
        ctx.beginPath();
        ctx.ellipse(
            sand.x, sand.y, sand.rx, sand.ry,
            -0.2, 0, Math.PI * 2
        );
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

    // Putting green
    ctx.fillStyle = "#a8d98b";
    ctx.beginPath();
    ctx.ellipse(hole.x, hole.y, 95, 75, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hole
    ctx.fillStyle = "#142319";
    ctx.beginPath();
    ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
    ctx.fill();

    // Flag pole
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(hole.x, hole.y);
    ctx.lineTo(hole.x, hole.y - 65);
    ctx.stroke();

    // Flag
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.moveTo(hole.x, hole.y - 65);
    ctx.lineTo(hole.x + 38, hole.y - 53);
    ctx.lineTo(hole.x, hole.y - 40);
    ctx.closePath();
    ctx.fill();

    // Power-ups
    for (const item of powerUps) {
        if (item.collected) continue;

        ctx.fillStyle =
            item.type === "star" ? "#ffcb35" : "#26c6da";

        ctx.beginPath();
        ctx.arc(item.x, item.y, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 19px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(
            item.type === "star" ? "★" : "⚡",
            item.x,
            item.y
        );

        ctx.textAlign = "start";
    }

    // Course border and title
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, WIDTH - 4, HEIGHT - 4);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px Arial";
    ctx.fillText("MINI GOLF | LEVEL " + level, 22, 30);
}

function drawBall() {
    // Ball shadow
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(
        ball.x + 4,
        ball.y + 5,
        ball.radius * 1.2,
        ball.radius * 0.7,
        0, 0, Math.PI * 2
    );
    ctx.fill();

    // Shiny golf ball
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

// Show the aiming line while dragging
function drawAim() {
    if (!dragging || moving || demoActive) return;

    const dx = ball.x - pointerX;
    const dy = ball.y - pointerY;
    const distance = Math.hypot(dx, dy);

    if (distance < 3) return;

    const length = Math.min(distance, MAX_DRAG);

    const endX = ball.x + (dx / distance) * length;
    const endY = ball.y + (dy / distance) * length;

    ctx.save();
    ctx.strokeStyle = "#fff4a8";
    ctx.lineWidth = 3;
    ctx.setLineDash([7, 5]);

    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Arial";

    ctx.fillText(
        "Power: " +
        Math.round(Math.min(distance / MAX_DRAG, 1) * 100) + "%",
        22,
        HEIGHT - 25
    );
}

// Convert mouse/touch position into canvas coordinates
function getCanvasPosition(event) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left) * WIDTH / rect.width,
        y: (event.clientY - rect.top) * HEIGHT / rect.height
    };
}

// Click and begin dragging the golf ball
canvas.addEventListener("pointerdown", function (event) {
    if (
        demoActive ||
        moving ||
        levelComplete ||
        gameComplete
    ) {
        return;
    }

    const point = getCanvasPosition(event);

    const distance = Math.hypot(
        point.x - ball.x,
        point.y - ball.y
    );

    if (distance <= ball.radius + 16) {
        dragging = true;
        pointerX = point.x;
        pointerY = point.y;

        canvas.setPointerCapture(event.pointerId);

        statusText.textContent =
            "Drag backward to aim, then release to shoot!";
    }
});

// Update the aiming line
canvas.addEventListener("pointermove", function (event) {
    if (!dragging) return;

    const point = getCanvasPosition(event);

    pointerX = point.x;
    pointerY = point.y;
});

// Release the mouse to hit the ball
canvas.addEventListener("pointerup", function (event) {
    if (!dragging) return;

    const point = getCanvasPosition(event);

    pointerX = point.x;
    pointerY = point.y;

    dragging = false;
    shoot();
});

canvas.addEventListener("pointercancel", function () {
    dragging = false;
});

// Shoot in the opposite direction of the drag
function shoot() {
    const dx = ball.x - pointerX;
    const dy = ball.y - pointerY;

    const distance = Math.hypot(dx, dy);

    if (distance < 8) {
        statusText.textContent = "Drag farther to shoot.";
        return;
    }

    let speed =
        Math.min(distance, MAX_DRAG) / MAX_DRAG * MAX_SPEED;

    // Optional power-up
    if (boostNextShot) {
        speed = Math.min(speed * 1.5, MAX_SPEED * 1.3);
        boostNextShot = false;
    }

    ball.dx = (dx / distance) * speed;
    ball.dy = (dy / distance) * speed;

    shots++;
    totalShots++;
    moving = true;

    lastSafePosition = {
        x: ball.x,
        y: ball.y
    };

    updateScoreboard();

    statusText.textContent =
        "Shot " + shots + "! Watch the ball roll.";
}

// Check whether the ball is inside an oval area
function isInsideEllipse(x, y, item) {
    return (
        ((x - item.x) / item.rx) ** 2 +
        ((y - item.y) / item.ry) ** 2
    ) <= 1;
}

function isOnSand(x, y) {
    return bunkers.some(function (sand) {
        return isInsideEllipse(x, y, sand);
    });
}

function isInWater(x, y) {
    return waterHazards.some(function (water) {
        return isInsideEllipse(x, y, water);
    });
}

// Move the ball and apply friction
function moveBall() {
    if (
        !moving ||
        demoActive ||
        gameComplete ||
        levelComplete
    ) {
        return;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce off the left and right boundaries
    if (ball.x - ball.radius < 10) {
        ball.x = 10 + ball.radius;
        ball.dx = Math.abs(ball.dx) * BOUNCE;
    }

    if (ball.x + ball.radius > WIDTH - 10) {
        ball.x = WIDTH - 10 - ball.radius;
        ball.dx = -Math.abs(ball.dx) * BOUNCE;
    }

    // Bounce off the top and bottom boundaries
    if (ball.y - ball.radius < 10) {
        ball.y = 10 + ball.radius;
        ball.dy = Math.abs(ball.dy) * BOUNCE;
    }

    if (ball.y + ball.radius > HEIGHT - 10) {
        ball.y = HEIGHT - 10 - ball.radius;
        ball.dy = -Math.abs(ball.dy) * BOUNCE;
    }

    // Bounce off rocks
    for (const rock of obstacles) {
        const dx = ball.x - rock.x;
        const dy = ball.y - rock.y;
        const distance = Math.hypot(dx, dy);
        const minimumDistance = ball.radius + rock.radius;

        if (distance < minimumDistance && distance > 0) {
            const nx = dx / distance;
            const ny = dy / distance;

            ball.x = rock.x + nx * minimumDistance;
            ball.y = rock.y + ny * minimumDistance;

            const dot = ball.dx * nx + ball.dy * ny;

            if (dot < 0) {
                ball.dx = (ball.dx - 2 * dot * nx) * BOUNCE;
                ball.dy = (ball.dy - 2 * dot * ny) * BOUNCE;
            }
        }
    }

    // Water hazard: return to the last safe position
    if (isInWater(ball.x, ball.y)) {
        ball.x = lastSafePosition.x;
        ball.y = lastSafePosition.y;

        ball.dx = 0;
        ball.dy = 0;
        moving = false;

        shots++;
        totalShots++;

        updateScoreboard();

        statusText.textContent =
            "Water hazard! Penalty shot added. Try again.";

        return;
    }

    // Collect power-ups
    for (const item of powerUps) {
        if (item.collected) continue;

        const distance = Math.hypot(
            ball.x - item.x,
            ball.y - item.y
        );

        if (distance < ball.radius + 15) {
            item.collected = true;
            powerUpsCollected++;

            if (item.type === "star") {
                boostNextShot = true;

                statusText.textContent =
                    "Star collected! Your next shot gets extra power.";
            } else {
                ball.dx *= 1.35;
                ball.dy *= 1.35;

                statusText.textContent =
                    "Speed boost collected!";
            }

            updateScoreboard();
        }
    }

    lastSafePosition = {
        x: ball.x,
        y: ball.y
    };

    // Sand slows the ball down more than grass
    const friction = isOnSand(ball.x, ball.y)
        ? SAND_FRICTION
        : GRASS_FRICTION;

    ball.dx *= friction;
    ball.dy *= friction;

    const speed = Math.hypot(ball.dx, ball.dy);

    // Sink the ball when it reaches the hole slowly enough
    const holeDistance = Math.hypot(
        ball.x - hole.x,
        ball.y - hole.y
    );

    if (holeDistance < hole.radius && speed < 4.5) {
        ball.x = hole.x;
        ball.y = hole.y;

        ball.dx = 0;
        ball.dy = 0;

        moving = false;
        levelComplete = true;

        if (level === 3) {
            gameComplete = true;

            statusText.textContent =
                "Congratulations! You completed all 3 levels in " +
                totalShots + " shots!";
        } else {
            statusText.textContent =
                "Level " + level +
                " complete! Click Next Level to continue.";

            nextLevelButton.disabled = false;
        }

        updateScoreboard();
        return;
    }

    // Stop when the ball loses its momentum
    if (
        Math.abs(ball.dx) < STOP_SPEED &&
        Math.abs(ball.dy) < STOP_SPEED
    ) {
        ball.dx = 0;
        ball.dy = 0;
        moving = false;

        statusText.textContent =
            "Ball stopped! Aim your next shot.";
    }
}

/* ============================================
   PART 4 - GAME START, LEVELS, AND ANIMATION
============================================ */

// Start the game with a short automatic animation
function resetGame() {
    level = 1;
    shots = 0;
    totalShots = 0;
    powerUpsCollected = 0;

    moving = false;
    dragging = false;
    levelComplete = false;
    gameComplete = false;

    demoActive = true;
    demoFrames = 180;

    nextLevelButton.disabled = true;

    createLevel(1);

    // Automatically move diagonally during the introduction
    ball.dx = 4;
    ball.dy = -3;
    moving = true;

    statusText.textContent =
        "Welcome to Mini Golf! Watch the ball before playing.";
}

// Transition from the automatic animation to gameplay
function startPlaying() {
    demoActive = false;
    moving = false;

    ball.x = 100;
    ball.y = 400;
    ball.dx = 0;
    ball.dy = 0;

    statusText.textContent =
        "Level " + level +
        ": Drag backward from the ball and release to shoot!";
}

// Load the next level after completing the current hole
nextLevelButton.addEventListener("click", function () {
    if (!levelComplete || gameComplete) {
        return;
    }

    level++;

    shots = 0;
    levelComplete = false;

    nextLevelButton.disabled = true;

    createLevel(level);

    statusText.textContent =
        "Level " + level +
        " started! Aim carefully and avoid the obstacles.";
});

// Reset the entire game
resetButton.addEventListener("click", resetGame);

// Main animation loop
function animate() {
    // Automatic opening animation
    if (demoActive) {
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Bounce off the left and right walls
        if (ball.x - ball.radius < 10 ||
            ball.x + ball.radius > WIDTH - 10) {
            ball.dx *= -1;
        }

        // Bounce off the top and bottom walls
        if (ball.y - ball.radius < 10 ||
            ball.y + ball.radius > HEIGHT - 10) {
            ball.dy *= -1;
        }

        demoFrames--;

        // Start the game after approximately 3 seconds
        if (demoFrames <= 0) {
            startPlaying();
        }
    } else {
        // Normal game movement
        moveBall();
    }

    // Redraw the canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    drawCourse();
    drawAim();
    drawBall();

    // Opening screen overlay
    if (demoActive) {
        ctx.fillStyle = "rgba(10,35,20,0.85)";
        ctx.fillRect(190, 210, 520, 85);

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";

        ctx.font = "bold 25px Arial";
        ctx.fillText(
            "WELCOME TO MINI GOLF",
            WIDTH / 2,
            245
        );

        ctx.font = "16px Arial";
        ctx.fillText(
            "Get ready! Your game starts soon.",
            WIDTH / 2,
            275
        );

        ctx.textAlign = "start";
    }

    // Level completion overlay
    if (levelComplete || gameComplete) {
        ctx.fillStyle = "rgba(10,35,20,0.88)";
        ctx.fillRect(190, 205, 520, 115);

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";

        ctx.font = "bold 27px Arial";
        ctx.fillText(
            gameComplete ? "YOU WON!" : "LEVEL COMPLETE!",
            WIDTH / 2,
            245
        );

        ctx.font = "16px Arial";
        ctx.fillText(
            "Shots this level: " + shots +
            " | Total shots: " + totalShots,
            WIDTH / 2,
            277
        );

        ctx.textAlign = "start";
    }

    // Continue animating
    requestAnimationFrame(animate);
}

// Initialize and start the game
resetGame();
animate();
