const fs = require('fs');

// Read stations.txt and create a hashmap of station IDs and names
const stationMap = new Map();
fs.readFile('C:/Rail Sheba/Rail_Sheba/Backend/stuffs/stations.txt', 'utf8', (err, stationsData) => {
    if (err) {
        console.error('Error reading stations file:', err);
        return;
    }

    const stationLines = stationsData.split('\n');
    stationLines.forEach(line => {
        const [id, name] = line.split(',');
        stationMap.set(name.trim(), id.trim());
    });

    // Read fare.txt and replace station names with IDs
    fs.readFile('C:/Rail Sheba/Rail_Sheba/Backend/stuffs/fare.txt', 'utf8', (err, fareData) => {
        if (err) {
            console.error('Error reading fare file:', err);
            return;
        }

        let modifiedFareData = fareData;
        stationMap.forEach((id, name) => {
            const regex = new RegExp(`(${name},)`, 'g');
            modifiedFareData = modifiedFareData.replace(regex, `${id},`);
        });

        // Write the modified fare data to a new file
        fs.writeFile('modifiedFare.txt', modifiedFareData, (err) => {
            if (err) {
                console.error('Error writing modified fare file:', err);
                return;
            }
            console.log('Modified fare data written to modifiedFare.txt');
        });
    });
});
