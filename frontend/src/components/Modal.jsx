import React from 'react';
import '../index.css'; // Para asegurar que herede tus tipografías

const Modal = ({ mensaje, tipo, onClose }) => {
  if (!mensaje) return null;

  // Estilos "en línea" o clases para que coincidan con tu temática
  // Puedes ajustar los colores aquí según tu "image_00c5c9.png"
  const estilosFondo = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo oscuro semitransparente
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const estilosVentana = {
    backgroundColor: '#fff', // O el color crema/papel de tu juego
    border: '4px solid #8B4513', // Un borde estilo madera o acorde a tu tema
    borderRadius: '15px',
    padding: '20px',
    textAlign: 'center',
    maxWidth: '400px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    fontFamily: 'inherit' // Hereda la fuente de tu juego
  };

  const estilosBoton = {
    marginTop: '15px',
    padding: '10px 20px',
    backgroundColor: tipo === 'error' ? '#d9534f' : '#5cb85c', // Rojo si es error, Verde si es acierto
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  };

  return (
    <div style={estilosFondo}>
      <div style={estilosVentana}>
        {/* Aquí puedes agregar una imagen o icono si quieres */}
        <h2 style={{ color: '#333' }}>{tipo === 'error' ? '¡Ups!' : '¡Muy bien!'}</h2>
        <p style={{ fontSize: '18px', margin: '20px 0' }}>{mensaje}</p>
        <button style={estilosBoton} onClick={onClose}>
          Continuar
        </button>
      </div>
    </div>
  );
};

export default Modal;