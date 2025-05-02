import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiUser, FiActivity, FiVideo } from 'react-icons/fi';
import './InicioPaciente.css';

const InicioPaciente = () => {
  const opciones = [
    {
      ruta: "/agendar-turno",
      icono: <FiCalendar className="opcion-icono" />,
      titulo: "Agendar Turno",
      descripcion: "Reserva una cita médica con facilidad"
    },
    {
      ruta: "/mis-turnos",
      icono: <FiClock className="opcion-icono" />,
      titulo: "Mis Turnos",
      descripcion: "Consulta tus citas programadas"
    },
    {
      ruta: "/consultas-virtuales",
      icono: <FiVideo className="opcion-icono" />,
      titulo: "Consultas Virtuales",
      descripcion: "Accede a videollamadas médicas"
    },
    {
      ruta: "/resultados-clinicos",
      icono: <FiActivity className="opcion-icono" />,
      titulo: "Resultados Clínicos",
      descripcion: "Revisa tus análisis y exámenes"
    }
  ];

  return (
    <div className="inicio-lista-container">
      <Link to="/perfil" className="boton-perfil-flotante">
        <FiUser className="perfil-icono" />
      </Link>

      <div className="inicio-lista-header">
        <h1 className="inicio-lista-titulo">Bienvenido, Paciente</h1>
        <p className="inicio-lista-subtitulo">¿Qué necesitas hacer hoy?</p>
      </div>

      <div className="inicio-lista-menu">
        {opciones.map((opcion, index) => (
          <Link to={opcion.ruta} key={index} className="inicio-lista-item">
            <div className="inicio-lista-icono">
              {opcion.icono}
            </div>
            <div className="inicio-lista-contenido">
              <h3 className="inicio-lista-item-titulo">{opcion.titulo}</h3>
              <p className="inicio-lista-item-descripcion">{opcion.descripcion}</p>
            </div>
            <div className="inicio-lista-flecha">
              <span>→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InicioPaciente;