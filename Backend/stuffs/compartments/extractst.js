const fs = require('fs');

// Read the stations.txt file
fs.readFile('C:/Rail Sheba/Rail_Sheba/Backend/stuffs/compartments/stations.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Split the content of stations.txt by lines
  const lines = data.split('\n');

  // Extract numbers from each line
  const numbers = lines.map(line => {
    const parts = line.split(',');
    return parts[0].trim(); // Extract the number part and remove any leading/trailing spaces
  });

  // Write the extracted numbers into output.txt
  fs.writeFile('C:/Rail Sheba/Rail_Sheba/Backend/stuffs/compartments/output.txt', numbers.join('\n'), err => {
    if (err) {
      console.error('Error writing to output file:', err);
      return;
    }
    console.log('Numbers extracted and written to output.txt successfully!');
  });
});
