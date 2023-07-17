const fs = require('fs');
const path = require('path');

function readFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  const fileContent = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(fileContent);
}

function writeFile(filePath, data) {
  const fullPath = path.join(__dirname, '..', filePath);
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(fullPath, jsonData);
}

module.exports = {
  readFile,
  writeFile,
};
