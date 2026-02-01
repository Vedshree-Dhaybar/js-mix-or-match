const time = document.querySelector(".time span");
const flips = document.querySelector(".flips span");

const title = document.querySelector(".title");

const cardsList = document.querySelector(".cards");

let flippedCards = [];

let flipsCount = 0;
let timeCount = 100;
let matchedCount = 0;

let result = [];

function renderCards() {
    function getRandomTwiceNumbers() {
        // Step 1: Create array with numbers 1–8 appearing twice
        let arr = [];
        for (let i = 1; i <= 8; i++) {
            arr.push(i, i);  // push twice
        }
        // Step 2: Shuffle the array (Fisher–Yates shuffle)
        arr.sort(() => Math.random() - 0.5);

        return arr;
    }

    result = getRandomTwiceNumbers();

    for (let i = 0; i < 16; i++) {
        cardsList.innerHTML += `
        <div class="card-container"> 
            <div class="card">
                <div class="front"><img src="assets/card-bg.jpg"></div>
                <div class="back"><img src="assets/elem${result[i]}-removebg-preview.png"></div>
            </div>
        </div>
    `;
    }

    console.log(result);
}

renderCards();

function restartGame() {
    flipsCount = 0;
    timeCount = 100;
    flippedCards = [];
    matchedCount = 0;

    flips.textContent = 0;
    time.textContent = 100;

    cardsList.innerHTML = "";

    renderCards();

    addCardListeners();
}

function addCardListeners() {
    const cards = document.querySelectorAll(".card");

    cards.forEach((card, i) => card.addEventListener("click", () => {

        flipsCount++;
        flips.textContent = flipsCount;

        gsap.to(card, {
            rotationY: 180,
            duration: 0.2,
            ease: "power1.out"
        })

        card.style.pointerEvents = "none";
        card.style.cursor = "default";

        const flipped = { id: i, flip: true, matched: false };
        if (flippedCards.length < 2) {
            flippedCards.push(flipped);
        }

        console.log(flippedCards);

        if (flippedCards.length === 2) {
            matchCards();
        }
    }
    ))

}


function matchCards() {
    const cards = document.querySelectorAll(".card");


    let card1 = flippedCards[0];
    let card2 = flippedCards[1];

    if (result[card1.id] === result[card2.id]) {
        card1.matched = true;
        card2.matched = true;

        matchedCount += 2;

    } else {
        setTimeout(() => {
            cards[card1.id].style.pointerEvents = "auto";
            cards[card2.id].style.pointerEvents = "auto";

            gsap.to(cards[card1.id], {
                rotationY: 0,
                duration: 0.2,
                ease: "power1.out"
            });

            gsap.to(cards[card2.id], {
                rotationY: 0,
                duration: 0.2,
                ease: "power1.out"
            });

        }, 600);

    }

    flippedCards.length = 0;

    if (matchedCount === 16) {
        gameWin();
    }
}

function timer() {
    timerInterval = setInterval(() => {
        timeCount--;
        time.textContent = timeCount;
        if (timeCount <= 0) {
            clearInterval(timerInterval);
            title.querySelector("h1").textContent = "Time's Up";
            title.querySelector("h2").textContent = "Click to Restart";
            title.style.display = "initial";
            document.querySelector(".blur-layer").style.display = "initial";
        }
    }, 1000);
}

function gameWin() {
    title.querySelector("h1").textContent = "Victory";
    title.querySelector("h2").textContent = "Click to Restart";
    title.style.display = "initial";
    document.querySelector(".blur-layer").style.display = "initial";
}

title.addEventListener("click", () => {
    timer();

    title.style.display = "none";
    document.querySelector(".blur-layer").style.display = "none";

    addCardListeners();

    if (title.querySelector("h2").textContent === "Click to Restart") {
        restartGame();
    }
});
