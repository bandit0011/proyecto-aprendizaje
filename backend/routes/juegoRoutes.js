const express = require('express');
const router = express.Router();
const juegoController = require('../controllers/JuegoController');

// 1. Ruta para guardar puntaje (POST)
// URL Final: http://localhost:3000/juegos/guardar
router.post('/guardar', juegoController.guardarPuntaje);

// 2. Ruta para obtener reportes (GET)
// URL Final: http://localhost:3000/juegos/reportes
router.get('/reportes', juegoController.obtenerReportes);

// 3. Ruta para cargar progreso al iniciar (GET)
// URL Final: http://localhost:3000/juegos/progreso/1/nivel_1
router.get('/progreso/:usuario_id/:nivel', juegoController.cargarPuntaje);

module.exports = router;