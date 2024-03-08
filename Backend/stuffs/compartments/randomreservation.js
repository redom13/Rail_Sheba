const fs = require('fs');

// Function to generate a random integer within a range
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random date within a range of years
function getRandomDate(startYear, endYear) {
  const startDate = new Date(startYear, 0, 1).getTime();
  const endDate = new Date(endYear + 1, 0, 0).getTime();
  const randomDate = new Date(startDate + Math.random() * (endDate - startDate));
  return randomDate.toISOString().split('T')[0];
}

// Read stations from stations.txt file
const stations = fs.readFileSync('C:/Rail Sheba/Rail_Sheba/Backend/stuffs/compartments/stations.txt', 'utf8').trim().split('\n');

// Generate SQL statements and write them to a file
const filename = 'C:/Rail Sheba/Rail_Sheba/Backend/stuffs/compartments/output.txt';
let sqlStatements = '';
for (let i = 1; i <= 1000; i++) {
  const fromStation = stations[getRandomInt(0, stations.length - 1)].trim();
  const toStation = stations[getRandomInt(0, stations.length - 1)].trim();
  const randomDate = getRandomDate(2022, 2024);
  const sql = `INSERT INTO RESERVATION VALUES('${i}', '123456789', ${fromStation}, ${toStation}, TO_DATE('${randomDate}','YYYY-MM-DD'), TO_DATE('${randomDate}','YYYY-MM-DD'), 1000);\n`;
  sqlStatements += sql;
}

fs.writeFileSync(filename, sqlStatements);
console.log(`SQL statements have been written to ${filename}`);
