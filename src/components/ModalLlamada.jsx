import React from 'react';
import './ModalLlamada.css';
const ModalLlamada = ({ medico, onAceptar, onRechazar }) => {
  return (
    <div className="modal-llamada">
      <div className="contenido-modal">
        {/* Animación de llamada */}
        <div className="animacion-llamada">
          <div className="circulo-llamada"></div>
          <div className="circulo-llamada"></div>
          <div className="circulo-llamada"></div>
        </div>
        
        {/* Información de la llamada */}
        <h2 className="titulo-llamada">Llamada entrante</h2>
        <p className="texto-llamada">Dr. {medico.nombre} está llamando</p>
        
        {/* Botones de acción */}
        <div className="contenedor-botones">
          <button 
            className="boton-aceptar" 
            onClick={onAceptar}
          >
            <i className="fas fa-phone"></i> Aceptar
          </button>
          <button 
            className="boton-rechazar" 
            onClick={onRechazar}
          >
            <i className="fas fa-phone-slash"></i> Rechazar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalLlamada;