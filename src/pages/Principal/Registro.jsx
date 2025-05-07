import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { auth, db } from "../../Data/firebase";
import './Registro.css';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    usuario: '',
    telefono: '',
    fecha: '',
    direccion: '',
    correo: '',
    contrasena: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const medicalIcons = [
      'fa-heartbeat', 'fa-stethoscope', 'fa-hospital', 'fa-user-md', 
      'fa-pills', 'fa-syringe', 'fa-ambulance', 'fa-medkit'
    ];
    
    const container = document.querySelector('.registro-container');
    
    medicalIcons.forEach((icon, index) => {
      const iconElement = document.createElement('i');
      iconElement.className = `medical-icon fas ${icon}`;
      
      const left = Math.random() * 90;
      const top = Math.random() * 90;
      const duration = Math.random() * 20 + 20;
      const delay = Math.random() * 10;
      const size = Math.random() * 2 + 1;
      
      iconElement.style.left = `${left}%`;
      iconElement.style.top = `${top}%`;
      iconElement.style.fontSize = `${size}rem`;
      iconElement.style.animationDuration = `${duration}s`;
      iconElement.style.animationDelay = `${delay}s`;
      
      container.appendChild(iconElement);
    });
    
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      const size = Math.random() * 10 + 5;
      const left = Math.random() * 100;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${left}%`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
      
      container.appendChild(particle);
    }
    
    return () => {
      document.querySelectorAll('.medical-icon, .particle').forEach(el => el.remove());
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.correo,
        formData.contrasena
      );

      await updateProfile(userCredential.user, {
        displayName: formData.nombre
      });

      const userData = {
        nombre: formData.nombre,
        usuario: formData.usuario,
        telefono: formData.telefono,
        fecha: new Date(formData.fecha).getTime(),
        direccion: formData.direccion,
        correo: formData.correo,
        contrasena: formData.contrasena
      };

      await setDoc(doc(db, "registropaciente", userCredential.user.uid), userData);

      alert('Registro exitoso y guardado en Firestore!');
      navigate("/login"); 
    } catch (error) {
      console.error('Error en el registro:', error);
      alert(error.message);
    }
  };

  return (
    <div className="registro-container">
      
      
      <form className="registro-box" onSubmit={handleSubmit}>
        <h2 className="welcome-text">Registro de Paciente</h2>
        <p className="subtitle">Complete todos los campos requeridos</p>

        <div className="input-group">
          <i className="fas fa-user"></i>
          <input 
            type="text" 
            name="nombre" 
            placeholder="Nombre completo" 
            className="input-field" 
            value={formData.nombre} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="input-group">
          <i className="fas fa-id-card"></i>
          <input 
            type="text" 
            name="usuario" 
            placeholder="Nombre de usuario" 
            className="input-field" 
            value={formData.usuario} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="input-group">
          <i className="fas fa-phone"></i>
          <input 
            type="number" 
            name="telefono" 
            placeholder="Teléfono" 
            className="input-field" 
            value={formData.telefono} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="input-group">
          <i className="fas fa-calendar-alt"></i>
          <input 
            type="date" 
            name="fecha" 
            className="input-field" 
            value={formData.fecha} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="input-group">
          <i className="fas fa-map-marker-alt"></i>
          <input 
            type="text" 
            name="direccion" 
            placeholder="Dirección" 
            className="input-field" 
            value={formData.direccion} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="input-group">
          <i className="fas fa-envelope"></i>
          <input 
            type="email" 
            name="correo" 
            placeholder="Correo electrónico" 
            className="input-field" 
            value={formData.correo} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="input-group">
          <i className="fas fa-lock"></i>
          <input 
            type="password" 
            name="contrasena" 
            placeholder="Contraseña" 
            className="input-field" 
            value={formData.contrasena} 
            onChange={handleChange} 
            required 
          />
        </div>

        <button type="submit" className="registro-button">
          REGISTRARSE <i className="fas fa-arrow-right"></i>
        </button>
        
        <p className="link-text">
          ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
        </p>
      </form>
    </div>
  );
};

export default Registro;