/*
 *  Sequence generation
 */

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