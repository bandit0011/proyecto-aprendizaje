import { useEffect, useState } from 'react';

function TablaReportes({ alVolver }) {
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/juegos/reportes')
      .then(res => res.json())
      .then(data => setRegistros(data))
      .catch(err => console.error("Error cargando reportes:", err));
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2 style={{ color: '#FF9800' }}>📊 Historial de Progreso</h2>
      
      <div style={{ overflowX: 'auto', marginTop: '20px' }}>
        <table style={styles.tabla}>
          <thead>
            <tr style={styles.encabezado}>
              <th style={styles.th}>Fecha</th>
              <th style={styles.th}>Estudiante</th>
              <th style={styles.th}>Nivel</th>
              <th style={styles.th}>Juego</th>
              <th style={styles.th}>Puntos</th>
            </tr>
          </thead>
          <tbody>
            {registros.length === 0 ? (
              <tr><td colSpan="5" style={{padding: '20px'}}>No hay registros aún</td></tr>
            ) : (
              registros.map((fila) => (
                <tr key={fila.id} style={styles.fila}>
                  <td style={styles.td}>{new Date(fila.fecha).toLocaleDateString()}</td>
                  <td style={styles.td}><strong>{fila.nombre}</strong></td>
                  <td style={styles.td}>{fila.nivel_cognitivo}</td>
                  <td style={styles.td}>{fila.juego}</td>
                  <td style={{...styles.td, color: 'green', fontWeight: 'bold'}}>{fila.puntos}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button onClick={alVolver} style={styles.btnVolver}>⬅ Volver al Panel</button>
    </div>
  );
}

// Estilos de tabla
const styles = {
  tabla: { width: '100%', maxWidth: '800px', margin: '0 auto', borderCollapse: 'collapse', boxShadow: '0 0 20px rgba(0,0,0,0.1)' },
  encabezado: { backgroundColor: '#009688', color: 'white' },
  th: { padding: '15px', borderBottom: '1px solid #ddd' },
  td: { padding: '12px', borderBottom: '1px solid #ddd', backgroundColor: 'white' },
  fila: { transition: 'background-color 0.3s' },
  btnVolver: { marginTop: '30px', padding: '10px 20px', backgroundColor: '#607D8B', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default TablaReportes;