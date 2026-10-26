/*
 COP4813 Assignment 9
 Interactive Mini Golf Game
*/

// Keep the game code together.
(() => {
    "use strict";

    // Connect JavaScript to the Assignment 9 HTML.
    const canvas = document.getElementById("golfCanvas");
    const ctx = canvas.getContext("2d");

    const statusElement = document.getElementById("golfStatus");
    const restartButton = document.getElementById("resetGolf");
    const nextButton = document.getElementById("nextLevel");

    const levelDisplay = document.getElementById("levelDisplay");
    const shotDisplay = document.getElementById("shotCount");
    const totalShotsDisplay = document.getElementById("totalShots");
    const powerUpDisplay = document.getElementById("powerUpCount");
    const coinDisplay = document.getElementById("coinCount");

    const W = canvas.width;
    const H = canvas.height;

    const BALL_RADIUS = 10;
    const MAX_DRAG = 115;
    const COLORS = [
        "#ffffff",
        "#ff5c8a",
        "#ffd166",
        "#66e3ff",
        "#b8f28b",
        "#c6a0ff"
    ];

    // Game screen settings.
    let phase = "loading";
    let phaseStart = performance.now();

    const LOADING_DURATION = 1800;
    const DEMO_DURATION = 5000;

    // Opening bouncing-ball demonstration.
    const demo = {
        x: W * 0.25,
        y: H * 0.30,
        radius: 19,
        dx: 3.2,
        dy: 2.5,
        color: "#ffffff",
        clicks: 0
    };

    // Main game variables.
    let level = 1;
    let ball = null;
    let hole = null;

    let rocks = [];
    let waterHazards = [];
    let sandTraps = [];
    let powerUps = [];

    let moving = false;
    let dragging = false;
    let pointerX = 0;
    let pointerY = 0;

    let shotCount = 0;
    let totalShots = 0;
    let coinsCollected = 0;
    let powerUpsCollected = 0;

    let ballColorIndex = 0;
    let ballColor = COLORS[ballColorIndex];

    let completed = false;
    let boostNextShot = false;

    let lastSafePosition = { x: 100, y: 400 };

    // Display a message below the game.
    function setStatus(message) {
        statusElement.textContent = message;
    }

    // Keep a number within a minimum and maximum.
    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    // Draw centered text on the canvas.
    function drawCenteredText(text, x, y, font, color = "#ffffff") {
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, x, y);
    }

    // Change the golf ball to the next color.
    function changeBallColor() {
        ballColorIndex = (ballColorIndex + 1) % COLORS.length;
        ballColor = COLORS[ballColorIndex];
    }

    // Draw the opening loading screen.
    function drawLoadingScreen(now) {
        const gradient = ctx.createLinearGradient(0, 0, W, H);
        gradient.addColorStop(0, "#102c1b");
        gradient.addColorStop(1, "#39834b");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);

        drawCenteredText(
            "MINI GOLF ADVENTURE",
            W / 2,
            H * 0.32,
            "bold 38px Arial"
        );

        drawCenteredText(
            "Preparing your golf course...",
            W / 2,
            H * 0.43,
            "20px Arial",
            "#e0f5d8"
        );

        const barWidth = 420;
        const barHeight = 18;
        const barX = (W - barWidth) / 2;
        const barY = H * 0.52;

        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.fillRect(barX, barY, barWidth, barHeight);

        const progress = clamp(
            (now - phaseStart) / LOADING_DURATION,
            0,
            1
        );

        ctx.fillStyle = "#ffd166";
        ctx.fillRect(
            barX,
            barY,
            barWidth * progress,
            barHeight
        );
    }

    // Move the demo ball and bounce it off the edges.
    function updateDemo() {
        demo.x += demo.dx;
        demo.y += demo.dy;

        if (
            demo.x - demo.radius <= 20 ||
            demo.x + demo.radius >= W - 20
        ) {
            demo.dx *= -1;
            demo.x = clamp(
                demo.x,
                20 + demo.radius,
                W - 20 - demo.radius
            );
        }

        if (
            demo.y - demo.radius <= 20 ||
            demo.y + demo.radius >= H - 20
        ) {
            demo.dy *= -1;
            demo.y = clamp(
                demo.y,
                20 + demo.radius,
                H - 20 - demo.radius
            );
        }
    }

    // Draw the opening bouncing-ball demonstration.
    function drawDemo() {
        ctx.fillStyle = "#39834b";
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = "#83c76c";
        ctx.fillRect(20, 20, W - 40, H - 40);

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 5;
        ctx.strokeRect(20, 20, W - 40, H - 40);

        const gradient = ctx.createRadialGradient(
            demo.x - 5,
            demo.y - 6,
            2,
            demo.x,
            demo.y,
            demo.radius
        );

        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(0.6, demo.color);
        gradient.addColorStop(1, "#444444");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(
            demo.x,
            demo.y,
            demo.radius,
            0,
            Math.PI * 2
        );
        ctx.fill();

        drawCenteredText(
            "BOUNCING BALL DEMO",
            W / 2,
            55,
            "bold 27px Arial",
            "#173b20"
        );

        drawCenteredText(
            "Click the moving ball to change its color and direction",
            W / 2,
            88,
            "17px Arial",
            "#173b20"
        );

        drawCenteredText(
            "Mini golf starts shortly...",
            W / 2,
            H - 35,
            "16px Arial",
            "#173b20"
        );
    }
 
    // Create the layout for a golf level.
    function createLevel(number) {
        level = number;

        rocks = [];
        waterHazards = [];
        sandTraps = [];
        powerUps = [];

        moving = false;
        dragging = false;
        completed = false;
        boostNextShot = false;

        // Reset the ball and hole positions.
        ball = {
            x: W * 0.12,
            y: H * 0.82,
            radius: BALL_RADIUS,
            dx: 0,
            dy: 0
        };

        hole = {
            x: W * 0.88,
            y: H * 0.18,
            radius: 18
        };

        lastSafePosition = {
            x: ball.x,
            y: ball.y
        };

        // Level 1: Beginner course.
        if (number === 1) {
            waterHazards.push(
                { x: W * 0.46, y: H * 0.72, rx: 72, ry: 40 }
            );

            sandTraps.push(
                { x: W * 0.67, y: H * 0.44, rx: 76, ry: 42 }
            );

            rocks.push(
                { x: W * 0.32, y: H * 0.49, radius: 22 },
                { x: W * 0.75, y: H * 0.68, radius: 19 }
            );

            powerUps.push(
                { x: W * 0.25, y: H * 0.69, type: "star", collected: false },
                { x: W * 0.54, y: H * 0.32, type: "coin", collected: false },
                { x: W * 0.78, y: H * 0.54, type: "boost", collected: false }
            );

        // Level 2: More obstacles.
        } else if (number === 2) {
            waterHazards.push(
                { x: W * 0.42, y: H * 0.70, rx: 78, ry: 43 },
                { x: W * 0.70, y: H * 0.31, rx: 53, ry: 34 }
            );

            sandTraps.push(
                { x: W * 0.61, y: H * 0.46, rx: 80, ry: 45 }
            );

            rocks.push(
                { x: W * 0.30, y: H * 0.53, radius: 23 },
                { x: W * 0.56, y: H * 0.62, radius: 19 },
                { x: W * 0.79, y: H * 0.70, radius: 21 }
            );

            powerUps.push(
                { x: W * 0.24, y: H * 0.35, type: "coin", collected: false },
                { x: W * 0.51, y: H * 0.29, type: "star", collected: false },
                { x: W * 0.80, y: H * 0.48, type: "boost", collected: false }
            );

        // Level 3: Advanced course.
        } else {
            waterHazards.push(
                { x: W * 0.41, y: H * 0.39, rx: 72, ry: 42 },
                { x: W * 0.66, y: H * 0.70, rx: 64, ry: 38 }
            );

            sandTraps.push(
                { x: W * 0.65, y: H * 0.43, rx: 80, ry: 45 },
                { x: W * 0.29, y: H * 0.66, rx: 57, ry: 35 }
            );

            rocks.push(
                { x: W * 0.27, y: H * 0.43, radius: 21 },
                { x: W * 0.52, y: H * 0.57, radius: 23 },
                { x: W * 0.79, y: H * 0.57, radius: 18 }
            );

            powerUps.push(
                { x: W * 0.24, y: H * 0.27, type: "star", collected: false },
                { x: W * 0.48, y: H * 0.29, type: "coin", collected: false },
                { x: W * 0.80, y: H * 0.32, type: "boost", collected: false }
            );
        }

        // Reset this level's shot count.
        shotCount = 0;

        updateScoreboard();

        setStatus(
            `Level ${level}: Drag backward from the ball and release to shoot.`
        );

        // Enable Next Level only after the course is completed.
        nextButton.disabled = true;
    }

    // Draw the water hazards and sand traps.
    function drawWaterAndSand() {
        // Draw water.
        for (const water of waterHazards) {
            ctx.fillStyle = "#258bd2";
            ctx.beginPath();
            ctx.ellipse(
                water.x,
                water.y,
                water.rx,
                water.ry,
                0,
                0,
                Math.PI * 2
            );
            ctx.fill();

            ctx.strokeStyle = "#a5e7ff";
            ctx.lineWidth = 3;
            ctx.stroke();

            drawCenteredText(
                "WATER",
                water.x,
                water.y,
                "bold 12px Arial",
                "#ffffff"
            );
        }

        // Draw sand.
        for (const sand of sandTraps) {
            ctx.fillStyle = "#e7c77b";
            ctx.beginPath();
            ctx.ellipse(
                sand.x,
                sand.y,
                sand.rx,
                sand.ry,
                0,
                0,
                Math.PI * 2
            );
            ctx.fill();

            ctx.strokeStyle = "#fff0b3";
            ctx.lineWidth = 3;
            ctx.stroke();

            drawCenteredText(
                "SAND",
                sand.x,
                sand.y,
                "bold 12px Arial",
                "#76521b"
            );
        }
    }

 
    // Update all scoreboard values in the HTML.
    function updateScoreboard() {
        levelDisplay.textContent = `Level ${level} of 3`;
        shotDisplay.textContent = shotCount;
        totalShotsDisplay.textContent = totalShots;
        powerUpDisplay.textContent = powerUpsCollected;
        coinDisplay.textContent = coinsCollected;
    }

    // Draw the complete golf course.
    function drawCourse() {
        const gradient = ctx.createLinearGradient(0, 0, W, H);
        gradient.addColorStop(0, "#9bd779");
        gradient.addColorStop(1, "#4b9b53");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);

        // Draw the course border.
        ctx.strokeStyle = "#f7f4dc";
        ctx.lineWidth = 8;
        ctx.strokeRect(8, 8, W - 16, H - 16);

        // Add decorative stripes to the grass.
        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.lineWidth = 2;

        for (let x = 35; x < W; x += 65) {
            ctx.beginPath();
            ctx.moveTo(x, 20);
            ctx.lineTo(x, H - 20);
            ctx.stroke();
        }

        // Draw the water hazards and sand traps.
        drawWaterAndSand();

        // Draw rocks.
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

            ctx.strokeStyle = "#42494d";
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Draw the golf hole.
        ctx.fillStyle = "#202020";
        ctx.beginPath();
        ctx.arc(
            hole.x,
            hole.y,
            hole.radius,
            0,
            Math.PI * 2
        );
        ctx.fill();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw the flag pole.
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(hole.x, hole.y);
        ctx.lineTo(hole.x, hole.y - 43);
        ctx.stroke();

        // Draw the red flag.
        ctx.fillStyle = "#ed3b45";
        ctx.beginPath();
        ctx.moveTo(hole.x, hole.y - 43);
        ctx.lineTo(hole.x + 28, hole.y - 34);
        ctx.lineTo(hole.x, hole.y - 25);
        ctx.closePath();
        ctx.fill();
    }

    // Draw the golf ball with shading.
    function drawBall() {
        if (!ball) {
            return;
        }

        // Draw the ball's shadow.
        ctx.fillStyle = "rgba(0,0,0,0.22)";
        ctx.beginPath();
        ctx.ellipse(
            ball.x + 3,
            ball.y + 5,
            ball.radius * 1.1,
            ball.radius * 0.75,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Draw the ball itself.
        const gradient = ctx.createRadialGradient(
            ball.x - 3,
            ball.y - 4,
            1,
            ball.x,
            ball.y,
            ball.radius * 1.5
        );

        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(0.5, ballColor);
        gradient.addColorStop(1, "#444444");

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
    }

    // Draw the aiming line while the player drags.
    function drawAim() {
        if (!dragging || !ball) {
            return;
        }

        const dx = ball.x - pointerX;
        const dy = ball.y - pointerY;
        const distance = Math.hypot(dx, dy);
        const scale = distance > MAX_DRAG
            ? MAX_DRAG / distance
            : 1;

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 6]);

        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(
            ball.x - dx * scale,
            ball.y - dy * scale
        );
        ctx.stroke();

        ctx.setLineDash([]);
    }

    // Check whether a point is inside an oval hazard.
    function pointInEllipse(x, y, ellipse) {
        const dx = (x - ellipse.x) / ellipse.rx;
        const dy = (y - ellipse.y) / ellipse.ry;

        return dx * dx + dy * dy <= 1;
    }

 
    // Update the ball while it is rolling.
    function updateBall() {
        if (!ball || !moving || completed) {
            return;
        }

        // Move the ball.
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Bounce off the left and right course boundaries.
        if (
            ball.x - ball.radius < 12 ||
            ball.x + ball.radius > W - 12
        ) {
            ball.dx *= -0.75;
            ball.x = clamp(
                ball.x,
                12 + ball.radius,
                W - 12 - ball.radius
            );
        }

        // Bounce off the top and bottom course boundaries.
        if (
            ball.y - ball.radius < 12 ||
            ball.y + ball.radius > H - 12
        ) {
            ball.dy *= -0.75;
            ball.y = clamp(
                ball.y,
                12 + ball.radius,
                H - 12 - ball.radius
            );
        }

        // Check for collisions with rocks.
        for (const rock of rocks) {
            const dx = ball.x - rock.x;
            const dy = ball.y - rock.y;
            const distance = Math.hypot(dx, dy);
            const minimumDistance = ball.radius + rock.radius;

            if (distance < minimumDistance && distance > 0) {
                const nx = dx / distance;
                const ny = dy / distance;

                // Move the ball outside the rock.
                ball.x = rock.x + nx * minimumDistance;
                ball.y = rock.y + ny * minimumDistance;

                // Bounce away from the rock.
                const dot = ball.dx * nx + ball.dy * ny;

                if (dot < 0) {
                    ball.dx -= 1.75 * dot * nx;
                    ball.dy -= 1.75 * dot * ny;
                }
            }
        }

        // Water sends the ball back to its last safe position.
        for (const water of waterHazards) {
            if (pointInEllipse(ball.x, ball.y, water)) {
                ball.x = lastSafePosition.x;
                ball.y = lastSafePosition.y;
                ball.dx = 0;
                ball.dy = 0;
                moving = false;

                setStatus(
                    "Splash! Your ball landed in water. Try another shot."
                );
                return;
            }
        }

        // Sand slows the ball down.
        let onSand = false;

        for (const sand of sandTraps) {
            if (pointInEllipse(ball.x, ball.y, sand)) {
                onSand = true;
                break;
            }
        }

        const friction = onSand ? 0.94 : 0.985;

        ball.dx *= friction;
        ball.dy *= friction;

        // Collect power-ups and coins.
        for (const item of powerUps) {
            if (item.collected) {
                continue;
            }

            const distance = Math.hypot(
                ball.x - item.x,
                ball.y - item.y
            );

            if (distance < ball.radius + 15) {
                item.collected = true;

                if (item.type === "coin") {
                    coinsCollected++;
                    setStatus("Coin collected!");
                } else if (item.type === "star") {
                    powerUpsCollected++;
                    changeBallColor();
                    setStatus("Star collected! Your ball changed color!");
                } else if (item.type === "boost") {
                    powerUpsCollected++;
                    boostNextShot = true;
                    setStatus("Speed boost collected! Your next shot is stronger.");
                }

                updateScoreboard();
            }
        }

        // Save the last safe position outside the water.
        lastSafePosition.x = ball.x;
        lastSafePosition.y = ball.y;

        // Check whether the ball reaches the hole.
        const holeDistance = Math.hypot(
            ball.x - hole.x,
            ball.y - hole.y
        );

        if (
            holeDistance < hole.radius &&
            Math.hypot(ball.dx, ball.dy) < 2.5
        ) {
            ball.x = hole.x;
            ball.y = hole.y;
            ball.dx = 0;
            ball.dy = 0;

            moving = false;
            completed = true;

            // Enable the button only when the level is completed.
            nextButton.disabled = false;

            setStatus(
                `Level ${level} complete! You took ${shotCount} shots. Click Next Level to continue.`
            );

            return;
        }

        // Stop the ball when it has almost finished rolling.
        if (
            Math.abs(ball.dx) < 0.08 &&
            Math.abs(ball.dy) < 0.08
        ) {
            ball.dx = 0;
            ball.dy = 0;
            moving = false;

            setStatus(
                `Level ${level}: ${shotCount} shots. Drag backward from the ball to shoot again.`
            );
        }
    }

 
    // Convert mouse or touch coordinates to canvas coordinates.
    function getPointerPosition(event) {
        const rect = canvas.getBoundingClientRect();

        return {
            x: (event.clientX - rect.left) * (W / rect.width),
            y: (event.clientY - rect.top) * (H / rect.height)
        };
    }

    // Handle pressing the mouse or touching the canvas.
    canvas.addEventListener("pointerdown", (event) => {
        const position = getPointerPosition(event);

        // During the opening demo, clicking the ball changes its direction.
        if (phase === "demo") {
            const distance = Math.hypot(
                position.x - demo.x,
                position.y - demo.y
            );

            if (distance <= demo.radius + 12) {
                demo.clicks++;
                demo.dx *= -1;
                demo.dy *= -1;

                const demoColors = [
                    "#ff5c8a",
                    "#ffd166",
                    "#66e3ff",
                    "#b8f28b",
                    "#c6a0ff"
                ];

                demo.color = demoColors[
                    demo.clicks % demoColors.length
                ];

                setStatus("Nice! You changed the demo ball.");
            }

            return;
        }

        // Only allow aiming when the game is active and the ball is stopped.
        if (phase !== "game" || moving || completed || !ball) {
            return;
        }

        const distance = Math.hypot(
            position.x - ball.x,
            position.y - ball.y
        );

        if (distance <= ball.radius + 18) {
            dragging = true;
            pointerX = position.x;
            pointerY = position.y;

            // Change the golf ball's color when it is selected.
            changeBallColor();

            canvas.setPointerCapture(event.pointerId);
            setStatus("Drag backward from the ball, then release to shoot.");
        }
    });

    // Update the aiming position while dragging.
    canvas.addEventListener("pointermove", (event) => {
        if (!dragging) {
            return;
        }

        const position = getPointerPosition(event);
        pointerX = position.x;
        pointerY = position.y;
    });

    // Release the mouse or touch to shoot the ball.
    canvas.addEventListener("pointerup", (event) => {
        if (!dragging || !ball) {
            return;
        }

        const position = getPointerPosition(event);
        pointerX = position.x;
        pointerY = position.y;

        const dx = ball.x - pointerX;
        const dy = ball.y - pointerY;
        const distance = Math.hypot(dx, dy);

        dragging = false;

        // Ignore a very small drag.
        if (distance < 8) {
            setStatus("Drag farther backward to take a shot.");
            return;
        }

        // Limit the maximum shot strength.
        const strength = Math.min(distance, MAX_DRAG);
        const scale = strength / Math.max(distance, 1);
        const power = boostNextShot ? 0.19 : 0.13;

        ball.dx = dx * scale * power;
        ball.dy = dy * scale * power;

        // Use a power-up boost only for this shot.
        if (boostNextShot) {
            ball.dx *= 1.45;
            ball.dy *= 1.45;
            boostNextShot = false;
        }

        shotCount++;
        totalShots++;

        moving = true;
        updateScoreboard();

        setStatus(`Shot ${shotCount}! Watch your ball roll.`);
    });

    // Cancel aiming if the browser interrupts the pointer.
    canvas.addEventListener("pointercancel", () => {
        dragging = false;
    });

    // Restart the complete game and reset the scores.
    function restartGame() {
        level = 1;

        totalShots = 0;
        coinsCollected = 0;
        powerUpsCollected = 0;

        ballColorIndex = 0;
        ballColor = COLORS[ballColorIndex];

        phase = "game";
        phaseStart = performance.now();

        createLevel(1);
        updateScoreboard();

        nextButton.disabled = true;

        setStatus("New game started! Drag backward from the ball to shoot.");
    }

    // Move to the next level after the current level is completed.
    function goToNextLevel() {
        if (!completed) {
            return;
        }

        if (level < 3) {
            createLevel(level + 1);
            setStatus(
                `Welcome to Level ${level}! Watch out for the new obstacles.`
            );
        } else {
            nextButton.disabled = true;
            setStatus(
                `Congratulations! You completed all three levels in ${totalShots} total shots and collected ${coinsCollected} coins!`
            );
        }
    }

    // Connect the HTML buttons to their functions.
    restartButton.addEventListener("click", restartGame);
    nextButton.addEventListener("click", goToNextLevel);

 
    // Draw the active mini-golf game.
    function drawGame() {
        drawCourse();

        // Draw every power-up that has not been collected.
        for (const item of powerUps) {
            if (item.collected) {
                continue;
            }

            if (item.type === "star") {
                drawCenteredText(
                    "⭐",
                    item.x,
                    item.y,
                    "25px Arial"
                );
            } else if (item.type === "coin") {
                ctx.fillStyle = "#ffd166";
                ctx.beginPath();
                ctx.arc(item.x, item.y, 12, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = "#a66a00";
                ctx.lineWidth = 2;
                ctx.stroke();

                drawCenteredText(
                    "$",
                    item.x,
                    item.y,
                    "bold 15px Arial",
                    "#76521b"
                );
            } else if (item.type === "boost") {
                drawCenteredText(
                    "⚡",
                    item.x,
                    item.y,
                    "25px Arial"
                );
            }
        }

        // Show the level number on the course.
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.fillRect(22, 22, 145, 34);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(`LEVEL ${level} / 3`, 32, 39);

        // Draw the aiming guide and golf ball.
        drawAim();
        drawBall();

        // Display a completion message over the course.
        if (completed) {
            ctx.fillStyle = "rgba(0,0,0,0.68)";
            ctx.fillRect(140, 190, W - 280, 125);

            drawCenteredText(
                level === 3 ? "COURSE COMPLETED!" : "LEVEL COMPLETE!",
                W / 2,
                228,
                "bold 29px Arial",
                "#ffd166"
            );

            drawCenteredText(
                level === 3
                    ? "Congratulations! You finished all three levels."
                    : "Click Next Level to continue.",
                W / 2,
                272,
                "18px Arial"
            );
        }
    }

    // Start a fresh game after the opening animation.
    function startGame() {
        totalShots = 0;
        coinsCollected = 0;
        powerUpsCollected = 0;

        ballColorIndex = 0;
        ballColor = COLORS[ballColorIndex];

        phase = "game";
        createLevel(1);
        updateScoreboard();

        setStatus(
            "Level 1: Drag backward from the ball and release to shoot."
        );
    }

    // Run the game animation continuously.
    function animate(now) {
        if (phase === "loading") {
            drawLoadingScreen(now);

            if (now - phaseStart >= LOADING_DURATION) {
                phase = "demo";
                phaseStart = now;

                setStatus(
                    "Click the bouncing demo ball to change its color and direction."
                );
            }
        } else if (phase === "demo") {
            updateDemo();
            drawDemo();

            if (now - phaseStart >= DEMO_DURATION) {
                startGame();
            }
        } else if (phase === "game") {
            updateBall();
            drawGame();
        }

        requestAnimationFrame(animate);
    }

    // Prepare the page and start the animation.
    function initializeGame() {
        updateScoreboard();

        setStatus("Preparing the golf course...");

        restartButton.disabled = false;
        nextButton.disabled = true;

        requestAnimationFrame(animate);
    }

    // Start the game when the JavaScript has loaded.
    initializeGame();

})();

