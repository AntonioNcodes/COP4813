
/* ==========================================
   SECRETS OF ANCIENT EGYPT
   COP4813 - Assignment 13
   Educational 2D Adventure Game
========================================== */

// GAME ELEMENTS

const titleScreen = document.getElementById("title-screen");
const gameScreen = document.getElementById("game-screen");

const startButton = document.getElementById("start-button");
const journalButton = document.getElementById("journal-button");

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const artifactsDisplay = document.getElementById("artifacts");
const gameMessage = document.getElementById("game-message");

// GAME SETTINGS

const worldWidth = 2200;
const groundY = 385;
const gravity = 0.65;

let score = 0;
let lives = 3;
let collectedCount = 0;

let gameRunning = false;

let animationId = null;

let cameraX = 0;
let keys = {};

// PLAYER

const player = {
    x: 70,
    y: groundY - 48,
    width: 34,
    height: 48,
    speed: 4,
    velocityY: 0,
    jumping: false
};

// HISTORICAL ARTIFACTS

const artifacts = [
    {
        x: 380,
        y: 340,
        name: "Ankh",
        fact: "The ankh was an ancient Egyptian symbol associated with life.",
        question: "What did the ankh symbolize?\nA. Life\nB. War\nC. Farming",
        answer: "A"
    },
    {
        x: 850,
        y: 340,
        name: "Papyrus",
        fact: "Ancient Egyptians made a writing material called papyrus from a plant that grew along the Nile.",
        question: "What plant was used to make papyrus?\nA. Palm tree\nB. Papyrus plant\nC. Olive tree",
        answer: "B"
    },
    {
        x: 1650,
        y: 340,
        name: "Scarab",
        fact: "The scarab beetle was an important symbol associated with rebirth and renewal.",
        question: "What was the scarab associated with?\nA. Rebirth and renewal\nB. Ocean travel\nC. Farming tools",
        answer: "A"
    }
];

// OBSTACLES

const obstacles = [
    { x: 600, width: 45, height: 38 },
    { x: 1050, width: 50, height: 42 },
    { x: 1500, width: 55, height: 40 }
];

// HISTORY JOURNAL

let journalEntries = [];

// START GAME

startButton.addEventListener("click", startGame);

function startGame() {

    score = 0;
    lives = 3;
    collectedCount = 0;

    cameraX = 0;


    player.x = 70;
    player.y = groundY - player.height;
    player.velocityY = 0;
    player.jumping = false;

    journalEntries = [];

    artifacts.forEach(item => {
        item.collected = false;
    });


    titleScreen.hidden = true;
    gameScreen.hidden = false;

    gameMessage.textContent =
        "Your adventure begins! Explore the desert and find ancient artifacts.";

    updateDisplay();

    gameRunning = true;

    cancelAnimationFrame(animationId);

    gameLoop();
}

// KEYBOARD CONTROLS

window.addEventListener("keydown", function(event) {

    if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(event.key)
    ) {
        event.preventDefault();
    }

    keys[event.key.toLowerCase()] = true;

});

window.addEventListener("keyup", function(event) {

    keys[event.key.toLowerCase()] = false;

});

// PLAYER MOVEMENT

function movePlayer() {

    if (keys["arrowright"] || keys["d"]) {
        player.x += player.speed;
    }

    if (keys["arrowleft"] || keys["a"]) {
        player.x -= player.speed;
    }

    if (
        (keys[" "] || keys["arrowup"] || keys["w"]) &&
        !player.jumping
    ) {
        player.velocityY = -12;
        player.jumping = true;
    }

    player.velocityY += gravity;
    player.y += player.velocityY;

    if (player.y + player.height >= groundY) {
        player.y = groundY - player.height;
        player.velocityY = 0;
        player.jumping = false;
    }

    // Keep player inside the world

    player.x = Math.max(
        0,
        Math.min(player.x, worldWidth - player.width)
    );

    // Move camera with player

    cameraX = Math.max(
        0,
        Math.min(
            player.x - canvas.width / 2,
            worldWidth - canvas.width
        )
    );

}

// DRAW BACKGROUND

function drawBackground() {

    // Sky

    const sky = ctx.createLinearGradient(
        0, 0, 0, canvas.height
    );

    sky.addColorStop(0, "#78b6d5");
    sky.addColorStop(1, "#f2cc83");

    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sun

    ctx.fillStyle = "#ffe6a1";
    ctx.beginPath();
    ctx.arc(760, 75, 38, 0, Math.PI * 2);
    ctx.fill();

    // Distant pyramids

    drawPyramid(170 - cameraX * 0.4, 285, 180, 170);
    drawPyramid(650 - cameraX * 0.4, 300, 140, 155);
    drawPyramid(1100 - cameraX * 0.4, 280, 200, 180);
    drawPyramid(1750 - cameraX * 0.4, 295, 160, 165);

    // Desert ground

    ctx.fillStyle = "#d6a04c";
    ctx.fillRect(0, groundY, canvas.width, 65);

    ctx.fillStyle = "#b77b34";
    ctx.fillRect(0, groundY + 8, canvas.width, 8);

}

function drawPyramid(x, y, width, height) {

    ctx.fillStyle = "#d7a34f";

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width / 2, y - height);
    ctx.lineTo(x + width, y);
    ctx.closePath();
    ctx.fill();

    // Pyramid shadow

    ctx.fillStyle = "#a97438";

    ctx.beginPath();
    ctx.moveTo(x + width / 2, y - height);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width / 2, y);
    ctx.closePath();
    ctx.fill();

}

// DRAW PLAYER

function drawPlayer() {

    const x = player.x - cameraX;
    const y = player.y;

    // Head

    ctx.fillStyle = "#b87943";
    ctx.fillRect(x + 9, y, 18, 18);

    // Hair

    ctx.fillStyle = "#29211c";
    ctx.fillRect(x + 8, y, 19, 5);

    // Body

    ctx.fillStyle = "#f5e6bd";
    ctx.fillRect(x + 7, y + 18, 22, 20);

    // Belt

    ctx.fillStyle = "#c28b32";
    ctx.fillRect(x + 7, y + 30, 22, 5);

    // Legs

    ctx.fillStyle = "#523a29";
    ctx.fillRect(x + 8, y + 38, 7, 10);
    ctx.fillRect(x + 21, y + 38, 7, 10);

}

// DRAW ARTIFACTS

function drawArtifacts() {

    artifacts.forEach(item => {

        if (item.collected) return;

        const x = item.x - cameraX;

        ctx.fillStyle = "#ffd447";

        ctx.beginPath();
        ctx.arc(x, item.y, 13, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#99651d";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = "#70451b";
        ctx.font = "bold 14px Georgia";
        ctx.textAlign = "center";

        ctx.fillText(
            item.name === "Ankh" ? "A" :
            item.name === "Papyrus" ? "P" : "S",
            x,
            item.y + 5
        );

    });
}

// DRAW OBSTACLES

function drawObstacles() {

    obstacles.forEach(obstacle => {

        const x = obstacle.x - cameraX;

        ctx.fillStyle = "#79543a";

        ctx.fillRect(
            x,
            groundY - obstacle.height,
            obstacle.width,
            obstacle.height
        );

        ctx.fillStyle = "#b58a5c";

        ctx.fillRect(
            x + 5,
            groundY - obstacle.height + 5,
            obstacle.width - 10,
            7
        );

    });

}

// CHECK ARTIFACT COLLECTION

function collectArtifact(item) {
       keys = {};
    player.velocityY = 0;

    item.collected = true;

    collectedCount++;

    gameMessage.textContent =
        "You discovered: " + item.name + "!";

    const response = prompt(
        "HISTORICAL CHALLENGE\n\n" +
        item.question +
        "\n\nEnter A, B, or C:"
    );

   keys = {};

    if (response && response.trim().toUpperCase() === item.answer) {

        score += 100;

        gameMessage.textContent =
            "Correct! You earned 100 points. " + item.fact;

        alert("Correct! +100 points\n\n" + item.fact);

    } else {

        gameMessage.textContent =
            "Not quite! " + item.fact;

        alert(
            "Good try! Here is something to learn:\n\n" +
            item.fact
        );

    }

    journalEntries.push(
        item.name + ": " + item.fact
    );

    updateDisplay();

}

// CHECK COLLISIONS

function checkCollisions() {

    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;

    // Normal artifacts

    artifacts.forEach(item => {

        if (item.collected) return;

        const distance = Math.hypot(
            playerCenterX - item.x,
            playerCenterY - item.y
        );

        if (distance < 35) {
            collectArtifact(item);
        }

    });

    // Obstacle collisions

    obstacles.forEach(obstacle => {

        const touching =
            player.x + player.width > obstacle.x &&
            player.x < obstacle.x + obstacle.width &&
            player.y + player.height > groundY - obstacle.height;

        if (touching) {

            lives--;

            player.x = Math.max(
                0,
                obstacle.x - player.width - 10
            );

            player.y = groundY - player.height;
            player.velocityY = 0;
            player.jumping = false;

            gameMessage.textContent =
                "You hit an obstacle! Be careful.";

            updateDisplay();

            if (lives <= 0) {
                endGame();
            }

        }

    });

}

// HISTORY JOURNAL

journalButton.addEventListener("click", function() {

    if (!gameRunning) return;

    if (journalEntries.length === 0) {

        alert(
            "HISTORY JOURNAL\n\n" +
            "You haven't discovered any artifacts yet. " +
            "Explore the desert to begin learning!"
        );

        return;

    }

    alert(
        "YOUR HISTORY JOURNAL\n\n" +
        journalEntries.join("\n\n")
    );

});

// UPDATE SCORE AND LIVES

function updateDisplay() {

    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    artifactsDisplay.textContent = collectedCount;

}

// GAME OVER

function endGame() {

    gameRunning = false;

    cancelAnimationFrame(animationId);

    alert(
        "ADVENTURE OVER!\n\n" +
        "Final Score: " + score +
        "\nArtifacts Discovered: " + collectedCount
    );

    gameScreen.hidden = true;
    titleScreen.hidden = false;

}

// WIN CONDITION

function checkWin() {

    if (player.x >= worldWidth - 100) {

        gameRunning = false;

        cancelAnimationFrame(animationId);

        score += 200;

        updateDisplay();

        alert(
            "LEVEL COMPLETE!\n\n" +
            "You explored the desert and uncovered " +
            "secrets of Ancient Egypt!\n\n" +
            "Final Score: " + score
        );

        gameScreen.hidden = true;
        titleScreen.hidden = false;

    }

}

// MAIN GAME LOOP

function gameLoop() {

    if (!gameRunning) return;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    movePlayer();

    drawBackground();
    drawObstacles();
    drawArtifacts();
    drawPlayer();

    checkCollisions();



    if (gameRunning) {
        checkWin();
    }

    if (gameRunning) {
        animationId = requestAnimationFrame(gameLoop);
    }

}
