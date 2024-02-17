const fs = require('fs');

// Function to read stations file and store data in a hashmap
function readStationsFile(filename) {
    const stations = {};
    const data = fs.readFileSync(filename, 'utf8').split('\n');
    data.forEach(line => {
        const [number, name] = line.trim().split(',');
        stations[name.trim()] = number.trim();
    });
    return stations;
}

// Function to replace station names with numbers in train stops file
function replaceNamesWithNumbers(trainStopsFile, stations) {
    const replacedLines = [];
    const data = fs.readFileSync(trainStopsFile, 'utf8').split('\n');
    data.forEach(line => {
        const parts = line.trim().split(',');
        if (parts.length === 5) {
            parts[2] = stations[parts[2]] || 'NULL';
            replacedLines.push(parts.join(','));
        }
    });
    return replacedLines;
}

// Function to write output to a file
function writeOutput(outputFile, lines) {
    fs.writeFileSync(outputFile, lines.join('\n'));
}

const stationsFile = "C:/Rail Sheba/Rail_Sheba/Backend/stuffs/stations.txt";
const trainStopsFile = "C:/Rail Sheba/Rail_Sheba/Backend/stuffs/trainsStops.txt";
const outputFile = "C:/Rail Sheba/Rail_Sheba/Backend/stuffs/output.txt";

const stations = readStationsFile(stationsFile);
const replacedLines = replaceNamesWithNumbers(trainStopsFile, stations);
writeOutput(outputFile, replacedLines);

console.log("Output has been written to", outputFile);
