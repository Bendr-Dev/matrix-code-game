const matrixDisplay = document.getElementById("code-matrix-content");

const matrixHexValues = [];
const matrix = [];
const difficulty = 5;

/**
 * Creates an array of byte values in hexadecimal to be used for game
 */
const generateHexValues = (difficulty) => {
    if (matrixHexValues.length !== 0)
        matrixHexValues.splice(0, matrixHexValues.length);
    
    for (let index = 0; index < difficulty; index++) {
        let randomHexValue = generateByteValue();
        matrixHexValues.push(randomHexValue);
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
        row.push(matrixHexValues[parseInt(Math.random() * 4)]);
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

const createRow = (row) => {
    let newRowElement = document.createElement("div");
    row.forEach((byte) => {
        let newByteElement = document.createElement("div");
        newByteElement.innerHTML = byte;
        newRowElement.appendChild(newByteElement);
    });

    return newRowElement;
}

generateHexValues(difficulty);
generateMatrix(difficulty);
displayMatrix();