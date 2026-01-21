const db = require('../config/db'); // Importamos la conexión para poder actualizar el nivel
const JuegoModel = require('../models/JuegoModel');

const juegoController = {
  
  // Guardar Puntos Y Desbloquear Nivel (Lógica Avanzada)
  guardarPuntaje: (req, res) => {
    // Recibimos nuevos datos: nivel_jugado y si gano_nivel

    console.log("📥 Intento de guardar:", req.body);

    const { usuario_id, juego, puntos, nivel_jugado, gano_nivel } = req.body;

    if (!usuario_id || !juego) return res.status(400).send({ mensaje: 'Faltan datos' });

    // 1. Primero guardamos el historial de la partida (siempre se guarda)
    JuegoModel.guardarProgreso({ usuario_id, juego, puntos }, (err, result) => {
      if (err) return res.status(500).send({ mensaje: 'Error al guardar el progreso' });

      // 2. Si el niño ganó el nivel, intentamos desbloquear el siguiente
      if (gano_nivel) {
        const siguienteNivel = nivel_jugado + 1;
        
        // Query de Actualización:
        // "Pon el nivel X al usuario Y, PERO SOLO SI su nivel actual es menor al nuevo"
        // (Esto evita que si rejuega el nivel 1, se le baje el nivel si ya iba por el 5)
        const sqlUpdate = 'UPDATE usuarios SET nivel_desbloqueado = ? WHERE id = ? AND nivel_desbloqueado < ?';
        
        db.query(sqlUpdate, [siguienteNivel, usuario_id, siguienteNivel], (errUpdate, resUpdate) => {
           if (errUpdate) console.error("Error al subir nivel:", errUpdate);
           
           // Respondemos al frontend confirmando el nuevo nivel
           res.send({ 
             mensaje: '¡Puntaje guardado y Nivel Subido!', 
             nivel_desbloqueado: siguienteNivel 
           });
        });

      } else {
        // Si perdió o no superó la racha, solo confirmamos el guardado
        res.send({ mensaje: 'Puntaje guardado (sin subir nivel)' });
      }
    });
  },

  // Enviar Reportes (Se mantiene igual)
  obtenerReportes: (req, res) => {
    JuegoModel.obtenerReporteGeneral((err, result) => {
      if (err) return res.status(500).send({ mensaje: 'Error obteniendo reportes' });
      res.send(result);
    });
  },

  cargarPuntaje: (req, res) => {
    const { usuario_id, nivel } = req.params; // Recibimos ID y Nivel por URL

    JuegoModel.obtenerPuntajeActual(usuario_id, nivel, (err, result) => {
      if (err) return res.status(500).send({ mensaje: 'Error al cargar' });
      
      // Si hay registros, devolvemos los puntos. Si no, devolvemos 0.
      if (result && result.length > 0) {
        res.send({ puntos: result[0].puntos });
      } else {
        res.send({ puntos: 0 });
      }
    });
  }

};

module.exports = juegoController;