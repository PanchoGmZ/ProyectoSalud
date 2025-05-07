
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Inicio.css';
import pohi from '../Principal/img/pohi.png';

export default function Inicio() {
  const navigate = useNavigate();
  const [hoverButton, setHoverButton] = useState(null);

  return (
    <div className="container">
      {/* Fondo animado con partículas */}
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`
          }}></div>
        ))}
      </div>

      {/* Texto flotante animado */}
      <div className="floating-text">El grupo Miski Palomo</div>
      

      {/* Contenido principal */}
      <div className="left-section">
        <div className="logo animate-pop-in">
          <img src={pohi} height={150} alt="Logo" className="logo-image" />
        </div>
<<<<<<< HEAD
  
        <div className="right-section">
          <div className="link-group">
            <button 
              className={`nav-button ${hoverButton === 'pacientes' ? 'active' : ''}`}
              onClick={() => navigate('/login')}
              onMouseEnter={() => setHoverButton('pacientes')}
              onMouseLeave={() => setHoverButton(null)}
            >
              <span className="button-text">Pacientes</span>
              <span className="button-line"></span>
            </button>
          </div>
          <div className="link-group">
            <button 
              className={`nav-button ${hoverButton === 'medicos' ? 'active' : ''}`}
              onClick={() => navigate('/loginmedico')}
              onMouseEnter={() => setHoverButton('medicos')}
              onMouseLeave={() => setHoverButton(null)}
            >
              <span className="button-text">Medicos</span>
              <span className="button-line"></span>
            </button>
          </div>
          <div className="link-group">
            <button 
              className={`nav-button ${hoverButton === 'admin' ? 'active' : ''}`}
              onClick={() => navigate('/login-administrador')}
              onMouseEnter={() => setHoverButton('admin')}
              onMouseLeave={() => setHoverButton(null)}
            >
              <span className="button-text">Administrador</span>
              <span className="button-line"></span>
            </button>
          </div>
=======
        <h1 className="title animate-pop-in" style={{ animationDelay: '0.3s' }}>
          Vive <span className="highlight animate-color-change">mas Saludable</span>
        </h1>
        <p className="subtitle animate-fade-in" style={{ animationDelay: '0.6s' }}>
          Una manera fácil de cuidarte
        </p>
      </div>

      <div className="right-section">
        <div className="link-group">
          <button
            className={`nav-button ${hoverButton === 'pacientes' ? 'active' : ''} animate-float`}
            onClick={() => navigate('/login')}
            onMouseEnter={() => setHoverButton('pacientes')}
            onMouseLeave={() => setHoverButton(null)}
          >
            <span className="button-text">Pacientes</span>
            <span className="button-line"></span>
          </button>
        </div>
        <div className="link-group">
          <button
            className={`nav-button ${hoverButton === 'medicos' ? 'active' : ''} animate-float`}
            onClick={() => navigate('/loginmedico')}
            onMouseEnter={() => setHoverButton('medicos')}
            onMouseLeave={() => setHoverButton(null)}
            style={{ animationDelay: '0.2s' }}
          >
            <span className="button-text">Médicos</span>
            <span className="button-line"></span>
          </button>
        </div>
        <div className="link-group">
          <button
            className={`nav-button ${hoverButton === 'admin' ? 'active' : ''} animate-float`}
            onClick={() => navigate('/login-administrador')}
            onMouseEnter={() => setHoverButton('admin')}
            onMouseLeave={() => setHoverButton(null)}
            style={{ animationDelay: '0.4s' }}
          >
            <span className="button-text">Administrador</span>
            <span className="button-line"></span>
          </button>
>>>>>>> 1825dd297ef88995f34677eb10c5e8fd5050f879
        </div>
      </div>
    </div>
  );
}