import React from 'react';
import { Link } from 'react-router-dom';
import './InicioMedico.css'; // Recuerda tener el CSS creado

const DashboardMedico = () => {
  return (
    <div className="sistema-container">
      {/* Menú lateral */}
      <aside className="menu-lateral">
        <h2 className="logo">Vive <span>más Saludable</span></h2>
        <nav className="menu-links">
          <Link to="/inicio-medico" className="activo">Inicio</Link>
          <Link to="/agenda-medico">Agenda</Link>
          <Link to="/consultas">Consultas</Link>

       
          <Link to="/resultados-pacientes">Resultados</Link>
         
          <Link to="/perfil-medico">Perfil Médico</Link>
        </nav>
      </aside>

      
      <main className="contenido-principal">
        <header className="barra-superior">
          <div className="buscador">
            <input type="text" placeholder="Buscar ..." />
            <button><i className="fas fa-search"></i></button>
          </div>
          <div className="iconos">
            <i className="fas fa-bell"></i>
            <i className="fas fa-user-circle"></i>
          </div>
        </header>

        <section className="bienvenida">
          <h1>¡Bienvenido, Médico!</h1>
          <p>Gestiona tu día de manera fácil y rápida.</p>
        </section>
      </main>
    </div>
  );
};

export default DashboardMedico;
