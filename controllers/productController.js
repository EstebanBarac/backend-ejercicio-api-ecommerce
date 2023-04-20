const Product = require('../models/productModel');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.log(error);
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    console.log(error);
  }
};

const createProduct = async (req, res) => {
  const { name, price, description } = req.body;

  const product = new Product({
    name,
    price,
    description,
  });

  try {
    const createdProduct = await product.save();
    res.json(createdProduct);
  } catch (error) {
    console.log(error);
  }
};

const updateProduct = async (req, res) => {
  const { name, price, description } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.remove();
      res.json({ message: 'Product removed' });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
