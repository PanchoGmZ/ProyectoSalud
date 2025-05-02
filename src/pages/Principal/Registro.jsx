import React, { useState } from 'react';
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
          REGISTRARSE
        </button>
        
        <p className="link-text">
          ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
        </p>
      </form>
    </div>
  );
};

export default Registro;
