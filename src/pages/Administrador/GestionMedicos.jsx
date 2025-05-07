import React, { useState, useEffect } from 'react';
import { db } from '../../Data/firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../Data/firebase";
import './GestionMedicos.css';

const GestionMedicos = () => {
  const [medicos, setMedicos] = useState([]);
  const [nuevoMedico, setNuevoMedico] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    telefono: '',
    direccion: '',
    especialidad: '',
    formacion: '',
    biografia: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [medicoEditando, setMedicoEditando] = useState(null);

 
  useEffect(() => {
    const cargarMedicos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'registromedico'));
        const medicosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMedicos(medicosData);
      } catch (error) {
        console.error('Error al cargar médicos:', error);
        setError('Error al cargar los médicos');
      }
    };
    cargarMedicos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoMedico({ ...nuevoMedico, [name]: value });
  };

  const agregarMedico = async () => {
    if (
      !nuevoMedico.nombre ||
      !nuevoMedico.correo ||
      !nuevoMedico.contrasena ||
      !nuevoMedico.especialidad
    ) {
      setError('Por favor complete los campos obligatorios: Nombre, Correo, Contraseña y Especialidad');
      return;
    }

    setLoading(true);
    setError(null);

    try {
     
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        nuevoMedico.correo,
        nuevoMedico.contrasena
      );

      
      await updateProfile(userCredential.user, {
        displayName: nuevoMedico.nombre
      });

    
      const medicoData = {
        nombre: nuevoMedico.nombre,
        correo: nuevoMedico.correo,
        telefono: nuevoMedico.telefono || '',
        direccion: nuevoMedico.direccion || '',
        especialidad: nuevoMedico.especialidad,
        formacion: nuevoMedico.formacion || '',
        biografia: nuevoMedico.biografia || '',
        uid: userCredential.user.uid
      };

      const docRef = await addDoc(collection(db, 'registromedico'), medicoData);
      
   
      setMedicos([...medicos, { ...medicoData, id: docRef.id }]);
      

      setNuevoMedico({
        nombre: '',
        correo: '',
        contrasena: '',
        telefono: '',
        direccion: '',
        especialidad: '',
        formacion: '',
        biografia: ''
      });

    } catch (error) {
      console.error('Error al agregar médico:', error);
      setError(getFirebaseErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const eliminarMedico = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este médico?')) return;

    try {
      await deleteDoc(doc(db, 'registromedico', id));
      setMedicos(medicos.filter(medico => medico.id !== id));
    } catch (error) {
      console.error('Error al eliminar médico:', error);
      setError('Error al eliminar el médico');
    }
  };

  const iniciarEdicion = (medico) => {
    setEditandoId(medico.id);
    setMedicoEditando({
      nombre: medico.nombre,
      correo: medico.correo,
      telefono: medico.telefono || '',
      direccion: medico.direccion || '',
      especialidad: medico.especialidad,
      formacion: medico.formacion || '',
      biografia: medico.biografia || ''
    });
  };

  const guardarEdicion = async () => {
    if (!medicoEditando.nombre || !medicoEditando.correo || !medicoEditando.especialidad) {
      setError('Por favor complete los campos obligatorios: Nombre, Correo y Especialidad');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateDoc(doc(db, 'registromedico', editandoId), {
        nombre: medicoEditando.nombre,
        correo: medicoEditando.correo,
        telefono: medicoEditando.telefono,
        direccion: medicoEditando.direccion,
        especialidad: medicoEditando.especialidad,
        formacion: medicoEditando.formacion,
        biografia: medicoEditando.biografia
      });

     
      setMedicos(medicos.map(medico => 
        medico.id === editandoId ? { ...medico, ...medicoEditando } : medico
      ));

     
      setEditandoId(null);
      setMedicoEditando(null);

    } catch (error) {
      console.error('Error al actualizar médico:', error);
      setError('Error al actualizar el médico');
    } finally {
      setLoading(false);
    }
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setMedicoEditando(null);
    setError(null);
  };


  const getFirebaseErrorMessage = (code) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'El correo electrónico ya está en uso';
      case 'auth/invalid-email':
        return 'Correo electrónico inválido';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres';
      default:
        return 'Ocurrió un error al registrar el médico';
    }
  };

  return (
    <div className="gestion-usuarios-container">
      <h1>Gestión de Médicos</h1>

      <div className="nuevo-usuario">
        <h2>Agregar Nuevo Médico</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="grid">
          <input
            type="text"
            name="nombre"
            value={nuevoMedico.nombre}
            onChange={handleInputChange}
            placeholder="Nombre Completo"
            required
          />
          <input
            type="email"
            name="correo"
            value={nuevoMedico.correo}
            onChange={handleInputChange}
            placeholder="Correo Electrónico"
            required
          />
          <input
            type="password"
            name="contrasena"
            value={nuevoMedico.contrasena}
            onChange={handleInputChange}
            placeholder="Contraseña (mínimo 6 caracteres)"
            required
            minLength="6"
          />
          <input
            type="text"
            name="telefono"
            value={nuevoMedico.telefono}
            onChange={handleInputChange}
            placeholder="Teléfono"
          />
          <input
            type="text"
            name="direccion"
            value={nuevoMedico.direccion}
            onChange={handleInputChange}
            placeholder="Dirección"
          />
          <input
            type="text"
            name="especialidad"
            value={nuevoMedico.especialidad}
            onChange={handleInputChange}
            placeholder="Especialidad"
            required
          />
          <input
            type="text"
            name="formacion"
            value={nuevoMedico.formacion}
            onChange={handleInputChange}
            placeholder="Formación Académica"
          />
          <textarea
            name="biografia"
            value={nuevoMedico.biografia}
            onChange={handleInputChange}
            placeholder="Biografía"
            className="biografia-input"
          />
        </div>
        <button onClick={agregarMedico} disabled={loading}>
          {loading ? 'Registrando...' : 'Agregar Médico'}
        </button>
      </div>

      <div className="lista-usuarios">
        <h2>Lista de Médicos</h2>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Especialidad</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {medicos.map((medico) => (
                <tr key={medico.id}>
                  {editandoId === medico.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          value={medicoEditando.nombre}
                          onChange={(e) => setMedicoEditando({...medicoEditando, nombre: e.target.value})}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={medicoEditando.especialidad}
                          onChange={(e) => setMedicoEditando({...medicoEditando, especialidad: e.target.value})}
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          value={medicoEditando.correo}
                          onChange={(e) => setMedicoEditando({...medicoEditando, correo: e.target.value})}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={medicoEditando.telefono}
                          onChange={(e) => setMedicoEditando({...medicoEditando, telefono: e.target.value})}
                        />
                      </td>
                      <td className="acciones">
                        <button className="guardar" onClick={guardarEdicion}>
                          Guardar
                        </button>
                        <button className="cancelar" onClick={cancelarEdicion}>
                          Cancelar
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{medico.nombre}</td>
                      <td>{medico.especialidad}</td>
                      <td>{medico.correo}</td>
                      <td>{medico.telefono}</td>
                      <td className="acciones">
                        <button className="editar" onClick={() => iniciarEdicion(medico)}>
                          Editar
                        </button>
                        <button 
                          className="eliminar" 
                          onClick={() => eliminarMedico(medico.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GestionMedicos;