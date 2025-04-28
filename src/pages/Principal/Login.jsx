import React from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Aquí podrías agregar validaciones si quisieras
    navigate('/inicio-paciente');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="welcome-text">Bienvenido de nuevo</h2>
        <p className="subtitle">Ingresa tus credenciales para continuar</p>

        <input type="text" placeholder="Usuario" className="input-field" />
        <input type="password" placeholder="Contraseña" className="input-field" />

        <button className="login-button" onClick={handleLogin}>
          Ingresar
        </button>

        <p className="link-text">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
