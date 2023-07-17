const { readFile, writeFile } = require('../helpers/file.helper');

const getNextProductId = async () => {
  try {
    const products = await readFile('data/products.json');
    const lastProduct = products[products.length - 1];
    if (lastProduct) {
      return (parseInt(lastProduct.id) + 1).toString();
    } else {
      return '1';
    }
  } catch (error) {
    console.error('Error reading products.json:', error);
    return null;
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await readFile('data/products.json');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const addProduct = async (req, res) => {
  const { name, price } = req.body;

  try {
    const productId = await getNextProductId();
    if (productId) {
      const newProduct = { id: productId, name, price };
      const products = await readFile('data/products.json');
      products.push(newProduct);
      await writeFile('data/products.json', products);
      res.json({ message: 'Product added' });
    } else {
      res.status(500).json({ message: 'Error generating product ID' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  try {
    const products = await readFile('data/products.json');
    const product = products.find((product) => product.id === id);

    if (product) {
      product.name = name;
      product.price = price;
      await writeFile('data/products.json', products);
      res.json({ message: 'Product updated' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const products = await readFile('data/products.json');
    const updatedProducts = products.filter((product) => product.id !== id);
    await writeFile('data/products.json', updatedProducts);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
