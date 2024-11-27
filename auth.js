const jwt = require('jsonwebtoken'); // Asegúrate de tener jsonwebtoken instalado: npm install jsonwebtoken

// Clave secreta para firmar los tokens (usa una variable de entorno en producción)
const SECRET_KEY = 'tu_clave_secreta';

// Función para generar un token
const generateToken = (user) => {
    const payload = { id: user.id, tipo: user.tipo }; // Crea el contenido del token
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' }); // Firma el token con un tiempo de expiración de 1 hora
};

// Función para verificar un token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY); // Verifica y decodifica el token
    } catch (err) {
        throw new Error('Token inválido'); // Lanza un error si el token no es válido
    }
};

// Middleware para verificar roles
const verifyRole = (requiredRole) => {
    return (req, res, next) => {
        if (req.user.tipo !== requiredRole) {
            return res.status(403).send('Acceso denegado. No tienes los permisos adecuados.');
        }
        next();
    };
};

module.exports = { generateToken, verifyToken, verifyRole };
