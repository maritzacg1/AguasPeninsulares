const { createLogger, format, transports } = require('winston');

// Configuración del logger
const logger = createLogger({
  level: 'info',  // Nivel mínimo de mensajes a registrar (puede ser 'error', 'warn', 'info', 'debug')
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [
    new transports.Console(),  // Muestra logs en la consola
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Guarda errores en un archivo
    new transports.File({ filename: 'logs/combined.log' })  // Guarda todos los logs en un archivo
  ],
});

module.exports = logger;
