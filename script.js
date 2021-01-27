"use strict";
import { createNewMatrix, displayMatrix, matrixDisplay } from "./matrix.js";
import { createSequences, displaySequences, checkSeqCompletion, updateSeqDisplay, sequenceDisplay } from "./sequence.js";

// Selectors
const bufferDisplay = document.getElementById("buffer");
const timeDisplay = document.getElementById("time");

// Game variables
const gridElements = []; // Used to grab matrix DOM elements
const gameState = { // Holds data for the game
    difficulty: 5,
    bufferCount: 8,
    startTime: 20,
    matrix: null,
    sequences: null,
    bufferSeq: [],
    currLocation: { // Keep a cache of where the user has selected on the matrix
        isRow: true,
        row: 0,
        col: 0
    },
    trackCompletion: []
};

/**
 * Resets certain properties in gameState
 * @param {{}} gameState
 */
const resetGameState = (gameState) => {
    gameState.matrix = null;
    gameState.sequences = null;
    gameState.bufferSeq = [];
    gameState.currLocation.isRow = true;
    gameState.currLocation.row = 0;
    gameState.currLocation.col = 0;
    gameState.trackCompletion = [];
}

/**
 * Clears previous game state and creates new objects to track sequences
 * @param {string[][]} sequences 
 * @param {[{ seq: string[][], currIndex: number, complete: number }]} trackCompletion 
 */
const createNewTrackCompletion = (sequences, trackCompletion) => {
    trackCompletion.length !== 0 && trackCompletion.forEach(() => {
                                        trackCompletion.pop();
                                    });

    sequences.forEach((sequence) => {
        trackCompletion.push({
            seq: sequence,
            currIndex: -1,
            complete: 0
        });
    });
}



/**
 * Creates and displays boxes for future sequence value selections
 * @param {number} bufferCount: Max amount of sequences user can enter
 * @param {HTMLElement} bufferDisplay: Container for displaying buffer selections 
 */
const createEmptyBufferSlots = (bufferCount, bufferDisplay) => {
    while (bufferDisplay.firstChild) {
        bufferDisplay.removeChild(bufferDisplay.lastChild);
    }

    for (let index = 0; index < bufferCount; index++) {
        bufferDisplay.appendChild(document.createElement("div"));
    }
}

/**
 * Creates a timer that counts down in ms
 * @param {number} startTime: Initial time to count down 
 * @param {HTMLElement} timeDisplay: Container to display timer
 */
const startTimer = (gameState, timeDisplay) => {
    let currTime = Date.now();
    const timer = setInterval(() => {
        let elapsedTime = Date.now() - currTime;
        if ((gameState.startTime - (elapsedTime / 1000)).toFixed(2) >= 0) {
            timeDisplay.innerHTML = (gameState.startTime - (elapsedTime / 1000)).toFixed(2);
            if (checkGameStatus(gameState.trackCompletion)) {
                clearInterval(timer);
                const resetTimer = setTimeout(() => {
                    resetGameState(gameState);
                    startNewGame(gameState);
                    clearTimeout(resetTimer);
                }, 1500);
            }
        } else {
            timeDisplay.innerHTML = "0.00";
            clearInterval(timer);

            gameState.trackCompletion.forEach((trackSeq) => {
                if (trackSeq.complete === 0) {
                    trackSeq.complete = -1;
                }
            });
            updateSeqDisplay(gameState.trackCompletion, sequenceDisplay);
            const resetTimer = setTimeout(() => {
                resetGameState(gameState);
                startNewGame(gameState);
                clearTimeout(resetTimer);
            }, 1500);
        }
    }, 100);
}

/**
 * Obtains matrix DOM elements for further manipulation
 * @param {HTMLElement[][]} gridElements 
 * @param {HTMLElement} matrixDisplay 
 * @param {number} difficulty
 * @param {{ isRow: boolean, row: number, col: number }} currLocation
 */
const initializeGridElements = (matrixDisplay, gameState) => {
    while (gridElements.length > 0) {
        gridElements.pop();
    }

    let tempGridEl = [];
    matrixDisplay.querySelectorAll("div").forEach((el) => {
        tempGridEl.push(el);
    });

    for (let index = 0; index < gameState.difficulty; index++) {
        gridElements.push(tempGridEl.splice(0, gameState.difficulty));
    }

    highlightCurrentSection(gridElements, gameState.currLocation);
    addListeners(gridElements, gameState);
}

/**
 * Adds highlight class to current row or column user is selecting value from
 * @param {HTMLElement[][]} gridElements 
 * @param {{ isRow: boolean, row: number, col: number }} currLocation 
 */
const highlightCurrentSection = (gridElements, currLocation) => {
    if (currLocation.isRow) {
        for (let index = 0; index < gridElements.length; index++) {
            gridElements[index][currLocation.col].classList.remove("highlight-high");
        }

        gridElements[currLocation.row].forEach((element) => {
            element.classList.add("highlight-high");
        });
    } else {
        gridElements[currLocation.row].forEach((element) => {
            element.classList.remove("highlight-high");
        });

        for (let index = 0; index < gridElements.length; index++) {
            gridElements[index][currLocation.col].classList.add("highlight-high");
        }
    }
}

/**
 * Highlights row/col opposite to what section the user is selecting
 * @param {HTMLElement[][]} gridElements 
 * @param {{ isRow: boolean, row: number, col: number}} currLocation 
 * @param {{row: number, col: number}} hoverLocation 
 */
const hoverListener = (gridElements, currLocation, hoverLocation) => {
    clearClass("highlight-low", gridElements);
    if (currLocation.isRow && gridElements[hoverLocation.row][hoverLocation.col].innerHTML !== "[ ]" 
    && currLocation.row === hoverLocation.row) {
        for (let index = 0; index < gridElements.length; index++) {
            gridElements[index][hoverLocation.col].classList.toggle("highlight-low");
        }
    } else if (!currLocation.isRow && gridElements[hoverLocation.row][hoverLocation.col].innerHTML !== "[ ]" 
        && currLocation.col === hoverLocation.col) {
        gridElements[hoverLocation.row].forEach(element => element.classList.toggle("highlight-low"));
    }
}

/**
 * Handles when a user clicks on a matrix value 
 * @param {HTMLElement[][]} gridElements 
 * @param {{ isRow: boolean, row: number, col: number}} currLocation 
 * @param {{row: number, col: number}} clickLocation 
 */
const clickListener = (gridElements, clickLocation, gameState) => {
    if (gameState.currLocation.isRow && gridElements[clickLocation.row][clickLocation.col].innerHTML !== "[ ]" 
        && gameState.currLocation.row === clickLocation.row) {

        // Update game state current location
        gameState.currLocation.col = clickLocation.col;
        gameState.currLocation.isRow = !gameState.currLocation.isRow;

        // Update buffer sequence and apply change to DOM element
        updateBufferSeq(gameState, gridElements[clickLocation.row][clickLocation.col].innerHTML);
        gridElements[clickLocation.row][clickLocation.col].innerHTML = "[ ]";

        // Highlight the next section
        highlightCurrentSection(gridElements, gameState.currLocation);
    } else if (!gameState.currLocation.isRow && gridElements[clickLocation.row][clickLocation.col].innerHTML !== "[ ]"
        && gameState.currLocation.col === clickLocation.col) {
        
        // Update game state current location
        gameState.currLocation.row = clickLocation.row;
        gameState.currLocation.isRow = !gameState.currLocation.isRow;

        // Update buffer sequence and apply change to DOM element
        updateBufferSeq(gameState, gridElements[clickLocation.row][clickLocation.col].innerHTML);
        gridElements[clickLocation.row][clickLocation.col].innerHTML = "[ ]";

        // Highlight the next section
        highlightCurrentSection(gridElements, gameState.currLocation);
    }
}

/**
 * Removes a class from all elements
 * @param {string} className: Name of class to remove 
 * @param {HTMLElement[][]} gridElements: Elements to remove class from
 */
const clearClass = (className, gridElements) => {
    for (let i = 0; i < gridElements.length; i++) {
        for (let j = 0; j < gridElements.length; j++) {
            gridElements[i][j].classList.remove(className);
        }
    }
}

/**
 * Adds listeners to all elements on the grid (matrix)
 * @param {HTMLElements[][]} gridElements: Elements to apply listeners too
 * @param {{}} gameState: Holds data pertaining to the state of the game
 */
const addListeners = (gridElements, gameState) => {
    for (let i = 0; i < gridElements.length; i++) {
        for (let j = 0; j < gridElements.length; j++) {
            gridElements[i][j].addEventListener("mouseover", () => hoverListener(gridElements, gameState.currLocation, {row: i, col: j}));
            gridElements[i][j].addEventListener("mouseleave", () => hoverListener(gridElements, gameState.currLocation, {row: i, col: j}));
            gridElements[i][j].addEventListener("click", () => clickListener(gridElements, {row: i, col: j}, gameState));
        }
    }
}

const updateBufferSeq = (gameState, byteValue) => {
    if (gameState.bufferSeq.length < gameState.bufferCount) {
        gameState.bufferSeq.push(byteValue);
    }

    if (gameState.bufferSeq.length === 1) {
        startTimer(gameState, timeDisplay);
    }

    bufferDisplay.querySelectorAll("div").forEach((element, index) => {
        if (!!gameState.bufferSeq[index]) {
         element.innerHTML = gameState.bufferSeq[index];
        }
    });

    checkSeqCompletion(byteValue, gameState.trackCompletion, gameState.bufferSeq, gameState.bufferCount);
}

const checkGameStatus = (trackCompletion) => {
    return trackCompletion.every((trackSeq) => trackSeq.complete !== 0);
}

/**
 * Creates a new game
 * @param {{}} gameState: Keeps track of user's actions and game information
 */
const startNewGame = (gameState) => {
    gameState.matrix = createNewMatrix(gameState.difficulty);
    gameState.sequences = createSequences(gameState.bufferCount, gameState.matrix, gameState.difficulty);
    createNewTrackCompletion(gameState.sequences, gameState.trackCompletion);
    timeDisplay.innerHTML = `${gameState.startTime}.00`; // Initialize display
    displayMatrix(gameState.matrix, matrixDisplay);
    displaySequences(gameState.sequences, sequenceDisplay);
    createEmptyBufferSlots(gameState.bufferCount, bufferDisplay);
    initializeGridElements(matrixDisplay, gameState);
}

startNewGame(gameState);

