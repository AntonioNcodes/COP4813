/* ==========================================
   SECRETS OF ANCIENT EGYPT
   COP4813 - ASSIGNMENT 13
   Three-Level Educational Adventure
========================================== */

// HTML ELEMENTS

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

const ankhDisplay = document.getElementById("ankh-count");
const papyrusDisplay = document.getElementById("papyrus-count");
const scarabDisplay = document.getElementById("scarab-count");
const treasuresDisplay = document.getElementById("treasures-collected");

const levelName = document.getElementById("level-name");
const levelDescription = document.getElementById("level-description");
const levelNumber = document.getElementById("level-number");

const questionPanel = document.getElementById("question-panel");
const questionArtifact = document.getElementById("question-artifact");
const questionTitle = document.getElementById("question-title");
const questionImage = document.getElementById("question-image");
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
let currentLevel = 0;

let gameRunning = false;
let questionActive = false;
let journalOpen = false;
let endPanelOpen = false;

let animationId = null;
let cameraX = 0;
let keys = {};

let activeArtifact = null;
let currentEndPanel = null;

let journalEntries = [];


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


// LEVELS AND HISTORICAL QUESTIONS

const levels = [

    {
        name: "Desert of Secrets",
        description: "Explore the Egyptian desert and discover ancient treasures.",
        background: "#e7bd78",

        artifacts: [

            {
                x: 350,
                name: "Ankh",
                symbol: "☥",
                question: "What did the Ankh symbolize in Ancient Egypt?",
                options: ["Life", "War", "Farming", "Wealth"],
                answer: 0,
                fact: "The Ankh was an ancient Egyptian symbol associated with life and immortality.",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Ankh.svg"
            },

            {
                x: 700,
                name: "Papyrus",
                symbol: "📜",
                question: "What plant was used to make papyrus?",
                options: ["Palm tree", "Papyrus plant", "Olive tree", "Cedar tree"],
                answer: 1,
                fact: "Ancient Egyptians made a writing material called papyrus from a plant that grew along the Nile River.",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Papyrus_plant.jpg"
            },

            {
                x: 1050,
                name: "Scarab",
                symbol: "🪲",
                question: "What was the scarab beetle associated with?",
                options: ["Ocean travel", "War", "Rebirth and renewal", "Farming"],
                answer: 2,
                fact: "The scarab beetle was an important symbol associated with rebirth and renewal.",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Scarab_beetle.jpg"
            },

            {
                x: 1400,
                name: "Papyrus",
                symbol: "📜",
                question: "Which river was essential to ancient Egyptian civilization?",
                options: ["Amazon", "Nile", "Mississippi", "Danube"],
                answer: 1,
                fact: "The Nile River provided water, transportation, and fertile soil for farming.",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Nile_River.jpg"
            },

            {
                x: 1750,
                name: "Ankh",
                symbol: "☥",
                question: "What were the large pyramids mainly built as?",
                options: ["Markets", "Schools", "Tombs", "Farms"],
                answer: 2,
                fact: "Many Egyptian pyramids were built as royal tombs for pharaohs.",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Pyramids_of_Giza.jpg"
            }

        ]
    },

    {
        name: "Temple of Knowledge",
        description: "Enter an ancient temple and learn about Egyptian culture and writing.",
        background: "#c69a60",

        artifacts: [

            {
                x: 350,
                name: "Papyrus",
                symbol: "📜",
                question: "What were hieroglyphics?",
                options: ["A type of food", "A writing system", "A musical instrument", "A building"],
                answer: 1,
                fact: "Hieroglyphics were a writing system that used pictures and symbols.",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Egyptian_hieroglyphics.jpg"
            },

            {
                x: 700,
                name: "Ankh",
                symbol: "☥",
                question: "Who was the ancient Egyptian sun god?",
                options: ["Ra", "Osiris", "Anubis", "Horus"],
                answer: 0,
                fact: "Ra was an important ancient Egyptian sun god.",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Ra_Egyptian_god.jpg"
            },

            {
                x: 1050,
                name: "Scarab",
                symbol: "🪲",
                question: "What was the main purpose of the Rosetta Stone?",
                options: ["Build pyramids", "Translate hieroglyphics", "Store food", "Measure land"],
                answer: 1,
                fact: "The Rosetta Stone helped researchers understand Egyptian hieroglyphics.",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Rosetta_Stone.jpg"
            },

            {
                x: 1400,
                name: "Papyrus",
                symbol: "📜",
                question: "What was the main role of a scribe?",
                options: ["Write and record information", "Build boats", "Grow crops", "Train soldiers"],
                answer: 0,
                fact: "Scribes were trained writers who recorded information and important documents.",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Ancient_Egyptian_scribe.jpg"
            },

            {
                x: 1750,
                name: "Ankh",
                symbol: "☥",
                question: "Which animal was closely associated with the god Anubis?",
                options: ["Lion", "Jackal", "Eagle", "Horse"],
                answer: 1,
                fact: "Anubis was commonly depicted with the head of a jackal and was associated with mummification.",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Anubis.jpg"
            }

        ]
    },

    {
        name: "Pharaoh's Tomb",
        description: "Explore the royal tomb and uncover the final secrets of Ancient Egypt.",
        background: "#8e765b",

        artifacts: [

            {
                x: 350,
                name: "Scarab",
                symbol: "🪲",
                question: "What was the purpose of mummification?",
                options: ["Prepare the body for the afterlife", "Prepare for battle", "Celebrate a festival", "Build a home"],
                answer: 0,
                fact: "Mummification preserved bodies because ancient Egyptians believed in an afterlife.",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Egyptian_mummy.jpg"
            },

            {
                x: 700,
                name: "Ankh",
                symbol: "☥",
                question: "What was the title of an ancient Egyptian ruler?",
                options: ["Senator", "Emperor", "Pharaoh", "Knight"],
                answer: 2,
                fact: "The pharaoh was the ruler of ancient Egypt.",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Tutankhamun_mask.jpg"
            },

            {
                x: 1050,
                name: "Papyrus",
                symbol: "📜",
                question: "Who was Tutankhamun?",
                options: ["A famous pharaoh", "A Roman general", "A Greek philosopher", "A builder"],
                answer: 0,
                fact: "Tutankhamun was a young Egyptian pharaoh whose tomb was discovered in 1922.",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Tutankhamun_mask.jpg"
            },

            {
                x: 1400,
                name: "Scarab",
                symbol: "🪲",
                question: "What was placed inside some ancient Egyptian tombs?",
                options: ["Modern computers", "Food and valuable objects", "Cars", "Electric lights"],
                answer: 1,
                fact: "Some tombs contained food, jewelry, furniture, and other objects for the afterlife.",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Egyptian_tomb_treasures.jpg"
            },

            {
                x: 1750,
                name: "Ankh",
                symbol: "☥",
                question: "What was the Valley of the Kings used for?",
                options: ["Growing crops", "Royal burials", "Trading boats", "Building schools"],
                answer: 1,
                fact: "The Valley of the Kings was a burial site for many New Kingdom pharaohs.",
                image: "https://commons.wikimedia.org/wiki/Special:FilePath/Valley_of_the_Kings.jpg"
            }

        ]
    }

];


// CURRENT LEVEL ARTIFACTS

function getArtifacts() {
    return levels[currentLevel].artifacts;
}


// OBSTACLES

const obstacles = [
    { x: 550, width: 45, height: 38 },
    { x: 950, width: 50, height: 42 },
    { x: 1350, width: 55, height: 40 },
    { x: 1650, width: 45, height: 38 }
];


// START GAME

startButton.addEventListener("click", startGame);

function startGame() {

    score = 0;
    lives = 3;
    collectedCount = 0;
    currentLevel = 0;

    inventory = {
        Ankh: 0,
        Papyrus: 0,
        Scarab: 0
    };

    journalEntries = [];

    player.x = 70;
    player.y = groundY - player.height;
    player.velocityY = 0;
    player.jumping = false;

    cameraX = 0;
    keys = {};

    questionActive = false;
    journalOpen = false;
    endPanelOpen = false;
    activeArtifact = null;

    levels.forEach(level => {
        level.artifacts.forEach(item => {
            item.collected = false;
        });
    });

    questionPanel.hidden = true;
    continueButton.hidden = true;

    if (currentEndPanel) {
        currentEndPanel.remove();
        currentEndPanel = null;
    }

    titleScreen.hidden = true;
    gameScreen.hidden = false;

    gameRunning = true;

    updateLevelDisplay();
    updateDisplay();

    gameMessage.textContent =
        "Your adventure begins! Find the five treasures in the desert.";

    cancelAnimationFrame(animationId);
    gameLoop();
}


// LEVEL DISPLAY

function updateLevelDisplay() {

    const level = levels[currentLevel];

    levelName.textContent = level.name;
    levelDescription.textContent = level.description;
    levelNumber.textContent = currentLevel + 1;
}


// KEYBOARD CONTROLS

window.addEventListener("keydown", function(event) {

    if (["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(event.key)) {
        event.preventDefault();
    }

    if (!gameRunning || questionActive || journalOpen || endPanelOpen) {
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

    player.x = Math.max(0, Math.min(player.x, worldWidth - player.width));

    cameraX = Math.max(
        0,
        Math.min(player.x - canvas.width / 2, worldWidth - canvas.width)
    );
}


// BACKGROUND

function drawBackground() {

    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);

    sky.addColorStop(0, "#80b9d6");
    sky.addColorStop(1, "#f4d49b");

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

    // Ground

    ctx.fillStyle = levels[currentLevel].background;
    ctx.fillRect(0, groundY, canvas.width, 65);

    ctx.fillStyle = "#a7773f";
    ctx.fillRect(0, groundY + 8, canvas.width, 8);

    // Level-specific scenery

    if (currentLevel === 1) {
        drawTemple();
    }

    if (currentLevel === 2) {
        drawTomb();
    }
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

    ctx.fillStyle = "#a97438";

    ctx.beginPath();
    ctx.moveTo(x + width / 2, y - height);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width / 2, y);
    ctx.closePath();
    ctx.fill();
}


// TEMPLE SCENERY

function drawTemple() {

    ctx.fillStyle = "#a88b61";

    ctx.fillRect(650 - cameraX * 0.35, 190, 260, 195);

    ctx.fillStyle = "#e0c18b";

    for (let i = 0; i < 5; i++) {
        ctx.fillRect(675 - cameraX * 0.35 + i * 48, 210, 25, 175);
    }

    ctx.fillStyle = "#755637";
    ctx.fillRect(640 - cameraX * 0.35, 190, 280, 20);
}


// TOMB SCENERY

function drawTomb() {

    ctx.fillStyle = "#554637";
    ctx.fillRect(650 - cameraX * 0.35, 200, 260, 185);

    ctx.fillStyle = "#8b704d";
    ctx.fillRect(675 - cameraX * 0.35, 225, 210, 160);

    ctx.fillStyle = "#d4a642";

    for (let i = 0; i < 5; i++) {
        ctx.fillRect(700 - cameraX * 0.35 + i * 35, 260, 12, 35);
    }
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

    getArtifacts().forEach(item => {

        if (item.collected) return;

        const x = item.x - cameraX;

        ctx.fillStyle = "#ffd447";
        ctx.beginPath();
        ctx.arc(x, 340, 17, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#99651d";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = "#70451b";
        ctx.font = "bold 19px Georgia";
        ctx.textAlign = "center";

        ctx.fillText(item.symbol, x, 347);

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


// OPEN QUESTION

function collectArtifact(item) {

    if (questionActive || item.collected) return;

    keys = {};

    activeArtifact = item;
    questionActive = true;

    player.velocityY = 0;

    questionArtifact.textContent = item.symbol;
    questionTitle.textContent = "Ancient " + item.name + " Challenge";
    questionText.textContent = item.question;

    questionImage.src = item.image;
    questionImage.alt = "Historical image related to " + item.name;

    questionImage.onerror = function() {
        questionImage.alt = "Historical image unavailable";
        questionImage.style.display = "none";
    };

    questionImage.onload = function() {
        questionImage.style.display = "block";
    };

    answerFeedback.textContent = "";
    answerFeedback.className = "";

    answerOptions.innerHTML = "";
    continueButton.hidden = true;

    item.options.forEach((option, index) => {

        const button = document.createElement("button");

        button.type = "button";
        button.textContent =
            String.fromCharCode(65 + index) + ". " + option;

        button.addEventListener("click", function() {
            checkAnswer(index, button);
        });

        answerOptions.appendChild(button);

    });

    questionPanel.hidden = false;

    gameMessage.textContent = "Answer the question to collect your treasure!";

}


// CHECK ANSWER

function checkAnswer(selectedAnswer, selectedButton) {

    if (!activeArtifact || activeArtifact.collected) return;

    const item = activeArtifact;
    const answerButtons = answerOptions.querySelectorAll("button");

    if (selectedAnswer === item.answer) {

        answerButtons.forEach(button => {
            button.disabled = true;
        });

        selectedButton.classList.add("correct-answer");

        item.collected = true;

        inventory[item.name]++;
        collectedCount++;
        score += 100;

        answerFeedback.textContent =
            "Correct! " + item.fact + " You earned 100 points!";

        answerFeedback.className = "correct";

        gameMessage.textContent =
            item.name + " collected! Great work!";

        journalEntries.push({
            name: item.name,
            level: levels[currentLevel].name,
            fact: item.fact
        });

        updateDisplay();

        if (getArtifacts().every(artifact => artifact.collected)) {
            answerFeedback.textContent +=
                " You found all five treasures in this level!";
        }

        continueButton.textContent = "Continue Adventure";
        continueButton.hidden = false;

    } else {

        selectedButton.classList.add("incorrect-answer");

        answerFeedback.textContent =
            "Not quite! Try again. Hint: " + item.fact;

        answerFeedback.className = "incorrect";

    }

}


// CONTINUE BUTTON

continueButton.addEventListener("click", function() {

    questionPanel.hidden = true;

    questionActive = false;
    activeArtifact = null;

    answerOptions.innerHTML = "";
    answerFeedback.textContent = "";

    questionImage.style.display = "block";

    keys = {};

    const levelComplete = getArtifacts().every(item => item.collected);

    if (levelComplete) {

        if (currentLevel < levels.length - 1) {

            currentLevel++;

            player.x = 70;
            player.y = groundY - player.height;
            player.velocityY = 0;
            player.jumping = false;

            cameraX = 0;

            updateLevelDisplay();

            gameMessage.textContent =
                "Level complete! Welcome to " + levels[currentLevel].name + "!";

        } else {

            winGame();
            return;

        }

    } else {

        gameMessage.textContent =
            "Keep exploring and collect the remaining treasures!";

    }

    gameLoop();

});


// COLLISIONS

function checkCollisions() {

    if (questionActive) return;

    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;

    getArtifacts().forEach(item => {

        if (item.collected) return;

        const distance = Math.hypot(
            playerCenterX - item.x,
            playerCenterY - 340
        );

        if (distance < 35) {
            collectArtifact(item);
        }

    });

    if (questionActive) return;

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
                "You hit a stone barrier! Jump over obstacles next time.";

            updateDisplay();

            if (lives <= 0) {
                endGame();
            }

        }

    });

}


// JOURNAL

journalButton.addEventListener("click", openJournal);

function openJournal() {

    if (!gameRunning || questionActive || journalOpen) return;

    keys = {};
    journalOpen = true;

    const panel = document.createElement("section");

    panel.className = "journal-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");

    const heading = document.createElement("h2");
    heading.textContent = "Ancient Egyptian History Journal";

    panel.appendChild(heading);

    if (journalEntries.length === 0) {

        const message = document.createElement("p");

        message.textContent =
            "Your journal is empty. Collect treasures to discover historical facts!";

        panel.appendChild(message);

    } else {

        journalEntries.forEach(entry => {

            const entryBox = document.createElement("div");
            entryBox.className = "journal-entry";

            const title = document.createElement("h3");
            title.textContent = entry.name + " - " + entry.level;

            const fact = document.createElement("p");
            fact.textContent = entry.fact;

            entryBox.appendChild(title);
            entryBox.appendChild(fact);

            panel.appendChild(entryBox);

        });

    }

    const closeButton = document.createElement("button");

    closeButton.textContent = "Return to Adventure";

    closeButton.addEventListener("click", function() {

        panel.remove();
        journalOpen = false;

        gameLoop();

    });

    panel.appendChild(closeButton);
    gameScreen.appendChild(panel);

    closeButton.focus();

}


// UPDATE DISPLAY

function updateDisplay() {

    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    artifactsDisplay.textContent = collectedCount;

    ankhDisplay.textContent = inventory.Ankh;
    papyrusDisplay.textContent = inventory.Papyrus;
    scarabDisplay.textContent = inventory.Scarab;

    treasuresDisplay.textContent = collectedCount;

}


// END SCREEN

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
        "Treasures Collected: " + collectedCount + " / 15";

    const returnButton = document.createElement("button");
    returnButton.textContent = "Return to Main Menu";

    returnButton.addEventListener("click", function() {

        panel.remove();
        currentEndPanel = null;

        endPanelOpen = false;
        gameRunning = false;

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
        "Your journey through Ancient Egypt has ended. Try again to discover all the treasures!"
    );

}


// WIN GAME

function winGame() {

    gameRunning = false;

    cancelAnimationFrame(animationId);

    score += 200;

    updateDisplay();

    showEndPanel(
        "Secrets of Ancient Egypt Uncovered!",
        "Congratulations! You completed all three levels, collected 15 treasures, and discovered fascinating facts about Ancient Egypt. You earned 200 bonus points!"
    );

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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();

    drawBackground();
    drawObstacles();
    drawArtifacts();
    drawPlayer();

    checkCollisions();

    if (
        gameRunning &&
        !questionActive &&
        !journalOpen &&
        !endPanelOpen
    ) {
        animationId = requestAnimationFrame(gameLoop);
    }

}
