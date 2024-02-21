const fs = require('fs');

function calculateFare(inputFile, outputFile, trainId) {
    fs.readFile(inputFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        const lines = data.trim().split('\n');
        const fares = [];

        for (const line of lines) {
            const [stopNo, tId, stationId, , ] = line.split(',');
            if (parseInt(tId) === trainId) {
                for (const otherLine of lines) {
                    const [, , otherStationId, , ] = otherLine.split(',');
                    if (parseInt(otherLine.split(',')[1]) === trainId) {
                        const fare = Math.abs(parseInt(stopNo) - parseInt(otherLine.split(',')[0])) * 50;
                        fares.push(`${stationId},${otherStationId},${fare}\n`); // Append newline here
                    }
                }
            }
        }

        fs.appendFile(outputFile, fares.join(''), err => { // Join without delimiter to ensure no extra newlines between entries
            if (err) {
                console.error('Error writing to file:', err);
                return;
            }
            console.log('Fares calculated and saved to', outputFile);
        });
    });
}

calculateFare('C:/Rail Sheba/Rail_Sheba/Backend/stuffs/fares/trainstops.txt', 'C:/Rail Sheba/Rail_Sheba/Backend/stuffs/fares/op.txt', 783);
