const matrixDisplay = document.getElementById("code-matrix-content");

const matrixByteValues = [];
const matrix = [];
const sequences = [];
const difficulty = 5;

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
 */
const generateByteValue = () => {
    let value1 = convertNumberToHex(parseInt(Math.random() * 15));
    let value2 = convertNumberToHex(parseInt(Math.random() * 15));

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
 */
const generateRow = (difficulty) => {
    let row = [];
    for (let index = 0; index < difficulty; index++) {
        row.push(matrixByteValues[parseInt(Math.random() * (difficulty - 1))]);
    }   
    return row;
}

/**
 * Converts a single number into hex value
 * @param {number} number: Value ranging from 0 to 15 to be converted into hex value 
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
 * Creates a valid sequence based off of the generated matrix
 * @param {number} difficulty: Determine the potential size of sequence
 */
const createSequence = (difficulty) => {
    let numberOfSequenceValues = parseInt((Math.random() * 2) + (difficulty - 3));
    let sequence = [];

    for (let index = 0; index < numberOfSequenceValues; index++) {
        sequence.push(matrixByteValues[parseInt(Math.random() * (difficulty - 1))]);
    }

    // Check if sequence is valid with matrix
    sequences.push(sequence);
}

/**
 * Tests values of sequence and validates sequence with given matrix
 * @param {number[]} sequence: number combinations to be validated 
 * @param {number[][]} matrix: matrix which the sequence will be tested on
 * @param {number} difficulty: Used to calculate buffer size
 */
const checkSequence =
    (seqPosition, matrix, genSequence, currSequence, difficulty, isRowCheck, bufferCount, currRow, currCol, lastIndex) => {
    let maxBufferSize = difficulty - 1;
    let isPattern = false;
    let matchFound = false;

    if (isValid(genSequence, currSequence))
        isPattern = true;

    while (!isPattern && bufferCount < maxBufferSize) {
        if (isRowCheck) {
            // Row check
            // First check if there's a matching value with current sequence value being sought after
            matrix[currRow].forEach((colSequenceValue, index) => {
                if (isValid(colSequenceValue, genSequence[seqPosition]) && index !== lastIndex) {
                    currSequence.push(colSequenceValue);
                    currCol = index;
                    seqPosition += 1;
                    bufferCount += 1;
                    isRowCheck = !isRowCheck;
                    matchFound = true;
                    checkSequence(...arguments);
                }
            });
            // Brute force tatic in case there's no matching sequence value 
            if (!matchFound) {
                currSequence.splice(0, currSequence.length);
                seqPosition = -1;
                matrix[currRow].forEach((colSequenceValue, index) => {
                    currSequence.push(colSequenceValue);
                    currCol = index;
                    seqPosition += 1;
                    bufferCount += 1;
                    isRowCheck = !isRowCheck;
                    matchFound = true;
                    checkSequence(...arguments);
                });
            }
        } else {
            // Column check
            for (let index = 0; index < matrix[currRow].length; index++) {
                if (isValid(matrix[index][currCol], genSequence[seqPosition])) {
                    currSequence.push(matrix[index][currCol]);
                    currRow = index;
                    seqPosition += 1;
                    bufferCount += 1;
                    isRowCheck = !isRowCheck;
                    matchFound = true;
                    checkSequence(...arguments);
                }
            }
        }
    }

    if (isPattern)
        return true;
    else return false;
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
