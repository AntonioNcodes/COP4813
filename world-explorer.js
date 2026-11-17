
// World Explorer - Assignment 13

const destinations = [
    {
        country: "Japan",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Mt_Fuji.jpg?width=1200",
        flag: "🇯🇵",
        questions: [
            {
                category: "Geography",
                question: "What is the capital of Japan?",
                answers: ["Tokyo", "Kyoto", "Osaka"],
                correct: "Tokyo"
            },
            {
                category: "History",
                question: "Which Japanese city is famous for its historic temples and shrines?",
                answers: ["Sapporo", "Kyoto", "Nagoya"],
                correct: "Kyoto"
            },
            {
                category: "Culture",
                question: "Which food is traditionally made with vinegared rice?",
                answers: ["Tacos", "Sushi", "Pasta"],
                correct: "Sushi"
            }
        ],
        souvenir: "Japanese Passport Stamp 🇯🇵"
    },
    {
        country: "Egypt",
        flag: "🇪🇬",
        questions: [
            {
                category: "Geography",
                question: "Which river flows through Egypt?",
                answers: ["Amazon", "Nile", "Mississippi"],
                correct: "Nile"
            },
            {
                category: "History",
                question: "Which ancient structures are found at Giza?",
                answers: ["Pyramids", "Colosseum", "Stonehenge"],
                correct: "Pyramids"
            },
            {
                category: "Culture",
                question: "Which food is a popular Egyptian dish made with rice, pasta, and lentils?",
                answers: ["Koshari", "Sushi", "Paella"],
                correct: "Koshari"
            }
        ],
        souvenir: "Egyptian Passport Stamp 🇪🇬"
    },
    {
        country: "Brazil",
        flag: "🇧🇷",
        questions: [
            {
                category: "Geography",
                question: "What is the largest country in South America?",
                answers: ["Chile", "Brazil", "Peru"],
                correct: "Brazil"
            },
            {
                category: "History",
                question: "Which famous Brazilian city is home to the Christ the Redeemer statue?",
                answers: ["Rio de Janeiro", "Brasília", "Salvador"],
                correct: "Rio de Janeiro"
            },
            {
                category: "Culture",
                question: "Which Brazilian celebration is famous for parades and samba?",
                answers: ["Carnival", "Oktoberfest", "Diwali"],
                correct: "Carnival"
            }
        ],
        souvenir: "Brazilian Passport Stamp 🇧🇷"
    },
    {
        country: "France",
        flag: "🇫🇷",
        questions: [
            {
                category: "Geography",
                question: "What is the capital of France?",
                answers: ["Lyon", "Paris", "Nice"],
                correct: "Paris"
            },
            {
                category: "History",
                question: "Which famous landmark stands in Paris?",
                answers: ["Eiffel Tower", "Big Ben", "Leaning Tower"],
                correct: "Eiffel Tower"
            },
            {
                category: "Culture",
                question: "Which pastry is especially associated with France?",
                answers: ["Croissant", "Doughnut", "Churro"],
                correct: "Croissant"
            }
        ],
        souvenir: "French Passport Stamp 🇫🇷"
    },
    {
        country: "Italy",
        flag: "🇮🇹",
        questions: [
            {
                category: "Geography",
                question: "Which Italian city is famous for its canals?",
                answers: ["Venice", "Milan", "Naples"],
                correct: "Venice"
            },
            {
                category: "History",
                question: "Which ancient Roman structure is a famous landmark in Rome?",
                answers: ["Colosseum", "Parthenon", "Acropolis"],
                correct: "Colosseum"
            },
            {
                category: "Culture",
                question: "Which food is traditionally associated with Naples?",
                answers: ["Pizza", "Sushi", "Curry"],
                correct: "Pizza"
            }
        ],
        souvenir: "Italian Passport Stamp 🇮🇹"
    }
];

let destinationIndex = 0;
let questionIndex = 0;
let score = 0;
let stamps = [];

const game = document.getElementById("game");

function startGame() {
    destinationIndex = 0;
    questionIndex = 0;
    score = 0;
    stamps = [];

    showQuestion();
}

function showQuestion() {
    const destination = destinations[destinationIndex];
    const question = destination.questions[questionIndex];

    game.innerHTML = `
        <h2>${destination.flag} Exploring ${destination.country}</h2>
        <p><strong>Destination:</strong> ${destinationIndex + 1} of ${destinations.length}</p>
        <p><strong>Category:</strong> ${question.category}</p>
        <p>${question.question}</p>
        <div id="answers"></div>
        <p id="feedback" aria-live="polite"></p>
        <p><strong>Score:</strong> ${score}</p>
        <p><strong>Passport Stamps:</strong> ${stamps.length}</p>
    `;

    const answers = document.getElementById("answers");

    question.answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer;
        button.style.margin = "5px";
        button.addEventListener("click", () => checkAnswer(answer));
        answers.appendChild(button);
    });
}

function checkAnswer(answer) {
    const question = destinations[destinationIndex].questions[questionIndex];
    const feedback = document.getElementById("feedback");
    const answerButtons = document.querySelectorAll("#answers button");

    answerButtons.forEach(button => {
        button.disabled = true;
    });

    if (answer === question.correct) {
        score += 10;
        feedback.textContent = "Correct! You earned 10 points. Great job!";
    } else {
        feedback.textContent = `Not quite! The correct answer is ${question.correct}.`;
    }

    const nextButton = document.createElement("button");
    nextButton.textContent = "Continue";
    nextButton.style.marginTop = "12px";
    nextButton.addEventListener("click", nextQuestion);

    game.appendChild(nextButton);
}

function nextQuestion() {
    questionIndex++;

    if (questionIndex < destinations[destinationIndex].questions.length) {
        showQuestion();
        return;
    }

    const destination = destinations[destinationIndex];
    stamps.push(destination.souvenir);

    destinationIndex++;

    if (destinationIndex < destinations.length) {
        showDestinationComplete();
    } else {
        showFinalResults();
    }
}

function showDestinationComplete() {
    const destination = destinations[destinationIndex - 1];

    game.innerHTML = `
        <h2>Destination Completed!</h2>
        <p>You explored ${destination.flag} ${destination.country}.</p>
        <p>You collected: ${destination.souvenir}</p>
        <p><strong>Current Score:</strong> ${score}</p>
        <button id="next-destination">Unlock Next Destination</button>
    `;

    document.getElementById("next-destination").addEventListener("click", () => {
        questionIndex = 0;
        showQuestion();
    });
}

function showFinalResults() {
    game.innerHTML = `
        <h2>Congratulations, World Explorer!</h2>
        <p>You visited all ${destinations.length} destinations!</p>
        <h3>Final Score: ${score} / ${destinations.length * 30}</h3>
        <h3>Your Passport Stamps</h3>
        <ul>${stamps.map(stamp => `<li>${stamp}</li>`).join("")}</ul>
        <button id="play-again">Play Again</button>
    `;

    document.getElementById("play-again").addEventListener("click", startGame);
}

document.getElementById("start-button").addEventListener("click", startGame);
