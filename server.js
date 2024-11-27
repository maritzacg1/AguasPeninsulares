const express = require('express');
const cors = require('cors');
const logger = require('./logger'); // Importa el logger
const usuariosRoutes = require('./routes/usuarios'); // Rutas de usuarios
const productosRoutes = require('./routes/productos'); // Rutas de productos

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:8100'], // Agrega ambos orígenes
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // Para procesar datos JSON

// Rutas
app.use('/usuarios', usuariosRoutes); // Prefijo /usuarios
app.use('/productos', productosRoutes); // Prefijo /productos

// Iniciar el servidor
app.listen(PORT, () => {
  logger.info(`Servidor corriendo en http://localhost:${PORT}`);
});
