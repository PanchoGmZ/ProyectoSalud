import React, { useState } from 'react';
import './Consultas.css';
import { useNavigate } from 'react-router-dom';

const Consultas = () => {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState('todas');



  const filtrarConsultas = () => {
    if (filtro === 'todas') return consultas;
    return consultas.filter((consulta) => consulta.tipo === filtro);
  };

  const handleReprogramar = (id) => {
    navigate('/agendar');
  };

  const handleAceptar = (id) => {
    console.log(`Consulta ${id} aceptada`);
  };

  const handleCancelar = (id) => {
    console.log(`Consulta ${id} cancelada`);
  };

  const handleRegresar = () => {
    navigate(-1);
  };

  return (
    <div className="pantalla-completa">
      <div className="consultas-container">
        <div className="consultas-header">
          <button className="btn-back" onClick={handleRegresar}>
            ← Regresar
          </button>
          <h1>Consultas Pendientes</h1>
        </div>

        <div className="consultas-filtros">
          <button className={`filtro-btn ${filtro === 'todas' ? 'activo' : ''}`} onClick={() => setFiltro('todas')}>Todas</button>
          <button className={`filtro-btn ${filtro === 'virtual' ? 'activo' : ''}`} onClick={() => setFiltro('virtual')}>Virtuales</button>
          <button className={`filtro-btn ${filtro === 'presencial' ? 'activo' : ''}`} onClick={() => setFiltro('presencial')}>Presenciales</button>
        </div>

        {filtrarConsultas().length === 0 ? (
          <div className="sin-consultas">No hay consultas disponibles</div>
        ) : (
          <ul className="consultas-lista">
            {filtrarConsultas().map((consulta) => (
              <li key={consulta.id} className="consulta-item">
                <div className="consulta-texto">
                  <h2>{consulta.paciente}</h2>
                  <p>{consulta.tipo === 'virtual' ? 'Consulta Virtual' : 'Consulta Presencial'} — {consulta.fecha}</p>
                </div>
                <div className="consulta-botones">
                  <button className="btn light" onClick={() => handleAceptar(consulta.id)}>Aceptar</button>
                  <button className="btn light" onClick={() => handleReprogramar(consulta.id)}>Reprogramar</button>
                  <button className="btn danger" onClick={() => handleCancelar(consulta.id)}>Cancelar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Consultas;
