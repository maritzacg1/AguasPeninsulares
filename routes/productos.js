const express = require('express');
const db = require('../config/db'); // Cambiar la ruta
// Usar la conexión db en lugar de pool
const logger = require('../logger'); // Importa el logger

const router = express.Router();

// Obtener todos los productos
router.get('/', (req, res) => {
  const query = 'SELECT * FROM productos';
  db.query(query, (err, results) => {  // Usa db en lugar de pool
    if (err) {
      logger.error(`Error al obtener productos: ${err.message}`);
      return res.status(500).json({ message: 'Error en el servidor.' });
    }
    res.status(200).json(results);
  });
});

// Agregar un producto
router.post('/', (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body;
  if (!nombre || !precio || stock === undefined) {
    logger.warn('Intento de agregar producto con campos incompletos.');
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }

  const query = 'INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)';
  db.query(query, [nombre, descripcion, precio, stock], (err, results) => {
    if (err) {
      logger.error(`Error al agregar producto: ${err.message}`);
      return res.status(500).json({ message: 'Error en el servidor.' });
    }
    logger.info(`Producto agregado: ${nombre}`);
    res.status(201).json({ message: 'Producto agregado exitosamente.' });
  });
});

module.exports = router;
