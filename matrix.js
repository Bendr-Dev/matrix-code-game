/*
 *  Matrix generation
 */ 

const matrixByteValues = [];

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
 * @returns {string}
 */
const generateByteValue = () => {
    let value1 = convertNumberToHex(Math.floor(Math.random() * 15));
    let value2 = convertNumberToHex(Math.floor(Math.random() * 15));

    return value1 + value2;
}

/**
 * Creates a matrix
 * @param {number} difficulty: Number of rows to generate 
 * @returns {string[][]}
 */
const generateMatrix = (difficulty) => {
    let matrix = [];
    for (let index = 0; index < difficulty; index++) {
        matrix.push(generateRow(difficulty));
    }

    return matrix;
}

/**
 * Creates a row of random values from the generated hex values
 * @param {number} difficulty: Number of columns to generate (length of array)
 * @returns {string[]}
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
 * @returns {string}
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
 * Creates an matrix with random 2-length string values
 * @param {number} difficulty: Determines size of matrix
 * @returns {generateMatrix(difficulty)}
 */
export const createNewMatrix = (difficulty) => {
    generateByteValues(difficulty);
    return generateMatrix(difficulty);
}