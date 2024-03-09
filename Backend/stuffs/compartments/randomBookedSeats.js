const fs = require('fs');

// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate unique random numbers within a range
function generateUniqueRandomNumbers(min, max, count) {
  const numbers = new Set();
  while (numbers.size < count) {
    numbers.add(getRandomInt(min, max));
  }
  return Array.from(numbers);
}

// Generate unique random PNRs
const pnrList = generateUniqueRandomNumbers(1, 1000, 1000);

// Generate SQL lines
let sqlLines = '';
pnrList.forEach(pnr => {
  const compId = getRandomInt(1, 1104);
  const seatNo = getRandomInt(1, 20);
  sqlLines += `INSERT INTO BOOKED_SEATS VALUES (${pnr},${compId},${seatNo});\n`;
});

// Write SQL lines to file
fs.writeFile('C:/Rail Sheba/Rail_Sheba/Backend/stuffs/compartments/op2.txt', sqlLines, (err) => {
  if (err) throw err;
  console.log('SQL lines have been written to op2.txt');
});
