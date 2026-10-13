"use strict";

// ============================================
// Assignment 9 - Living Fantasy Aquarium
// COP4813 Web Systems
// ============================================

const canvas = document.getElementById("aquariumCanvas");
const ctx = canvas.getContext("2d");
const statusText = document.getElementById("aquariumStatus");
const foodButton = document.getElementById("foodButton");
const resetButton = document.getElementById("resetAquarium");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let animals = [];
let food = [];
let bubbles = [];
let seaweed = [];
let effects = [];
let animationFrame = 0;
let running = true;

// --------------------------------------------
// Create the animals
// --------------------------------------------

function createAnimals() {
    animals = [
        {
            type: "fish",
            name: "Neon Fish",
            x: 125, y: 145,
            dx: 1.7, dy: 0.8,
            w: 48, h: 27,
            color: "#ffad42",
            phase: 0
        },
        {
            type: "fish",
            name: "Blue Fish",
            x: 250, y: 255,
            dx: -1.4, dy: 0.9,
            w: 43, h: 24,
            color: "#55e6ff",
            phase: 1
        },
        {
            type: "jellyfish",
            name: "Jellyfish",
            x: 410, y: 110,
            dx: 0.8, dy: 0.65,
            w: 34, h: 44,
            color: "#db8cff",
            phase: 2
        },
        {
            type: "turtle",
            name: "Sea Turtle",
            x: 590, y: 335,
            dx: 0.5, dy: -0.2,
            w: 62, h: 43,
            color: "#66d69a",
            phase: 0
        },
        {
            type: "ray",
            name: "Manta Ray",
            x: 365, y: 395,
            dx: -1.15, dy: -0.55,
            w: 74, h: 43,
            color: "#8e9fff",
            phase: 1
        },
        {
            type: "seahorse",
            name: "Seahorse",
            x: 730, y: 205,
            dx: -0.55, dy: 0.8,
            w: 39, h: 55,
            color: "#ffbd65",
            phase: 2
        },
        {
            type: "shark",
            name: "Fantasy Shark",
            x: 690, y: 115,
            dx: -1.5, dy: 0.55,
            w: 86, h: 47,
            color: "#9ab6d4",
            phase: 0
        }
    ];
}

// --------------------------------------------
// Create decorative background elements
// --------------------------------------------

function createBackground() {
    bubbles = [];
    seaweed = [];

    for (let i = 0; i < 35; i++) {
        bubbles.push({
            x: Math.random() * WIDTH,
            y: Math.random() * HEIGHT,
            radius: 2 + Math.random() * 5,
            speed: 0.35 + Math.random() * 0.9,
            drift: Math.random() * 0.8 - 0.4
        });
    }

    for (let i = 0; i < 15; i++) {
        seaweed.push({
            x: i * 65 + 10,
            height: 35 + Math.random() * 55,
            phase: Math.random() * Math.PI * 2
        });
    }
}

// --------------------------------------------
// Draw the aquarium background
// --------------------------------------------

function drawBackground() {
    const water = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    water.addColorStop(0, "#082c63");
    water.addColorStop(0.55, "#075078");
    water.addColorStop(1, "#062a4b");

    ctx.fillStyle = water;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Sunlight beams
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = "#7af3ff";

    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(75 + i * 190, 0);
        ctx.lineTo(125 + i * 190, 0);
        ctx.lineTo(245 + i * 190, HEIGHT);
        ctx.lineTo(145 + i * 190, HEIGHT);
        ctx.closePath();
        ctx.fill();
    }

    ctx.restore();

    // Distant glowing plants
    for (const plant of seaweed) {
        ctx.save();
        ctx.strokeStyle = "#22c997";
        ctx.lineWidth = 5;
        ctx.lineCap = "round";

        const sway = Math.sin(animationFrame * 0.025 + plant.phase) * 9;

        ctx.beginPath();
        ctx.moveTo(plant.x, HEIGHT - 14);
        ctx.quadraticCurveTo(
            plant.x + sway,
            HEIGHT - plant.height / 2,
            plant.x + sway * 0.5,
            HEIGHT - plant.height
        );
        ctx.stroke();

        ctx.restore();
    }

    // Sandy ocean floor
    ctx.fillStyle = "#c4b779";
    ctx.fillRect(0, HEIGHT - 15, WIDTH, 15);

    ctx.fillStyle = "#e4d39a";

    for (let i = 0; i < WIDTH; i += 24) {
        ctx.beginPath();
        ctx.arc(i, HEIGHT - 13, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Aquarium boundary
    ctx.strokeStyle = "rgba(147, 230, 255, 0.65)";
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, WIDTH - 4, HEIGHT - 4);
}

// --------------------------------------------
// Animate background bubbles
// --------------------------------------------

function drawBubbles() {
    for (const bubble of bubbles) {
        bubble.y -= bubble.speed;
        bubble.x += bubble.drift;

        if (bubble.y < 8) {
            bubble.y = HEIGHT - 20;
            bubble.x = Math.random() * WIDTH;
        }

        if (bubble.x < 5) bubble.x = WIDTH - 5;
        if (bubble.x > WIDTH - 5) bubble.x = 5;

        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(180, 244, 255, 0.65)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(
            bubble.x - bubble.radius * 0.3,
            bubble.y - bubble.radius * 0.3,
            Math.max(1, bubble.radius * 0.22),
            0,
            Math.PI * 2
        );
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fill();
    }
}

// --------------------------------------------
// Draw a glowing eye
// --------------------------------------------

function drawEye(x, y, size = 3) {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y, size + 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#10213c";
    ctx.beginPath();
    ctx.arc(x + 1, y, size * 0.65, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x + 1, y - 1, size * 0.25, 0, Math.PI * 2);
    ctx.fill();
}

// --------------------------------------------
// Draw a fantasy fish
// --------------------------------------------

function drawFish(a) {
    const tail = Math.sin(animationFrame * 0.16 + a.phase) * 5;

    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.scale(a.dx < 0 ? -1 : 1, 1);

    // Tail
    ctx.fillStyle = a.color;
    ctx.beginPath();
    ctx.moveTo(-a.w * 0.30, 0);
    ctx.lineTo(-a.w * 0.55, -a.h * 0.48 + tail);
    ctx.lineTo(-a.w * 0.52, a.h * 0.48 + tail);
    ctx.closePath();
    ctx.fill();

    // Top fin
    ctx.fillStyle = "#e5fbff";
    ctx.globalAlpha = 0.65;
    ctx.beginPath();
    ctx.moveTo(-a.w * 0.1, -a.h * 0.35);
    ctx.lineTo(a.w * 0.12, -a.h * 0.8);
    ctx.lineTo(a.w * 0.28, -a.h * 0.25);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    // Body
    ctx.fillStyle = a.color;
    ctx.shadowColor = a.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(0, 0, a.w * 0.40, a.h * 0.48, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Side fin
    ctx.fillStyle = "#ffffff";
    ctx.globalAlpha = 0.65;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(a.w * 0.12, a.h * 0.42);
    ctx.lineTo(a.w * 0.30, a.h * 0.10);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    // Stripes
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.lineWidth = 2;

    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 7, -a.h * 0.30);
        ctx.lineTo(i * 7, a.h * 0.30);
        ctx.stroke();
    }

    drawEye(a.w * 0.24, -a.h * 0.08, 2.5);

    ctx.restore();
}

// --------------------------------------------
// Draw a jellyfish
// --------------------------------------------

function drawJellyfish(a) {
    const pulse = 1 + Math.sin(animationFrame * 0.07 + a.phase) * 0.08;
    const tentacleWave = Math.sin(animationFrame * 0.10 + a.phase) * 5;

    ctx.save();
    ctx.translate(a.x, a.y);

    // Tentacles
    ctx.lineWidth = 3;
    const jellyColors = ["#ffb4f1", "#9af7ff", "#f5b4ff", "#ffffff"];

    for (let i = 0; i < 5; i++) {
        const tx = (i - 2) * 9;

        ctx.strokeStyle = jellyColors[i % jellyColors.length];
        ctx.beginPath();
        ctx.moveTo(tx, 7);
        ctx.bezierCurveTo(
            tx + tentacleWave, 18,
            tx - tentacleWave, 29,
            tx + tentacleWave * 0.5, 39
        );
        ctx.stroke();
    }

    // Bell
    ctx.shadowColor = a.color;
    ctx.shadowBlur = 18;
    ctx.fillStyle = a.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, a.w * 0.55 * pulse, a.h * 0.40 * pulse, 0, Math.PI, 0);
    ctx.lineTo(a.w * 0.55 * pulse, 0);
    ctx.quadraticCurveTo(0, 12, -a.w * 0.55 * pulse, 0);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Glowing spots
    ctx.fillStyle = "#fff4ff";

    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.arc(i * 9, -7, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

// --------------------------------------------
// Draw a sea turtle
// --------------------------------------------

function drawTurtle(a) {
    const flipper = Math.sin(animationFrame * 0.12 + a.phase) * 7;

    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.scale(a.dx < 0 ? -1 : 1, 1);

    // Tail
    ctx.fillStyle = "#66d69a";
    ctx.beginPath();
    ctx.moveTo(-a.w * 0.45, 2);
    ctx.lineTo(-a.w * 0.62, 8);
    ctx.lineTo(-a.w * 0.43, 10);
    ctx.fill();

    // Flippers
    ctx.fillStyle = "#52bd88";

    ctx.save();
    ctx.rotate(-0.4 + flipper * 0.025);
    ctx.beginPath();
    ctx.ellipse(-12, -a.h * 0.50, 10, 17, -0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.rotate(0.35 - flipper * 0.025);
    ctx.beginPath();
    ctx.ellipse(-8, a.h * 0.43, 10, 16, 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Shell
    ctx.fillStyle = "#247d58";
    ctx.beginPath();
    ctx.ellipse(-2, 0, a.w * 0.38, a.h * 0.43, 0, Math.PI, 0);
    ctx.lineTo(a.w * 0.36, 2);
    ctx.quadraticCurveTo(0, a.h * 0.60, -a.w * 0.38, 2);
    ctx.fill();

    // Shell pattern
    ctx.strokeStyle = "#9be6a0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(15, 0);
    ctx.moveTo(-12, -10);
    ctx.lineTo(-4, 10);
    ctx.moveTo(7, -10);
    ctx.lineTo(14, 9);
    ctx.stroke();

    // Head
    ctx.fillStyle = "#75e0a4";
    ctx.beginPath();
    ctx.ellipse(a.w * 0.40, -3, 13, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    drawEye(a.w * 0.45, -6, 2.2);

    ctx.restore();
}

// --------------------------------------------
// Draw a manta ray
// --------------------------------------------

function drawRay(a) {
    const flap = Math.sin(animationFrame * 0.11 + a.phase) * 9;

    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.scale(a.dx < 0 ? -1 : 1, 1);

    // Wide wings
    ctx.fillStyle = a.color;
    ctx.shadowColor = "#879bff";
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.moveTo(-a.w * 0.48, 0);
    ctx.quadraticCurveTo(-a.w * 0.32, -a.h * 0.65 - flap, 0, -a.h * 0.20);
    ctx.quadraticCurveTo(a.w * 0.25, -a.h * 0.52 - flap, a.w * 0.48, -a.h * 0.20);
    ctx.quadraticCurveTo(a.w * 0.35, 0, a.w * 0.22, a.h * 0.30);
    ctx.quadraticCurveTo(0, a.h * 0.65, -a.w * 0.20, a.h * 0.30);
    ctx.quadraticCurveTo(-a.w * 0.37, a.h * 0.15, -a.w * 0.48, 0);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Long tail
    ctx.strokeStyle = "#b5c4ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-a.w * 0.38, 4);
    ctx.quadraticCurveTo(-a.w * 0.50, 18, -a.w * 0.58, 28);
    ctx.stroke();

    // Eyes
    drawEye(-9, -4, 2);
    drawEye(9, -4, 2);

    // Smile
    ctx.strokeStyle = "#263a7a";
    ctx.beginPath();
    ctx.arc(0, 1, 7, 0.15, Math.PI - 0.15);
    ctx.stroke();

    ctx.restore();
}

// --------------------------------------------
// Draw a seahorse
// --------------------------------------------

function drawSeahorse(a) {
    const sway = Math.sin(animationFrame * 0.09 + a.phase) * 4;

    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.scale(a.dx < 0 ? -1 : 1, 1);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Curled tail
    ctx.strokeStyle = "#dc8b45";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(-2, 12);
    ctx.bezierCurveTo(-14, 21, -16, 32, -7, 32);
    ctx.bezierCurveTo(1, 32, 0, 24, -6, 26);
    ctx.stroke();

    // Body
    ctx.strokeStyle = a.color;
    ctx.lineWidth = 13;
    ctx.beginPath();
    ctx.moveTo(0, 17);
    ctx.quadraticCurveTo(-7, 4 + sway, 0, -5);
    ctx.quadraticCurveTo(5, -14, 8, -21);
    ctx.stroke();

    // Snout
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(7, -21);
    ctx.lineTo(18, -22);
    ctx.stroke();

    // Crown
    ctx.fillStyle = "#ffdc8b";
    ctx.beginPath();
    ctx.moveTo(0, -25);
    ctx.lineTo(-7, -34);
    ctx.lineTo(0, -31);
    ctx.lineTo(5, -37);
    ctx.lineTo(7, -25);
    ctx.closePath();
    ctx.fill();

    // Dorsal fin
    ctx.fillStyle = "#ffe0a2";
    ctx.beginPath();
    ctx.moveTo(-5, -1);
    ctx.lineTo(-17, -9 + sway);
    ctx.lineTo(-10, 8);
    ctx.closePath();
    ctx.fill();

    drawEye(8, -25, 2);

    ctx.restore();
}

// --------------------------------------------
// Draw a fantasy shark
// --------------------------------------------

function drawShark(a) {
    const tail = Math.sin(animationFrame * 0.16 + a.phase) * 7;

    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.scale(a.dx < 0 ? -1 : 1, 1);

    // Tail fin
    ctx.fillStyle = "#7299bd";
    ctx.beginPath();
    ctx.moveTo(-a.w * 0.34, 0);
    ctx.lineTo(-a.w * 0.53, -a.h * 0.50 + tail);
    ctx.lineTo(-a.w * 0.48, 0);
    ctx.lineTo(-a.w * 0.53, a.h * 0.48 + tail);
    ctx.closePath();
    ctx.fill();

    // Dorsal fin
    ctx.beginPath();
    ctx.moveTo(-a.w * 0.10, -a.h * 0.20);
    ctx.lineTo(a.w * 0.02, -a.h * 0.65);
    ctx.lineTo(a.w * 0.23, -a.h * 0.20);
    ctx.closePath();
    ctx.fill();

    // Lower fin
    ctx.beginPath();
    ctx.moveTo(-a.w * 0.10, a.h * 0.18);
    ctx.lineTo(a.w * 0.08, a.h * 0.48);
    ctx.lineTo(a.w * 0.18, a.h * 0.12);
    ctx.closePath();
    ctx.fill();

    // Body
    ctx.fillStyle = a.color;
    ctx.shadowColor = "#8cb8e2";
    ctx.shadowBlur = 9;

    ctx.beginPath();
    ctx.moveTo(-a.w * 0.37, 0);
    ctx.quadraticCurveTo(-a.w * 0.24, -a.h * 0.50, a.w * 0.20, -a.h * 0.28);
    ctx.lineTo(a.w * 0.48, -a.h * 0.02);
    ctx.lineTo(a.w * 0.28, a.h * 0.12);
    ctx.quadraticCurveTo(-a.w * 0.05, a.h * 0.45, -a.w * 0.37, 0);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Pale underside
    ctx.fillStyle = "#e3f4ff";
    ctx.beginPath();
    ctx.moveTo(-a.w * 0.20, a.h * 0.12);
    ctx.quadraticCurveTo(a.w * 0.05, a.h * 0.32, a.w * 0.30, a.h * 0.08);
    ctx.lineTo(a.w * 0.20, a.h * 0.22);
    ctx.quadraticCurveTo(-a.w * 0.05, a.h * 0.40, -a.w * 0.20, a.h * 0.12);
    ctx.fill();

    // Gill marks
    ctx.strokeStyle = "#547c9f";
    ctx.lineWidth = 2;

    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(a.w * 0.02 + i * 5, -3);
        ctx.lineTo(a.w * 0.01 + i * 5, 8);
        ctx.stroke();
    }

    drawEye(a.w * 0.31, -a.h * 0.13, 3);

    // Teeth
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(a.w * 0.35, 2);
    ctx.lineTo(a.w * 0.39, 7);
    ctx.lineTo(a.w * 0.42, 2);
    ctx.fill();

    ctx.restore();
}

// --------------------------------------------
// Draw an animal and its selection highlight
// --------------------------------------------

function drawAnimal(a) {
    ctx.save();

    if (a.reaction > 0) {
        ctx.shadowColor = "#fff477";
        ctx.shadowBlur = 20;
    }

    switch (a.type) {
        case "fish":
            drawFish(a);
            break;
        case "jellyfish":
            drawJellyfish(a);
            break;
        case "turtle":
            drawTurtle(a);
            break;
        case "ray":
            drawRay(a);
            break;
        case "seahorse":
            drawSeahorse(a);
            break;
        case "shark":
            drawShark(a);
            break;
    }

    ctx.restore();

    // Visible rings after clicking an animal
    if (a.reaction > 0) {
        ctx.save();
        ctx.strokeStyle = "#fff477";
        ctx.lineWidth = 3;
        ctx.globalAlpha = Math.min(1, a.reaction / 15);

        ctx.beginPath();
        ctx.arc(a.x, a.y, 20 + (35 - a.reaction) * 1.5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
        a.reaction--;
    }

    // Draw animal labels
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillText(a.name, a.x, a.y + a.h * 0.8 + 13);
}

// --------------------------------------------
// Release food into the aquarium
// --------------------------------------------

function releaseFood(x = 100 + Math.random() * (WIDTH - 200), y = 80) {
    food.push({
        x: x,
        y: y,
        radius: 5,
        age: 0,
        maxAge: 900
    });

    statusText.textContent = "Food released! Watch the fish chase it.";
}

// --------------------------------------------
// Draw food particles
// --------------------------------------------

function drawFood() {
    for (const pellet of food) {
        ctx.save();
        ctx.shadowColor = "#ffe66d";
        ctx.shadowBlur = 14;
        ctx.fillStyle = "#ffe66d";

        ctx.beginPath();
        ctx.arc(pellet.x, pellet.y, pellet.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

// --------------------------------------------
// Update food: fish chase nearby pellets
// --------------------------------------------

function updateFood() {
    for (let i = food.length - 1; i >= 0; i--) {
        const pellet = food[i];
        pellet.age++;

        let closestFish = null;
        let closestDistance = Infinity;

        for (const a of animals) {
            if (a.type !== "fish") continue;

            const distance = Math.hypot(a.x - pellet.x, a.y - pellet.y);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestFish = a;
            }
        }

        if (closestFish && closestDistance < 230) {
            const angle = Math.atan2(
                pellet.y - closestFish.y,
                pellet.x - closestFish.x
            );

            closestFish.dx += Math.cos(angle) * 0.035;
            closestFish.dy += Math.sin(angle) * 0.035;

            // Keep the fish from becoming too fast
            closestFish.dx = Math.max(-3, Math.min(3, closestFish.dx));
            closestFish.dy = Math.max(-2.5, Math.min(2.5, closestFish.dy));

            // Food is eaten when a fish reaches it
            if (closestDistance < 22) {
                food.splice(i, 1);
                statusText.textContent =
                    closestFish.name + " found and ate the food!";
                continue;
            }
        }

        // Food slowly sinks
        pellet.y += 0.35;
        pellet.x += Math.sin(animationFrame * 0.04 + i) * 0.25;

        // Remove old food
        if (pellet.age > pellet.maxAge || pellet.y > HEIGHT - 20) {
            food.splice(i, 1);
        }
    }
}

// --------------------------------------------
// Move animals and bounce off aquarium walls
// --------------------------------------------

function moveAnimals() {
    for (const a of animals) {
        // Natural swimming movement
        a.x += a.dx;
        a.y += a.dy;

        a.x += Math.sin(animationFrame * 0.025 + a.phase) * 0.15;
        a.y += Math.cos(animationFrame * 0.035 + a.phase) * 0.12;

        // Bounding margins account for each animal's size
        const marginX = a.w * 0.58 + 4;
        const marginY = a.h * 0.65 + 5;

        // Bounce horizontally
        if (a.x >= WIDTH - marginX) {
            a.x = WIDTH - marginX;
            a.dx = -Math.abs(a.dx);
        } else if (a.x <= marginX) {
            a.x = marginX;
            a.dx = Math.abs(a.dx);
        }

        // Bounce vertically
        if (a.y >= HEIGHT - 25 - marginY) {
            a.y = HEIGHT - 25 - marginY;
            a.dy = -Math.abs(a.dy);
        } else if (a.y <= marginY + 5) {
            a.y = marginY + 5;
            a.dy = Math.abs(a.dy);
        }

        // Avoid motion becoming completely stationary
        if (Math.abs(a.dx) < 0.3) {
            a.dx = a.dx < 0 ? -0.5 : 0.5;
        }

        if (Math.abs(a.dy) < 0.2) {
            a.dy = a.dy < 0 ? -0.35 : 0.35;
        }
    }
}

// --------------------------------------------
// Click detection for animals
// --------------------------------------------

function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();

    // Convert screen coordinates to canvas coordinates
    const mouseX = (event.clientX - rect.left) * WIDTH / rect.width;
    const mouseY = (event.clientY - rect.top) * HEIGHT / rect.height;

    // Check animals from front to back
    for (let i = animals.length - 1; i >= 0; i--) {
        const a = animals[i];

        const hitRadius = Math.max(a.w, a.h) * 0.65;
        const distance = Math.hypot(mouseX - a.x, mouseY - a.y);

        if (distance <= hitRadius) {
            a.reaction = 30;

            // Make the creature swim away briefly
            a.dx *= -1.35;
            a.dy = a.dy < 0 ? -1.1 : 1.1;

            // Keep movement controlled
            a.dx = Math.max(-3, Math.min(3, a.dx));

            // Add a glowing reaction burst
            effects.push({
                x: a.x,
                y: a.y,
                radius: 8,
                alpha: 1
            });

            statusText.textContent =
                "You clicked the " + a.name + "! It reacts and swims away!";

            return;
        }
    }

    // If no animal was clicked, release food at the mouse position
    releaseFood(mouseX, mouseY);
}

// --------------------------------------------
// Draw click reaction effects
// --------------------------------------------

function drawEffects() {
    for (let i = effects.length - 1; i >= 0; i--) {
        const effect = effects[i];

        ctx.save();
        ctx.strokeStyle = "#fff477";
        ctx.globalAlpha = effect.alpha;
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();

        effect.radius += 1.8;
        effect.alpha -= 0.035;

        if (effect.alpha <= 0) {
            effects.splice(i, 1);
        }
    }
}

// --------------------------------------------
// Main animation loop
// --------------------------------------------

function animate() {
    if (!running) return;

    animationFrame++;

    drawBackground();
    drawBubbles();

    moveAnimals();
    updateFood();

    // Draw creatures
    for (const a of animals) {
        drawAnimal(a);
    }

    drawFood();
    drawEffects();

    requestAnimationFrame(animate);
}

// --------------------------------------------
// Reset the aquarium
// --------------------------------------------

function resetAquarium() {
    food = [];
    effects = [];
    animationFrame = 0;

    createAnimals();
    createBackground();

    statusText.textContent =
        "Aquarium reset! All six kinds of sea creatures are swimming.";

    // The existing animation loop continues running
}

// --------------------------------------------
// Set up mouse interactions and controls
// --------------------------------------------

canvas.addEventListener("click", handleCanvasClick);

foodButton.addEventListener("click", function () {
    releaseFood();
});

resetButton.addEventListener("click", resetAquarium);

// --------------------------------------------
// Start the aquarium
// --------------------------------------------

createAnimals();
createBackground();
animate();
