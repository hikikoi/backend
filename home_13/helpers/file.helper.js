const fs = require('fs');

const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data ? JSON.parse(data) : []);
      }
    });
  });
};

const writeFile = (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data), 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports = {
  readFile,
  writeFile,
};
