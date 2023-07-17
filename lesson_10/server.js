const http = require("http");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const secretKey = "dell_007";
const PORT = 3000;

const loadUsers = () => {
  try {
    const data = fs.readFileSync("./db/users.json");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const saveUsers = (users) => {
  const data = JSON.stringify(users, null, 2);
  fs.writeFileSync("./db/users.json", data);
};

const deleteUser = (user) => {
  delete user.token;
};

const generateToken = (username) => {
  return jwt.sign({ username }, secretKey);
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
};

const handleRegister = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    const { username, password } = JSON.parse(body);

    if (!username || !password) {
      res.statusCode = 400;
      res.end("Username and password are required");
      return;
    }

    const users = loadUsers();
    const existingUser = users.find((user) => user.username === username);
    if (existingUser && existingUser.token) {
      res.statusCode = 409;
      res.end("User already exists");
      return;
    }else if(!existingUser.token){
      Object.assign(existingUser,{token:generateToken(username)})
      saveUsers(existingUser);
      res.end("Registered")
      return
    }
    const token = generateToken(username);
    const newUser = { username, password, posts: [], token };
    users.push(newUser);
    saveUsers(users);


    res.statusCode = 200;
    res.end("Sucsessfully registered");
  });
};

const handleLogin = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    const { username, password } = JSON.parse(body);

    const users = loadUsers();
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    if (!user) {
      res.statusCode = 401;
      res.end("Invalid credentials");
      return;
    }else if(!user.token){
      res.statusCode = 401;
      res.end("Invalid token");
      return
    }
    const token = generateToken(username);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ username, password, posts: user.posts, token }));
  });
};

const handleLogOut = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    const { username, password } = JSON.parse(body);

    const users = loadUsers();
    const user = users.find(
      (user) => user.username === username && user.password === password
    );

    if (!user) {
      res.statusCode = 404;
      res.end("User not found");
      return;
    }

    if (!user.token) {
      res.statusCode = 500;
      res.end("Hasn't token");
      return;
    }

    delete user.token;
    saveUsers(users);
    res.end("Token deleted");
  });
};


const handlePost = (req, res) => {
  const token = req.headers["authorization"];
  if (!token) {
    res.statusCode = 401;
    res.end("Missing token");
    return;
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    res.statusCode = 403;
    res.end("Invalid token");
    return;
  }

  const username = decodedToken.username;

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    const { post } = JSON.parse(body);

    const users = loadUsers();
    const user = users.find((user) => user.username === username);
    if (!user) {
      res.statusCode = 404;
      res.end("User not found");
      return;
    }

    const postId = user.posts.length + 1;
    const newPost = { id: postId, text: post };
    user.posts.push(newPost);
    saveUsers(users);

    res.statusCode = 200;
    res.end("Post created");
  });
};

const server = http.createServer((req, res) => {
  // "username":"username1",
  // "password":"passqord1"
  if (req.url === "/register" && req.method === "POST") {
    handleRegister(req, res);
    // "username":"username1",
    // "password":"passqord1"
  } else if (req.url === "/login" && req.method === "POST") {
    handleLogin(req, res);
    //  Authorization: Bearer <token>
    // "username":"username1",
    // "password":"passqord1"
    // "posts":"post1"
  } else if (req.url === "/post" && req.method === "POST") {
    handlePost(req, res);
  }else if (req.url === "/logout" && req.method === "DELETE") {
    handleLogOut(req, res);
  } else {
    res.statusCode = 404;
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});
