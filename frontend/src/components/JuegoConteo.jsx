import { useState, useEffect } from 'react';

function JuegoConteo({ alTerminar }) {
  const [cantidad, setCantidad] = useState(0);
  const [opciones, setOpciones] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [puntos, setPuntos] = useState(0);
  const [nivel, setNivel] = useState(1);

  // Iniciar el juego al cargar
  useEffect(() => {
    generarNivel();
  }, []);

  const generarNivel = () => {
    // 1. Generar número aleatorio entre 1 y 10
    const numeroCorrecto = Math.floor(Math.random() * 9) + 1;
    setCantidad(numeroCorrecto);
    setMensaje('');

    // 2. Generar opciones incorrectas
    let opcionesTemp = [numeroCorrecto];
    while (opcionesTemp.length < 3) {
      const numRandom = Math.floor(Math.random() * 9) + 1;
      if (!opcionesTemp.includes(numRandom)) {
        opcionesTemp.push(numRandom);
      }
    }
    
    // 3. Mezclar las opciones para que no siempre esté en el mismo lugar
    setOpciones(opcionesTemp.sort(() => Math.random() - 0.5));
  };

  const verificarRespuesta = (numero) => {
    if (numero === cantidad) {
      // RESPUESTA CORRECTA
      setMensaje('¡Muy Bien! 🌟');
      setPuntos(puntos + 10);
      
      // Pasar al siguiente nivel después de 1 segundo
      setTimeout(() => {
        if (nivel < 5) { // Jugamos 5 rondas
            setNivel(nivel + 1);
            generarNivel();
        } else {
            // FIN DEL JUEGO
            alTerminar(puntos + 10); // Enviamos el puntaje final
        }
      }, 1500);

    } else {
      // RESPUESTA INCORRECTA (Neuroeducación: Feedback suave, sin castigo rojo agresivo)
      setMensaje('Inténtalo de nuevo 🧐');
    }
  };

  return (
    <div style={styles.tablero}>
      <h2 style={{color: '#009688'}}>Nivel {nivel}/5 | Puntos: {puntos}</h2>
      
      <p style={{fontSize: '20px'}}>¿Cuántas manzanas hay?</p>

      {/* ZONA VISUAL (LAS MANZANAS) */}
      <div style={styles.zonaJuego}>
        {Array.from({ length: cantidad }).map((_, index) => (
          <span key={index} style={{fontSize: '50px', margin: '5px'}}>🍎</span>
        ))}
      </div>

      {/* FEEDBACK */}
      <h3 style={{color: mensaje.includes('Bien') ? 'green' : 'orange', height: '30px'}}>
        {mensaje}
      </h3>

      {/* BOTONES DE RESPUESTA */}
      <div style={styles.botonera}>
        {opciones.map((num) => (
          <button 
            key={num} 
            style={styles.botonNumero}
            onClick={() => verificarRespuesta(num)}
          >
            {num}
          </button>
        ))}
      </div>
      
      <button style={styles.botonSalir} onClick={() => alTerminar(puntos)}>
        Salir
      </button>
    </div>
  );
}

const styles = {
  tablero: { textAlign: 'center', padding: '20px', backgroundColor: '#FFFDE7', borderRadius: '20px', border: '3px solid #FF9800' },
  zonaJuego: { margin: '20px', minHeight: '100px', backgroundColor: 'white', borderRadius: '15px', padding: '20px' },
  botonera: { display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' },
  botonNumero: { fontSize: '30px', padding: '20px', width: '80px', borderRadius: '50%', border: 'none', backgroundColor: '#2196F3', color: 'white', cursor: 'pointer', boxShadow: '0 4px #0D47A1' },
  botonSalir: { marginTop: '30px', padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}
};

export default JuegoConteo;