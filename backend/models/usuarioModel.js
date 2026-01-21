// models/UsuarioModel.js
const db = require('../config/db');

const UsuarioModel = {
  // Buscar un usuario por su nombre de usuario (para login)
  buscarPorUsuario: (usuario, callback) => {
    const sql = 'SELECT * FROM usuarios WHERE usuario = ?';
    db.query(sql, [usuario], callback);
  },

  // Crear un nuevo estudiante
  crearEstudiante: (datos, callback) => {
    const sql = 'INSERT INTO usuarios (nombre, usuario, rol, nivel_cognitivo) VALUES (?, ?, "estudiante", ?)';
    db.query(sql, [datos.nombre, datos.usuario, datos.nivel], callback);
  }
};

module.exports = UsuarioModel;