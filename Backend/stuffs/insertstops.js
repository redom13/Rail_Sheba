const fs = require('fs');

// Read data from output.txt
fs.readFile('C:/Rail Sheba/Rail_Sheba/Backend/stuffs/output.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Split data into lines
  const lines = data.trim().split('\n');

  // Prepare output string
  let output = '';

  // Process each line
  lines.forEach(line => {
    // Split line into values
    const [stopNo, trainId, stationId, arrivalTime, departureTime] = line.split(',');

    // Format the values and create the output string
    const formattedLine = `INSERT INTO TRAIN_STOPS(TRAIN_ID,STATION_ID,STOP_NO,ARR_TIME,DEPT_TIME) VALUES(${trainId},${stationId},${stopNo},${arrivalTime === 'NULL' ? 'NULL' : `'${arrivalTime}'`},${departureTime === 'NULL' ? 'NULL' : `'${departureTime}'`});\n`;

    // Append formatted line to output
    output += formattedLine;
  });

  // Write to output2.txt
  fs.writeFile('C:/Rail Sheba/Rail_Sheba/Backend/stuffs/output2.txt', output, 'utf8', err => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('Data has been written to output2.txt');
  });
});
