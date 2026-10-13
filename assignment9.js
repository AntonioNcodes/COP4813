
const canvas = document.getElementById("soccerCanvas");
const ctx = canvas.getContext("2d");

const status = document.getElementById("soccerStatus");
const button = document.getElementById("soccerButton");

// Soccer ball properties
const ball = {
    x: 100,
    y: 100,
    radius: 25,
    speedX: 3,
    speedY: 2,
    color: "white"
};

// Draw the soccer field
function drawField() {
    ctx.fillStyle = "#20834a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Field markings
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;

    ctx.strokeRect(10, 10, 780, 430);

    ctx.beginPath();
    ctx.moveTo(400, 10);
    ctx.lineTo(400, 440);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(400, 225, 60, 0, Math.PI * 2);
    ctx.stroke();
}

// Draw the soccer ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

    ctx.fillStyle = ball.color;
    ctx.fill();

    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Black center circle
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#111827";
    ctx.fill();

    // Ball highlights
    ctx.beginPath();
    ctx.arc(
        ball.x - 8,
        ball.y - 9,
        5,
        0,
        Math.PI * 2
    );
    ctx.fillStyle = "#dbeafe";
    ctx.fill();
}

// Move the ball and bounce off the edges
function moveBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    if (ball.x + ball.radius >= canvas.width ||
        ball.x - ball.radius <= 0) {
        ball.speedX *= -1;
    }

    if (ball.y + ball.radius >= canvas.height ||
        ball.y - ball.radius <= 0) {
        ball.speedY *= -1;
    }
}

// Animation loop
function animate() {
    drawField();
    moveBall();
    drawBall();

    requestAnimationFrame(animate);
}

// Respond to clicking the canvas
canvas.addEventListener("click", function(event) {
    const rect = canvas.getBoundingClientRect();

    // Convert mouse position to canvas coordinates
    const mouseX =
        (event.clientX - rect.left) * canvas.width / rect.width;
    const mouseY =
        (event.clientY - rect.top) * canvas.height / rect.height;

    const distance = Math.hypot(
        mouseX - ball.x,
        mouseY - ball.y
    );

    if (distance <= ball.radius) {
        ball.color = ball.color === "white" ? "#ffd54a" : "white";

        // Give the ball a speed boost
        ball.speedX *= 1.4;
        ball.speedY *= 1.4;

        status.textContent =
            "GOOOAL! The ball has gone absolutely crazy! ⚽";
    }
});

// Start or restart the animation
button.addEventListener("click", function() {
    ball.x = 100;
    ball.y = 100;
    ball.speedX = 3;
    ball.speedY = 2;
    ball.color = "white";

    status.textContent =
        "Kickoff! Click the ball to cause chaos!";

    button.textContent = "Restart Animation";
});

// Start the animation immediately
animate();
