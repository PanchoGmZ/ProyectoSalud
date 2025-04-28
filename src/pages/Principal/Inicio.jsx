import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Inicio.css'; 
import pohi from '../Principal/img/pohi.png'
export default function Inicio() {
    const navigate = useNavigate();
    const [hoverButton, setHoverButton] = useState(null);

    return (
      <div className="container">
        <div className="left-section">
          <div className="logo">
           <img src={pohi} height={150} alt="Logo" className="logo-image" />
          </div>
          <h1 className="title">
            Vive <span className="highlight">mas Saludable</span>
          </h1>
          <p className="subtitle">Una manera facil de cuidarte</p>
        </div>
  
        <div className="right-section">
          <div className="link-group">
            <button 
              className={`nav-button ${hoverButton === 'pacientes' ? 'active' : ''}`}
              onClick={() => navigate('/inicio-paciente')}
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
              onClick={() => navigate('/inicio-medico')}
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
              onClick={() => navigate('/inicio-administrador')}
              onMouseEnter={() => setHoverButton('admin')}
              onMouseLeave={() => setHoverButton(null)}
            >
              <span className="button-text">Administrador</span>
              <span className="button-line"></span>
            </button>
          </div>
        </div>
      </div>
    );
}