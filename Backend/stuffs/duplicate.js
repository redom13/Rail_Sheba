const fs = require('fs');

// Function to remove duplicate lines from an array
function removeDuplicates(array) {
    return array.filter((line, index, self) => self.indexOf(line) === index);
}

// Read the file
fs.readFile('C:/Rail Sheba/Rail_Sheba/Backend/stuffs/modifiedFare.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    // Split file content into lines
    const lines = data.split('\n').map(line => line.trim());

    // Remove duplicate and identical lines
    const uniqueLines = removeDuplicates(lines);

    // Join the lines back into a single string
    const modifiedContent = uniqueLines.join('\n');

    // Write modified content back to the file
    fs.writeFile('C:/Rail Sheba/Rail_Sheba/Backend/stuffs/modifiedFare.txt', modifiedContent, 'utf8', (err) => {
        if (err) {
            console.error('Error writing to the file:', err);
            return;
        }
        console.log('File has been successfully modified.');
    });
});
