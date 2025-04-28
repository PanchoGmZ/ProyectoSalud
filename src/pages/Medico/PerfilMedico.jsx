import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiPhone, FiCalendar, FiAward, FiClock } from 'react-icons/fi';
import './PerfilMedico.css';

const PerfilMedico = () => {
  const navigate = useNavigate();

  return (
    <div className="perfil-medico-container">
      <div className="glass-card">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiArrowLeft className="icon" /> Volver
        </button>

        <div className="perfil-header">
          <div className="avatar-container">
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
              alt="Dr. Franklin Socompi"
              className="perfil-foto"
            />
            <div className="status-badge">Disponible</div>
          </div>
          
          <div className="perfil-info">
            <h1>Dr. Franklin Socompi</h1>
            <span className="especialidad">Cardiólogo</span>
            
            <div className="contact-info">
              <p><FiMail className="icon" /> dr.franklin@example.com</p>
              <p><FiPhone className="icon" /> +591 70000000</p>
            </div>
            
            <button className="cta-button">
              <FiCalendar className="icon" /> Solicitar cita
            </button>
          </div>
        </div>

        <div className="perfil-detalles">
          <div className="detail-card">
            <h3><FiAward className="icon" /> Biografía Profesional</h3>
            <p>
              Médico especializado en cardiología con más de 10 años de experiencia en diagnóstico y tratamiento de enfermedades cardiovasculares. Comprometido con el bienestar integral de sus pacientes y la aplicación de las últimas técnicas médicas basadas en evidencia científica.
            </p>
          </div>

          <div className="detail-card">
            <h3><FiAward className="icon" /> Formación Académica</h3>
            <ul>
              <li><span className="highlight">Universidad Mayor de San Andrés</span> - Medicina General</li>
              <li><span className="highlight">Universidad de Buenos Aires</span> - Especialidad en Cardiología</li>
              <li><span className="highlight">Harvard Medical School</span> - Curso Avanzado en Electrofisiología</li>
            </ul>
          </div>

          <div className="detail-card schedule">
            <h3><FiClock className="icon" /> Horarios de Atención</h3>
            <div className="schedule-grid">
              <div>
                <h4>Consultorio Principal</h4>
                <p>Lunes a Viernes: 8:00 AM - 5:00 PM</p>
                <p>Sábados: 9:00 AM - 12:00 PM</p>
              </div>
              <div>
                <h4>Clínica Santa María</h4>
                <p>Martes y Jueves: 2:00 PM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilMedico;