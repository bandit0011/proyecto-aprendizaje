const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES (Importante: CORS debe ir antes de las rutas)
app.use(cors());
app.use(express.json());

// --- IMPORTAR ARCHIVOS DE RUTAS ---
const authRoutes = require('./routes/authRoutes');
const juegoRoutes = require('./routes/juegoRoutes'); // <--- ¿Tenías esta línea?

// --- USAR LAS RUTAS ---
// 1. Rutas de Autenticación (Login, Registro)
app.use('/', authRoutes);

// 2. Rutas de Juegos (Guardar, Cargar, Reportes)
// ¡ESTA ES LA LÍNEA QUE ARREGLA EL ERROR 404! 👇
app.use('/juegos', juegoRoutes); 

// Ruta de prueba base
app.get('/', (req, res) => {
  res.send('API del Proyecto Educativo funcionando 🚀');
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});