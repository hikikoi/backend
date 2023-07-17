const http = require("http");
const fs = require("fs");

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    
});

server.listen(PORT, () => {
  console.log("Server listening on port ", PORT);
});
