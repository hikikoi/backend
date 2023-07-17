const http = require("http");
const fs = require("fs");
const path = require("path");

const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, "0");
const day = String(currentDate.getDate()).padStart(2, "0");

const folderName = `${year}.${month}.${day}`;
const folderPath = path.join(__dirname, folderName);

const PORT = 8000;

const server = http.createServer((req, res) => {
  let method = req.method;

  if (method === "GET") {
    if (req.url === "/market") {
      let markets = JSON.parse(
        fs.readFileSync(path.join(__dirname, "./db/markets.json"), "utf-8")
      );
      let products = JSON.parse(
        fs.readFileSync(path.join(__dirname, "./db/products.json"), "utf-8")
      );

      let result = markets.map((market) => {
        let marketProducts = products.filter((p) => p.market === market.id);
        return {
          id: market.id,
          market: market.market,
          products: marketProducts,
        };
      });

      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(result));
    }
  }
});

fs.mkdir(folderPath, (err) => {
    if (err) {
      console.error("Error. Folder not created:", err);
      return;
    }
  
    const fileName = "Baxtiyor.txt";
    const filePath = path.join(folderPath, fileName);
  
    const creationDate = currentDate.toLocaleString();
  
    fs.writeFile(filePath, `Baxtiyor ${creationDate}`, (err) => {
      if (err) {
        console.error("Error. File not created:", err);
        return;
      }
  
      console.log("File and folder sucsessfully created.");
    });
  });
  

server.listen(PORT, () => {
  console.log("Server listening on port: ", PORT);
});
