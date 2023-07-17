const fs = require('fs');
const path = require('path')

const loadDataFromJSON = (filename) => {
    const filePath = path.join(__dirname, '..', 'model', filename);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  };
  
  const saveDataToJSON = (filename, data) => {
    const filePath = path.join(__dirname, '..', 'model', filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  };

  module.exports = {
    loadDataFromJSON,
    saveDataToJSON
}
