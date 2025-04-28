import React from 'react';
import './Registro.css';

const Registro = () => {
  return (
    <div className="registro-container">
      <div className="registro-box">
        <h2 className="welcome-text">Crea tu cuenta</h2>
        <p className="subtitle">Llena los campos para registrarte</p>

        <input type="text" placeholder="Nombre completo" className="input-field" />
        <input type="text" placeholder="Número de Teléfono" className="input-field" />
        <input type="date" className="input-field" />
        <input type="text" placeholder="Dirección Domicilio" className="input-field" />
        <input type="email" placeholder="Correo Electrónico" className="input-field" />
        <input type="text" placeholder="Usuario" className="input-field" />
        <input type="password" placeholder="Contraseña" className="input-field" />

        <button className="registro-button">REGISTRARSE</button>

        <p className="link-text">¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a></p>
      </div>
    </div>
  );
};

export default Registro;