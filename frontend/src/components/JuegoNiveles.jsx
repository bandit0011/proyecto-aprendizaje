import { useState, useEffect, useRef } from 'react';

function JuegoNiveles({ nivelInicial, usuarioId, alSalir }) {
  const [nivelActivo, setNivelActivo] = useState(nivelInicial || 1);
  const [datosJuego, setDatosJuego] = useState({});
  const [mensaje, setMensaje] = useState('');
  
  // PUNTUACIÓN
  const [puntos, setPuntos] = useState(0);
  const [metaPuntos, setMetaPuntos] = useState(100); 

  // Referencia para la música de fondo
  const musicaFondoRef = useRef(null);

  // CONFIGURACIÓN DE NIVELES
  const config = {
    1: { titulo: "Nivel 1: Sumas (1 dígito)", color: "#4CAF50", icono: "➕", meta: 100 },
    2: { titulo: "Nivel 2: Restas (1 dígito)", color: "#FF9800", icono: "➖", meta: 100 },
    3: { titulo: "Nivel 3: Sumas/Restas (2 dígitos)", color: "#2196F3", icono: "🔢", meta: 120 },
    4: { titulo: "Nivel 4: Lógica (> < =)", color: "#9C27B0", icono: "⚖️", meta: 120 },
    5: { titulo: "Nivel 5: Multiplicación", color: "#E91E63", icono: "✖️", meta: 150 },
    6: { titulo: "Nivel 6: Desafío Final", color: "#3F51B5", icono: "🎓", meta: 200 }
  };

  // --- EFECTO: MÚSICA DE FONDO (.WAV) ---
  useEffect(() => {
    // CAMBIO AQUI: Extensión .wav
    musicaFondoRef.current = new Audio('/sounds/fondo.wav');
    musicaFondoRef.current.loop = true; 
    musicaFondoRef.current.volume = 0.2; 
    
    const promesaAudio = musicaFondoRef.current.play();
    
    if (promesaAudio !== undefined) {
      promesaAudio.catch(error => {
        console.log("Autoplay bloqueado. Interactúa para escuchar.", error);
      });
    }

    return () => {
      if (musicaFondoRef.current) {
        musicaFondoRef.current.pause();
        musicaFondoRef.current.currentTime = 0;
      }
    };
  }, []); 

  // --- EFECTOS DE SONIDO (.WAV) ---
  const reproducirSonido = (tipo) => {
    // CAMBIO AQUI: Extensiones .wav
    const audio = new Audio(tipo === 'bien' ? '/sounds/acierto.wav' : '/sounds/error.wav');
    audio.volume = 0.6; 
    audio.play().catch(e => console.error(e));
  };

  // AL INICIAR EL NIVEL
  useEffect(() => {
    iniciarNivel();
  }, [nivelActivo]);

  const iniciarNivel = () => {
    setMetaPuntos(config[nivelActivo].meta); 
    
    // RECUPERAR PROGRESO DEL SERVIDOR
    fetch(`http://localhost:3000/juegos/progreso/${usuarioId}/nivel_${nivelActivo}`)
      .then(res => res.json())
      .then(data => {
        if (data.puntos > 0 && data.puntos < config[nivelActivo].meta) {
          setPuntos(data.puntos);
        } else {
          setPuntos(0); 
        }
      })
      .catch(err => console.error("Error cargando progreso:", err));

    cargarProblema();
  };

  const cargarProblema = () => {
    setMensaje('');
    let p = {};

    switch(nivelActivo) {
      case 1: 
        const n1a = rnd(1, 9), n1b = rnd(1, 9);
        p = { pregunta: `${n1a} + ${n1b}`, respuesta: n1a+n1b, opciones: genOps(n1a+n1b), visual1: n1a, visual2: n1b, tipoVisual: 'suma' };
        break;
      case 2: 
        const n2a = rnd(2, 9), n2b = rnd(1, n2a);
        p = { pregunta: `${n2a} - ${n2b}`, respuesta: n2a-n2b, opciones: genOps(n2a-n2b), visual1: n2a, visual2: n2b, tipoVisual: 'resta' };
        break;
      case 3: 
        const esSuma = Math.random() > 0.5;
        const n3a = rnd(10, 20), n3b = rnd(1, 9);
        p = esSuma 
          ? { pregunta: `${n3a} + ${n3b}`, respuesta: n3a+n3b, opciones: genOps(n3a+n3b), tipoVisual: 'none' }
          : { pregunta: `${n3a} - ${n3b}`, respuesta: n3a-n3b, opciones: genOps(n3a-n3b), tipoVisual: 'none' };
        break;
      case 4: 
        const n4a = rnd(10, 50), n4b = rnd(10, 50);
        let resp4 = '='; if(n4a > n4b) resp4='>'; if(n4a < n4b) resp4='<';
        p = { pregunta: `${n4a} ___ ${n4b}`, respuesta: resp4, opciones: ['>', '<', '='], tipoVisual: 'comparacion' };
        break;
      case 5: 
        const n5a = [2,5,10][rnd(0,2)], n5b = rnd(1,10);
        p = { pregunta: `${n5a} x ${n5b}`, respuesta: n5a*n5b, opciones: genOps(n5a*n5b), visual1: n5a, visual2: n5b, tipoVisual: 'grupos' };
        break;
      case 6: 
        const tipo = rnd(1,3);
        const v1=rnd(10,50), v2=rnd(2,9);
        if(tipo===1) p={pregunta:`${v1} + ${v2}`, respuesta:v1+v2, opciones:genOps(v1+v2), tipoVisual:'none'};
        if(tipo===2) p={pregunta:`${v1} - ${v2}`, respuesta:v1-v2, opciones:genOps(v1-v2), tipoVisual:'none'};
        if(tipo===3) { const d=rnd(2,5), c=rnd(2,10); p={pregunta:`${d*c} ÷ ${d}`, respuesta:c, opciones:genOps(c), tipoVisual:'none'}; }
        break;
      default: break;
    }
    setDatosJuego(p);
  };

  const verificar = async (seleccion) => {
    if (seleccion === datosJuego.respuesta) {
      reproducirSonido('bien'); // Sonido Correcto
      setMensaje('¡BIEN HECHO! (+10) 🌟');
      const nuevosPuntos = puntos + 10;
      setPuntos(nuevosPuntos);

      if (nuevosPuntos >= metaPuntos) {
        await guardarProgreso(nuevosPuntos, true); 
        alert(`¡FELICIDADES! 🎉\nCompletaste el ${config[nivelActivo].titulo}\nRegresando al mapa...`);
        alSalir(nuevosPuntos); 
      } else {
        guardarProgreso(nuevosPuntos, false); 
        setTimeout(cargarProblema, 1000); 
      }
    } else {
      reproducirSonido('mal'); // Sonido Error
      setMensaje('Ups, cuidado (-5) 📉');
      const ptsResta = Math.max(0, puntos - 5);
      setPuntos(ptsResta);
      guardarProgreso(ptsResta, false);
    }
  };

  const guardarProgreso = async (pts, desbloquear) => {
    try {
      await fetch('http://localhost:3000/juegos/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuarioId, jogo: `nivel_${nivelActivo}`, // Corrección menor: 'juego' es la clave correcta en el backend
          juego: `nivel_${nivelActivo}`,
          puntos: pts, nivel_jugado: nivelActivo, gano_nivel: desbloquear
        })
      });
    } catch(e) { console.error("Error guardando:", e); }
  };

  // --- UTILIDADES ---
  function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function genOps(correcta) {
    let ops = [correcta];
    while(ops.length < 3) {
      let r = correcta + rnd(-5, 5);
      if(r >= 0 && !ops.includes(r)) ops.push(r);
    }
    return ops.sort(() => Math.random() - 0.5);
  }

  // --- RENDERIZADO VISUAL ---
  const renderVisual = () => {
    if (datosJuego.tipoVisual === 'suma') 
      return <div style={styles.visual}>{Array(datosJuego.visual1).fill('🔵').join('')} + {Array(datosJuego.visual2).fill('🔵').join('')}</div>;
    if (datosJuego.tipoVisual === 'resta') 
      return <div style={styles.visual}>{Array(datosJuego.visual1).fill('🔴').join('')} <span style={{fontSize:'14px'}}>(Quita {datosJuego.visual2})</span></div>;
    if (datosJuego.tipoVisual === 'grupos') 
      return <div style={{color:'#777'}}>💡 {datosJuego.visual1} grupos de {datosJuego.visual2}</div>;
    return null;
  };

  const colorTema = config[nivelActivo].color;

  return (
    <div style={styles.container}>
      {/* BARRA DE PROGRESO */}
      <div style={styles.header}>
        <div style={{...styles.badge, background: colorTema}}>{config[nivelActivo].titulo}</div>
        <button onClick={() => alSalir(0)} style={styles.btnExit}>Salir</button>
      </div>

      <div style={styles.barraBg}>
        <div style={{...styles.barraFill, width: `${(puntos/metaPuntos)*100}%`, background: colorTema}}></div>
        <span style={styles.textoMeta}>{puntos} / {metaPuntos} pts</span>
      </div>

      {/* TARJETA */}
      <div style={{...styles.card, borderTop: `6px solid ${colorTema}`}}>
        <div style={{...styles.pregunta, color: colorTema}}>
            {datosJuego.pregunta} {datosJuego.tipoVisual !== 'comparacion' && '= ?'}
        </div>
        {renderVisual()}
      </div>

      <div style={{height: '25px', color: mensaje.includes('BIEN')?'green':'red', fontWeight:'bold'}}>{mensaje}</div>

      {/* BOTONES */}
      <div style={styles.opciones}>
        {datosJuego.opciones && datosJuego.opciones.length > 0 ? (
          datosJuego.opciones.map((op, i) => (
            <button key={i} style={styles.btnOp} onClick={() => verificar(op)}>
              {op}
            </button>
          ))
        ) : (
          <p>Cargando opciones...</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '500px', margin: '0 auto', padding: '20px', fontFamily: 'Arial', textAlign: 'center' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  badge: { color: 'white', padding: '5px 15px', borderRadius: '15px', fontWeight: 'bold' },
  btnExit: { border: 'none', background: '#ddd', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' },
  barraBg: { background: '#eee', height: '25px', borderRadius: '12px', position: 'relative', overflow: 'hidden', marginBottom: '20px' },
  barraFill: { height: '100%', transition: 'width 0.3s' },
  textoMeta: { position: 'absolute', width: '100%', top: '4px', left: 0, fontSize: '12px', fontWeight: 'bold', color: '#333' },
  card: { background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', marginBottom: '20px' },
  pregunta: { fontSize: '48px', fontWeight: 'bold' },
  visual: { fontSize: '24px', marginTop: '10px', letterSpacing: '5px' },
  opciones: { display: 'flex', gap: '15px', justifyContent: 'center', minHeight: '60px' },
  btnOp: { 
    fontSize: '30px', 
    padding: '15px 25px', 
    borderRadius: '10px', 
    border: '2px solid #eee', 
    background: 'white', 
    color: '#333', 
    cursor: 'pointer', 
    boxShadow: '0 4px #ddd',
    minWidth: '80px' 
  }
};

export default JuegoNiveles;