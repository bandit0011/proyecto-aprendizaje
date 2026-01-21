// controllers/authController.js
const UsuarioModel = require('../models/usuarioModel');

const authController = {
  
  // LÓGICA DE LOGIN
  login: (req, res) => {
    const { usuario, password, rol } = req.body;

    UsuarioModel.buscarPorUsuario(usuario, (err, result) => {
      if (err) return res.status(500).send('Error en el servidor');
      if (result.length === 0) return res.status(401).send({ mensaje: 'Usuario no encontrado' });

      const usuarioEncontrado = result[0];

      // Verificamos que el rol coincida
      if (usuarioEncontrado.rol !== rol) {
         return res.status(401).send({ mensaje: 'Rol incorrecto para este usuario' });
      }

      // Si es Admin, validamos contraseña
      if (rol === 'admin') {
        if (usuarioEncontrado.password !== password) {
           return res.status(401).send({ mensaje: 'Contraseña incorrecta' });
        }
      }

      // Login Exitoso
      res.send({
        mensaje: 'Login exitoso',
        usuario: usuarioEncontrado.nombre,
        id: usuarioEncontrado.id,
        nivel: usuarioEncontrado.nivel_cognitivo,
        rol: usuarioEncontrado.rol,
        max_nivel: usuarioEncontrado.nivel_desbloqueado
      });
    });
  },

  // LÓGICA DE REGISTRO
  crearEstudiante: (req, res) => {
    const { nombre, usuario, nivel } = req.body;

    if (!nombre || !usuario || !nivel) {
      return res.status(400).send({ mensaje: 'Faltan datos' });
    }

    UsuarioModel.crearEstudiante({ nombre, usuario, nivel }, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).send({ mensaje: 'El usuario ya existe' });
        }
        return res.status(500).send({ mensaje: 'Error en base de datos' });
      }
      res.send({ mensaje: 'Estudiante creado', id: result.insertId });
    });
  }
};

module.exports = authController;