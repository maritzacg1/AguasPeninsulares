const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const logger = require('../logger');

const router = express.Router();

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'aguas_peninsulares',
});

// Conectar a la base de datos
db.connect(err => {
  if (err) {
    logger.error(`Error conectando a la base de datos: ${err.message}`);
    process.exit(1); // Detiene el servidor si no hay conexión
  }
  logger.info('Conectado a la base de datos MySQL');
});

// Registro de usuarios
router.post('/register', async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  if (!nombre || !correo || !contrasena) {
    logger.warn('Intento de registro con campos incompletos.');
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const query = 'INSERT INTO usuarios (nombre, correo, contrasena, tipo) VALUES (?, ?, ?, "cliente")';

    db.query(query, [nombre, correo, hashedPassword], (err) => {
      if (err) {
        logger.error(`Error al registrar usuario: ${err.message}`);
        return res.status(500).json({ message: 'Error al registrar el usuario.' });
      }
      logger.info(`Usuario registrado con éxito: ${correo}`);
      res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    });
  } catch (err) {
    logger.error(`Error inesperado: ${err.message}`);
    res.status(500).json({ message: 'Error inesperado en el servidor.' });
  }
});

// Login de usuarios
router.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    logger.warn('Intento de inicio de sesión con campos incompletos.');
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }

  const query = 'SELECT * FROM usuarios WHERE correo = ?';
  db.query(query, [correo], async (err, results) => {
    if (err) {
      logger.error(`Error al obtener usuario: ${err.message}`);
      return res.status(500).json({ message: 'Error en el servidor.' });
    }

    if (results.length === 0) {
      logger.warn(`Usuario no encontrado: ${correo}`);
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!passwordMatch) {
      logger.warn(`Contraseña incorrecta para el usuario: ${correo}`);
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    logger.info(`Usuario logueado con éxito: ${correo}`);
    res.status(200).json({
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
      tipo: user.tipo,
    });
  });
});

// Nueva ruta para obtener todos los usuarios
router.get('/', (req, res) => {
  const query = 'SELECT * FROM usuarios';

  db.query(query, (err, results) => {
    if (err) {
      logger.error(`Error al obtener usuarios: ${err.message}`);
      return res.status(500).json({ message: 'Error en el servidor.' });
    }
    res.status(200).json(results); // Devuelve los resultados en formato JSON
  });
});
module.exports = router;
