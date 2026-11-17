
 // ========================================
 // WORLD EXPLORER - ASSIGNMENT 13
 // Interactive Travel Adventure Game
 // ========================================

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

// ========================================
// GAME VARIABLES
// ========================================

let currentCountry = 0;
let score = 0;
let completedCountries = [];
let discoveredLandmarks = [];
let matchedPairs = [];
let selectedCards = [];
let cardsLocked = false;
let gameStarted = false;

const gamePanel = document.getElementById("adventure-panel");
const scoreDisplay = document.getElementById("score");
const completedDisplay = document.getElementById("countries-completed");
const stampDisplay = document.getElementById("stamp-count");
const startButton = document.getElementById("start-button");

// ========================================
// INTERACTIVE WORLD MAP
// ========================================

let worldMap;
let mapMarkers = [];

const countryLocations = [
    { lat: 36.2048, lng: 138.2529 },
    { lat: 26.8206, lng: 30.8025 },
    { lat: -14.2350, lng: -51.9253 },
    { lat: 46.2276, lng: 2.2137 },
    { lat: 41.8719, lng: 12.5674 }
];

function initializeWorldMap() {

    worldMap = L.map("world-map").setView([20, 10], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(worldMap);

    updateMapMarkers();
}

function updateMapMarkers() {

    if (!worldMap) return;

    mapMarkers.forEach(marker => {
        worldMap.removeLayer(marker);
    });

    mapMarkers = [];

    destinations.forEach((destination, index) => {

        const location = countryLocations[index];

        const completed = completedCountries.includes(index);
        const unlocked = index === completedCountries.length;

        let markerClass = "destination-marker";
        let label = `${destination.flag} ${destination.country}`;

        if (completed) {
            markerClass += " completed";
            label = `✅ ${destination.country}`;
        } else if (!unlocked) {
            markerClass += " locked";
            label = `🔒 ${destination.country}`;
        }

        const customIcon = L.divIcon({
            className: "",
            html: `<div class="${markerClass}">${label}</div>`,
            iconSize: [130, 40],
            iconAnchor: [65, 20]
        });

        const marker = L.marker(
            [location.lat, location.lng],
            { icon: customIcon }
        ).addTo(worldMap);

        if (gameStarted && unlocked) {

            marker.on("click", () => {

                currentCountry = index;

                discoveredLandmarks = [];
                matchedPairs = [];
                selectedCards = [];
                cardsLocked = false;

                showDestination();
            });

        } else {

            marker.on("click", () => {
                marker.openPopup();
            });

        }

        marker.bindPopup(
            `<strong>${destination.flag} ${destination.country}</strong>`
        );

        mapMarkers.push(marker);
    });
}

// ========================================
// START GAME
// ========================================

startButton.addEventListener("click", startAdventure);

function startAdventure() {

    currentCountry = 0;
    score = 0;
    completedCountries = [];
    discoveredLandmarks = [];
    matchedPairs = [];
    selectedCards = [];
    cardsLocked = false;
    gameStarted = true;

    document.getElementById("passport-stamps").innerHTML =
        "<p>No stamps collected yet. Your journey awaits!</p>";

    updateStats();
    updateMapMarkers();

    gamePanel.innerHTML = `
        <h2>🚀 Adventure Started!</h2>
        <p>Your first destination is Japan!</p>
        <p>Click Japan on the map to begin exploring.</p>
    `;
}

// ========================================
// UPDATE PLAYER STATISTICS
// ========================================

function updateStats() {

    scoreDisplay.textContent = score;

    completedDisplay.textContent =
        `${completedCountries.length} / ${destinations.length}`;

    stampDisplay.textContent = completedCountries.length;
}

// ========================================
// SHOW DESTINATION
// ========================================

function showDestination() {

    const destination = destinations[currentCountry];

    gamePanel.innerHTML = `
        <h2>${destination.flag} Welcome to ${destination.country}!</h2>

        <p>Explore all three landmarks to continue your adventure.</p>

        <div id="landmark-list" class="landmark-list"></div>

        <p id="explore-progress">
            Landmarks discovered: 0 / 3
        </p>
    `;

    const list = document.getElementById("landmark-list");

    destination.landmarks.forEach((landmark, index) => {

        const button = document.createElement("button");

        button.className = "landmark-button";

        button.innerHTML = `
            ${landmark.icon}<br>
            ${landmark.name}
        `;

        button.addEventListener("click", () => {
            discoverLandmark(index);
        });

        list.appendChild(button);
    });
}

// ========================================
// DISCOVER LANDMARKS
// ========================================

function discoverLandmark(index) {

    if (discoveredLandmarks.includes(index)) {
        return;
    }

    const destination = destinations[currentCountry];
    const landmark = destination.landmarks[index];

    discoveredLandmarks.push(index);

    score += 10;
    updateStats();

    const fact = document.createElement("p");

    fact.className = "landmark-fact";
    fact.textContent = `💡 ${landmark.fact}`;

    gamePanel.insertBefore(
        fact,
        document.getElementById("explore-progress")
    );

    document.getElementById("explore-progress").textContent =
        `Landmarks discovered: ${discoveredLandmarks.length} / 3`;

    const buttons = document.querySelectorAll(".landmark-button");

    buttons[index].disabled = true;
    buttons[index].textContent = `✅ ${landmark.name}`;

    if (discoveredLandmarks.length === 3) {

        const continueButton = document.createElement("button");

        continueButton.textContent =
            "Start Matching Challenge →";

        continueButton.addEventListener("click", showMatchingGame);

        gamePanel.appendChild(continueButton);
    }
}

// ========================================
// MATCHING MINI-GAME
// ========================================

function showMatchingGame() {

    const destination = destinations[currentCountry];

    const cards = [];

    destination.matches.forEach((item, index) => {

        cards.push({
            display: item.icon,
            pair: index
        });

        cards.push({
            display: item.name,
            pair: index
        });
    });

    cards.sort(() => Math.random() - 0.5);

    matchedPairs = [];
    selectedCards = [];
    cardsLocked = false;

    gamePanel.innerHTML = `
        <h2>🧩 ${destination.country} Matching Challenge</h2>

        <p>Flip the cards and find all three matching pairs!</p>

        <div id="matching-board" class="matching-board"></div>

        <p id="match-progress">Pairs found: 0 / 3</p>

        <p id="match-feedback" aria-live="polite"></p>
    `;

    const board = document.getElementById("matching-board");

    cards.forEach((card, index) => {

        const button = document.createElement("button");

        button.className = "match-card";
        button.textContent = "❓";

        button.addEventListener("click", () => {
            flipCard(button, card, index);
        });

        board.appendChild(button);
    });
}

// ========================================
// FLIP MATCHING CARDS
// ========================================

function flipCard(button, card, index) {

    if (
        cardsLocked ||
        button.disabled ||
        selectedCards.some(item => item.index === index)
    ) {
        return;
    }

    button.textContent = card.display;
    button.classList.add("selected");

    selectedCards.push({
        button: button,
        pair: card.pair,
        index: index
    });

    if (selectedCards.length === 2) {

        cardsLocked = true;

        const firstCard = selectedCards[0];
        const secondCard = selectedCards[1];

        if (firstCard.pair === secondCard.pair) {

            firstCard.button.disabled = true;
            secondCard.button.disabled = true;

            firstCard.button.classList.remove("selected");
            secondCard.button.classList.remove("selected");

            firstCard.button.classList.add("matched");
            secondCard.button.classList.add("matched");

            matchedPairs.push(firstCard.pair);

            score += 20;
            updateStats();

            document.getElementById("match-feedback").textContent =
                "🎉 Great match! You earned 20 points.";

            document.getElementById("match-progress").textContent =
                `Pairs found: ${matchedPairs.length} / 3`;

            selectedCards = [];
            cardsLocked = false;

            if (matchedPairs.length === 3) {

                const finishButton = document.createElement("button");

                finishButton.textContent =
                    "Complete Destination 🏆";

                finishButton.addEventListener("click", completeDestination);

                gamePanel.appendChild(finishButton);
            }

        } else {

            document.getElementById("match-feedback").textContent =
                "Not a match! Try again.";

            const first = firstCard;
            const second = secondCard;

            setTimeout(() => {

                first.button.textContent = "❓";
                second.button.textContent = "❓";

                first.button.classList.remove("selected");
                second.button.classList.remove("selected");

                selectedCards = [];
                cardsLocked = false;

            }, 900);
        }
    }
}

// ========================================
// COMPLETE DESTINATION
// ========================================

function completeDestination() {

    const destination = destinations[currentCountry];

    completedCountries.push(currentCountry);

    const passport = document.getElementById("passport-stamps");

    if (completedCountries.length === 1) {
        passport.innerHTML = "";
    }

    const stamp = document.createElement("div");

    stamp.className = "stamp";
    stamp.textContent = `${destination.flag} ${destination.country}`;

    passport.appendChild(stamp);

    updateStats();
    updateMapMarkers();

    if (completedCountries.length === destinations.length) {
        showFinalResults();
        return;
    }

    gamePanel.innerHTML = `
        <h2>🏆 Destination Completed!</h2>

        <p>You successfully explored ${destination.country}!</p>

        <p>You earned a passport stamp and unlocked your next destination.</p>

        <p>Return to the world map and select your next country!</p>
    `;
}

// ========================================
// FINAL RESULTS
// ========================================

function showFinalResults() {

    gamePanel.innerHTML = `
        <h2>🎉 World Explorer Champion!</h2>

        <p>You explored all five countries!</p>

        <h3>⭐ Final Score: ${score}</h3>

        <p>🌍 Countries completed: 5 / 5</p>

        <p>🎟️ Passport stamps collected: 5</p>

        <p>Congratulations on completing your world adventure!</p>

        <button id="play-again">
            Play Again 🔄
        </button>
    `;

    document
        .getElementById("play-again")
        .addEventListener("click", startAdventure);
}

// ========================================
// LOAD THE WORLD MAP
// ========================================

initializeWorldMap();
