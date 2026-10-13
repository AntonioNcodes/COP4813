
"use strict";

// ============================================
// Assignment 9 - Living Bioluminescent Aquarium
// ============================================

const canvas = document.getElementById("aquariumCanvas");
const ctx = canvas.getContext("2d");

const statusText = document.getElementById("aquariumStatus");
const foodButton = document.getElementById("foodButton");
const pauseButton = document.getElementById("pauseButton");
const resetButton = document.getElementById("resetButton");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let animals = [];
let food = [];
let bubbles = [];
let particles = [];
let ripples = [];

let paused = false;
let animationId = null;
let previousTime = 0;
let elapsedTime = 0;

// --------------------------------------------
// Create the animals
// --------------------------------------------

function createAnimals() {
    animals = [
        {
            type: "fish",
            name: "Tropical Fish",
            x: 130, y: 145,
            size: 24,
            dx: 1.5, dy: 0.6,
            color: "#35e7ff",
            glow: "#00d9ff",
            phase: 0,
            reaction: 0
        },
        {
            type: "fish",
            name: "Tropical Fish",
            x: 250, y: 340,
            size: 20,
            dx: -1.2, dy: 0.8,
            color: "#ff70db",
            glow: "#ff32ca",
            phase: 2,
            reaction: 0
        },
        {
            type: "fish",
            name: "Tropical Fish",
            x: 450, y: 220,
            size: 22,
            dx: 1.0, dy: -0.8,
            color: "#ffe66d",
            glow: "#ffbe0b",
            phase: 4,
            reaction: 0
        },
        {
            type: "jellyfish",
            name: "Jellyfish",
            x: 330, y: 105,
            size: 29,
            dx: 0.45, dy: 0.65,
            color: "#bc8cff",
            glow: "#c084fc",
            phase: 1,
            reaction: 0
        },
        {
            type: "jellyfish",
            name: "Jellyfish",
            x: 710, y: 175,
            size: 24,
            dx: -0.4, dy: 0.5,
            color: "#ff85d5",
            glow: "#f472b6",
            phase: 3,
            reaction: 0
        },
        {
            type: "turtle",
            name: "Sea Turtle",
            x: 620, y: 335,
            size: 31,
            dx: -0.8, dy: 0.35,
            color: "#64f5a4",
            glow: "#34d399",
            phase: 0,
            reaction: 0
        },
        {
            type: "ray",
            name: "Manta Ray",
            x: 480, y: 410,
            size: 35,
            dx: 1.0, dy: -0.4,
            color: "#68dfff",
            glow: "#38bdf8",
            phase: 2,
            reaction: 0
        },
        {
            type: "seahorse",
            name: "Seahorse",
            x: 790, y: 300,
            size: 25,
            dx: -0.45, dy: -0.55,
            color: "#ffcf70",
            glow: "#fbbf24",
            phase: 0,
            reaction: 0
        },
        {
            type: "shark",
            name: "Shark",
            x: 150, y: 410,
            size: 32,
            dx: 1.15, dy: -0.35,
            color: "#91b9d8",
            glow: "#7dd3fc",
            phase: 1,
            reaction: 0
        }
    ];
}

// --------------------------------------------
// Create background bubbles
// --------------------------------------------

function createBubbles() {
    bubbles = [];

    for (let i = 0; i < 45; i++) {
        bubbles.push({
            x: Math.random() * WIDTH,
            y: Math.random() * HEIGHT,
            radius: 1 + Math.random() * 3,
            speed: 0.3 + Math.random() * 0.8,
            drift: Math.random() * 2
        });
    }
}

// --------------------------------------------
// Draw the underwater background
// --------------------------------------------

function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);

    gradient.addColorStop(0, "#071a3b");
    gradient.addColorStop(0.55, "#07385a");
    gradient.addColorStop(1, "#04172e");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Soft underwater light rays
    ctx.save();

    for (let i = 0; i < 6; i++) {
        const x = i * 180 - 40;
        const sway = Math.sin(elapsedTime * 0.3 + i) * 15;

        ctx.fillStyle = "rgba(58, 213, 255, 0.035)";
        ctx.beginPath();
        ctx.moveTo(x + sway, 0);
        ctx.lineTo(x + 65 + sway, 0);
        ctx.lineTo(x + 180, HEIGHT);
        ctx.lineTo(x - 30, HEIGHT);
        ctx.closePath();
        ctx.fill();
    }

    ctx.restore();

    // Faint glowing seabed
    const floor = ctx.createLinearGradient(
        0, HEIGHT - 55, 0, HEIGHT
    );

    floor.addColorStop(0, "rgba(11, 95, 120, 0)");
    floor.addColorStop(1, "rgba(20, 145, 135, 0.32)");

    ctx.fillStyle = floor;
    ctx.fillRect(0, HEIGHT - 55, WIDTH, 55);

    // Sand ripples
    ctx.strokeStyle = "rgba(91, 235, 216, 0.13)";
    ctx.lineWidth = 1;

    for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        ctx.ellipse(
            i * 120 + 25,
            HEIGHT - 9,
            35 + (i % 3) * 10,
            5,
            0,
            0,
            Math.PI * 2
        );
        ctx.stroke();
    }

    drawSeaweed();
}

// --------------------------------------------
// Draw seaweed along the bottom
// --------------------------------------------

function drawSeaweed() {
    const positions = [30, 80, 165, 730, 810, 870];

    positions.forEach((x, index) => {
        ctx.save();
        ctx.translate(x, HEIGHT);

        const sway = Math.sin(elapsedTime * 1.2 + index) * 8;

        ctx.strokeStyle = index % 2 === 0
            ? "rgba(43, 226, 173, 0.65)"
            : "rgba(47, 177, 191, 0.65)";

        ctx.lineWidth = 5;
        ctx.lineCap = "round";

        for (let j = 0; j < 3; j++) {
            ctx.beginPath();
            ctx.moveTo(j * 9 - 8, 0);
            ctx.quadraticCurveTo(
                j * 10 + sway,
                -25,
                j * 6 + sway * 0.6,
                -55 - j * 10
            );
            ctx.stroke();
        }

        ctx.restore();
    });
}

// --------------------------------------------
// Draw and animate bubbles
// --------------------------------------------

function drawBubbles(delta) {
    bubbles.forEach(bubble => {
        bubble.y -= bubble.speed * delta;
        bubble.x += Math.sin(
            elapsedTime + bubble.drift
        ) * 0.12 * delta;

        if (bubble.y < -10) {
            bubble.y = HEIGHT + 5;
            bubble.x = Math.random() * WIDTH;
        }

        ctx.beginPath();
        ctx.arc(
            bubble.x,
            bubble.y,
            bubble.radius,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle = "rgba(143, 235, 255, 0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(
            bubble.x - bubble.radius * 0.3,
            bubble.y - bubble.radius * 0.3,
            Math.max(0.5, bubble.radius * 0.2),
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
        ctx.fill();
    });
}

// --------------------------------------------
// Draw a glowing tropical fish
// --------------------------------------------

function drawFish() {
    // Tail
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(-23, 0);
    ctx.lineTo(-36, -11 + Math.sin(elapsedTime * 7 + this.phase) * 4);
    ctx.lineTo(-34, 11 + Math.sin(elapsedTime * 7 + this.phase) * 4);
    ctx.closePath();
    ctx.fill();

    // Body
    ctx.shadowBlur = 18;
    ctx.shadowColor = this.glow;
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.ellipse(0, 0, 25, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Dorsal fin
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.beginPath();
    ctx.moveTo(-7, -11);
    ctx.lineTo(3, -22);
    ctx.lineTo(12, -10);
    ctx.closePath();
    ctx.fill();

    // Stripe
    ctx.strokeStyle = "rgba(255,255,255,0.65)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(5, -12);
    ctx.lineTo(8, 12);
    ctx.stroke();

    // Eye
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(15, -3, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#071426";
    ctx.beginPath();
    ctx.arc(16, -3, 2, 0, Math.PI * 2);
    ctx.fill();

    // Mouth
    ctx.strokeStyle = "#123047";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(23, 4);
    ctx.lineTo(27, 5);
    ctx.stroke();
}

// --------------------------------------------
// Draw a jellyfish
// --------------------------------------------

function drawJellyfish() {
    const pulse = Math.sin(elapsedTime * 2.8 + this.phase) * 0.12;
    const bellWidth = 23 + pulse * 10;
    const bellHeight = 19 - pulse * 5;

    ctx.shadowColor = this.glow;
    ctx.shadowBlur = 22;

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(-bellWidth, 1);
    ctx.bezierCurveTo(
        -bellWidth - 2, -bellHeight,
        bellWidth + 2, -bellHeight,
        bellWidth, 1
    );
    ctx.quadraticCurveTo(0, 11, -bellWidth, 1);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Glowing spots on the bell
    ctx.fillStyle = "rgba(255,255,255,0.8)";

    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.arc(i * 10, -10, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Tentacles sway as the jellyfish moves
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    for (let i = -2; i <= 2; i++) {
        const x = i * 8;
        const sway = Math.sin(
            elapsedTime * 3 + this.phase + i
        ) * 7;

        ctx.beginPath();
        ctx.moveTo(x, 2);
        ctx.bezierCurveTo(
            x + sway, 14,
            x - sway, 25,
            x + sway, 36
        );
        ctx.stroke();
    }
}

// --------------------------------------------
// Draw a sea turtle
// --------------------------------------------

function drawTurtle() {
    const flap = Math.sin(elapsedTime * 5 + this.phase) * 7;

    ctx.shadowColor = this.glow;
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#389c70";

    // Flippers
    ctx.save();
    ctx.translate(-12, -10);
    ctx.rotate(-0.5 + flap * 0.02);
    ctx.beginPath();
    ctx.ellipse(-5, -7, 9, 17, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(-12, 10);
    ctx.rotate(0.5 - flap * 0.02);
    ctx.beginPath();
    ctx.ellipse(-5, 7, 9, 17, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(12, -11);
    ctx.rotate(0.5 + flap * 0.02);
    ctx.beginPath();
    ctx.ellipse(6, -6, 9, 16, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(12, 11);
    ctx.rotate(-0.5 - flap * 0.02);
    ctx.beginPath();
    ctx.ellipse(6, 6, 9, 16, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Shell
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, 24, 19, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.strokeStyle = "#c2ffb0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 17, 13, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Shell pattern
    ctx.beginPath();
    ctx.moveTo(-12, -8);
    ctx.lineTo(0, 0);
    ctx.lineTo(12, -8);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 13);
    ctx.moveTo(-17, 4);
    ctx.lineTo(17, 4);
    ctx.stroke();

    // Head
    ctx.fillStyle = "#69e6a0";
    ctx.beginPath();
    ctx.ellipse(28, 0, 10, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#102b35";
    ctx.beginPath();
    ctx.arc(30, -3, 2, 0, Math.PI * 2);
    ctx.fill();
}

// --------------------------------------------
// Draw a manta ray
// --------------------------------------------

function drawRay() {
    const wing = Math.sin(elapsedTime * 3 + this.phase) * 9;

    ctx.shadowColor = this.glow;
    ctx.shadowBlur = 18;
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.moveTo(-27, -7);
    ctx.quadraticCurveTo(-42, -20 - wing, -46, -27 - wing);
    ctx.quadraticCurveTo(-36, 0, -28, 12);
    ctx.quadraticCurveTo(-8, 25, 0, 15);
    ctx.quadraticCurveTo(8, 25, 28, 12);
    ctx.quadraticCurveTo(36, 0, 46, -27 - wing);
    ctx.quadraticCurveTo(42, -20 - wing, 27, -7);
    ctx.quadraticCurveTo(10, -20, 0, -12);
    ctx.quadraticCurveTo(-10, -20, -27, -7);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Long tail
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 13);
    ctx.quadraticCurveTo(4, 25, 1, 38);
    ctx.stroke();

    // Eyes
    ctx.fillStyle = "#061b32";
    ctx.beginPath();
    ctx.arc(-13, -5, 2.5, 0, Math.PI * 2);
    ctx.arc(13, -5, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Underside
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-8, 8);
    ctx.quadraticCurveTo(0, 15, 8, 8);
    ctx.stroke();
}

// --------------------------------------------
// Draw a seahorse
// --------------------------------------------

function drawSeahorse() {
    const bob = Math.sin(elapsedTime * 3 + this.phase) * 3;

    ctx.save();
    ctx.translate(0, bob);

    ctx.shadowColor = this.glow;
    ctx.shadowBlur = 16;
    ctx.fillStyle = this.color;

    // Curled tail
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.strokeStyle = this.color;

    ctx.beginPath();
    ctx.moveTo(-3, 9);
    ctx.bezierCurveTo(-20, 15, -19, 28, -9, 27);
    ctx.bezierCurveTo(0, 27, -4, 20, -9, 22);
    ctx.stroke();

    // Body
    ctx.beginPath();
    ctx.moveTo(-5, 14);
    ctx.quadraticCurveTo(-17, 2, -9, -10);
    ctx.quadraticCurveTo(-6, -18, 0, -15);
    ctx.quadraticCurveTo(12, -11, 7, 0);
    ctx.lineTo(4, 13);
    ctx.quadraticCurveTo(0, 18, -5, 14);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.ellipse(7, -16, 9, 8, -0.4, 0, Math.PI * 2);
    ctx.fill();

    // Snout
    ctx.beginPath();
    ctx.moveTo(13, -17);
    ctx.lineTo(23, -14);
    ctx.lineTo(13, -12);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;

    // Eye
    ctx.fillStyle = "#172033";
    ctx.beginPath();
    ctx.arc(9, -18, 2, 0, Math.PI * 2);
    ctx.fill();

    // Dorsal fin
    ctx.strokeStyle = "#fff0b3";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(-5, -3);
    ctx.lineTo(-14, -8);
    ctx.lineTo(-12, 1);
    ctx.stroke();

    ctx.restore();
}

// --------------------------------------------
// Draw a shark
// --------------------------------------------

function drawShark() {
    ctx.shadowColor = this.glow;
    ctx.shadowBlur = 16;
    ctx.fillStyle = this.color;

    // Tail
    ctx.beginPath();
    ctx.moveTo(-23, 0);
    ctx.lineTo(-37, -19);
    ctx.lineTo(-33, 0);
    ctx.lineTo(-37, 17);
    ctx.closePath();
    ctx.fill();

    // Body
    ctx.beginPath();
    ctx.moveTo(-29, 0);
    ctx.quadraticCurveTo(-18, -17, 4, -15);
    ctx.quadraticCurveTo(22, -13, 30, 0);
    ctx.quadraticCurveTo(18, 16, -8, 13);
    ctx.quadraticCurveTo(-23, 10, -29, 0);
    ctx.fill();

    // Dorsal fin
    ctx.beginPath();
    ctx.moveTo(-7, -13);
    ctx.lineTo(3, -29);
    ctx.lineTo(11, -12);
    ctx.closePath();
    ctx.fill();

    // Lower fin
    ctx.beginPath();
    ctx.moveTo(-4, 12);
    ctx.lineTo(7, 25);
    ctx.lineTo(12, 12);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;

    // Pale belly
    ctx.fillStyle = "#e4f6ff";
    ctx.beginPath();
    ctx.moveTo(-13, 7);
    ctx.quadraticCurveTo(7, 16, 23, 5);
    ctx.quadraticCurveTo(12, 13, -5, 10);
    ctx.fill();

    // Eye
    ctx.fillStyle = "#08182a";
    ctx.beginPath();
    ctx.arc(19, -5, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Gill lines
    ctx.strokeStyle = "rgba(20, 50, 75, 0.7)";
    ctx.lineWidth = 1.5;

    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(8 + i * 4, -4);
        ctx.lineTo(6 + i * 4, 5);
        ctx.stroke();
    }
}

// --------------------------------------------
// Draw one animal
// --------------------------------------------

function drawAnimal(animal) {
    ctx.save();

    ctx.translate(animal.x, animal.y);

    // Turn the animal toward its direction of travel
    const facing = animal.dx < 0 ? -1 : 1;
    ctx.scale(facing, 1);

    // Give the creature a subtle swimming motion
    const swim = Math.sin(
        elapsedTime * 2 + animal.phase
    ) * 1.8;

    ctx.translate(0, swim);

    // Special click reaction: temporarily glow brighter
    if (animal.reaction > 0) {
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 30;
    }

    const scale = animal.size / 30;
    ctx.scale(scale, scale);

    switch (animal.type) {
        case "fish":
            drawFish.call(animal);
            break;

        case "jellyfish":
            drawJellyfish.call(animal);
            break;

        case "turtle":
            drawTurtle.call(animal);
            break;

        case "ray":
            drawRay.call(animal);
            break;

        case "seahorse":
            drawSeahorse.call(animal);
            break;

        case "shark":
            drawShark.call(animal);
            break;
    }

    ctx.restore();

    // Draw a subtle outline around a recently clicked animal
    if (animal.reaction > 0) {
        ctx.save();
        ctx.shadowColor = animal.glow;
        ctx.shadowBlur = 22;
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(
            animal.x,
            animal.y,
            animal.size * 1.3,
            0,
            Math.PI * 2
        );
        ctx.stroke();

        ctx.restore();
    }
}

// --------------------------------------------
// Move animals and keep them inside the canvas
// --------------------------------------------

function moveAnimals(delta) {
    animals.forEach(animal => {
        // Reduce reaction timer
        animal.reaction = Math.max(
            0,
            animal.reaction - delta / 60
        );

        // Special reaction movement
        if (animal.reaction > 0 && animal.type === "fish") {
            animal.x += animal.dx * delta * 1.5;
            animal.y += animal.dy * delta * 1.5;
        } else {
            animal.x += animal.dx * delta;
            animal.y += animal.dy * delta;
        }

        // Gentle natural vertical swimming
        if (animal.type === "jellyfish") {
            animal.dy += Math.sin(
                elapsedTime * 1.5 + animal.phase
            ) * 0.003 * delta;
        }

        if (animal.type === "seahorse") {
            animal.dy += Math.sin(
                elapsedTime * 2 + animal.phase
            ) * 0.002 * delta;
        }

        // Stop excessive vertical drift
        animal.dy = Math.max(-1.5, Math.min(1.5, animal.dy));

        // Keep every creature within the aquarium
        const margin = animal.size * 1.4;

        if (animal.x >= WIDTH - margin) {
            animal.x = WIDTH - margin;
            animal.dx = -Math.abs(animal.dx);
        } else if (animal.x <= margin) {
            animal.x = margin;
            animal.dx = Math.abs(animal.dx);
        }

        if (animal.y >= HEIGHT - margin) {
            animal.y = HEIGHT - margin;
            animal.dy = -Math.abs(animal.dy);
        } else if (animal.y <= margin) {
            animal.y = margin;
            animal.dy = Math.abs(animal.dy);
        }
    });
}

// --------------------------------------------
// Release glowing fish food
// --------------------------------------------

function releaseFood(x = WIDTH / 2, y = HEIGHT / 2) {
    for (let i = 0; i < 7; i++) {
        food.push({
            x: x + (Math.random() - 0.5) * 35,
            y: y + (Math.random() - 0.5) * 20,
            dx: (Math.random() - 0.5) * 0.8,
            dy: 0.5 + Math.random() * 0.8,
            radius: 3 + Math.random() * 2,
            life: 900
        });
    }

    createRipple(x, y, "#67f5c5");

    statusText.textContent =
        "Glowing food released! Watch the fish chase it.";
}

// --------------------------------------------
// Fish chase nearby food
// --------------------------------------------

function updateFood(delta) {
    food.forEach(pellet => {
        pellet.life -= delta;

        // Find the closest fish
        let closestFish = null;
        let closestDistance = Infinity;

        animals.forEach(animal => {
            if (animal.type !== "fish") return;

            const distance = Math.hypot(
                animal.x - pellet.x,
                animal.y - pellet.y
            );

            if (distance < closestDistance) {
                closestDistance = distance;
                closestFish = animal;
            }
        });

        // Food attracts the closest fish
        if (closestFish && closestDistance < 240) {
            const angle = Math.atan2(
                pellet.y - closestFish.y,
                pellet.x - closestFish.x
            );

            closestFish.dx += Math.cos(angle) * 0.008 * delta;
            closestFish.dy += Math.sin(angle) * 0.008 * delta;

            // Keep fish movement at a manageable speed
            closestFish.dx = Math.max(
                -2.5, Math.min(2.5, closestFish.dx)
            );

            closestFish.dy = Math.max(
                -2, Math.min(2, closestFish.dy)
            );
        }

        pellet.x += pellet.dx * delta;
        pellet.y += pellet.dy * delta;

        // Food slowly sinks
        pellet.dy += 0.0005 * delta;
    });

    // Remove expired or collected food
    food = food.filter(pellet => {
        if (pellet.life <= 0 || pellet.y > HEIGHT - 10) {
            return false;
        }

        for (const animal of animals) {
            if (animal.type !== "fish") continue;

            const distance = Math.hypot(
                animal.x - pellet.x,
                animal.y - pellet.y
            );

            if (distance < animal.size * 0.9) {
                createParticles(pellet.x, pellet.y, "#67f5c5", 5);
                return false;
            }
        }

        return true;
    });
}

// --------------------------------------------
// Draw glowing food pellets
// --------------------------------------------

function drawFood() {
    food.forEach(pellet => {
        ctx.save();

        ctx.shadowColor = "#67f5c5";
        ctx.shadowBlur = 15;
        ctx.fillStyle = "#a7ffdf";

        ctx.beginPath();
        ctx.arc(
            pellet.x,
            pellet.y,
            pellet.radius,
            0,
            Math.PI * 2
        );
        ctx.fill();

        ctx.restore();
    });
}

// --------------------------------------------
// Create a ripple effect
// --------------------------------------------

function createRipple(x, y, color = "#67e8f9") {
    ripples.push({
        x,
        y,
        radius: 5,
        alpha: 1,
        color
    });
}

function drawRipples(delta) {
    ripples.forEach(ripple => {
        ripple.radius += 0.8 * delta;
        ripple.alpha -= 0.018 * delta;

        ctx.save();
        ctx.globalAlpha = Math.max(0, ripple.alpha);
        ctx.strokeStyle = ripple.color;
        ctx.lineWidth = 3;
        ctx.shadowColor = ripple.color;
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.arc(
            ripple.x,
            ripple.y,
            ripple.radius,
            0,
            Math.PI * 2
        );
        ctx.stroke();

        ctx.restore();
    });

    ripples = ripples.filter(ripple => ripple.alpha > 0);
}

// --------------------------------------------
// Create and draw glowing particles
// --------------------------------------------

function createParticles(x, y, color, amount = 18) {
    for (let i = 0; i < amount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;

        particles.push({
            x,
            y,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            radius: 1 + Math.random() * 3,
            alpha: 1,
            color
        });
    }
}

function drawParticles(delta) {
    particles.forEach(particle => {
        particle.x += particle.dx * delta;
        particle.y += particle.dy * delta;
        particle.dx *= 0.99;
        particle.dy *= 0.99;
        particle.alpha -= 0.018 * delta;

        ctx.save();
        ctx.globalAlpha = Math.max(0, particle.alpha);
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.arc(
            particle.x,
            particle.y,
            particle.radius,
            0,
            Math.PI * 2
        );
        ctx.fill();

        ctx.restore();
    });

    particles = particles.filter(particle => particle.alpha > 0);
}

// --------------------------------------------
// Handle mouse clicks on the canvas
// --------------------------------------------

function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();

    // Convert screen coordinates to canvas coordinates
    const x = (event.clientX - rect.left) * WIDTH / rect.width;
    const y = (event.clientY - rect.top) * HEIGHT / rect.height;

    // Find the animal under the mouse
    let clickedAnimal = null;
    let closestDistance = Infinity;

    animals.forEach(animal => {
        const distance = Math.hypot(
            animal.x - x,
            animal.y - y
        );

        const hitRadius = animal.size * 1.4;

        if (
            distance < hitRadius &&
            distance < closestDistance
        ) {
            clickedAnimal = animal;
            closestDistance = distance;
        }
    });

    if (clickedAnimal) {
        interactWithAnimal(clickedAnimal);
    } else {
        releaseFood(x, y);
    }
}

// --------------------------------------------
// Give every animal its own click response
// --------------------------------------------

function interactWithAnimal(animal) {
    animal.reaction = 1.2;

    createRipple(animal.x, animal.y, animal.glow);
    createParticles(
        animal.x,
        animal.y,
        animal.glow,
        22
    );

    switch (animal.type) {
        case "fish":
            animal.dx *= -1.8;
            animal.dy += (Math.random() - 0.5) * 2;
            statusText.textContent =
                "The tropical fish darts away in a flash of light!";
            break;

        case "jellyfish":
            animal.dy = -Math.abs(animal.dy) - 0.4;
            statusText.textContent =
                "The jellyfish pulses with bioluminescent energy!";
            break;

        case "turtle":
            animal.dx *= -1;
            animal.dy = -animal.dy;
            statusText.textContent =
                "The sea turtle turns and glows brightly!";
            break;

        case "ray":
            animal.dx *= -1;
            animal.dy -= 0.8;
            statusText.textContent =
                "The manta ray performs a glowing evasive glide!";
            break;

        case "seahorse":
            animal.dy = -1.5;
            animal.dx += (Math.random() - 0.5) * 1.5;
            statusText.textContent =
                "The seahorse spirals upward in a golden glow!";
            break;

        case "shark":
            animal.dx *= -1;
            animal.dy += (Math.random() - 0.5) * 1.8;
            statusText.textContent =
                "The shark makes a quick turn and swims away!";
            break;
    }

    // Keep the new movement within reasonable limits
    animal.dx = Math.max(-2.5, Math.min(2.5, animal.dx));
    animal.dy = Math.max(-2, Math.min(2, animal.dy));
}

// --------------------------------------------
// Main animation loop
// --------------------------------------------

function animate(timestamp) {
    if (paused) return;

    let delta = previousTime
        ? (timestamp - previousTime) / 16.67
        : 1;

    // Avoid huge jumps after a delayed frame
    delta = Math.min(delta, 2);
    previousTime = timestamp;

    elapsedTime += delta / 60;

    drawBackground();
    drawBubbles(delta);

    moveAnimals(delta);
    updateFood(delta);

    animals.forEach(drawAnimal);

    drawFood();
    drawRipples(delta);
    drawParticles(delta);

    animationId = requestAnimationFrame(animate);
}

// --------------------------------------------
// Pause and resume
// --------------------------------------------

function togglePause() {
    paused = !paused;

    if (paused) {
        cancelAnimationFrame(animationId);
        pauseButton.textContent = "Resume Aquarium";
        statusText.textContent =
            "Aquarium paused. Press Resume Aquarium to continue.";
    } else {
        previousTime = 0;
        pauseButton.textContent = "Pause Aquarium";
        statusText.textContent = "The aquarium is swimming again!";
        animationId = requestAnimationFrame(animate);
    }
}

// --------------------------------------------
// Reset everything
// --------------------------------------------

function resetAquarium() {
    cancelAnimationFrame(animationId);

    paused = false;
    previousTime = 0;
    elapsedTime = 0;

    food = [];
    particles = [];
    ripples = [];

    createAnimals();
    createBubbles();

    pauseButton.textContent = "Pause Aquarium";

    statusText.textContent =
        "Aquarium reset! Click an animal or release some food.";

    animationId = requestAnimationFrame(animate);
}

// --------------------------------------------
// Connect the buttons and mouse events
// --------------------------------------------

canvas.addEventListener("click", handleCanvasClick);

foodButton.addEventListener("click", () => {
    releaseFood(
        WIDTH * 0.5,
        HEIGHT * 0.35
    );
});

pauseButton.addEventListener("click", togglePause);
resetButton.addEventListener("click", resetAquarium);

// --------------------------------------------
// Start the aquarium
// --------------------------------------------

createAnimals();
createBubbles();

animationId = requestAnimationFrame(animate);
