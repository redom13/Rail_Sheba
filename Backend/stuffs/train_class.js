const fs = require('fs');

// Read the JSON file
fs.readFile('C:/Rail Sheba/Rail_Sheba/Backend/stuffs/train_data.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    try {
        const trainData = JSON.parse(data);
        const output = [];

        // Process each train object
        trainData.forEach(train => {
            const trainId = train.train_id;
            const classes = train.cost.map(cost => cost.class);

            // Push train id and classes to output array
            output.push(`${trainId},${classes.join(',')}`);
        });

        // Write to output file
        fs.writeFile('C:/Rail Sheba/Rail_Sheba/Backend/stuffs/train_datas.txt', output.join('\n'), 'utf8', err => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            console.log('Data has been written to train_datas.txt');
        });
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
});
