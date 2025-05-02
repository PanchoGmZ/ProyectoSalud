import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiEdit, FiSave, FiHome } from 'react-icons/fi';
import { db, auth } from '../../Data/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './PerfilPaciente.css';

const PerfilPaciente = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [paciente, setPaciente] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    fecha: '',
    direccion: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Verificar autenticación y cargar datos
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const docRef = doc(db, "registropaciente", user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setPaciente({
              nombre: data.nombre || '',
              correo: data.correo || user.email || '',
              telefono: data.telefono || '',
              fecha: data.fecha ? new Date(data.fecha).toISOString().split('T')[0] : '',
              direccion: data.direccion || ''
            });
          } else {
            setError('No se encontraron datos del paciente');
          }
        } catch (err) {
          console.error("Error al cargar datos:", err);
          setError('Error al cargar los datos del perfil');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError('Usuario no autenticado');
      }
    });

    return unsubscribe;
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaciente(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      if (!currentUser?.uid) {
        throw new Error('No hay usuario autenticado');
      }

      const updateData = {
        nombre: paciente.nombre,
        correo: paciente.correo,
        telefono: paciente.telefono,
        direccion: paciente.direccion,
        updatedAt: new Date().getTime()
      };

      if (paciente.fecha) {
        updateData.fecha = new Date(paciente.fecha).getTime();
      }

      await updateDoc(doc(db, "registropaciente", currentUser.uid), updateData);
      
      setEditMode(false);
      alert('Perfil actualizado correctamente');
    } catch (error) {
      console.error("Error al actualizar:", error);
      setError('Error al actualizar el perfil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando perfil...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!currentUser) {
    return <div className="error">Debes iniciar sesión para ver este perfil</div>;
  }

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <div className="avatar">
          <FiUser size={48} />
        </div>
        <h1>{paciente.nombre || 'Nombre no disponible'}</h1>
        <button 
          onClick={() => {
            if (editMode) {
              handleSave();
            } else {
              setEditMode(true);
            }
          }} 
          className="edit-button"
          disabled={loading}
        >
          {editMode ? <FiSave size={18} /> : <FiEdit size={18} />}
          {editMode ? ' Guardar' : ' Editar'}
        </button>
      </div>

      <div className="perfil-form">
        <div className="form-group">
          <label><FiUser /> Nombre Completo:</label>
          {editMode ? (
            <input
              type="text"
              name="nombre"
              value={paciente.nombre}
              onChange={handleChange}
              required
            />
          ) : (
            <p>{paciente.nombre || 'No especificado'}</p>
          )}
        </div>

        <div className="form-group">
          <label><FiMail /> Email:</label>
          {editMode ? (
            <input
              type="email"
              name="correo"
              value={paciente.correo}
              onChange={handleChange}
              required
            />
          ) : (
            <p>{paciente.correo || 'No especificado'}</p>
          )}
        </div>

        <div className="form-group">
          <label><FiPhone /> Teléfono:</label>
          {editMode ? (
            <input
              type="tel"
              name="telefono"
              value={paciente.telefono}
              onChange={handleChange}
            />
          ) : (
            <p>{paciente.telefono || 'No especificado'}</p>
          )}
        </div>

        <div className="form-group">
          <label><FiCalendar /> Fecha de Nacimiento:</label>
          {editMode ? (
            <input
              type="date"
              name="fecha"
              value={paciente.fecha}
              onChange={handleChange}
            />
          ) : (
            <p>{paciente.fecha ? new Date(paciente.fecha).toLocaleDateString() : 'No especificada'}</p>
          )}
        </div>

        <div className="form-group">
          <label><FiHome /> Dirección:</label>
          {editMode ? (
            <input
              type="text"
              name="direccion"
              value={paciente.direccion}
              onChange={handleChange}
            />
          ) : (
            <p>{paciente.direccion || 'No especificada'}</p>
          )}
        </div>

        {editMode && (
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => setEditMode(false)}
              className="cancel-button"
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerfilPaciente;