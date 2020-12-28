const matrixDisplay = document.getElementById("code-matrix-content");

const matrixByteValues = [];
const matrix = [];
const sequences = [];
const difficulty = 5;

/**
 * Creates an array of byte values in hexadecimal to be used for game
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

const createSequence = (difficulty) => {
    let numberOfSequenceValues = parseInt((Math.random() * (difficulty - 2)) + 1);
    let sequence = [];

    for (let index = 0; index < numberOfSequenceValues; index++) {
        sequence.push(matrixByteValues[parseInt(Math.random() * (difficulty - 1))]);
    }

    // Check if sequence is valid with matrix
    sequences.push(sequence);
}

generateByteValues(difficulty);
generateMatrix(difficulty);
displayMatrix();
