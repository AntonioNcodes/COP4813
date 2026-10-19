"use strict";

// ============================================
// Assignment 9 - Golf Ball Animation
// COP4813 Web Systems
// ============================================

// Get HTML elements
const canvas = document.getElementById("golfCanvas");
const ctx = canvas.getContext("2d");

const statusText = document.getElementById("golfStatus");
const shotCount = document.getElementById("shotCount");
const hitButton = document.getElementById("hitButton");
const resetButton = document.getElementById("resetGolf");

// Canvas dimensions
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Golf ball properties
let ball;
let shots = 0;
let effects = [];

// Colors used when the ball is hit
const colors = [
    "#ffffff",
    "#ffdf5d",
    "#ff8a65",
    "#80cbc4",
    "#ce93d8"
];

// ============================================
// Initialize and reset the golf ball
// ============================================

function resetBall() {
    ball = {
        x: 110,
        y: 110,
        radius: 13,
        dx: 3,
        dy: 2,
        color: "#ffffff"
    };

    shots = 0;
    effects = [];

    updateScore();
    statusText.textContent = "Ready to play!";
}

function updateScore() {
    shotCount.textContent =
        shots + (shots === 1 ? " shot" : " shots");
}

// ============================================
// Draw trees around the golf course
// ============================================

function drawTree(x, y, size) {
    // Tree trunk
    ctx.fillStyle = "#755139";
    ctx.fillRect(
        x - 4,
        y + size * 0.25,
        8,
        size * 0.65
    );

    // Dark green foliage
    ctx.fillStyle = "#164c30";
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    // Middle foliage layer
    ctx.fillStyle = "#277342";
    ctx.beginPath();
    ctx.arc(
        x - size * 0.25,
        y - size * 0.2,
        size * 0.68,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Light green highlight
    ctx.fillStyle = "#438b4e";
    ctx.beginPath();
    ctx.arc(
        x + size * 0.2,
        y - size * 0.3,
        size * 0.43,
        0,
        Math.PI * 2
    );
    ctx.fill();
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

    // Outer course boundary
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 3;
    ctx.strokeRect(
        10, 10,
        WIDTH - 20,
        HEIGHT - 20
    );

    // Fairway
    ctx.fillStyle = "#79b86b";
    ctx.beginPath();
    ctx.ellipse(
        440, 270,
        335, 215,
        -0.05,
        0, Math.PI * 2
    );
    ctx.fill();

    // Fairway stripes
    ctx.save();

    ctx.beginPath();
    ctx.ellipse(
        440, 270,
        335, 215,
        -0.05,
        0, Math.PI * 2
    );
    ctx.clip();

    for (let x = 130; x < 800; x += 90) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.09)";
        ctx.fillRect(x, 40, 45, 460);
    }

    ctx.restore();

    // Water hazard
    const water = ctx.createLinearGradient(
        0, 330, 170, 480
    );

    water.addColorStop(0, "#70c8d5");
    water.addColorStop(1, "#2787aa");

    ctx.fillStyle = water;
    ctx.beginPath();
    ctx.ellipse(
        160, 415,
        115, 55,
        -0.15,
        0, Math.PI * 2
    );
    ctx.fill();

    // Water highlights
    ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
    ctx.lineWidth = 2;

    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.ellipse(
            140 + i * 10,
            405 + i * 8,
            25, 5,
            -0.15,
            0, Math.PI
        );
        ctx.stroke();
    }

    // Sand bunkers
    ctx.fillStyle = "#e9d6a2";

    ctx.beginPath();
    ctx.ellipse(
        650, 125,
        78, 43,
        -0.3,
        0, Math.PI * 2
    );
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(
        560, 395,
        62, 30,
        0.2,
        0, Math.PI * 2
    );
    ctx.fill();

    // Sand texture
    ctx.fillStyle = "rgba(155, 125, 67, 0.22)";

    for (let i = 0; i < 24; i++) {
        const x = 595 + (i * 37 % 105);
        const y = 100 + (i * 19 % 48);

        ctx.fillRect(x, y, 2, 2);
    }

    // Putting green
    ctx.fillStyle = "#a4d887";
    ctx.beginPath();
    ctx.ellipse(
        755, 340,
        105, 82,
        -0.2,
        0, Math.PI * 2
    );
    ctx.fill();

    // Putting green outline
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Golf hole
    ctx.fillStyle = "#173622";
    ctx.beginPath();
    ctx.ellipse(
        765, 350,
        18, 10,
        0,
        0, Math.PI * 2
    );
    ctx.fill();

    // Flag pole
    ctx.strokeStyle = "#f9f9f3";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(765, 350);
    ctx.lineTo(765, 245);
    ctx.stroke();

    // Red flag
    ctx.fillStyle = "#e85c54";

    ctx.beginPath();
    ctx.moveTo(765, 247);
    ctx.lineTo(815, 262);
    ctx.lineTo(765, 280);
    ctx.closePath();
    ctx.fill();

    // Trees around the edges of the course
    drawTree(55, 85, 19);
    drawTree(55, 180, 15);
    drawTree(65, 285, 18);
    drawTree(835, 100, 18);
    drawTree(850, 205, 15);
    drawTree(835, 455, 20);
    drawTree(390, 475, 15);

    // Course label
    ctx.fillStyle = "rgba(20, 55, 34, 0.75)";
    ctx.beginPath();
    ctx.roundRect(22, 22, 180, 34, 8);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Arial";
    ctx.fillText("PRACTICE GREEN", 36, 44);
}

// ============================================
// Draw the golf ball
// ============================================

function drawBall() {
    ctx.save();

    // Ball shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
    ctx.beginPath();

    ctx.ellipse(
        ball.x + 5,
        ball.y + 7,
        ball.radius * 1.15,
        ball.radius * 0.65,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Shaded golf ball
    const gradient = ctx.createRadialGradient(
        ball.x - 5,
        ball.y - 6,
        1,
        ball.x,
        ball.y,
        ball.radius * 1.4
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.65, ball.color);
    gradient.addColorStop(1, "#b9c1bb");

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

    // Ball outline
    ctx.strokeStyle = "rgba(65, 75, 65, 0.5)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Golf ball dimples
    ctx.fillStyle = "rgba(120, 130, 120, 0.5)";

    const dimples = [
        [-5, -5],
        [2, -7],
        [6, -3],
        [-7, 1],
        [0, 0],
        [6, 4],
        [-4, 6],
        [2, 7]
    ];

    for (const dimple of dimples) {
        ctx.beginPath();

        ctx.arc(
            ball.x + dimple[0],
            ball.y + dimple[1],
            1.15,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    ctx.restore();
}

// ============================================
// Move and bounce the golf ball
// ============================================

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce off the right boundary
    if (ball.x + ball.radius >= WIDTH - 12) {
        ball.x = WIDTH - 12 - ball.radius;
        ball.dx = -Math.abs(ball.dx);
    }

    // Bounce off the left boundary
    if (ball.x - ball.radius <= 12) {
        ball.x = 12 + ball.radius;
        ball.dx = Math.abs(ball.dx);
    }

    // Bounce off the bottom boundary
    if (ball.y + ball.radius >= HEIGHT - 12) {
        ball.y = HEIGHT - 12 - ball.radius;
        ball.dy = -Math.abs(ball.dy);
    }

    // Bounce off the top boundary
    if (ball.y - ball.radius <= 12) {
        ball.y = 12 + ball.radius;
        ball.dy = Math.abs(ball.dy);
    }
}

// ============================================
// Hit the golf ball
// ============================================

function hitBall() {
    shots++;

    // Choose a random direction and speed
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 3;

    ball.dx = Math.cos(angle) * speed;
    ball.dy = Math.sin(angle) * speed;

    // Change to a random ball color
    const randomIndex = Math.floor(
        Math.random() * colors.length
    );

    ball.color = colors[randomIndex];

    // Create a ring effect at the ball's position
    effects.push({
        x: ball.x,
        y: ball.y,
        radius: ball.radius,
        alpha: 1
    });

    updateScore();

    statusText.textContent = "Nice shot! Keep it going!";
}

// ============================================
// Detect mouse clicks on the golf ball
// ============================================

function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();

    // Convert mouse coordinates to canvas coordinates
    const mouseX =
        (event.clientX - rect.left) * WIDTH / rect.width;

    const mouseY =
        (event.clientY - rect.top) * HEIGHT / rect.height;

    // Calculate distance between the mouse and ball
    const distance = Math.hypot(
        mouseX - ball.x,
        mouseY - ball.y
    );

    // Only hit the ball if it was clicked
    if (distance <= ball.radius + 6) {
        hitBall();
    }
}

// ============================================
// Draw the ball's hit effect
// ============================================

function drawEffects() {
    for (let i = effects.length - 1; i >= 0; i--) {
        const effect = effects[i];

        ctx.save();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.globalAlpha = effect.alpha;

        ctx.beginPath();

        ctx.arc(
            effect.x,
            effect.y,
            effect.radius,
            0,
            Math.PI * 2
        );

        ctx.stroke();
        ctx.restore();

        // Expand and fade the ring
        effect.radius += 2;
        effect.alpha -= 0.055;

        if (effect.alpha <= 0) {
            effects.splice(i, 1);
        }
    }
}

// ============================================
// Main animation loop
// ============================================

function animate() {
    // Clear the previous frame
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Redraw and update the scene
    drawCourse();
    moveBall();
    drawBall();
    drawEffects();

    // Continue the animation
    requestAnimationFrame(animate);
}

// ============================================
// Reset the game
// ============================================

function resetGame() {
    resetBall();

    statusText.textContent = "Game reset. Ready to play!";
}

// ============================================
// Set up event listeners
// ============================================

canvas.addEventListener("click", handleCanvasClick);

hitButton.addEventListener("click", hitBall);

resetButton.addEventListener("click", resetGame);

// ============================================
// Start the animation
// ============================================

resetBall();
animate();
