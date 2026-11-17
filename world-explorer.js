
// WORLD EXPLORER - Assignment 13
// Interactive travel adventure game

const destinations = [
    {
        country: "Japan",
        flag: "🇯🇵",
        landmarks: [
            {
                name: "Mount Fuji",
                icon: "🗻",
                fact: "Mount Fuji is Japan's tallest mountain and an important cultural symbol."
            },
            {
                name: "Tokyo",
                icon: "🏙️",
                fact: "Tokyo is Japan's capital and one of the world's largest metropolitan areas."
            },
            {
                name: "Cherry Blossoms",
                icon: "🌸",
                fact: "Cherry blossom season is celebrated throughout Japan every spring."
            }
        ],
        matches: [
            { icon: "🍣", name: "Sushi" },
            { icon: "⛩️", name: "Shrine" },
            { icon: "🥋", name: "Martial Arts" }
        ]
    },
    {
        country: "Egypt",
        flag: "🇪🇬",
        landmarks: [
            {
                name: "Pyramids of Giza",
                icon: "🔺",
                fact: "The Great Pyramid of Giza is one of the Seven Wonders of the Ancient World."
            },
            {
                name: "River Nile",
                icon: "🌊",
                fact: "The Nile River has supported communities and agriculture in Egypt for thousands of years."
            },
            {
                name: "Great Sphinx",
                icon: "🗿",
                fact: "The Great Sphinx is an ancient monument with a lion's body and a human head."
            }
        ],
        matches: [
            { icon: "🐪", name: "Camel" },
            { icon: "🏺", name: "Ancient Pottery" },
            { icon: "🌴", name: "Oasis" }
        ]
    },
    {
        country: "Brazil",
        flag: "🇧🇷",
        landmarks: [
            {
                name: "Christ the Redeemer",
                icon: "🗽",
                fact: "This famous statue overlooks Rio de Janeiro from Mount Corcovado."
            },
            {
                name: "Amazon Rainforest",
                icon: "🌳",
                fact: "The Amazon is the world's largest tropical rainforest."
            },
            {
                name: "Iguazu Falls",
                icon: "💧",
                fact: "Iguazu Falls is a spectacular waterfall system on the border of Brazil and Argentina."
            }
        ],
        matches: [
            { icon: "⚽", name: "Football" },
            { icon: "🎭", name: "Carnival" },
            { icon: "🥁", name: "Samba" }
        ]
    },
    {
        country: "France",
        flag: "🇫🇷",
        landmarks: [
            {
                name: "Eiffel Tower",
                icon: "🗼",
                fact: "The Eiffel Tower was completed in 1889 for the World's Fair in Paris."
            },
            {
                name: "Louvre Museum",
                icon: "🖼️",
                fact: "The Louvre is one of the world's most visited art museums."
            },
            {
                name: "Palace of Versailles",
                icon: "🏰",
                fact: "The Palace of Versailles was once the home of French kings."
            }
        ],
        matches: [
            { icon: "🥐", name: "Croissant" },
            { icon: "🧀", name: "Cheese" },
            { icon: "🎨", name: "Art" }
        ]
    },
    {
        country: "Italy",
        flag: "🇮🇹",
        landmarks: [
            {
                name: "Colosseum",
                icon: "🏛️",
                fact: "The Colosseum in Rome hosted public events and gladiator contests in ancient times."
            },
            {
                name: "Leaning Tower of Pisa",
                icon: "🗼",
                fact: "The Tower of Pisa is famous for its unintended tilt."
            },
            {
                name: "Venice",
                icon: "🚤",
                fact: "Venice is famous for its canals and traditional gondola boats."
            }
        ],
        matches: [
            { icon: "🍕", name: "Pizza" },
            { icon: "🍝", name: "Pasta" },
            { icon: "🍨", name: "Gelato" }
        ]
    }
];

let currentCountry = 0;
let score = 0;
let completedCountries = [];
let discoveredLandmarks = [];
let matchedItems = [];
let selectedItem = null;
let gameStarted = false;

const gamePanel = document.getElementById("adventure-panel");

const scoreDisplay = document.getElementById("score");
const completedDisplay = document.getElementById("countries-completed");
const stampDisplay = document.getElementById("stamp-count");

const startButton = document.getElementById("start-button");

startButton.addEventListener("click", startAdventure);

// Start the adventure
function startAdventure() {
    currentCountry = 0;
    score = 0;
    completedCountries = [];
    discoveredLandmarks = [];
    matchedItems = [];
    selectedItem = null;
    gameStarted = true;

    updateStats();
    updateMap();

    gamePanel.innerHTML = `
        <h2>🚀 Adventure Started!</h2>
        <p>Your first destination is Japan!</p>
        <p>Click Japan on the map to begin exploring.</p>
    `;

    document.getElementById("destination-0").focus();
}

// Update the score and passport information
function updateStats() {
    scoreDisplay.textContent = score;
    completedDisplay.textContent =
        `${completedCountries.length} / ${destinations.length}`;
    stampDisplay.textContent = completedCountries.length;
}

// Unlock destinations as the player progresses
function updateMap() {
    destinations.forEach((destination, index) => {
        const button = document.getElementById(`destination-${index}`);
        const unlocked = index <= completedCountries.length;

        button.disabled = !unlocked;
        button.classList.toggle("locked", !unlocked);

        button.textContent = unlocked
            ? `${destination.flag} ${destination.country}`
            : `🔒 ${destination.country}`;
    });
}

// Open a destination
destinations.forEach((destination, index) => {
    document
        .getElementById(`destination-${index}`)
        .addEventListener("click", () => {
            if (!gameStarted) {
                gamePanel.innerHTML =
                    "<h2>Start your adventure first!</h2>";
                return;
            }

            if (index > completedCountries.length) {
                return;
            }

            currentCountry = index;
            discoveredLandmarks = [];
            matchedItems = [];
            selectedItem = null;

            showDestination();
        });
});

// Display destination information
function showDestination() {
    const destination = destinations[currentCountry];

    gamePanel.innerHTML = `
        <h2>${destination.flag} Welcome to ${destination.country}!</h2>
        <p>Explore all three landmarks to continue your adventure.</p>
        <div id="landmark-list" class="landmark-list"></div>
        <p id="explore-progress">Landmarks discovered: 0 / 3</p>
    `;

    const list = document.getElementById("landmark-list");

    destination.landmarks.forEach((landmark, index) => {
        const button = document.createElement("button");

        button.className = "landmark-button";
        button.innerHTML = `${landmark.icon}<br>${landmark.name}`;

        button.addEventListener("click", () => {
            discoverLandmark(index);
        });

        list.appendChild(button);
    });
}

// Discover a landmark and reveal its fact
function discoverLandmark(index) {
    if (discoveredLandmarks.includes(index)) {
        return;
    }

    const landmark = destinations[currentCountry].landmarks[index];

    discoveredLandmarks.push(index);
    score += 10;

    updateStats();

    const fact = document.createElement("p");
    fact.className = "landmark-fact";
    fact.textContent = `💡 ${landmark.fact}`;

    gamePanel.appendChild(fact);

    document.getElementById("explore-progress").textContent =
        `Landmarks discovered: ${discoveredLandmarks.length} / 3`;

    if (discoveredLandmarks.length === 3) {
        const continueButton = document.createElement("button");

        continueButton.textContent = "Start Matching Challenge →";
        continueButton.addEventListener("click", showMatchingGame);

        gamePanel.appendChild(continueButton);
    }
}

// Memory matching mini-game
function showMatchingGame() {
    const destination = destinations[currentCountry];

    // Each pair contains an icon and its matching name
    const cards = [];

    destination.matches.forEach((item, index) => {
        cards.push({
            value: item.name,
            display: item.icon,
            pair: index
        });

        cards.push({
            value: item.name,
            display: item.name,
            pair: index
        });
    });

    // Shuffle the cards
    cards.sort(() => Math.random() - 0.5);

    matchedItems = [];
    selectedItem = null;

    gamePanel.innerHTML = `
        <h2>🧩 ${destination.country} Matching Challenge</h2>
        <p>Find each matching pair! Match the picture with its name.</p>
        <div id="matching-board" class="matching-board"></div>
        <p id="match-progress">Pairs found: 0 / 3</p>
        <p id="match-feedback" aria-live="polite"></p>
    `;

    const board = document.getElementById("matching-board");

    cards.forEach((card, index) => {
        const button = document.createElement("button");

        button.className = "match-card";
        button.textContent = card.display;

        button.addEventListener("click", () => {
            selectMatch(button, card, index);
        });

        board.appendChild(button);
    });
}

// Select matching cards
function selectMatch(button, card, index) {
    if (
        button.disabled ||
        (selectedItem && selectedItem.index === index)
    ) {
        return;
    }

    if (!selectedItem) {
        selectedItem = { button, card, index };
        button.classList.add("selected");
        document.getElementById("match-feedback").textContent =
            "Now select its matching name!";
        return;
    }

    if (selectedItem.card.pair === card.pair) {
        selectedItem.button.disabled = true;
        button.disabled = true;

        selectedItem.button.classList.add("matched");
        button.classList.add("matched");

        matchedItems.push(card.pair);
        score += 20;

        document.getElementById("match-feedback").textContent =
            "Great match! You earned 20 points.";

        selectedItem = null;
        updateStats();

        document.getElementById("match-progress").textContent =
            `Pairs found: ${matchedItems.length} / 3`;

        if (matchedItems.length === 3) {
            const finishButton = document.createElement("button");

            finishButton.textContent = "Complete Destination 🏆";
            finishButton.addEventListener("click", completeDestination);

            gamePanel.appendChild(finishButton);
        }
    } else {
        document.getElementById("match-feedback").textContent =
            "Not a match. Try another card!";

        selectedItem.button.classList.remove("selected");
        selectedItem = null;
    }
}

// Complete a country and award a passport stamp
function completeDestination() {
    const destination = destinations[currentCountry];

    completedCountries.push(currentCountry);

    const stamp = document.createElement("div");
    stamp.className = "stamp";
    stamp.textContent = `${destination.flag} ${destination.country}`;

    const passport = document.getElementById("passport-stamps");

    if (completedCountries.length === 1) {
        passport.innerHTML = "";
    }

    passport.appendChild(stamp);

    updateStats();
    updateMap();

    if (completedCountries.length === destinations.length) {
        showFinalResults();
        return;
    }

    gamePanel.innerHTML = `
        <h2>🏆 Destination Completed!</h2>
        <p>You successfully explored ${destination.country}!</p>
        <p>You earned a passport stamp and unlocked your next destination.</p>
        <button id="continue-journey">Continue Your Journey 🌎</button>
    `;

    document
        .getElementById("continue-journey")
        .addEventListener("click", () => {
            currentCountry = completedCountries.length;
            showDestination();
        });
}

// Final results
function showFinalResults() {
    gamePanel.innerHTML = `
        <h2>🎉 World Explorer Champion!</h2>
        <p>You explored all five countries!</p>
        <h3>⭐ Final Score: ${score}</h3>
        <p>🌍 Countries completed: 5 / 5</p>
        <p>🎟️ Passport stamps collected: 5</p>
        <p>Congratulations on completing your world adventure!</p>
        <button id="play-again">Play Again 🔄</button>
    `;

    document
        .getElementById("play-again")
        .addEventListener("click", startAdventure);
}
