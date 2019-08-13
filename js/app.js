//variables for list of cards and the whole deck
const nodeListOfCards = document.querySelectorAll('.card');
const arrayOfCards = Array.prototype.slice.call(nodeListOfCards);
const deckOfAllCards = document.querySelector(".deck");

//variables for timer
let seconds = 0;
let minutes = 0;
const timer = document.querySelector('.timer');
let interval;

//function for starting timer
function startTimer() {
    interval = setInterval(function() {
        timer.innerHTML = minutes + ' mins ' + seconds + ' secs';
        seconds++;
        if (seconds == 60){
            minutes++;
            seconds = 0;
        }
    },1000);
};

//variables for move counter
const counter = document.querySelector('.moves');
let moves;
const arrayOfStars = document.querySelectorAll('i.fa-star');

//function for counting moves, starting timer on first move, and regulating star rating based on moves
function moveCounter() {
    moves++; 
    counter.innerHTML = moves;
    //start timer on first move
    if (moves === 1) {
        seconds = 0;
        minutes = 0; 
        startTimer();
    }
    //star rating based on moves
    if (moves > 16 && moves < 32) {
        for (i= 0; i < 3; i++) {
            if (i > 1){
                arrayOfStars[i].style.visibility = "collapse";
            }
        }
    }
    else if (moves > 32) {
        for (i= 0; i < 3; i++) {
            if (i > 0) {
                arrayOfStars[i].style.visibility = "collapse";
            }
        }
    }
}
//function for shuffling arrays
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};

//function for starting the game, which shuffles the deck and resets the move counter, star rating and timer
function startGame() {
    let shuffledCards = shuffle(arrayOfCards);
    for (let i= 0; i < shuffledCards.length; i++){
      shuffledCards.forEach(function(item) { // FOR EACH ITEM IN SHUFFLEDCARDS, APPEND THE ITEM TO THE DECKOFALLCARDS
        deckOfAllCards.appendChild(item);
      });
      shuffledCards[i].classList.remove('flipCard','disabled');
    };
    //reset moves
    moves = 0;
    counter.innerHTML = moves;
   //reset star rating
    for (var i= 0; i < arrayOfStars.length; i++){
        arrayOfStars[i].style.color = "#FFD700";
        arrayOfStars[i].style.visibility = "visible";
    }
    //reset stopwatch
    timer.innerHTML = '0 mins 0 secs';
    clearInterval(interval);
}

//start game
window.onload = startGame();

//variables for game
let flippedCard = false;
let lockBoard = false;
let firstChosenCard;
let secondChosenCard;

//in case it's not a match, "lock" the board so that we can't click on any other cards

//function for displaying the front side of the card and starting move count on the first chosen card
const displayFrontSide = function() {
    moveCounter();
    // when you're fipping a card, the rest of the board should be locked
    if (lockBoard) { //if board is not locked (if lockboard is false)
        return;
    } else {
        //console.log(this);
        this.classList.add('flipCard');
        this.classList.add('disabled');
        // need to know if the first card has been clicked or the second card
        if (!flippedCard) {
            flippedCard = true; //it is a flipped card
            firstChosenCard = this;
            //console.log({flippedCard, firstChosenCard});
        } else {
            flippedCard = false;
            secondChosenCard = this;
            checkForMatch();
        };
        // addCardToArrayOfOpenedCards(this);
        // console.log({firstChosenCard, secondChosenCard});
        // console.log(arrayOfOpenedCards);
    }
};

//function to check if the two flipped cards are a match

let matchedCards = [];
const checkForMatch = function() {
    if (firstChosenCard.dataset.name === secondChosenCard.dataset.name) {
        matchedCards.push(firstChosenCard.dataset.name);
        matchedCards.push(secondChosenCard.dataset.name);
        cardsMatch();
        //console.log("There are " + matchedCards + " cards in matchedCards.");
    } else {
        cardsDontMatch();
        //console.log('did this work part 2?');
    };
}

arrayOfCards.forEach(function(card) { // FOR EACH CARD IN ARRAYOFCARDS, DISPLAYFRONTSIDE WHEN THE EVENT LISTENER IS FIRED
    card.addEventListener('click', displayFrontSide);
});

//if first and second cards match, remove click eventListener for both cards

function cardsMatch() {
    firstChosenCard.removeEventListener('click', displayFrontSide);
    secondChosenCard.removeEventListener('click', displayFrontSide);
    if (matchedCards.length === 16) {
        endGame();
    }
    //console.log("click eventlistener removed!");
}; 

function cardsDontMatch() {
    lockBoard = true;
//if they don't match, unflip cards
    setTimeout(() => {
        firstChosenCard.classList.remove('flipCard');
        secondChosenCard.classList.remove('flipCard');
        firstChosenCard.classList.remove('disabled');
        secondChosenCard.classList.remove('disabled');
        lockBoard = false;
        //arrayOfOpenedCards = [];
    }, 1200);
};

let modal = document.querySelector(".modal");
let closeButton = document.querySelector(".close-button");
let totalMoves = document.querySelector('#totalMoves');
let totalTime = document.querySelector('#totalTime');
//let starRating = document.querySelector(".stars").innerHTML;

function toggleModal() {
    modal.classList.toggle("show-modal");
}

const endGame = function () {
    clearInterval(interval);
    totalTime = timer.innerHTML;
    totalMoves = counter.innerHTML;
    //starRating = arrayOfStars.innerHTML;
    toggleModal();
    document.querySelector('#totalMoves').innerHTML = totalMoves;
    //document.querySelector('#starRating').innerHTML = starRating;
    document.querySelector('#totalTime').innerHTML = totalTime;
}

closeButton.addEventListener("click", function(e) {
    toggleModal();
    startGame();
});