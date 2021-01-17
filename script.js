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
const currLocation = {
    isRow: true,
    row: 0,
    col: 0
};

/**
 * 
 * @param {*} matrix 
 * @param {*} matrixDisplay 
 * @param {*} gridElements 
 * @param {*} difficulty 
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
}

const highlightCurrentSection = (gridElements, currLocation) => {

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