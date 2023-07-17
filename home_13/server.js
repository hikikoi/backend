const express = require('express');
const dotenv = require('dotenv');
const authController = require('./controllers/auth.controller');
const productController = require('./controllers/product.controller');
const {PORT} = require("./config/config")
const { authenticateToken, checkAdminRole } = require('./middlewares/auth.middleware');

dotenv.config();
const app = express();

app.use(express.json());

app.post('/login', authController.login);
app.post('/register', authController.register);

app.get('/products', authenticateToken, productController.getProducts);
app.post('/products', authenticateToken, checkAdminRole, productController.addProduct);
app.put('/products/:id', authenticateToken, checkAdminRole, productController.updateProduct);
app.delete('/products/:id', authenticateToken, checkAdminRole, productController.deleteProduct);

app.listen(PORT, () => {
  console.log("Listening port", PORT);
});
