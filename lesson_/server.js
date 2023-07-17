const http = require("http");
const fs = require("fs");

const PORT = process.env.PORT || 5000;

const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

let lastId = Math.max(
  ...data.philosophers.map((item) => item.id),
  ...data.cultural_figures.map((item) => item.id),
  ...data.scholars.map((item) => item.id)
);

const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle other requests
  if (method === "GET") {
    if (url === "/philosophers") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data.philosophers));
    } else if (url === "/cultural_figures") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data.cultural_figures));
    } else if (url === "/scholars") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data.scholars));
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  } else if (method === "POST") {
    // Handle POST request
    // ...
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log("Server is listening on port ", PORT);
});
