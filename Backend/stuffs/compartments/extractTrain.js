const fs = require('fs');

// Function to extract numbers from text using regex
function extractNumbers(text) {
    const regex = /\((\d+),/g;
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
        matches.push(match[1]);
    }
    return matches;
}

// Read input file
fs.readFile('C:/Rail Sheba/Rail_Sheba/Backend/stuffs/compartments/trains.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading input file:', err);
        return;
    }

    // Extract numbers from each line
    const lines = data.split('\n');
    const numbers = lines.map(line => extractNumbers(line)).flat();

    // Write numbers to output file
    fs.writeFile('C:/Rail Sheba/Rail_Sheba/Backend/stuffs/compartments/output.txt', numbers.join('\n'), err => {
        if (err) {
            console.error('Error writing to output file:', err);
            return;
        }
        console.log('Numbers extracted and saved to output.txt');
    });
});
