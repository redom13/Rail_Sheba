const fs = require('fs');

// Function to read the input file, process the lines, and generate SQL INSERT statements
function generateSQLInserts(inputFilename, outputFilename) {
    const lines = fs.readFileSync(inputFilename, 'utf8').split('\n');
    const inserts = lines.map(line => {
        const [number1, number2, number3] = line.split(',').map(Number);
        return `INSERT INTO FARE VALUES(${number1},${number2},'S_CHAIR',${number3/2});`;
    });

    const outputContent = inserts.join('\n');

    // Write the SQL INSERT statements to the output file
    fs.writeFileSync(outputFilename, outputContent);
    console.log(`SQL INSERT statements written to ${outputFilename}`);
}

// Provide the input and output filenames
const inputFilename = 'C:/Rail Sheba/Rail_Sheba/Backend/stuffs/fares/op.txt';
const outputFilename = 'C:/Rail Sheba/Rail_Sheba/Backend/stuffs/fares/op2.txt';

generateSQLInserts(inputFilename, outputFilename);
