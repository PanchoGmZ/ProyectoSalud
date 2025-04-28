import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiUser, FiFilter, FiTrash2, FiEdit } from 'react-icons/fi';
import './MisTurnos.css'; // Archivo de estilos (abajo)

const MisTurnos = () => {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState('todos');
  
  // Datos de ejemplo (reemplazar con llamada a API)
  const [turnos, setTurnos] = useState([
    {
      id: 1,
      fecha: '2023-11-15',
      hora: '10:00',
      medico: 'Dra. Pérez',
      especialidad: 'Cardiología',
      estado: 'confirmado',
      tipo: 'Presencial'
    },
    {
      id: 2,
      fecha: '2023-11-18',
      hora: '15:30',
      medico: 'Dr. Gómez',
      especialidad: 'Dermatología',
      estado: 'pendiente',
      tipo: 'Virtual'
    },
    {
      id: 3,
      fecha: '2023-11-20',
      hora: '09:00',
      medico: 'Dr. Rodríguez',
      especialidad: 'Pediatría',
      estado: 'cancelado',
      tipo: 'Domicilio'
    }
  ]);

  const filtrarTurnos = () => {
    if (filtro === 'todos') return turnos;
    return turnos.filter(turno => turno.estado === filtro);
  };

  const cancelarTurno = (id) => {
    if (window.confirm('¿Estás seguro de cancelar este turno?')) {
      setTurnos(turnos.filter(turno => turno.id !== id));
    }
  };

  const editarTurno = (id) => {
    navigate(`/editar-turno/${id}`);
  };

  return (
    <div className="mis-turnos-container">
      <div className="mis-turnos-header">
        <h1><FiCalendar /> Mis Turnos</h1>
        <div className="filtros">
          <FiFilter />
          <select 
            value={filtro} 
            onChange={(e) => setFiltro(e.target.value)}
            className="filtro-select"
          >
            <option value="todos">Todos</option>
            <option value="confirmado">Confirmados</option>
            <option value="pendiente">Pendientes</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>
      </div>

      <div className="turnos-list">
        {filtrarTurnos().length > 0 ? (
          filtrarTurnos().map((turno) => (
            <div key={turno.id} className={`turno-card ${turno.estado}`}>
              <div className="turno-info">
                <h3>{turno.especialidad}</h3>
                <p><FiUser /> {turno.medico}</p>
                <p><FiCalendar /> {new Date(turno.fecha).toLocaleDateString()}</p>
                <p><FiClock /> {turno.hora}</p>
                <p>Tipo: {turno.tipo}</p>
              </div>
              
              <div className="turno-actions">
                <span className={`estado-badge ${turno.estado}`}>
                  {turno.estado.toUpperCase()}
                </span>
                
                {turno.estado !== 'cancelado' && (
                  <>
                    <button 
                      onClick={() => editarTurno(turno.id)} 
                      className="action-btn edit"
                    >
                      <FiEdit /> Editar
                    </button>
                    <button 
                      onClick={() => cancelarTurno(turno.id)} 
                      className="action-btn cancel"
                    >
                      <FiTrash2 /> Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-turnos">
            <p>No hay turnos registrados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MisTurnos;