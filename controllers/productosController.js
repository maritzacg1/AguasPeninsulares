const multer = require('multer');
const path = require('path');
const db = require('../config/db');
const logger = require('../logger');

// Configuración de multer para manejar la carga de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directorio donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para la imagen
  }
});

// Filtro para permitir solo imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);  // Aceptar imagen
  } else {
    cb(new Error('El archivo debe ser una imagen'), false);  // Rechazar si no es imagen
  }
};

// Inicialización de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Función para agregar un producto con imagen
const agregarProducto = (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body;
  const imagen = req.file ? req.file.path : null;  // Captura la ruta de la imagen

  if (!nombre || !precio || stock === undefined) {
    logger.warn('Intento de agregar producto con campos incompletos.');
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }

  const query = 'INSERT INTO productos (nombre, descripcion, precio, stock, imagen) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [nombre, descripcion, precio, stock, imagen], (err, results) => {
    if (err) {
      logger.error(`Error al agregar producto: ${err.message}`);
      return res.status(500).json({ message: 'Error en el servidor.' });
    }
    logger.info(`Producto agregado: ${nombre}`);
    res.status(201).json({ message: 'Producto agregado exitosamente.' });
  });
};

// Función para actualizar un producto con imagen
const actualizarProducto = (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock } = req.body;
  const imagen = req.file ? req.file.path : null;  // Obtiene la ruta de la imagen

  const query = 'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagen = ? WHERE id = ?';
  db.query(query, [nombre, descripcion, precio, stock, imagen, id], (err, results) => {
    if (err) {
      logger.error(`Error al actualizar producto: ${err.message}`);
      return res.status(500).json({ message: 'Error en el servidor.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    logger.info(`Producto actualizado: ${nombre}`);
    res.status(200).json({ message: 'Producto actualizado exitosamente.' });
  });
};

module.exports = {
  agregarProducto,
  actualizarProducto
};
