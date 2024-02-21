const fs = require('fs');

const inputFile = 'C:/Rail Sheba/Rail_Sheba/Backend/stuffs/compartments/output.txt';
const outputFile = 'C:/Rail Sheba/Rail_Sheba/Backend/stuffs/compartments/op.txt';

// Function to generate SQL statements for a given number
function generateSQL(number,x) {
    const compartments = [
        'KA', 'KHA', 'GA', 'GHA', 'UMA', 'CHA',
        'SCHA', 'JA', 'JHA', 'NEO', 'TA', 'THA'
    ];
    
    let id = 12*x;
    let sql = '';
    compartments.forEach((compartment, idx) => {
        if(id%12+1 <= 6)
        sql += `INSERT INTO COMPARTMENTS VALUES(${++id},${number},'${compartment}','S_CHAIR');\n`;
        else if(id%12+1 > 6 && id%12+1 <=10)
        sql += `INSERT INTO COMPARTMENTS VALUES(${++id},${number},'${compartment}','SNIGDHA');\n`;
        else
        sql += `INSERT INTO COMPARTMENTS VALUES(${++id},${number},'${compartment}','AC_S');\n`;
    });
    return sql;
}

// Read numbers from input file and generate SQL statements
fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the input file:', err);
        return;
    }

    const numbers = data.trim().split('\n');
    let sqlStatements = '';

    let y = 0;
    numbers.forEach(number => {
        sqlStatements += generateSQL(number.trim(),y++);
    });

    // Write SQL statements to output file
    fs.writeFile(outputFile, sqlStatements, err => {
        if (err) {
            console.error('Error writing to output file:', err);
            return;
        }
        console.log('SQL statements have been written to output file successfully.');
    });
});
