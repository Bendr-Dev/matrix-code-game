const matrixDisplay = document.getElementById("code-matrix-content");

const matrixByteValues = [];
const matrix = [];
const sequences = [];
const difficulty = 5;
const bufferCount = 8;

/**
 * Creates an array of byte values in hexadecimal to be used for game
 * @param {number} difficulty: Number of rows to generate
 */
const generateByteValues = (difficulty) => {
    if (matrixByteValues.length !== 0)
        matrixByteValues.splice(0, matrixByteValues.length);
    
    for (let index = 0; index < difficulty; index++) {
        let randomByteValue = generateByteValue();
        matrixByteValues.push(randomByteValue);
    }
}

/**
 * Creates a byte value ranging from 00 to FF
 * @returns {String}
 */
const generateByteValue = () => {
    let value1 = convertNumberToHex(Math.floor(Math.random() * 15));
    let value2 = convertNumberToHex(Math.floor(Math.random() * 15));

    return value1 + value2;
}

/**
 * Creates a matrix
 * @param {number} difficulty: Number of rows to generate 
 */
const generateMatrix = (difficulty) => {
    for (let index = 0; index < difficulty; index++) {
        matrix.push(generateRow(difficulty));
    }
}

/**
 * Creates a row of random values from the generated hex values
 * @param {number} difficulty: Number of columns to generate (length of array)
 * @returns {String[]}
 */
const generateRow = (difficulty) => {
    let row = [];
    for (let index = 0; index < difficulty; index++) {
        row.push(matrixByteValues[Math.floor(Math.random() * (difficulty - 1))]);
    }   
    return row;
}

/**
 * Converts a single number into hex value
 * @param {number} number: Value ranging from 0 to 15 to be converted into hex value
 * @returns {String}
 */
const convertNumberToHex = (number) => {
    if (number < 10) {
        return `${number}`;
    } else {
        switch (number) {
            case 10:
                return "A";
            case 11:
                return "B";
            case 12:
                return "C";
            case 13:
                return "D";
            case 14: 
                return "E";
            case 15:
                return "F";
        }
    }
}

/**
 * Add generated rows to display
 */
const displayMatrix = () => {
    if (matrix.length > 0) {
        matrix.forEach((row) => {
            let newRow = createRow(row);
            matrixDisplay.appendChild(newRow);
        });
    }
}

/**
 * Creates a div element representing a row containing more div elements with byte values
 * @param {number[]} row: Row containing byte values
 * @returns {HTMLDivElement}
 */
const createRow = (row) => {
    let newRowElement = document.createElement("div");
    row.forEach((byte) => {
        let newByteElement = document.createElement("div");
        newByteElement.innerHTML = byte;
        newRowElement.appendChild(newByteElement);
    });

    return newRowElement;
}

/**
 * Creates valid sequences based off code matrix
 * @param {number} bufferCount: Determines path count
 * @param {String[][]} matrix: Code matrix
 */
const createSequences = (bufferCount, matrix) => {
    let tempMatrix = matrix;
    let newSequencePath = [];
    let isRowSearch = true;
    let prevSelection = {
        row: -1,
        col: -1
    };

    for (let index = 0; index < bufferCount; index++) {
        newSequencePath.push(getNextValue(isRowSearch, prevSelection, tempMatrix));
        isRowSearch = !isRowSearch;
    }

    let amountOfSeq = Math.floor(Math.random() * 2) + 2;
    let newSequences = splitPath(newSequencePath, amountOfSeq);
    newSequences.sort((a, b) => a.length - b.length);
    newSequences.forEach((sequence) => sequences.push(sequence));
}

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
 * @param {Object {row: number, col: number}} prevSelection: Holds indexes of previous value selected
 * @param {Object [][]} matrix: Matrix used to pick values from
 * @returns {String}
 */
const getNextValue = (isRowSearch, prevSelection, matrix) => {
    let randIndex = Math.floor(Math.random() * (difficulty - 1));
    let value = null;

    if (isRowSearch) {
        if (prevSelection.row !== -1) {
            while (!!!matrix[prevSelection.row][randIndex]) {
                randIndex = Math.floor(Math.random() * (difficulty - 1));
            }

            prevSelection.col = randIndex;
            value = matrix[prevSelection.row][randIndex];
            matrix[prevSelection.row][randIndex] = null;
        } else {
            prevSelection.col = randIndex;
            prevSelection.row = 0;
            value = matrix[prevSelection.row][randIndex];
            matrix[prevSelection.row][randIndex] = null;
        }
    } else {
        while (!!!matrix[randIndex][prevSelection.col]) {
            randIndex = Math.floor(Math.random() * (difficulty - 1));
        }

        prevSelection.row = randIndex;
        value = matrix[randIndex][prevSelection.col];
        matrix[randIndex][prevSelection.col] = null; 
    }

    return value;
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

generateByteValues(difficulty);
generateMatrix(difficulty);
displayMatrix();
createSequences(bufferCount, matrix);
