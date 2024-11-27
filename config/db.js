const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',        // Dirección del servidor de base de datos (usualmente localhost)
  user: 'root',             // Nombre de usuario de MySQL
  password: '',             // Contraseña de MySQL
  database: 'aguas_peninsulares', // Nombre de tu base de datos
});

// Establecer la conexión
db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.message);
    process.exit(1); // Si la conexión falla, detener el servidor
  }
  console.log('Conectado a la base de datos MySQL');
});

// Exportar la conexión para usarla en otros archivos
module.exports = db;




