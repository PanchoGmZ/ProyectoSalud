import React from 'react';
import { Link } from 'react-router-dom';
import './InicioAdministrador.css'; // Importar el CSS

const InicioAdministrador = () => {
  return (
    <div className="contenido-principal">
      <div className="barra-superior">
        <h2>Panel de Administración</h2>
      </div>

      <div className="bienvenida-admin">
        <h1>Bienvenido, Administrador</h1>
        <p>Gestiona todas las funcionalidades del sistema desde aquí.</p>
      </div>

      <div className="grid-botones-admin">
        <Link to="/gestion-turnos" className="boton-admin">
          <div className="icono-admin">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <h3>Gestión de Turnos</h3>
          <p>Administra y agenda citas médicas.</p>
        </Link>

        <Link to="/gestion-usuarios" className="boton-admin">
          <div className="icono-admin">
            <i className="fas fa-users-cog"></i>
          </div>
          <h3>Gestión de Usuarios</h3>
          <p>Registra o edita médicos y pacientes.</p>
        </Link>

        

        <Link to="/reportes" className="boton-admin">
          <div className="icono-admin">
            <i className="fas fa-file-alt"></i>
          </div>
          <h3>Reportes</h3>
          <p>Genera informes mensuales o anuales.</p>
        </Link>
      </div>
    </div>
  );
};

export default InicioAdministrador;