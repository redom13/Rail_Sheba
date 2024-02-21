const fs = require('fs');

// Function to parse the input file content and remove duplicate lines
function removeDuplicates(filename) {
    const lines = fs.readFileSync(filename, 'utf8').split('\n');
    const map = new Map(); // Using a map to store unique entries based on station ids

    lines.forEach(line => {
        const [station1, station2, fare] = line.split(',').map(Number);
        const key = `${Math.min(station1, station2)},${Math.max(station1, station2)}`; // Generating a unique key based on station ids
        if (!map.has(key) || map.get(key).fare >= fare) { // Check if the fare is lower or it's a new entry
            map.set(key, { fare, line }); // Update or add the entry in the map
        }
    });

    // Convert map values back to array of lines
    const uniqueLines = Array.from(map.values()).map(entry => entry.line);
    return uniqueLines.join('\n');
}

// Function to write content back to the file
function writeFile(filename, content) {
    fs.writeFileSync(filename, content);
}

// Usage: Provide the input and output filenames
const inputFilename = 'C:/Rail Sheba/Rail_Sheba/Backend/stuffs/fares/op.txt';
const outputFilename = 'C:/Rail Sheba/Rail_Sheba/Backend/stuffs/fares/op2.txt';

const modifiedContent = removeDuplicates(inputFilename);
writeFile(outputFilename, modifiedContent);
console.log('Duplicate lines removed and saved to', outputFilename);
