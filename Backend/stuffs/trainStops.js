const fs = require('fs');

// Read the contents of stop.txt
fs.readFile('C:/Rail Sheba/Rail_Sheba/Backend/stuffs/stops.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    const lines = data.split('\n');
    const trainId = lines[0].trim();
    const output = [];

    let j=1;
    for (let i = 1; i < lines.length; i += 5) {
        // Check if there are enough lines available
        if (i + 4 >= lines.length) {
            console.error('Incomplete data for train stops');
            break;
        }

        const station = lines[i].trim();
        const arrival = extractTime(lines[i + 1].trim());
        const departure = extractTime(lines[i + 3].trim());
        output.push(`${j++},${trainId},${station},${arrival},${departure}`);
    }

    // Write the formatted data to trainStops.txt in append mode
    fs.appendFile('C:/Rail Sheba/Rail_Sheba/Backend/stuffs/trainsStops.txt', output.join('\n') + '\n', 'utf8', err => {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }
        console.log('Data has been appended to trainStops.txt');
    });
});

function extractTime(line) {
    const timeMatch = line.match(/\d{2}:\d{2} (?:am|pm)/);
    return timeMatch ? timeMatch[0] : 'NULL';
}
