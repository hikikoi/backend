const fs = require("fs");

function readJSONFile(filename) {
    const rawdata = fs.readFileSync(filename);
    return JSON.parse(rawdata);
  }

module.exports ={
    readJSONFile
}