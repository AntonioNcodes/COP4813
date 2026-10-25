
"use strict";

// ======================================
// PART 1: SET UP THE CANVAS
// ======================================

const canvas = document.getElementById("golfCanvas");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;

const statusText = document.getElementById("golfStatus");

// Ball setup
const ball = {
    x: 100,
    y: 100,
    radius: 18,
    dx: 3,
    dy: 2.5,
    color: "#ff3333"
};

// Ball colors
const colors = [
    "#ff3333",
    "#3399ff",
    "#33cc66",
    "#ffcc00",
    "#cc66ff",
    "#ff8800"
];

let colorIndex = 0;
let powerUpsCollected = 0;
let coinsCollected = 0;

// ======================================
// PART 2: CREATE POWER-UPS
// ======================================

const powerUps = [
    { x: 200, y: 180, type: "star", symbol: "★", color: "#ffcc00", collected: false },
    { x: 350, y: 330, type: "boost", symbol: "⚡", color: "#26c6da", collected: false },
    { x: 500, y: 150, type: "magnet", symbol: "M", color: "#bb86fc", collected: false },
    { x: 650, y: 350, type: "shield", symbol: "S", color: "#258ac0", collected: false },
    { x: 750, y: 200, type: "coin", symbol: "$", color: "#ffb300", collected: false }
];

// Power-up effects
let boostActive = false;
let magnetActive = false;
let shieldActive = false;

// ======================================
// PART 3: DRAW THE BACKGROUND
// ======================================

function drawBackground() {
    const grass = ctx.createLinearGradient(0, 0, W, H);
    grass.addColorStop(0, "#397b48");
    grass.addColorStop(1, "#205b37");

    ctx.fillStyle = grass;
    ctx.fillRect(0, 0, W, H);

    // Golf course stripes
    ctx.fillStyle = "rgba(255,255,255,0.07)";

    for (let x = 0; x < W; x += 90) {
        ctx.fillRect(x, 0, 40, H);
    }

    // Course border
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, W - 4, H - 4);
}

// ======================================
// PART 4: DRAW THE BALL
// ======================================

function drawBall() {
    // Ball shadow
    ctx.beginPath();
    ctx.ellipse(
        ball.x + 4,
        ball.y + 6,
        ball.radius,
        ball.radius / 2,
        0,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fill();

    // Ball
    const gradient = ctx.createRadialGradient(
        ball.x - 5,
        ball.y - 6,
        2,
        ball.x,
        ball.y,
        ball.radius
    );

    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(1, ball.color);

    ctx.beginPath();
    ctx.arc(
        ball.x,
        ball.y,
        ball.radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
}

// ======================================
// PART 5: DRAW THE POWER-UPS
// ======================================

function drawPowerUps() {
    for (const item of powerUps) {
        if (item.collected) continue;

        // Power-up circle
        ctx.beginPath();
        ctx.arc(item.x, item.y, 17, 0, Math.PI * 2);

        ctx.fillStyle = item.color;
        ctx.fill();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Power-up symbol
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(item.symbol, item.x, item.y);
    }

    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
}

// ======================================
// PART 6: MOVE AND BOUNCE THE BALL
// ======================================

function moveBall() {
    // Move the ball diagonally
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce off the left edge
    if (ball.x - ball.radius <= 0) {
        ball.x = ball.radius;
        ball.dx = Math.abs(ball.dx);
    }

    // Bounce off the right edge
    if (ball.x + ball.radius >= W) {
        ball.x = W - ball.radius;
        ball.dx = -Math.abs(ball.dx);
    }

    // Bounce off the top edge
    if (ball.y - ball.radius <= 0) {
        ball.y = ball.radius;
        ball.dy = Math.abs(ball.dy);
    }

    // Bounce off the bottom edge
    if (ball.y + ball.radius >= H) {
        ball.y = H - ball.radius;
        ball.dy = -Math.abs(ball.dy);
    }

    // Magnet pulls the ball toward the center
    if (magnetActive) {
        const targetX = W / 2;
        const targetY = H / 2;

        ball.dx += (targetX - ball.x) * 0.0005;
        ball.dy += (targetY - ball.y) * 0.0005;

        // Keep magnet effect from making the ball too fast
        const speed = Math.hypot(ball.dx, ball.dy);

        if (speed > 6) {
            ball.dx = ball.dx / speed * 6;
            ball.dy = ball.dy / speed * 6;
        }
    }
}

// ======================================
// PART 7: COLLECT POWER-UPS
// ======================================

function collectPowerUps() {
    for (const item of powerUps) {
        if (item.collected) continue;

        const distance = Math.hypot(
            ball.x - item.x,
            ball.y - item.y
        );

        if (distance < ball.radius + 17) {
            item.collected = true;
            powerUpsCollected++;

            if (item.type === "star") {
                // Star gives the ball extra speed
                ball.dx *= 1.5;
                ball.dy *= 1.5;

                statusText.textContent =
                    "Star collected! Extra speed activated!";
            }

            else if (item.type === "boost") {
                // Boost increases speed
                ball.dx *= 1.8;
                ball.dy *= 1.8;

                const speed = Math.hypot(ball.dx, ball.dy);

                if (speed > 8) {
                    ball.dx = ball.dx / speed * 8;
                    ball.dy = ball.dy / speed * 8;
                }

                boostActive = true;

                statusText.textContent =
                    "Boost collected! Speed increased!";
            }

            else if (item.type === "magnet") {
                magnetActive = true;

                statusText.textContent =
                    "Magnet collected! Ball is attracted to the center!";
            }

            else if (item.type === "shield") {
                shieldActive = true;

                statusText.textContent =
                    "Shield collected! Your shield is active!";
            }

            else if (item.type === "coin") {
                coinsCollected++;

                statusText.textContent =
                    "Coin collected! You earned a coin!";
            }
        }
    }
}

// ======================================
// PART 8: CLICK THE BALL
// ======================================

canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();

    const mouseX =
        (event.clientX - rect.left) * W / rect.width;

    const mouseY =
        (event.clientY - rect.top) * H / rect.height;

    const distance = Math.hypot(
        mouseX - ball.x,
        mouseY - ball.y
    );

    if (distance <= ball.radius + 5) {
        // Change color
        colorIndex = (colorIndex + 1) % colors.length;
        ball.color = colors[colorIndex];

        // Reverse direction
        ball.dx *= -1;
        ball.dy *= -1;

        if (statusText) {
            statusText.textContent =
                "You clicked the ball! Color and direction changed!";
        }
    }
});

// ======================================
// PART 9: DISPLAY THE SCORE
// ======================================

function drawScore() {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "left";

    ctx.fillText(
        "Power-ups: " + powerUpsCollected,
        18,
        28
    );

    ctx.fillText(
        "Coins: " + coinsCollected,
        18,
        50
    );

    if (magnetActive) {
        ctx.fillText("Magnet: ON", 18, 72);
    }

    if (shieldActive) {
        ctx.fillText("Shield: ON", 18, 94);
    }
}

// ======================================
// PART 10: ANIMATION LOOP
// ======================================

function animate() {
    // Clear and redraw the course
    ctx.clearRect(0, 0, W, H);

    drawBackground();
    moveBall();
    collectPowerUps();
    drawPowerUps();
    drawBall();
    drawScore();

    // Repeat the animation
    requestAnimationFrame(animate);
}

// ======================================
// START THE GAME
// ======================================

if (statusText) {
    statusText.textContent =
        "Click the moving ball to change its color and direction. Collect the power-ups!";
}

animate();
