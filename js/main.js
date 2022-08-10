/*
    Advices
    - Always Check The Console
    - Take Your Time To Name The Identifiers
    - DRY

    Steps To Create The Project
    [01] Create HTML Markup
    [02] Add Styling And Separate From Logic
    [03] Create The App Logic
    ---- [01] Add Levels
    ---- [02] Show Level And Seconds
    ---- [03] Add Array Of Words
    ---- [04] ِAdd Start Game Button
    ---- [05] Generate Upcoming Words
    ---- [06] Disable Copy Word And Paste Event + Focus On Input
    ---- [07] Start Play Function
    ---- [08] Start The Time And Count Score
    ---- [09] Add The Error And Success Messages
    [04] Your Trainings To Add Features
    ---- [01] Save Score To Local Storage With Date (Done)
    ---- [02] Choose Levels From Select Box         (Done)
    ---- [03] Break The Logic To More Functions
    ---- [04] Choose Array Of Words For Every Level
    ---- [05] Write Game Instruction With Dynamic Values
    ---- [06] Add 3 Seconds For The First Word      (Done)
*/
// Global Variables
const lvls = {
    "Easy": 5,
    "Normal": 3,
    "Hard": 2
};
let started = false;
let defaultLevelName = "Normal"; // Change Level From Here
let defaultLevelSeconds = lvls[defaultLevelName];


// Array Of Words
const words = [
    "Hello",
    "Code",
    "Programming",
    "Javascript",
    "Town",
    "Country",
    "Testing",
    "Youtube",
    "Linkedin",
    "Twitter",
    "Github",
    "Leetcode",
    "Internet",
    "Python",
    "Scala",
    "Destructuring",
    "Paradigm",
    "Styling",
    "Cascade",
    "Documentation",
    "Coding",
    "Funny",
    "Working",
    "Dependencies",
    "Task",
    "Runner",
    "Roles",
    "Test",
    "Rust",
    "Playing"
];

// Setting Levels


// Catch Selectors
let startButton = document.querySelector(".start");
let level = document.querySelector(".level");
let levelSpan = document.querySelectorAll(".level span");
let lvlNameSpan = document.querySelector(".message .lvl");
let secondsSpan = document.querySelector(".message .seconds");
let theWord = document.querySelector(".the-word");
let upcomingWords = document.querySelector(".upcoming-words");
let input = document.querySelector(".input");
let timeLeftSpan = document.querySelector(".time span");
let scoreGot = document.querySelector(".score .got");
let scoreTotal = document.querySelector(".score .total");
let finishMessage = document.querySelector(".finish");


// Choose Level
levelSpan.forEach(function (span) {
    span.addEventListener("click", function () {
        level.value = this.innerHTML;
        lvlNameSpan.innerText = span.innerText;
        secondsSpan.innerText = lvls[span.innerText];
        timeLeftSpan.innerHTML = lvls[span.innerText];
        defaultLevelSeconds = lvls[span.innerText];
        defaultLevelName = span.innerText;

        // Change class of span (active)
        levelSpan.forEach(function (span) {
            span.classList.remove("active");
        }
        );
        this.classList.add("active");
    });

}
);



// Setting Level Name + Seconds + Score
lvlNameSpan.innerHTML = defaultLevelName;
secondsSpan.innerHTML = defaultLevelSeconds;
timeLeftSpan.innerHTML = defaultLevelSeconds;
scoreTotal.innerHTML = words.length;

// Disable Paste Event
input.onpaste = function () {
    return false;
}

// Start Game
startButton.onclick = function () {
    this.remove();
    input.focus();
    level.classList.add("no-clicking");
    // Generate Word Function
    genWords();
}

function genWords() {
    // Get Random Word From Array
    let randomWord = words[Math.floor(Math.random() * words.length)];
    // Get Word Index
    let wordIndex = words.indexOf(randomWord);
    // Remove WordFrom Array
    words.splice(wordIndex, 1);
    // Show The Random Word
    theWord.innerHTML = randomWord;
    // Empty Upcoming Words
    upcomingWords.innerHTML = '';
    // Generate Words
    for (let i = 0; i < words.length; i++) {
        // Create Div Element
        let div = document.createElement("div");
        let txt = document.createTextNode(words[i]);
        div.appendChild(txt);
        upcomingWords.appendChild(div);
    }
    // Call Start Play Function
    startPlay();
    }

function startPlay() {


    timeLeftSpan.innerHTML = defaultLevelSeconds;

    let start = setInterval(() => {
        input.oninput = function () {
            started = true;
        }
        if (started) {

            timeLeftSpan.innerHTML--;

            if (timeLeftSpan.innerHTML === "0"||input.value[input.value.length - 1]===" ") {
                // Stop Timer
                clearInterval(start);
                // Compare Words
                if (theWord.innerHTML.toLowerCase() === input.value.toLowerCase().trim()) {
                    // Empty Input Field
                    input.value = '';
                    // Increase Score
                    scoreGot.innerHTML++;
                    if (words.length > 0) {
                        // Call Generate Word Function
                        genWords();
                    } else {
                        // Create Span Finish
                        createSpan("good", "You Won!");

                        // Remove Upcoming Words Box
                        upcomingWords.remove();
                        saveScore();

                    }
                } else {
                    if (breakRecords(defaultLevelName)) 
                        createSpan("bad", " <i class=\"fa-solid fa-crown new-record\"></i> Game Over");
                    else
                        createSpan("bad", "Game Over");
                    saveScore();

                }

            }
        }

    }, 1000);
}

// Save Score To Local Storage With Date
function saveScore() {
    let score = {
        "date": new Date().toLocaleDateString(),
        "level": defaultLevelName,
        "score": scoreGot.innerHTML
    }
    let scores = JSON.parse(localStorage.getItem("scores"));
    if (scores === null) {
        scores = [];
    }
    scores.push(score);
    localStorage.setItem("scores", JSON.stringify(scores));
}

// break records 
function breakRecords(level) {
    let scores = JSON.parse(localStorage.getItem("scores"));
    let maxScore = 0;
    if (scores !== null) {
        scores.forEach(function (score) {
            if (score.level === level) {
                maxScore = score.score;
            }
        }
        );
        if (maxScore < parseInt(scoreGot.innerHTML)) {
            return true;
        }
        return false;
    }
    return true;
}

// Create Span Finish function
function createSpan(className, text) {
    let span = document.createElement("span");
    span.className = className;
    span.innerHTML = `${text}`;
    finishMessage.appendChild(span);
}