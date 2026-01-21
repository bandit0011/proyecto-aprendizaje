const db = require('../config/db');

const JuegoModel = {
  // Guardar puntaje
  guardarProgreso: (datos, callback) => {
    const sql = 'INSERT INTO progreso (usuario_id, juego, puntos) VALUES (?, ?, ?)';
    db.query(sql, [datos.usuario_id, datos.juego, datos.puntos], callback);
  },

  // (NUEVO) Obtener reporte de TODOS los alumnos con sus nombres
  obtenerReporteGeneral: (callback) => {
    // Usamos INNER JOIN para combinar la tabla progreso con usuarios
    const sql = `
      SELECT p.id, u.nombre, u.nivel_cognitivo, p.juego, p.puntos, p.fecha 
      FROM progreso p
      JOIN usuarios u ON p.usuario_id = u.id
      ORDER BY p.fecha DESC
    `;
    db.query(sql, callback);
  },

  // (NUEVO) Obtener el último puntaje de un usuario en un nivel específico
  obtenerPuntajeActual: (usuario_id, juego, callback) => {
    // Buscamos el registro más reciente (ORDER BY id DESC LIMIT 1)
    const sql = 'SELECT puntos FROM progreso WHERE usuario_id = ? AND juego = ? ORDER BY id DESC LIMIT 1';
    db.query(sql, [usuario_id, juego], callback);
  }

};

module.exports = JuegoModel;