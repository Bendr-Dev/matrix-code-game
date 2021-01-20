"use strict";
import { createNewMatrix } from "./matrix.js";
import { createSequences } from "./sequence.js";

/*
 *  Selectors
 */

const matrixDisplay = document.getElementById("code-matrix-content");
const sequenceDisplay = document.getElementById("code-sequence-content");
const bufferDisplay = document.getElementById("buffer");
const timeDisplay = document.getElementById("time");


/*
 *  Game variables
 */

const gridElements = []; // Used to grab DOM elements
const difficulty = 5;
const bufferCount = 8; // Amount of attempts user has


const matrix = createNewMatrix(difficulty);
const sequences = createSequences(bufferCount, matrix, difficulty);
const bufferSeq = []; // User's selections
const startTime = 20;
const currLocation = { // Keep a cache of where the user has selected on the matrix
    isRow: true,
    row: 0,
    col: 0
};

/**
 * Creates div elements that store matrix values and calls function to
 * add UI/UX
 * @param {string[][]} matrix 
 * @param {HTMLElement} matrixDisplay 
 * @param {HTMLElement[][]} gridElements 
 * @param {number} difficulty 
 */
const displayMatrix = (matrix, matrixDisplay, gridElements, difficulty) => {
    if (matrix.length > 0) {
        matrix.forEach((row) => {
            row.forEach((byte) => {
                let newByteElement = document.createElement("div");
                newByteElement.innerHTML = byte;
                matrixDisplay.appendChild(newByteElement);
            });
        });
        initializeGridElements(gridElements, matrixDisplay, difficulty);
    }
}

/**
 * Obtains code matrix DOM elements for further manipulation
 * @param {HTMLElement[][]} gridElements 
 * @param {HTMLElement} matrixDisplay 
 * @param {number} difficulty 
 */
const initializeGridElements = (gridElements, matrixDisplay, difficulty) => {
    let tempGridEl = [];
    matrixDisplay.querySelectorAll("div").forEach((el) => {
        tempGridEl.push(el);
    });

    for (let index = 0; index < difficulty; index++) {
        gridElements.push(tempGridEl.splice(0, difficulty));
    }

    highlightCurrentSection(gridElements, currLocation);
    addListeners(gridElements);
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
const clickListener = (gridElements, currLocation, clickLocation) => {
    if (currLocation.isRow && gridElements[clickLocation.row][clickLocation.col].innerHTML !== "[ ]" 
        && currLocation.row === clickLocation.row) {
        currLocation.col = clickLocation.col;
        currLocation.isRow = !currLocation.isRow;
        updateBufferSeq(bufferSeq, bufferCount, gridElements[clickLocation.row][clickLocation.col].innerHTML);
        gridElements[clickLocation.row][clickLocation.col].innerHTML = "[ ]"
        highlightCurrentSection(gridElements, currLocation);
    } else if (!currLocation.isRow && gridElements[clickLocation.row][clickLocation.col].innerHTML !== "[ ]"
        && currLocation.col === clickLocation.col) {
        currLocation.row = clickLocation.row;
        currLocation.isRow = !currLocation.isRow;
        updateBufferSeq(bufferSeq, bufferCount, gridElements[clickLocation.row][clickLocation.col].innerHTML);
        gridElements[clickLocation.row][clickLocation.col].innerHTML = "[ ]"
        highlightCurrentSection(gridElements, currLocation);
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
 */
const addListeners = (gridElements) => {
    for (let i = 0; i < gridElements.length; i++) {
        for (let j = 0; j < gridElements.length; j++) {
            gridElements[i][j].addEventListener("mouseover", () => hoverListener(gridElements, currLocation, {row: i, col: j}));
            gridElements[i][j].addEventListener("mouseleave", () => hoverListener(gridElements, currLocation, {row: i, col: j}));
            gridElements[i][j].addEventListener("click", () => clickListener(gridElements, currLocation, {row: i, col: j}));
        }
    }
}

const updateBufferSeq = (bufferSeq, bufferCount, byteValue) => {
    if (bufferSeq.length < bufferCount) {
        bufferSeq.push(byteValue);
    }

    bufferDisplay.querySelectorAll("div").forEach((element, index) => {
        if (!!bufferSeq[index]) {
         element.innerHTML = bufferSeq[index];
        }
    });
}


/**
 * Displays sequences generated into DOM
 * @param {string[][]} sequences: Contains array's of string sequences 
 * @param {HTMLElement} sequenceDisplay: Container in the DOM to insert sequence HTMLElements
 */
const displaySequences = (sequences, sequenceDisplay) => {
    while (sequenceDisplay.firstChild) {
        sequenceDisplay.removeChild(sequenceDisplay.lastChild);
    }

    sequences.forEach((sequence) => {
        let newSequenceDiv = document.createElement("div");
        sequence.forEach((seqValue) => {
            let newSeqValueDiv = document.createElement("div");
            newSeqValueDiv.innerHTML = seqValue;
            newSequenceDiv.appendChild(newSeqValueDiv);
        });
        sequenceDisplay.appendChild(newSequenceDiv);
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
const startTimer = (startTime, timeDisplay) => {
    let currTime = Date.now();
    setInterval(() => {
        let elapsedTime = Date.now() - currTime;
        timeDisplay.innerHTML = (startTime - (elapsedTime / 1000)).toFixed(2);
    }, 100);
}


/**
 * Compares two values or two arrays
 * @param {any} value: First value to compare
 * @param {any} secondValue: Second value to compare with first value
 * @returns boolean
 */
const isValid = (value, secondValue) => {
    if (typeof value !== typeof secondValue)
        return false;

    if (typeof value !== "object")
        return value === secondValue;
    
    if (value.length !== secondValue.length)
        return false;
    else {
        let valid = true;
        value.forEach((value, index) => {
            if (value !== secondValue[index]) {
                valid = false;
            }
        });
        return valid;
    }
}

displayMatrix(matrix, matrixDisplay, gridElements, difficulty);
displaySequences(sequences, sequenceDisplay);
createEmptyBufferSlots(bufferCount, bufferDisplay);
//startTimer(startTime, timeDisplay);