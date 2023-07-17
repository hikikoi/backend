const http = require("http");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const PORT = 3000;
const secretKey = "hikikoi";

function loadUsers() {
  try {
    const data = fs.readFileSync("./db/users.json");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync("./db/users.json", JSON.stringify(users, null, 2));
}

function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(payload, secretKey);
}

function registerUser(username, password) {
  const users = loadUsers();
  const user = users.find((u) => u.username === username);
  if (user) {
    if (!user.token) {
      user.token = generateToken(user);
      user.isAdmin = false;
      saveUsers(users);
      return "Token generated and isAdmin set to false";
    } else {
      throw new Error("User with that username already exists");
    }
  }

  const newUser = {
    id: users.length + 1,
    username: username,
    password: password,
    isAdmin: false,
    token: generateToken({ id: users.length + 1, username: username, isAdmin: false })
  };

  users.push(newUser);
  saveUsers(users);

  return "Registered";
}

function authenticateUser(username, password) {
  const users = loadUsers();
  const user = users.find((u) => u.username === username);
  if (!user || (user && !user.token)) {
    throw new Error("Invalid username or password");
  }

  if (!user.token) {
    user.token = generateToken(user);
    user.isAdmin = false;
    saveUsers(users);
  }

  const { token, ...userData } = user;
  return { ...userData, token };
}

function verifyToken(token) {
  return jwt.verify(token, secretKey);
}

const server = http.createServer((req, res) => {
  if (req.url === "/register" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const { username: newUsername, password } = JSON.parse(body);
        const result = registerUser(newUsername, password);
        res.statusCode = 200;
        res.end(result);
      } catch (error) {
        res.statusCode = 400;
        res.end(error.message);
      }
    });
  } else if (req.url === "/login" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const { username, password } = JSON.parse(body);
        const user = authenticateUser(username, password);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(user));
      } catch (error) {
        res.statusCode = 401;
        res.end(error.message);
      }
    });
  } else if (req.url === "/logout" && req.method === "POST") {
    const token = req.headers.authorization;
    try {
      const decodedToken = verifyToken(token);
      const users = loadUsers();
      const user = users.find((u) => u.username === decodedToken.username);
      if (user) {
        delete user.token;
        saveUsers(users);
        res.statusCode = 200;
        res.end("Logged out");
      } else {
        res.statusCode = 401;
        res.end("Invalid token");
      }
    } catch (error) {
      res.statusCode = 401;
      res.end("Invalid token");
    }
  } else if (req.url === "/users" && req.method === "GET") {
    const token = req.headers.authorization;
    try {
      const decodedToken = verifyToken(token);
      if (decodedToken.isAdmin) {
        const users = loadUsers();
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(users));
      } else {
        res.statusCode = 403;
        res.end("Not allowed");
      }
    } catch (error) {
      res.statusCode = 401;
      res.end("Invalid token");
    }
  } else {
    res.statusCode = 404;
    res.end("Not found");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
