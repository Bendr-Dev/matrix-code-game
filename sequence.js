/*
 *  Handles sequence generation and display functionality
 */

// Selectors
export const sequenceDisplay = document.getElementById("code-sequence-content");

/**
 * Takes an array of string values and breaks it into smaller arrays
 * @param {String[]} path: bufferCount length array holding byte values from the generated matrix
 * @param {number} numOfSeq: Number of sequences to slice from path
 * @returns {string[][]}
 */
const splitPath = (path, numOfSeq) => {
    let currPathIndex = Math.floor(Math.random() * 2);
    let newSequences = [];

    for (let index = 0; index < numOfSeq; index++) {
        let randEndIndex = currPathIndex + (Math.floor((Math.random() * 2)) + (index + 1));

        newSequences.push(path.slice(currPathIndex, (randEndIndex + 1)));

        currPathIndex = randEndIndex;
        !!Math.floor(Math.random() * 2) && currPathIndex++;
    }

    return newSequences;
}

/**
 * Picks and returns a value from the matrix
 * @param {boolean} isRowSearch: Determines if next value is taken from row or col
 * @param {{row: number, col: number}} prevSelection: Holds indexes of previous value selected
 * @param {string[][]} matrix: Matrix used to pick values from
 * @returns {String}
 */
const getNextValue = (isRowSearch, prevSelection, tempMatrix, difficulty) => {
    let randIndex = Math.floor(Math.random() * (difficulty - 1));
    let value = null;

    if (isRowSearch) {
        if (prevSelection.row !== -1) {
            // Makes sure we don't select an already selected value
            while (!!!tempMatrix[prevSelection.row][randIndex]) {
                randIndex = Math.floor(Math.random() * (difficulty - 1));
            }

            prevSelection.col = randIndex;
            value = tempMatrix[prevSelection.row][randIndex];
            tempMatrix[prevSelection.row][randIndex] = null;
        } else {
            prevSelection.col = randIndex;
            prevSelection.row = 0;
            value = tempMatrix[prevSelection.row][randIndex];
            tempMatrix[prevSelection.row][randIndex] = null;
        }
    } else {
        while (!!!tempMatrix[randIndex][prevSelection.col]) {
            randIndex = Math.floor(Math.random() * (difficulty - 1));
        }

        prevSelection.row = randIndex;
        value = tempMatrix[randIndex][prevSelection.col];
        tempMatrix[randIndex][prevSelection.col] = null; 
    }

    return value;
}

/**
 * Updates a completed sequence
 * @param {[{}]} trackSeqCompletion 
 * @param {HTMLElement} sequenceDisplay 
 */
export const updateSeqDisplay = (trackSeqCompletion, sequenceDisplay) => {
    let sequences = sequenceDisplay.querySelectorAll("#code-sequence-content > div");

    trackSeqCompletion.forEach((trackSeq, index) => {
        if (trackSeq.complete !== 0) {
            if (trackSeq.complete === 1) {
                sequences[index].classList.add("sequence-complete");
            } else {
                sequences[index].classList.add("sequence-failed");
            }
        }
    });
}

export const checkSeqCompletion = (byteValue, trackSeqCompletion, bufferSeq, bufferCount) => {
    trackSeqCompletion.forEach((trackSeq) => {
        if (trackSeq.complete === 0) {
            if (trackSeq.seq[trackSeq.currIndex + 1] === byteValue) {
                trackSeq.currIndex += 1;

                if (trackSeq.currIndex + 1 === trackSeq.seq.length) {
                    trackSeq.complete = 1;
                }
            } else if (trackSeq.currIndex !== -1 && trackSeq.seq[trackSeq.currIndex] === byteValue) {
                
            } else if (trackSeq.currIndex !== -1 && trackSeq.seq[0] === byteValue) {
                trackSeq.currIndex = 0;
            } else {
                trackSeq.currIndex = -1;
            }
        }

        let tempCurrIndex = trackSeq.currIndex + 1;
        if (trackSeq.complete === 0 && (bufferCount - bufferSeq.length) < (trackSeq.seq.length - tempCurrIndex)) {
            trackSeq.complete = -1;
        }
    });

    updateSeqDisplay(trackSeqCompletion, sequenceDisplay);
}

/**
 * Displays sequences generated into DOM
 * @param {string[][]} sequences: Contains array's of string sequences 
 * @param {HTMLElement} sequenceDisplay: Container in the DOM to insert sequence HTMLElements
 */
export const displaySequences = (sequences, sequenceDisplay) => {
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
 * Creates valid sequences based off code matrix
 * @param {number} bufferCount: Determines path count
 * @param {String[][]} matrix: Code matrix
 */
export const createSequences = (bufferCount, matrix, difficulty) => {
    let tempMatrix = [];
    let tempRow = [];
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            tempRow.push(matrix[i][j]);
        }
        tempMatrix.push(tempRow);
        tempRow = [];
    }

    let newSequencePath = [];
    let isRowSearch = true;
    let prevSelection = {
        row: -1,
        col: -1
    };

    for (let index = 0; index < bufferCount; index++) {
        newSequencePath.push(getNextValue(isRowSearch, prevSelection, tempMatrix, difficulty));
        isRowSearch = !isRowSearch;
    }

    let amountOfSeq = Math.floor(Math.random() * 2) + 2;
    let newSequences = splitPath(newSequencePath, amountOfSeq);
    newSequences.sort((a, b) => a.length - b.length);
    return newSequences;
}