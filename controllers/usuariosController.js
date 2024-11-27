const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const logger = require('../logger');

// Clave secreta para JWT (usa una clave más segura en producción)
const SECRET_KEY = 'mi_clave_secreta';

// Registro de usuarios (contraseña cifrada)
const registerUsuario = async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  if (!nombre || !correo || !contrasena) {
    logger.warn('Intento de registro con campos incompletos.');
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }

  try {
    // Cifrar contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const query = `INSERT INTO usuarios (nombre, correo, contrasena, tipo) VALUES (?, ?, ?, 'cliente')`;

    db.query(query, [nombre, correo, hashedPassword], (err, result) => {
      if (err) {
        logger.error(`Error al registrar usuario: ${err.message}`);
        return res.status(500).json({ message: 'Error en el servidor al registrar el usuario.' });
      }

      logger.info(`Usuario registrado con éxito: ${correo}`);
      return res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    });
  } catch (err) {
    logger.error(`Error inesperado: ${err.message}`);
    res.status(500).json({ message: 'Error inesperado en el servidor.' });
  }
};

// Iniciar sesión (Autenticación)
const loginUsuario = (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }

  const query = 'SELECT * FROM usuarios WHERE correo = ?';
  db.query(query, [correo], async (err, result) => {
    if (err) {
      logger.error(`Error al buscar usuario: ${err.message}`);
      return res.status(500).json({ message: 'Error al buscar usuario.' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const user = result[0];
    const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    // Crear token JWT
    const token = jwt.sign({ id: user.id, nombre: user.nombre }, SECRET_KEY, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  });
};

module.exports = {
  registerUsuario,
  loginUsuario
};
