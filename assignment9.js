"use strict";

// ============================================
// Assignment 9 - Interactive Mini Golf
// COP4813 Web Systems
// ============================================

const canvas = document.getElementById("golfCanvas");
const ctx = canvas.getContext("2d");

const statusText = document.getElementById("golfStatus");
const shotCount = document.getElementById("shotCount");
const resetButton = document.getElementById("resetGolf");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Golf hole position
const hole = {
    x: 775,
    y: 115,
    radius: 17
};

// Game settings
const FRICTION = 0.985;
const SAND_FRICTION = 0.94;
const BOUNCE = 0.72;
const STOP_SPEED = 0.12;
const MAX_DRAG = 100;
const MAX_SPEED = 11;

// Golf ball
let ball;

// Game state
let shots = 0;
let moving = false;
let dragging = false;
let won = false;

let pointerX = 0;
let pointerY = 0;
let effects = [];

// ============================================
// Start or reset the game
// ============================================

function resetGame() {
    ball = {
        x: 100,
        y: 400,
        radius: 12,
        dx: 0,
        dy: 0
    };

    shots = 0;
    moving = false;
    dragging = false;
    won = false;
    effects = [];

    updateScore();

    statusText.textContent =
        "Drag from the golf ball to aim your first shot.";

    drawGame();
}

function updateScore() {
    shotCount.textContent =
        shots + (shots === 1 ? " shot" : " shots");
}

// ============================================
// Draw the golf course
// ============================================

function drawCourse() {
    // Grass background
    const grass = ctx.createLinearGradient(
        0, 0, WIDTH, HEIGHT
    );

    grass.addColorStop(0, "#397b48");
    grass.addColorStop(1, "#205b37");

    ctx.fillStyle = grass;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Course boundary
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, WIDTH - 20, HEIGHT - 20);

    // Fairway
    ctx.fillStyle = "#80bd70";
    ctx.beginPath();
    ctx.ellipse(
        445, 270, 335, 215, -0.05,
        0, Math.PI * 2
    );
    ctx.fill();

    // Fairway stripes
    ctx.save();

    ctx.beginPath();
    ctx.ellipse(
        445, 270, 335, 215, -0.05,
        0, Math.PI * 2
    );
    ctx.clip();

    for (let x = 140; x < 800; x += 90) {
        ctx.fillStyle = "rgba(255,255,255,0.09)";
        ctx.fillRect(x, 45, 42, 450);
    }

    ctx.restore();

    // Sand bunkers
    drawBunker(590, 170, 75, 37);
    drawBunker(460, 360, 63, 29);
    drawBunker(690, 420, 52, 25);

    // Trees
    drawTree(55, 75, 17);
    drawTree(55, 180, 16);
    drawTree(65, 285, 18);
    drawTree(840, 70, 17);
    drawTree(850, 230, 15);
    drawTree(840, 445, 18);
    drawTree(350, 475, 14);

    // Putting green
    ctx.fillStyle = "#a7d88b";
    ctx.beginPath();
    ctx.ellipse(
        755, 125, 112, 85, -0.15,
        0, Math.PI * 2
    );
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Golf hole
    ctx.fillStyle = "#183923";
    ctx.beginPath();
    ctx.ellipse(
        hole.x, hole.y + 3, 19, 12,
        0, 0, Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "#101b13";
    ctx.beginPath();
    ctx.arc(
        hole.x, hole.y,
        hole.radius, 0, Math.PI * 2
    );
    ctx.fill();

    // Flag pole
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(hole.x, hole.y);
    ctx.lineTo(hole.x, hole.y - 73);
    ctx.stroke();

    // Flag
    ctx.fillStyle = "#e6534b";
    ctx.beginPath();
    ctx.moveTo(hole.x, hole.y - 72);
    ctx.lineTo(hole.x + 42, hole.y - 60);
    ctx.lineTo(hole.x, hole.y - 45);
    ctx.closePath();
    ctx.fill();

    // Course label
    ctx.fillStyle = "rgba(20,55,34,0.8)";
    ctx.beginPath();
    ctx.roundRect(22, 22, 160, 32, 7);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px Arial";
    ctx.fillText("MINI GOLF", 35, 43);

    // Instructions
    if (!won && !moving && !dragging) {
        ctx.fillStyle = "rgba(20,55,34,0.8)";
        ctx.beginPath();
        ctx.roundRect(22, 63, 245, 29, 6);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "13px Arial";
        ctx.fillText(
            "Drag the ball to aim and shoot",
            33, 82
        );
    }
}

function drawBunker(x, y, rx, ry) {
    // Sand
    ctx.fillStyle = "#e9d6a2";
    ctx.beginPath();
    ctx.ellipse(
        x, y, rx, ry, -0.2,
        0, Math.PI * 2
    );
    ctx.fill();

    // Sand texture
    ctx.save();

    ctx.beginPath();
    ctx.ellipse(
        x, y, rx, ry, -0.2,
        0, Math.PI * 2
    );
    ctx.clip();

    ctx.fillStyle = "rgba(155,125,67,0.25)";

    for (let i = 0; i < 28; i++) {
        const px = x - rx + ((i * 31) % (rx * 2));
        const py = y - ry + ((i * 17) % (ry * 2));

        ctx.beginPath();
        ctx.arc(px, py, 1.3, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();

    ctx.strokeStyle = "rgba(155,125,67,0.35)";
    ctx.lineWidth = 1;
    ctx.stroke();
}

function drawTree(x, y, size) {
    // Tree trunk
    ctx.fillStyle = "#755139";
    ctx.fillRect(x - 3, y + 3, 6, size);

    // Tree canopy
    ctx.fillStyle = "#164c30";
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#347b45";
    ctx.beginPath();
    ctx.arc(
        x - size * 0.22,
        y - size * 0.2,
        size * 0.65,
        0, Math.PI * 2
    );
    ctx.fill();
}

// ============================================
// Detect whether the ball is on sand
// ============================================

function isOnSand(x, y) {
    const sand1 =
        ((x - 590) / 75) ** 2 +
        ((y - 170) / 37) ** 2 <= 1;

    const sand2 =
        ((x - 460) / 63) ** 2 +
        ((y - 360) / 29) ** 2 <= 1;

    const sand3 =
        ((x - 690) / 52) ** 2 +
        ((y - 420) / 25) ** 2 <= 1;

    return sand1 || sand2 || sand3;
}

// ============================================
// Draw the golf ball
// ============================================

function drawBall() {
    ctx.save();

    // Ball shadow
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.beginPath();
    ctx.ellipse(
        ball.x + 4,
        ball.y + 5,
        ball.radius * 1.2,
        ball.radius * 0.7,
        0, 0, Math.PI * 2
    );
    ctx.fill();

    // Ball gradient
    const gradient = ctx.createRadialGradient(
        ball.x - 4,
        ball.y - 5,
        1,
        ball.x,
        ball.y,
        ball.radius * 1.4
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.7, "#f4f4ee");
    gradient.addColorStop(1, "#b7c0b8");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(
        ball.x,
        ball.y,
        ball.radius,
        0, Math.PI * 2
    );
    ctx.fill();

    ctx.strokeStyle = "#aab5aa";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Golf ball dimples
    ctx.fillStyle = "rgba(125,135,125,0.55)";

    const dimples = [
        [-4, -4], [2, -5], [5, -1],
        [-5, 1], [0, 0], [3, 4], [-2, 5]
    ];

    for (const d of dimples) {
        ctx.beginPath();
        ctx.arc(
            ball.x + d[0],
            ball.y + d[1],
            1,
            0, Math.PI * 2
        );
        ctx.fill();
    }

    ctx.restore();
}

// ============================================
// Draw the aiming guide and power meter
// ============================================

function drawAim() {
    if (!dragging || moving || won) {
        return;
    }

    const dx = pointerX - ball.x;
    const dy = pointerY - ball.y;
    const distance = Math.hypot(dx, dy);

    if (distance < 3) {
        return;
    }

    const length = Math.min(distance, MAX_DRAG);

    const endX = ball.x + (dx / distance) * length;
    const endY = ball.y + (dy / distance) * length;

    ctx.save();

    // Aiming line
    ctx.strokeStyle = "#fff7c2";
    ctx.lineWidth = 3;
    ctx.setLineDash([7, 6]);

    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.setLineDash([]);

    // Aim endpoint
    ctx.fillStyle = "#fff7c2";
    ctx.beginPath();
    ctx.arc(endX, endY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Power meter
    const power = Math.round(
        Math.min(distance / MAX_DRAG, 1) * 100
    );

    ctx.fillStyle = "rgba(20,55,34,0.9)";
    ctx.beginPath();
    ctx.roundRect(22, HEIGHT - 49, 180, 28, 6);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px Arial";
    ctx.fillText(
        "POWER: " + power + "%",
        33, HEIGHT - 30
    );

    ctx.restore();
}

// ============================================
// Shoot the golf ball
// ============================================

function shoot() {
    const dx = pointerX - ball.x;
    const dy = pointerY - ball.y;
    const distance = Math.hypot(dx, dy);

    if (distance < 8) {
        statusText.textContent =
            "Drag farther from the ball to take a shot.";
        return;
    }

    const power = Math.min(distance, MAX_DRAG);
    const speed = (power / MAX_DRAG) * MAX_SPEED;

    ball.dx = (dx / distance) * speed;
    ball.dy = (dy / distance) * speed;

    shots++;
    moving = true;

    updateScore();

    statusText.textContent = "Ball in motion!";

    effects.push({
        x: ball.x,
        y: ball.y,
        radius: 8,
        alpha: 0.8
    });
}

// ============================================
// Move the ball and apply surface physics
// ============================================

function moveBall() {
    if (!moving || won) {
        return;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce off the left and right boundaries
    if (ball.x - ball.radius < 12) {
        ball.x = 12 + ball.radius;
        ball.dx = Math.abs(ball.dx) * BOUNCE;
    }

    if (ball.x + ball.radius > WIDTH - 12) {
        ball.x = WIDTH - 12 - ball.radius;
        ball.dx = -Math.abs(ball.dx) * BOUNCE;
    }

    // Bounce off the top and bottom boundaries
    if (ball.y - ball.radius < 12) {
        ball.y = 12 + ball.radius;
        ball.dy = Math.abs(ball.dy) * BOUNCE;
    }

    if (ball.y + ball.radius > HEIGHT - 12) {
        ball.y = HEIGHT - 12 - ball.radius;
        ball.dy = -Math.abs(ball.dy) * BOUNCE;
    }

    // Apply stronger friction on sand
    const friction = isOnSand(ball.x, ball.y)
        ? SAND_FRICTION
        : FRICTION;

    ball.dx *= friction;
    ball.dy *= friction;

    // Check whether the ball reached the hole
    const distanceToHole = Math.hypot(
        ball.x - hole.x,
        ball.y - hole.y
    );

    if (distanceToHole < hole.radius + 4) {
        won = true;
        moving = false;

        ball.x = hole.x;
        ball.y = hole.y;
        ball.dx = 0;
        ball.dy = 0;

        statusText.textContent =
            "You made it in " + shots +
            (shots === 1 ? " shot!" : " shots!") +
            " Click New Game to play again.";

        effects.push({
            x: hole.x,
            y: hole.y,
            radius: 12,
            alpha: 1
        });

        return;
    }

    // Stop the ball when it moves very slowly
    if (
        Math.abs(ball.dx) < STOP_SPEED &&
        Math.abs(ball.dy) < STOP_SPEED
    ) {
        ball.dx = 0;
        ball.dy = 0;
        moving = false;

        statusText.textContent =
            "Ball stopped. Drag from the ball for your next shot.";
    }
}

// ============================================
// Draw shot and victory effects
// ============================================

function drawEffects() {
    for (let i = effects.length - 1; i >= 0; i--) {
        const effect = effects[i];

        ctx.save();
        ctx.globalAlpha = effect.alpha;
        ctx.strokeStyle = won ? "#fff1a8" : "#ffffff";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.arc(
            effect.x,
            effect.y,
            effect.radius,
            0, Math.PI * 2
        );
        ctx.stroke();

        ctx.restore();

        effect.radius += 1.5;
        effect.alpha -= 0.035;

        if (effect.alpha <= 0) {
            effects.splice(i, 1);
        }
    }
}

// ============================================
// Draw the complete game
// ============================================

function drawGame() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    drawCourse();
    drawAim();
    drawBall();
    drawEffects();

    if (won) {
        ctx.fillStyle = "rgba(15,45,27,0.88)";
        ctx.beginPath();
        ctx.roundRect(250, 205, 400, 100, 14);
        ctx.fill();

        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 28px Arial";
        ctx.fillText("HOLE COMPLETE!", 450, 244);

        ctx.font = "16px Arial";
        ctx.fillText(
            "Completed in " + shots +
            (shots === 1 ? " shot!" : " shots!"),
            450, 277
        );

        ctx.textAlign = "start";
    }
}

// ============================================
// Mouse and touch controls
// ============================================

function getCanvasPosition(event) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left) * WIDTH / rect.width,
        y: (event.clientY - rect.top) * HEIGHT / rect.height
    };
}

canvas.addEventListener("pointerdown", function (event) {
    if (moving || won) {
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
        event.preventDefault();
    }
});

canvas.addEventListener("pointermove", function (event) {
    if (!dragging) {
        return;
    }

    const point = getCanvasPosition(event);

    pointerX = point.x;
    pointerY = point.y;

    event.preventDefault();
});

canvas.addEventListener("pointerup", function (event) {
    if (!dragging) {
        return;
    }

    const point = getCanvasPosition(event);

    pointerX = point.x;
    pointerY = point.y;

    dragging = false;

    shoot();

    event.preventDefault();
});

canvas.addEventListener("pointercancel", function () {
    dragging = false;
});

// New Game button
resetButton.addEventListener("click", resetGame);

// ============================================
// Animation loop
// ============================================

function animate() {
    moveBall();
    drawGame();

    requestAnimationFrame(animate);
}

// Start the game
resetGame();
animate();
