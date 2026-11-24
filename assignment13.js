
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

// INVENTORY ELEMENTS

const ankhDisplay = document.getElementById("ankh-count");
const papyrusDisplay = document.getElementById("papyrus-count");
const scarabDisplay = document.getElementById("scarab-count");
const treasuresDisplay = document.getElementById("treasures-collected");

// QUESTION ELEMENTS

const questionPanel = document.getElementById("question-panel");
const questionArtifact = document.getElementById("question-artifact");
const questionTitle = document.getElementById("question-title");
const questionText = document.getElementById("question-text");
const answerOptions = document.getElementById("answer-options");
const answerFeedback = document.getElementById("answer-feedback");
const continueButton = document.getElementById("continue-button");

// GAME SETTINGS

const worldWidth = 2200;
const groundY = 385;
const gravity = 0.65;

let score = 0;
let lives = 3;
let collectedCount = 0;

let gameRunning = false;
let questionActive = false;
let journalOpen = false;
let endPanelOpen = false;

let animationId = null;
let cameraX = 0;
let keys = {};

let activeArtifact = null;
let currentEndPanel = null;

// INVENTORY

let inventory = {
    Ankh: 0,
    Papyrus: 0,
    Scarab: 0
};

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

// HISTORICAL ARTIFACTS AND QUESTIONS

const artifacts = [
    {
        x: 380,
        y: 340,
        name: "Ankh",
        symbol: "☥",
        fact: "The ankh was an ancient Egyptian symbol associated with life and immortality.",
        question: "What did the Ankh symbolize in Ancient Egypt?",
        options: [
            "Life",
            "War",
            "Farming"
        ],
        answer: 0,
        collected: false
    },

    {
        x: 850,
        y: 340,
        name: "Papyrus",
        symbol: "📜",
        fact: "Ancient Egyptians made a writing material called papyrus from a plant that grew along the Nile River.",
        question: "What plant was used to make papyrus?",
        options: [
            "Palm tree",
            "Papyrus plant",
            "Olive tree"
        ],
        answer: 1,
        collected: false
    },

    {
        x: 1650,
        y: 340,
        name: "Scarab",
        symbol: "🪲",
        fact: "The scarab beetle was an important symbol in Ancient Egypt associated with rebirth and renewal.",
        question: "What was the scarab beetle associated with?",
        options: [
            "Rebirth and renewal",
            "Ocean travel",
            "Farming tools"
        ],
        answer: 0,
        collected: false
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

    inventory = {
        Ankh: 0,
        Papyrus: 0,
        Scarab: 0
    };

    cameraX = 0;
    keys = {};

    player.x = 70;
    player.y = groundY - player.height;
    player.velocityY = 0;
    player.jumping = false;

    journalEntries = [];

    activeArtifact = null;
    questionActive = false;
    journalOpen = false;
    endPanelOpen = false;

    artifacts.forEach(item => {
        item.collected = false;
    });

    questionPanel.hidden = true;
    continueButton.hidden = true;

    if (currentEndPanel) {
        currentEndPanel.remove();
        currentEndPanel = null;
    }

    titleScreen.hidden = true;
    gameScreen.hidden = false;

    gameMessage.textContent =
        "Your adventure begins! Find the three ancient treasures and unlock the temple.";

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

    if (
        !gameRunning ||
        questionActive ||
        journalOpen ||
        endPanelOpen
    ) {
        return;
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

// DRAW PYRAMIDS

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

        // Artifact background

        ctx.fillStyle = "#ffd447";

        ctx.beginPath();
        ctx.arc(x, item.y, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#99651d";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Artifact letter

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

// OPEN HISTORICAL QUESTION

function collectArtifact(item) {

    if (questionActive || item.collected) return;

    keys = {};

    player.velocityY = 0;

    activeArtifact = item;
    questionActive = true;

    questionArtifact.textContent = item.symbol;

    questionTitle.textContent =
        "Ancient " + item.name + " Challenge";

    questionText.textContent = item.question;

    answerFeedback.textContent = "";

    answerFeedback.className = "";

    answerOptions.innerHTML = "";

    continueButton.hidden = true;

    gameMessage.textContent =
        "You discovered an ancient " + item.name + "!";

    // Create answer buttons

    item.options.forEach((option, index) => {

        const button = document.createElement("button");

        button.type = "button";

        button.className = "answer-button";

        button.textContent =
            String.fromCharCode(65 + index) + ". " + option;

        button.addEventListener("click", function() {

            checkAnswer(index, button);

        });

        answerOptions.appendChild(button);

    });

    questionPanel.hidden = false;

}

// CHECK PLAYER ANSWER

function checkAnswer(selectedAnswer, selectedButton) {

    if (!activeArtifact || activeArtifact.collected) return;

    const item = activeArtifact;

    const answerButtons =
        answerOptions.querySelectorAll("button");

    if (selectedAnswer === item.answer) {

        // Correct answer

        answerButtons.forEach(button => {
            button.disabled = true;
        });

        selectedButton.classList.add("correct-answer");

        item.collected = true;

        inventory[item.name]++;

        collectedCount++;

        score += 100;

        answerFeedback.textContent =
            "Correct! You discovered the secret of the " +
            item.name + "! +100 points. " + item.fact;

        answerFeedback.className = "correct-feedback";

        gameMessage.textContent =
            "Excellent! " + item.name + " added to your inventory.";

        // Add information to the journal

        journalEntries.push({
            name: item.name,
            fact: item.fact
        });

        updateDisplay();

        // Check if all treasures have been collected

        if (collectedCount === artifacts.length) {

            answerFeedback.textContent +=
                " You have discovered all three ancient treasures! The Ancient Temple awaits!";

        }

        continueButton.textContent = "Continue Adventure";

        continueButton.hidden = false;

    } else {

        // Incorrect answer

        selectedButton.classList.add("incorrect-answer");

        answerFeedback.textContent =
            "Not quite! Try again. Remember: " + item.fact;

        answerFeedback.className = "incorrect-feedback";

    }

}

// CONTINUE ADVENTURE

continueButton.addEventListener("click", function() {

    questionPanel.hidden = true;

    questionActive = false;

    activeArtifact = null;

    answerOptions.innerHTML = "";

    answerFeedback.textContent = "";

    keys = {};

    if (collectedCount === artifacts.length) {

        gameMessage.textContent =
            "All three treasures have been collected! Find the Ancient Temple.";

    } else {

        gameMessage.textContent =
            "Keep exploring and discover more ancient treasures!";

    }

    gameLoop();

});

// CHECK COLLISIONS

function checkCollisions() {

    if (questionActive) return;

    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;

    // Artifact collisions

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

    if (questionActive) return;

    // Obstacle collisions

    obstacles.forEach(obstacle => {

        const touching =
            player.x + player.width > obstacle.x &&
            player.x < obstacle.x + obstacle.width &&
            player.y + player.height > groundY - obstacle.height;

        if (touching) {

            keys = {};

            lives--;

            player.x = Math.max(
                0,
                obstacle.x - player.width - 10
            );

            player.y = groundY - player.height;

            player.velocityY = 0;

            player.jumping = false;

            gameMessage.textContent =
                "You hit an ancient stone barrier! Jump over the obstacles to continue your journey.";

            updateDisplay();

            if (lives <= 0) {

                endGame();

            }

        }

    });

}

// HISTORY JOURNAL

journalButton.addEventListener("click", openJournal);

function openJournal() {

    if (!gameRunning || questionActive || journalOpen) return;

    keys = {};

    journalOpen = true;

    // Create journal panel

    const journalPanel = document.createElement("section");

    journalPanel.className = "journal-panel";

    journalPanel.setAttribute("role", "dialog");

    journalPanel.setAttribute("aria-modal", "true");

    journalPanel.setAttribute("aria-labelledby", "journal-title");

    const heading = document.createElement("h2");

    heading.id = "journal-title";

    heading.textContent = "Ancient Egyptian History Journal";

    journalPanel.appendChild(heading);

    if (journalEntries.length === 0) {

        const message = document.createElement("p");

        message.textContent =
            "Your journal is empty. Explore the desert and answer historical questions to discover ancient knowledge!";

        journalPanel.appendChild(message);

    } else {

        journalEntries.forEach(entry => {

            const entryBox = document.createElement("div");

            entryBox.className = "journal-entry";

            const title = document.createElement("h3");

            title.textContent = entry.name;

            const fact = document.createElement("p");

            fact.textContent = entry.fact;

            entryBox.appendChild(title);

            entryBox.appendChild(fact);

            journalPanel.appendChild(entryBox);

        });

    }

    const closeButton = document.createElement("button");

    closeButton.type = "button";

    closeButton.textContent = "Return to Adventure";

    closeButton.addEventListener("click", function() {

        journalPanel.remove();

        journalOpen = false;

        gameLoop();

    });

    journalPanel.appendChild(closeButton);

    gameScreen.appendChild(journalPanel);

    closeButton.focus();

}

// UPDATE SCORE, INVENTORY, AND PROGRESS

function updateDisplay() {

    scoreDisplay.textContent = score;

    livesDisplay.textContent = lives;

    artifactsDisplay.textContent = collectedCount;

    ankhDisplay.textContent = inventory.Ankh;

    papyrusDisplay.textContent = inventory.Papyrus;

    scarabDisplay.textContent = inventory.Scarab;

    treasuresDisplay.textContent = collectedCount;

}

// CREATE END SCREEN

function showEndPanel(title, message) {

    endPanelOpen = true;

    const panel = document.createElement("section");

    panel.className = "end-panel";

    panel.setAttribute("role", "dialog");

    panel.setAttribute("aria-modal", "true");

    const heading = document.createElement("h2");

    heading.textContent = title;

    const description = document.createElement("p");

    description.textContent = message;

    const scoreText = document.createElement("p");

    scoreText.textContent = "Final Score: " + score;

    const treasureText = document.createElement("p");

    treasureText.textContent =
        "Ancient Treasures Collected: " + collectedCount + " / 3";

    const returnButton = document.createElement("button");

    returnButton.type = "button";

    returnButton.textContent = "Return to Main Menu";

    returnButton.addEventListener("click", function() {

        panel.remove();

        currentEndPanel = null;

        endPanelOpen = false;

        gameScreen.hidden = true;

        titleScreen.hidden = false;

    });

    panel.appendChild(heading);

    panel.appendChild(description);

    panel.appendChild(scoreText);

    panel.appendChild(treasureText);

    panel.appendChild(returnButton);

    gameScreen.appendChild(panel);

    currentEndPanel = panel;

    returnButton.focus();

}

// GAME OVER

function endGame() {

    if (!gameRunning) return;

    gameRunning = false;

    cancelAnimationFrame(animationId);

    keys = {};

    questionPanel.hidden = true;

    showEndPanel(
        "Adventure Over!",
        "Your journey through Ancient Egypt has ended. Try again to discover all three ancient treasures!"
    );

}

// WIN CONDITION

function checkWin() {

    if (player.x >= worldWidth - 100) {

        // Require all treasures before winning

        if (collectedCount < artifacts.length) {

            player.x = worldWidth - 130;

            gameMessage.textContent =
                "The Ancient Temple is locked! Find all three treasures before entering.";

            return;

        }

        gameRunning = false;

        cancelAnimationFrame(animationId);

        score += 200;

        updateDisplay();

        showEndPanel(
            "The Ancient Temple Is Unlocked!",
            "Congratulations! You discovered the Ankh, Papyrus, and Scarab and uncovered the secrets of Ancient Egypt. You completed your educational adventure and earned 200 bonus points!"
        );

    }

}

// MAIN GAME LOOP

function gameLoop() {

    if (
        !gameRunning ||
        questionActive ||
        journalOpen ||
        endPanelOpen
    ) {
        return;
    }

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

    if (gameRunning && !questionActive) {

        checkWin();

    }

    if (
        gameRunning &&
        !questionActive &&
        !journalOpen &&
        !endPanelOpen
    ) {

        animationId = requestAnimationFrame(gameLoop);

    }

}
