const express = require('express');
const app = express();
const port = 3000;

let products = [
  { id: 1, name: 'Producto 1', price: 10.0 },
  { id: 2, name: 'Producto 2', price: 20.0 },
  { id: 3, name: 'Producto 3', price: 30.0 },
];

let cart = [];

// Endpoint para obtener los productos aleatorios
app.get('/products', (req, res) => {
  // Aquí obtenemos tres productos aleatorios del arreglo de productos
  const randomProducts = [];
  while (randomProducts.length < 3) {
    const product = products[Math.floor(Math.random() * products.length)];
    if (!randomProducts.includes(product)) {
      randomProducts.push(product);
    }
  }
  res.json(randomProducts);
});

// Endpoint para obtener los productos en el carrito
app.get('/cart', (req, res) => {
  res.json(cart);
});

// Endpoint para agregar productos al carrito
app.post('/cart/add', (req, res) => {
  const product = req.body;
  const productInCart = cart.find((item) => item.id === product.id);
  if (productInCart) {
    productInCart.quantity += product.quantity;
  } else {
    cart.push(product);
  }
  res.json({ message: 'Producto agregado al carrito' });
});

// Endpoint para actualizar la cantidad de productos en el carrito
app.post('/cart/update', (req, res) => {
  const product = req.body;
  const productInCart = cart.find((item) => item.id === product.id);
  if (productInCart) {
    productInCart.quantity = product.quantity;
    res.json({ message: 'Cantidad de producto actualizada en el carrito' });
  } else {
    res.status(404).json({ error: 'Producto no encontrado en el carrito' });
  }
});

// Endpoint para eliminar productos del carrito
app.post('/cart/remove', (req, res) => {
  const productId = req.body.id;
  const productIndex = cart.findIndex((item) => item.id === productId);
  if (productIndex >= 0) {
    cart.splice(productIndex, 1);
    res.json({ message: 'Producto eliminado del carrito' });
  } else {
    res.status(404).json({ error: 'Producto no encontrado en el carrito' });
  }
});

// Endpoint para procesar el pago
app.post('/checkout', (req, res) => {
  // Aquí integraríamos el procesador de pagos
  res.json({ message: 'Pago procesado con éxito' });
});

app.listen(port, () => {
  console.log(`La API está corriendo en el puerto ${port}`);
});
