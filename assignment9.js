
/*
 COP4813 Assignment 9 — Mini Golf Adventure
 PART 1: Bouncing ball animation
 PART 2: Mouse-click response
 PART 3: Loading screen and transition to mini golf
 PART 4: Mini-golf levels and ball physics
 PART 5: Power-ups
 PART 6: Water hazards and sand traps
*/

(() => {
    "use strict";

    let canvas = document.getElementById("gameCanvas") ||
                 document.querySelector("canvas");

    if (!canvas) {
        document.body.innerHTML = `
            <main style="max-width:960px;margin:20px auto;font-family:Arial;color:white;background:#102318;padding:16px">
                <h1>Mini Golf Adventure</h1>
                <p>Drag backward from the ball and release to shoot!</p>
                <canvas id="gameCanvas" width="900" height="540"
                    style="width:100%;height:auto;border:4px solid white;touch-action:none">
                </canvas>
                <p id="gameStatus">Get ready!</p>
                <button id="restartButton">Restart level</button>
                <button id="nextButton">Next level</button>
            </main>
        `;
        document.body.style.background = "#102318";
        canvas = document.getElementById("gameCanvas");
    }

    const ctx = canvas.getContext("2d");
    const W = canvas.width || 900;
    const H = canvas.height || 540;

    const BALL_RADIUS = 10;
    const MAX_DRAG = 115;
    const GRASS_FRICTION = 0.985;

    const COLORS = [
        "#ffffff",
        "#ff5c8a",
        "#ffd166",
        "#66e3ff",
        "#b8f28b",
        "#c6a0ff"
    ];

    const statusElement = document.getElementById("gameStatus");
    const restartButton = document.getElementById("restartButton");
    const nextButton = document.getElementById("nextButton");

    let phase = "loading";
    let phaseStart = performance.now();

    const LOADING_DURATION = 1400;
    const DEMO_DURATION = 4200;

    // PART 1: The ball moves diagonally and bounces inside a rectangle.
    const demo = {
        x: W * 0.20,
        y: H * 0.22,
        radius: 18,
        dx: 3.2,
        dy: 2.3,
        color: "#ffffff",
        clicks: 0
    };

    // Mini-golf game variables.
    let level = 1;
    let ball;
    let hole;
    let rocks = [];
    let powerUps = [];
    let waterHazards = [];
    let sandTraps = [];
    let particles = [];

    let moving = false;
    let dragging = false;
    let pointerX = 0;
    let pointerY = 0;

    let shotCount = 0;
    let coinsCollected = 0;
    let powerUpsCollected = 0;
    let boostNextShot = false;
    let completed = false;

    let ballColor = COLORS[0];
    
let ballColorIndex = 0;

function changeBallColor() {
    ballColorIndex = (ballColorIndex + 1) % COLORS.length;
    ballColor = COLORS[ballColorIndex];
}

    let lastSafePosition = { x: W * 0.12, y: H * 0.82 };

    function setStatus(message) {
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function drawCenteredText(text, x, y, font, color = "#ffffff") {
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, x, y);
    }

    // PART 3: Loading screen.
    function drawLoadingScreen(now) {
        const gradient = ctx.createLinearGradient(0, 0, W, H);
        gradient.addColorStop(0, "#102c1b");
        gradient.addColorStop(1, "#39834b");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);

        drawCenteredText(
            "MINI GOLF ADVENTURE",
            W / 2,
            H * 0.31,
            `bold ${Math.min(42, W * 0.052)}px Arial`
        );

        drawCenteredText(
            "Loading the course...",
            W / 2,
            H * 0.42,
            "bold 22px Arial",
            "#d9f5d0"
        );

        const barWidth = Math.min(W * 0.62, 440);
        const barHeight = 18;
        const barX = (W - barWidth) / 2;
        const barY = H * 0.51;

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

        drawCenteredText(
            "Preparing your mini-golf adventure",
            W / 2,
            H * 0.62,
            "16px Arial"
        );
    }

    // PART 1: Animate the ball and bounce it off the boundaries.
    function updateDemo() {
        demo.x += demo.dx;
        demo.y += demo.dy;

        const minX = 24 + demo.radius;
        const maxX = W - 24 - demo.radius;
        const minY = 24 + demo.radius;
        const maxY = H - 24 - demo.radius;

        if (demo.x <= minX || demo.x >= maxX) {
            demo.dx *= -1;
            demo.x = clamp(demo.x, minX, maxX);
        }

        if (demo.y <= minY || demo.y >= maxY) {
            demo.dy *= -1;
            demo.y = clamp(demo.y, minY, maxY);
        }
    }

    function drawDemo() {
        const gradient = ctx.createLinearGradient(0, 0, W, H);
        gradient.addColorStop(0, "#39834b");
        gradient.addColorStop(1, "#174d2b");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = "#83c76c";
        ctx.fillRect(24, 24, W - 48, H - 48);

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 5;
        ctx.strokeRect(24, 24, W - 48, H - 48);

        const gradientBall = ctx.createRadialGradient(
            demo.x - 5,
            demo.y - 6,
            2,
            demo.x,
            demo.y,
            demo.radius * 1.5
        );

        gradientBall.addColorStop(0, "#ffffff");
        gradientBall.addColorStop(0.42, demo.color);
        gradientBall.addColorStop(1, "#424242");

        ctx.fillStyle = gradientBall;
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
            "PART 1 & 2: BOUNCING OBJECT",
            W / 2,
            52,
            "bold 25px Arial",
            "#12351c"
        );

        drawCenteredText(
            "Click the moving ball to change its color and direction",
            W / 2,
            84,
            "16px Arial",
            "#12351c"
        );

        drawCenteredText(
            "Mini golf starts in a moment...",
            W / 2,
            H - 36,
            "16px Arial",
            "#12351c"
        );
    }

 
    // PART 4 — Set up each mini-golf level.
    function createLevel(number) {
        level = number;
        rocks = [];
        powerUps = [];
        waterHazards = [];
        sandTraps = [];
        particles = [];
        moving = false;
        dragging = false;
        completed = false;
        boostNextShot = false;

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

        // Level 1: Water, sand, rocks, and power-ups.
        if (number === 1) {
            waterHazards.push({
                x: W * 0.47,
                y: H * 0.72,
                rx: 76,
                ry: 43
            });

            sandTraps.push({
                x: W * 0.68,
                y: H * 0.43,
                rx: 80,
                ry: 46
            });

            rocks.push(
                { x: W * 0.33, y: H * 0.49, radius: 22 },
                { x: W * 0.73, y: H * 0.68, radius: 19 }
            );

            powerUps.push(
                { x: W * 0.27, y: H * 0.69, type: "star", collected: false },
                { x: W * 0.55, y: H * 0.32, type: "coin", collected: false },
                { x: W * 0.78, y: H * 0.55, type: "boost", collected: false }
            );

        // Level 2: More obstacles and two water hazards.
        } else if (number === 2) {
            waterHazards.push(
                { x: W * 0.42, y: H * 0.70, rx: 80, ry: 45 },
                { x: W * 0.70, y: H * 0.31, rx: 54, ry: 35 }
            );

            sandTraps.push({
                x: W * 0.62,
                y: H * 0.46,
                rx: 82,
                ry: 47
            });

            rocks.push(
                { x: W * 0.30, y: H * 0.54, radius: 23 },
                { x: W * 0.56, y: H * 0.62, radius: 19 },
                { x: W * 0.79, y: H * 0.71, radius: 21 }
            );

            powerUps.push(
                { x: W * 0.24, y: H * 0.35, type: "coin", collected: false },
                { x: W * 0.51, y: H * 0.29, type: "star", collected: false },
                { x: W * 0.80, y: H * 0.48, type: "boost", collected: false }
            );

        // Level 3: The most challenging course.
        } else {
            waterHazards.push(
                { x: W * 0.41, y: H * 0.39, rx: 74, ry: 43 },
                { x: W * 0.66, y: H * 0.70, rx: 65, ry: 39 }
            );

            sandTraps.push(
                { x: W * 0.65, y: H * 0.43, rx: 82, ry: 47 },
                { x: W * 0.29, y: H * 0.66, rx: 59, ry: 36 }
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

        setStatus(
            `Level ${level}: Drag backward from the ball, then release to shoot.`
        );
    }

    // Draw water hazards and sand traps on the course.
    function drawWaterAndSand() {
        // Water hazards.
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
                "bold 13px Arial",
                "#ffffff"
            );
        }

        // Sand traps.
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
                "bold 13px Arial",
                "#76521b"
            );
        }
    }

 
    // Draw the golf course and its obstacles.
    function drawCourse() {
        const gradient = ctx.createLinearGradient(0, 0, W, H);
        gradient.addColorStop(0, "#9bd779");
        gradient.addColorStop(1, "#4b9b53");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);

        // Course border.
        ctx.strokeStyle = "#f7f4dc";
        ctx.lineWidth = 8;
        ctx.strokeRect(8, 8, W - 16, H - 16);

        // Decorative stripes on the grass.
        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.lineWidth = 2;

        for (let x = 35; x < W; x += 65) {
            ctx.beginPath();
            ctx.moveTo(x, 20);
            ctx.lineTo(x, H - 20);
            ctx.stroke();
        }

        // Draw water and sand.
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

            ctx.fillStyle = "#aeb6b9";
            ctx.beginPath();
            ctx.arc(
                rock.x - rock.radius * 0.3,
                rock.y - rock.radius * 0.3,
                rock.radius * 0.25,
                0,
                Math.PI * 2
            );
            ctx.fill();
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

        // Display the level and score.
        ctx.fillStyle = "rgba(16,35,24,0.85)";
        ctx.fillRect(18, 18, 245, 70);

        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 19px Arial";
        ctx.fillText(`Level ${level}`, 30, 40);

        ctx.font = "15px Arial";
        ctx.fillText(`Shots: ${shotCount}`, 30, 65);
        ctx.fillText(`Coins: ${coinsCollected}`, 130, 65);
    }

    // Draw the golf ball.
    function drawBall() {
        if (!ball) {
            return;
        }

        // Ball shadow.
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

        // Ball surface.
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

    // Draw the aiming line while the player is dragging.
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

        const aimX = ball.x - dx * scale;
        const aimY = ball.y - dy * scale;

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 6]);

        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(aimX, aimY);
        ctx.stroke();

        ctx.setLineDash([]);

        drawCenteredText(
            "Aim your shot!",
            ball.x,
            ball.y - 28,
            "bold 14px Arial",
            "#ffffff"
        );
    }

    // Check whether a point is inside an oval hazard.
    function pointInEllipse(x, y, ellipse) {
        const dx = (x - ellipse.x) / ellipse.rx;
        const dy = (y - ellipse.y) / ellipse.ry;

        return dx * dx + dy * dy <= 1;
    }

 
    // Update the ball's movement while it is rolling.
    function updateBall() {
        if (!ball || !moving || completed) {
            return;
        }

        const previousX = ball.x;
        const previousY = ball.y;

        // Move the ball.
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Bounce off the course boundaries.
        if (ball.x - ball.radius < 12 ||
            ball.x + ball.radius > W - 12) {
            ball.dx *= -0.75;
            ball.x = clamp(
                ball.x,
                12 + ball.radius,
                W - 12 - ball.radius
            );
        }

        if (ball.y - ball.radius < 12 ||
            ball.y + ball.radius > H - 12) {
            ball.dy *= -0.75;
            ball.y = clamp(
                ball.y,
                12 + ball.radius,
                H - 12 - ball.radius
            );
        }

        // Check collisions with rocks.
        for (const rock of rocks) {
            const dx = ball.x - rock.x;
            const dy = ball.y - rock.y;
            const distance = Math.hypot(dx, dy);
            const minimumDistance = ball.radius + rock.radius;

            if (distance < minimumDistance && distance > 0) {
                const nx = dx / distance;
                const ny = dy / distance;

                // Push the ball outside the rock.
                ball.x = rock.x + nx * minimumDistance;
                ball.y = rock.y + ny * minimumDistance;

                // Reverse the velocity away from the rock.
                const dotProduct = ball.dx * nx + ball.dy * ny;

                if (dotProduct < 0) {
                    ball.dx -= 1.75 * dotProduct * nx;
                    ball.dy -= 1.75 * dotProduct * ny;
                }
            }
        }

        // Water hazards send the ball back to its last safe spot.
        for (const water of waterHazards) {
            if (pointInEllipse(ball.x, ball.y, water)) {
                ball.x = lastSafePosition.x;
                ball.y = lastSafePosition.y;
                ball.dx = 0;
                ball.dy = 0;
                moving = false;

                setStatus(
                    "Splash! Your ball landed in water. Try that shot again."
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

        const friction = onSand ? 0.94 : GRASS_FRICTION;

        ball.dx *= friction;
        ball.dy *= friction;

        // Collect power-ups when the ball gets close.
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
                    setStatus("Coin collected! Nice shot!");
                } else if (item.type === "star") {
                    powerUpsCollected++;
                    ballColor = "#ffd166";
                    setStatus("Star collected! Your ball changed color!");
                } else if (item.type === "boost") {
                    boostNextShot = true;
                    powerUpsCollected++;
                    setStatus("Speed boost collected! Your next shot is stronger.");
                }
            }
        }

        // Remember the last safe position when the ball is on the grass.
        let safe = true;

        for (const water of waterHazards) {
            if (pointInEllipse(ball.x, ball.y, water)) {
                safe = false;
                break;
            }
        }

        if (safe) {
            lastSafePosition.x = ball.x;
            lastSafePosition.y = ball.y;
        }

        // Check whether the ball reaches the hole.
        const holeDistance = Math.hypot(
            ball.x - hole.x,
            ball.y - hole.y
        );

        if (holeDistance < hole.radius && Math.hypot(ball.dx, ball.dy) < 2.5) {
            ball.x = hole.x;
            ball.y = hole.y;
            ball.dx = 0;
            ball.dy = 0;
            moving = false;
            completed = true;

            setStatus(
                `Level ${level} complete! Shots taken: ${shotCount}.`
            );
            return;
        }

        // Stop the ball when it has nearly stopped rolling.
        if (Math.abs(ball.dx) < 0.08 &&
            Math.abs(ball.dy) < 0.08) {
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
            x: (event.clientX - rect.left) * W / rect.width,
            y: (event.clientY - rect.top) * H / rect.height
        };
    }

    // PART 2: Clicking the moving demo ball changes its color and direction.
    canvas.addEventListener("click", function (event) {
        if (phase !== "demo") {
            return;
        }

        const pointer = getPointerPosition(event);

        const distance = Math.hypot(
            pointer.x - demo.x,
            pointer.y - demo.y
        );

        if (distance <= demo.radius + 10) {
            demo.clicks++;

            const colorIndex = demo.clicks % COLORS.length;
            demo.color = COLORS[colorIndex];

            // Change the direction after a successful click.
            demo.dx *= -1;
            demo.dy *= -1;

            setStatus("Nice click! The ball changed color and direction.");
        }
    });

    // Start aiming when the player presses down near the golf ball.
    canvas.addEventListener("pointerdown", function (event) {
        if (phase !== "game" || moving || completed || !ball) {
            return;
        }

        const pointer = getPointerPosition(event);

        const distance = Math.hypot(
            pointer.x - ball.x,
            pointer.y - ball.y
        );

       
if (distance <= ball.radius + 18) {
    changeBallColor();

    dragging = true;
    pointerX = pointer.x;
    pointerY = pointer.y;


            canvas.setPointerCapture(event.pointerId);
            event.preventDefault();
        }
    });

    // Update the aiming line as the player drags.
    canvas.addEventListener("pointermove", function (event) {
        if (!dragging) {
            return;
        }

        const pointer = getPointerPosition(event);

        pointerX = pointer.x;
        pointerY = pointer.y;
    });

    // Release the pointer to shoot the ball.
    canvas.addEventListener("pointerup", function (event) {
        if (!dragging || !ball) {
            return;
        }

        const pointer = getPointerPosition(event);

        pointerX = pointer.x;
        pointerY = pointer.y;

        let dx = ball.x - pointerX;
        let dy = ball.y - pointerY;

        const distance = Math.hypot(dx, dy);
        const limitedDistance = Math.min(distance, MAX_DRAG);

        dragging = false;

        if (distance < 8) {
            return;
        }

        const scale = limitedDistance / distance;

        dx *= scale;
        dy *= scale;

        const power = boostNextShot ? 0.18 : 0.12;

        ball.dx = dx * power;
        ball.dy = dy * power;

        boostNextShot = false;
        moving = true;
        shotCount++;

        setStatus(`Shot ${shotCount}! Watch the ball roll.`);
    });

    // Prevent dragging from remaining active if the pointer is cancelled.
    canvas.addEventListener("pointercancel", function () {
        dragging = false;
    });

    // Restart the current level.
    if (restartButton) {
        restartButton.addEventListener("click", function () {
            createLevel(level);
        });
    }

    // Move to the next level after completing the current one.
    if (nextButton) {
        nextButton.addEventListener("click", function () {
            if (completed) {
                createLevel(level < 3 ? level + 1 : 1);
            } else {
                setStatus("Finish the level by getting the ball into the hole first.");
            }
        });
    }


 
    // Draw the collected power-ups on the course.
    function drawPowerUps() {
        for (const item of powerUps) {
            if (item.collected) {
                continue;
            }

            let color = "#ffd166";
            let symbol = "★";

            if (item.type === "coin") {
                color = "#ffcf33";
                symbol = "$";
            } else if (item.type === "boost") {
                color = "#66e3ff";
                symbol = "⚡";
            }

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(item.x, item.y, 13, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.stroke();

            drawCenteredText(
                symbol,
                item.x,
                item.y,
                "bold 17px Arial",
                "#17331f"
            );
        }
    }

    // Draw a message when a level is completed.
    function drawCompletionMessage() {
        if (!completed) {
            return;
        }

        ctx.fillStyle = "rgba(0,0,0,0.68)";
        ctx.fillRect(W * 0.18, H * 0.36, W * 0.64, H * 0.25);

        drawCenteredText(
            `LEVEL ${level} COMPLETE!`,
            W / 2,
            H * 0.43,
            "bold 30px Arial",
            "#ffd166"
        );

        drawCenteredText(
            "Click Next Level to continue",
            W / 2,
            H * 0.52,
            "18px Arial",
            "#ffffff"
        );
    }

    // Draw all the elements in the mini-golf game.
    function drawGame() {
        drawCourse();
        drawPowerUps();
        drawBall();
        drawAim();
        drawCompletionMessage();
    }

    // Start the mini-golf game after the loading screen and demo.
    function startGame() {
        phase = "game";
        createLevel(1);
        shotCount = 0;
        coinsCollected = 0;
        powerUpsCollected = 0;
        ballColor = COLORS[0];

        setStatus(
            "Welcome! Drag backward from the ball and release to shoot."
        );
    }

    // Main animation loop.
    function animate(now) {
        if (phase === "loading") {
            drawLoadingScreen(now);

            if (now - phaseStart >= LOADING_DURATION) {
                phase = "demo";
                phaseStart = now;
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

    // Prepare the buttons and begin the animation.
    if (restartButton) {
        restartButton.textContent = "Restart level";
    }

    if (nextButton) {
        nextButton.textContent = "Next level";
    }

    setStatus("Loading Mini Golf Adventure...");

    requestAnimationFrame(animate);

})();
