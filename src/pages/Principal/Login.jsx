import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Data/firebase'; 
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    correo: '',
    contrasena: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
  // Crear nubes
  const createClouds = () => {
    const container = document.querySelector('body');
    
    for (let i = 0; i < 5; i++) {
      const cloud = document.createElement('div');
      cloud.className = 'cloud';
      
      const size = Math.random() * 150 + 50;
      const top = Math.random() * 100;
      const duration = Math.random() * 30 + 20;
      const delay = Math.random() * 15;
      
      cloud.style.width = `${size}px`;
      cloud.style.height = `${size/2}px`;
      cloud.style.top = `${top}%`;
      cloud.style.left = `${Math.random() * -20}%`;
      cloud.style.animationDuration = `${duration}s`;
      cloud.style.animationDelay = `${delay}s`;
      
      // Añadir partes adicionales a la nube
      cloud.style.setProperty('--cloud-size', `${size}px`);
      
      container.appendChild(cloud);
    }
  };
  
  // Crear elementos médicos flotantes
  const createMedicalElements = () => {
    const elements = ['cross', 'pill'];
    const container = document.querySelector('body');
    
    for (let i = 0; i < 10; i++) {
      const element = document.createElement('div');
      element.className = `medical-element ${elements[Math.floor(Math.random() * elements.length)]}`;
      
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const duration = Math.random() * 25 + 20;
      const delay = Math.random() * 10;
      
      element.style.left = `${left}%`;
      element.style.top = `${top}%`;
      element.style.animationDuration = `${duration}s`;
      element.style.animationDelay = `${delay}s`;
      
      container.appendChild(element);
    }
  };
  
  createClouds();
  createMedicalElements();
  
  return () => {
    document.querySelectorAll('.cloud, .medical-element').forEach(el => el.remove());
  };
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async () => {
    if (!formData.correo || !formData.contrasena) {
      setErrorMsg('Debe ingresar correo y contraseña');
      return;
    }

    setCargando(true);
    setErrorMsg('');

    try {
      await signInWithEmailAndPassword(auth, formData.correo, formData.contrasena);
      localStorage.setItem('correoPaciente', formData.correo);
      navigate('/inicio-paciente'); 
    } catch (error) {
      setErrorMsg('Credenciales incorrectas o usuario no registrado.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
   
      <div className="ecg-line"></div>
      
      <div className="login-box">
        <h2 className="welcome-text">Bienvenido de nuevo</h2>
        <p className="subtitle">Ingresa tus credenciales para continuar</p>

        <input
          type="email"
          name="correo"
          placeholder="Correo"
          className="input-field"
          value={formData.correo}
          onChange={handleChange}
        />
        <input
          type="password"
          name="contrasena"
          placeholder="Contraseña"
          className="input-field"
          value={formData.contrasena}
          onChange={handleChange}
        />

        {errorMsg && <p className="error-text">{errorMsg}</p>}

        <button className="login-button" onClick={handleLogin} disabled={cargando}>
          {cargando ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Cargando...
            </>
          ) : (
            <>
              <i className="fas fa-sign-in-alt"></i> Ingresar
            </>
          )}
        </button>

        <p className="link-text">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;