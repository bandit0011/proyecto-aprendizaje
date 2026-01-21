// Carga las variables del archivo .env
require('dotenv').config(); 

const mysql = require('mysql2');

// Creamos la conexión usando las variables de entorno (process.env)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306 // Usa 3306 por defecto si no está definido
});

// Intentar conectar
db.connect((err) => {
  if (err) {
    console.error('❌ Error CRÍTICO conectando a la Base de Datos:');
    console.error('Mensaje:', err.message);
    
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
        console.error('💡 Pista: Verifica tu usuario y contraseña en el archivo .env');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
        console.error('💡 Pista: Verifica que el nombre de la base de datos en .env sea correcto');
    }
    return;
  }
  console.log('✅ Conectado a MySQL exitosamente (vía .env)');
});

module.exports = db;