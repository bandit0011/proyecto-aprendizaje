import { useState } from 'react';
import JuegoNiveles from './components/JuegoNiveles';
import TablaReportes from './components/TablaReportes';

function App() {
  const [vista, setVista] = useState('seleccion'); 
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [datosUsuario, setDatosUsuario] = useState(null);
  
  const [jugandoNivel, setJugandoNivel] = useState(null); 

  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoUsuario, setNuevoUsuario] = useState('');
  const [nuevoNivel, setNuevoNivel] = useState('leve');

  // --- LOGINS Y REGISTROS ---
  const manejarLogin = async (rol) => {
    try {
      const respuesta = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password, rol })
      });
      const data = await respuesta.json();
      if (respuesta.ok) {
        setDatosUsuario(data);
        setVista('dashboard');
        setMensaje('');
      } else {
        setMensaje(data.mensaje);
      }
    } catch (error) { setMensaje('Error de conexión'); }
  };

  const registrarEstudiante = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/crear-estudiante', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nuevoNombre, usuario: nuevoUsuario, nivel: nuevoNivel })
      });
      const data = await respuesta.json();
      if (respuesta.ok) {
        alert('Creado con éxito'); setVista('dashboard');
      } else { alert(data.mensaje); }
    } catch (e) { alert('Error de conexión'); }
  };

  const alSalirJuego = (puntosObtenidos) => {
    setJugandoNivel(null); 
    if (datosUsuario && datosUsuario.max_nivel <= jugandoNivel && puntosObtenidos >= 100) {
        setDatosUsuario(prev => ({ ...prev, max_nivel: prev.max_nivel + 1 }));
    }
  };

  // --- VISTAS ---

  // 1. SELECCIÓN INICIAL
  if (vista === 'seleccion') {
    return (
      <div className="main-card">
        <h1>🎓 Aventura Matemática</h1>
        <p>¡Bienvenido! Selecciona quién eres para empezar:</p>
        <div style={{marginTop: '30px'}}>
          <button className="btn-primary" onClick={() => setVista('loginEstudiante')}>
            🧒 Soy Estudiante
          </button>
          <button className="btn-secondary" onClick={() => setVista('loginAdmin')}>
            👨‍🏫 Soy Docente
          </button>
        </div>
      </div>
    );
  }

  // 2. LOGIN (Genérico)
  if (vista === 'loginAdmin' || vista === 'loginEstudiante') {
    const esAdmin = vista === 'loginAdmin';
    return (
      <div className="main-card">
        <h2>Ingreso {esAdmin ? 'Docente' : 'Estudiante'}</h2>
        
        <input className="input-bonito" placeholder="Usuario" onChange={e => setUsuario(e.target.value)} />
        
        {esAdmin && (
          <input className="input-bonito" type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} />
        )}
        
        <br />
        <button className="btn-primary" onClick={() => manejarLogin(esAdmin ? 'admin' : 'estudiante')}>
          Entrar 🚀
        </button>
        
        <p style={{color: '#F44336', fontWeight: 'bold'}}>{mensaje}</p>
        <button onClick={() => setVista('seleccion')} className="btn-volver">⬅ Volver</button>
      </div>
    );
  }

  // 3. REGISTRO
  if (vista === 'registroEstudiante') {
    return (
      <div className="main-card">
        <h2 style={{color: '#FF9800'}}>📝 Nuevo Alumno</h2>
        <input className="input-bonito" placeholder="Nombre Completo" value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} />
        <input className="input-bonito" placeholder="Usuario de acceso" value={nuevoUsuario} onChange={e => setNuevoUsuario(e.target.value)} />
        
        <select className="input-bonito" value={nuevoNivel} onChange={e => setNuevoNivel(e.target.value)}>
            <option value="leve">Leve</option><option value="moderado">Moderado</option>
        </select>
        
        <br />
        <button className="btn-primary" onClick={registrarEstudiante}>Guardar Estudiante 💾</button>
        <br />
        <button onClick={() => setVista('dashboard')} className="btn-volver">Cancelar</button>
      </div>
    );
  }

  // 4. REPORTES
  if (vista === 'reportes') {
    return (
      <div className="main-card" style={{maxWidth: '1000px'}}> 
        <TablaReportes alVolver={() => setVista('dashboard')} />
      </div>
    );
  }

  // 5. DASHBOARD Y JUEGO
  if (vista === 'dashboard') {
    
    // MODO JUEGO ACTIVO
    if (jugandoNivel) {
        return (
            <div className="main-card">
                <JuegoNiveles 
                    nivelInicial={jugandoNivel} 
                    usuarioId={datosUsuario.id} 
                    alSalir={alSalirJuego}  
                />
            </div>
        );
    }

    // MAPA DE NIVELES (DASHBOARD)
    return (
      <div className="main-card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
           <h1 style={{margin: 0}}>Hola, {datosUsuario.usuario} 👋</h1>
           {datosUsuario.rol === 'admin' && <span style={{background:'#FFEB3B', padding:'5px 10px', borderRadius:'10px'}}>Profe</span>}
        </div>
        
        {datosUsuario.rol === 'estudiante' ? (
            <div>
                <p>Nivel Actual: ⭐ <strong>{datosUsuario.max_nivel || 1}</strong></p>
                <hr style={{border: '0', borderTop: '1px solid #eee', margin: '20px 0'}}/>
                
                <div className="grid-niveles">
                    {[
                      {n:1, meta:100}, {n:2, meta:100}, {n:3, meta:120}, 
                      {n:4, meta:120}, {n:5, meta:150}, {n:6, meta:200}
                    ].map((item) => {
                        const bloqueado = item.n > (datosUsuario.max_nivel || 1);
                        return (
                            <button 
                                key={item.n}
                                disabled={bloqueado}
                                onClick={() => setJugandoNivel(item.n)}
                                className={`btn-nivel ${bloqueado ? 'nivel-bloqueado' : ''}`}
                            >
                                <div className="icono-nivel">{bloqueado ? '🔒' : '🌟'}</div>
                                <div style={{fontWeight: 'bold', fontSize: '1.1rem'}}>Nivel {item.n}</div>
                                <div style={{fontSize: '0.8rem', color: '#888'}}>Meta: {item.meta}</div>
                            </button>
                        )
                    })}
                </div>
            </div>
        ) : (
            <div>
                <p>Panel de Gestión Docente</p>
                <div style={{marginTop: '30px'}}>
                    <button className="btn-secondary" onClick={() => setVista('registroEstudiante')}>+ Nuevo Alumno</button>
                    <button className="btn-secondary" onClick={() => setVista('reportes')}>Ver Reportes 📊</button>
                </div>
            </div>
        )}
        
        <br/>
        <button onClick={() => {setVista('seleccion'); setUsuario('');}} className="btn-volver">Cerrar Sesión 🔒</button>
      </div>
    );
  }

  return <div>Cargando...</div>;
}

export default App;