// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Definimos las rutas
router.post('/login', authController.login);
router.post('/crear-estudiante', authController.crearEstudiante);

module.exports = router;