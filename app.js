const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const Product = require('./models/product');

const app = express();

mongoose
  .connect(
    'mongodb+srv://EB0:7V1tvAxwEQ8sQe4X@creator-api.hztoda5.mongodb.net/test',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('Conexión a la base de datos establecida'))
  .catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const JWT_SECRET = 'mysecretkey';

// Rutas públicas
app.get('/', (req, res) => {
  res.send('Bienvenido a mi app');
});

app.get('/login', (req, res) => {
  res.send(`
    <form method="POST" action="/login">
      <input type="username" name="username" placeholder="Usuario" required>
      <input type="password" name="password" placeholder="Contraseña" required>
      <button type="submit">Iniciar sesión</button>
    </form>
  `);
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return res.status(401).json({ message: 'Contraseña incorrecta' });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);

  res.json({ token });
});

// Middleware de autenticación
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No estás autorizado' });
  }

  jwt.verify(token, JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).json({ message: 'No estás autorizado' });
    }

    const { userId } = payload;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    req.user = user;

    next();
  });
};

// Rutas protegidas
app.post('/products', requireAuth, async (req, res) => {
  const { name, price, stock } = req.body;

  const product = new Product({
    name,
    price,
    stock,
    seller: req.user._id,
  });

  try {
    await product.save();

    res.json(product);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: 'Ha ocurrido un error' });
  }
});

app.get('/products', requireAuth, async (req, res) => {
  const products = await Product.find({ seller: req.user._id });

  res.json(products);
});

app.listen(3000, () => {
  console.log('Servidor iniciado');
});
