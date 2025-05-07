import React, { useEffect, useState } from 'react';
import { auth, db } from '../../Data/firebase';
import { getDocs, collection } from 'firebase/firestore';
import './PerfilMedico.css';

const PerfilMedico = () => {
  const [medico, setMedico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerPerfilMedico = async () => {
      try {
        const usuarioActual = auth.currentUser;

        if (!usuarioActual) {
          setError('No hay ningún médico autenticado.');
          setLoading(false);
          return;
        }

        const querySnapshot = await getDocs(collection(db, 'registromedico'));
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const medicoEncontrado = docs.find(doc => doc.uid === usuarioActual.uid);

        if (medicoEncontrado) {
          setMedico(medicoEncontrado);
        } else {
          setError('No se encontró el perfil del médico.');
        }

      } catch (error) {
        console.error('Error al obtener perfil del médico:', error);
        setError('Hubo un problema al cargar el perfil. Por favor intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    obtenerPerfilMedico();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Cargando perfil médico...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-triangle error-icon"></i>
        <h2 className="error-message">{error}</h2>
        <button className="error-btn" onClick={() => window.location.reload()}>
          <i className="fas fa-sync-alt"></i> Intentar nuevamente
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Animación de doctores de fondo */}
      <div className="doctor-animation">
        <i className="fas fa-user-md doctor"></i>
        <i className="fas fa-stethoscope doctor"></i>
        <i className="fas fa-heartbeat doctor"></i>
        <i className="fas fa-hospital-user doctor"></i>
      </div>

      {/* Tarjeta de perfil */}
      <div className="profile-card">
        {/* Encabezado */}
        <div className="profile-header">
          <img 
            src={medico.foto || 'https://cdn-icons-png.flaticon.com/512/3304/3304567.png'} 
            alt="Foto del médico" 
            className="profile-avatar"
          />
          <h1 className="profile-title">Dr. {medico.nombre}</h1>
          <p className="profile-specialty">{medico.especialidad}</p>
        </div>

        {/* Contenido principal */}
        <div className="profile-content">
          {/* Tarjeta de información - Correo */}
          <div className="info-card">
            <i className="fas fa-envelope"></i>
            <h3 className="info-title">Correo Electrónico</h3>
            <p className="info-value">{medico.correo}</p>
          </div>

          {/* Tarjeta de información - Teléfono */}
          <div className="info-card">
            <i className="fas fa-phone-alt"></i>
            <h3 className="info-title">Teléfono</h3>
            <p className="info-value">{medico.telefono || 'No especificado'}</p>
          </div>

          {/* Tarjeta de información - Dirección */}
          <div className="info-card">
            <i className="fas fa-map-marker-alt"></i>
            <h3 className="info-title">Dirección</h3>
            <p className="info-value">{medico.direccion || 'No especificada'}</p>
          </div>

          {/* Tarjeta de información - Especialidad */}
          <div className="info-card">
            <i className="fas fa-certificate"></i>
            <h3 className="info-title">Especialidad</h3>
            <p className="info-value">{medico.especialidad}</p>
          </div>

          {/* Tarjeta de información - Formación */}
          <div className="info-card">
            <i className="fas fa-graduation-cap"></i>
            <h3 className="info-title">Formación Académica</h3>
            <p className="info-value">{medico.formacion || 'No especificada'}</p>
          </div>

          {/* Tarjeta de información - Horario */}
          <div className="info-card">
            <i className="fas fa-clock"></i>
            <h3 className="info-title">Horario de Atención</h3>
            <p className="info-value">{medico.horario || 'Lunes a Viernes: 9:00 AM - 6:00 PM'}</p>
          </div>

          {/* Sección de biografía */}
          <div className="bio-section">
            <h3 className="bio-title">
              <i className="fas fa-user-edit"></i> Biografía Profesional
            </h3>
            <p className="bio-text">
              {medico.biografia || 'El Dr. ' + medico.nombre + ' es un profesional altamente capacitado en ' + medico.especialidad + ' con años de experiencia tratando pacientes y brindando la mejor atención médica posible.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilMedico;