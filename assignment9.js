"use strict";

// ============================================
// Assignment 9 - Interactive Golf Course
// COP4813 Web Systems
// ============================================

const canvas = document.getElementById("golfCanvas");
const ctx = canvas.getContext("2d");

const statusText = document.getElementById("golfStatus");
const hitButton = document.getElementById("hitButton");
const resetButton = document.getElementById("resetGolf");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Golf ball properties
let ball;
let shots = 0;
let animationFrame = 0;
let effects = [];

// Colors used when the ball is hit
const ballColors = [
    "#ffffff",
    "#ffeb3b",
    "#ff7043",
    "#42a5f5",
    "#f06292",
    "#b388ff"
];

// --------------------------------------------
// Initialize the golf ball
// --------------------------------------------

function resetBall() {
    ball = {
        x: 100,
        y: 100,
        radius: 13,
        dx: 3,
        dy: 2,
        color: "#ffffff"
    };

    shots = 0;
    effects = [];

    statusText.textContent =
        "Ready to play! Click the golf ball to take a shot.";
}

// --------------------------------------------
// Draw the golf course
// --------------------------------------------

function drawCourse() {
    // Grass background
    const grass = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    grass.addColorStop(0, "#3d9145");
    grass.addColorStop(1, "#176b32");

    ctx.fillStyle = grass;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Fairway
    ctx.fillStyle = "#73bd62";
    ctx.beginPath();
    ctx.ellipse(450, 265, 330, 225, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fairway stripes
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(450, 265, 330, 225, 0, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = "rgba(255, 255, 255, 0.10)";

    for (let x = 140; x < 800; x += 100) {
        ctx.fillRect(x, 40, 45, 450);
    }

    ctx.restore();

    // Sand bunker
    ctx.fillStyle = "#e8d49b";
    ctx.beginPath();
    ctx.ellipse(660, 125, 75, 38, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Golf green
    ctx.fillStyle = "#9bdb78";
    ctx.beginPath();
    ctx.ellipse(755, 365, 105, 78, 0, 0, Math.PI * 2);
    ctx.fill();

    // Golf hole
    ctx.fillStyle = "#17231a";
    ctx.beginPath();
    ctx.ellipse(760, 375, 23, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Flag pole
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(760, 375);
    ctx.lineTo(760, 270);
    ctx.stroke();

    // Red flag
    ctx.fillStyle = "#e53935";

    ctx.beginPath();
    ctx.moveTo(760, 270);
    ctx.lineTo(815, 287);
    ctx.lineTo(760, 307);
    ctx.closePath();
    ctx.fill();

    // Shot counter
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 21px Arial";
    ctx.fillText("Shots: " + shots, 20, 32);

    // Instructions on course
    ctx.font = "14px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Click the ball to hit it!", 20, 55);

    // Canvas boundary
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, WIDTH - 4, HEIGHT - 4);
}

// --------------------------------------------
// Draw the golf ball
// --------------------------------------------

function drawBall() {
    ctx.save();

    // Ball shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.beginPath();
    ctx.ellipse(
        ball.x + 5,
        ball.y + 7,
        ball.radius * 1.1,
        ball.radius * 0.55,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Main ball
    ctx.fillStyle = ball.color;
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
    ctx.strokeStyle = "#d5d5d5";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Golf ball dimples
    ctx.fillStyle = "#b5b5b5";

    const dimples = [
        [-5, -5],
        [3, -6],
        [-7, 1],
        [1, 0],
        [7, 3],
        [-3, 6],
        [4, 7]
    ];

    for (const dimple of dimples) {
        ctx.beginPath();
        ctx.arc(
            ball.x + dimple[0],
            ball.y + dimple[1],
            1.2,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    ctx.restore();
}

// --------------------------------------------
// Move the ball
// --------------------------------------------

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce off the left and right walls
    if (ball.x + ball.radius >= WIDTH) {
        ball.x = WIDTH - ball.radius;
        ball.dx = -Math.abs(ball.dx);
    } else if (ball.x - ball.radius <= 0) {
        ball.x = ball.radius;
        ball.dx = Math.abs(ball.dx);
    }

    // Bounce off the top and bottom walls
    if (ball.y + ball.radius >= HEIGHT) {
        ball.y = HEIGHT - ball.radius;
        ball.dy = -Math.abs(ball.dy);
    } else if (ball.y - ball.radius <= 0) {
        ball.y = ball.radius;
        ball.dy = Math.abs(ball.dy);
    }
}

// --------------------------------------------
// Hit the golf ball
// --------------------------------------------

function hitBall() {
    shots++;

    // Give the ball a new direction and speed
    const speedX = 3 + Math.random() * 4;
    const speedY = 2 + Math.random() * 4;

    ball.dx = (Math.random() < 0.5 ? -1 : 1) * speedX;
    ball.dy = (Math.random() < 0.5 ? -1 : 1) * speedY;

    // Change the ball's color
    const randomIndex = Math.floor(
        Math.random() * ballColors.length
    );

    ball.color = ballColors[randomIndex];

    // Create a visible hit effect
    effects.push({
        x: ball.x,
        y: ball.y,
        radius: 8,
        alpha: 1
    });

    statusText.textContent =
        "Nice shot! Total shots: " + shots;
}

// --------------------------------------------
// Detect mouse clicks on the ball
// --------------------------------------------

function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();

    // Convert mouse position to canvas coordinates
    const mouseX =
        (event.clientX - rect.left) * WIDTH / rect.width;

    const mouseY =
        (event.clientY - rect.top) * HEIGHT / rect.height;

    // Calculate distance between mouse and ball
    const distance = Math.hypot(
        mouseX - ball.x,
        mouseY - ball.y
    );

    // Only hit the ball when it is clicked
    if (distance <= ball.radius + 5) {
        hitBall();
    }
}

// --------------------------------------------
// Draw the hit effect
// --------------------------------------------

function drawEffects() {
    for (let i = effects.length - 1; i >= 0; i--) {
        const effect = effects[i];

        ctx.save();
        ctx.strokeStyle = "#fff176";
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

        effect.radius += 2;
        effect.alpha -= 0.06;

        if (effect.alpha <= 0) {
            effects.splice(i, 1);
        }
    }
}

// --------------------------------------------
// Main animation loop
// --------------------------------------------

function animate() {
    animationFrame++;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    drawCourse();
    moveBall();
    drawBall();
    drawEffects();

    requestAnimationFrame(animate);
}

// --------------------------------------------
// Reset the golf game
// --------------------------------------------

function resetGame() {
    resetBall();

    statusText.textContent =
        "Game reset! Click the golf ball to take a shot.";
}

// --------------------------------------------
// Set up controls
// --------------------------------------------

canvas.addEventListener("click", handleCanvasClick);
hitButton.addEventListener("click", hitBall);
resetButton.addEventListener("click", resetGame);

// --------------------------------------------
// Start the golf animation
// --------------------------------------------

resetBall();
animate();
