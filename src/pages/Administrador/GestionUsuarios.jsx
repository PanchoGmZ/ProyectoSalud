import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
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
    biografia: '',
    usuario: ''
  });

 
  useEffect(() => {
    const cargarMedicos = async () => {
      const querySnapshot = await getDocs(collection(db, 'medicos'));
      const medicosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMedicos(medicosData);
    };
    cargarMedicos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoMedico({ ...nuevoMedico, [name]: value });
  };

  const agregarMedico = async () => {
    if (
      nuevoMedico.nombre &&
      nuevoMedico.correo &&
      nuevoMedico.contrasena &&
      nuevoMedico.especialidad
    ) {
      try {
        
        const docRef = await addDoc(collection(db, 'medicos'), nuevoMedico);
        
       
        setMedicos([...medicos, { ...nuevoMedico, id: docRef.id }]);
        
       
        setNuevoMedico({
          nombre: '',
          correo: '',
          contrasena: '',
          telefono: '',
          direccion: '',
          especialidad: '',
          formacion: '',
          biografia: '',
          usuario: ''
        });
      } catch (error) {
        console.error('Error al agregar médico:', error);
      }
    } else {
      alert('Por favor complete los campos obligatorios: Nombre, Correo, Contraseña y Especialidad');
    }
  };

  const eliminarMedico = async (id) => {
    try {
   
      await deleteDoc(doc(db, 'medicos', id));
      
      
      setMedicos(medicos.filter(medico => medico.id !== id));
    } catch (error) {
      console.error('Error al eliminar médico:', error);
    }
  };

  return (
    <div className="gestion-usuarios-container">
      <h1>Gestión de Médicos</h1>

      <div className="nuevo-usuario">
        <h2>Agregar Nuevo Médico</h2>
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
            placeholder="Contraseña"
            required
          />
          <input
            type="text"
            name="usuario"
            value={nuevoMedico.usuario}
            onChange={handleInputChange}
            placeholder="Nombre de Usuario"
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
        <button onClick={agregarMedico}>Agregar Médico</button>
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
                  <td>{medico.nombre}</td>
                  <td>{medico.especialidad}</td>
                  <td>{medico.correo}</td>
                  <td>{medico.telefono}</td>
                  <td className="acciones">
                    <button className="editar">Editar</button>
                    <button className="eliminar" onClick={() => eliminarMedico(medico.id)}>
                      Eliminar
                    </button>
                  </td>
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