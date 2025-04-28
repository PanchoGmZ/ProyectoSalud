import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiEdit, FiSave } from 'react-icons/fi';
import './PerfilPaciente.css';

const PerfilPaciente = () => {
  const [editMode, setEditMode] = useState(false);
  const [paciente, setPaciente] = useState({
    nombre: 'María González',
    email: 'maria@example.com',
    telefono: '+51 987 654 321',
    fechaNacimiento: '1985-05-15',
    direccion: 'Av. Principal 123, Lima',
    alergias: 'Penicilina, Mariscos',
    sangre: 'O+'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaciente(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la llamada a la API para guardar los cambios
    setEditMode(false);
    alert('Perfil actualizado correctamente');
  };

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <div className="avatar">
          <FiUser size={48} />
        </div>
        <h1>{paciente.nombre}</h1>
        <button 
          onClick={() => setEditMode(!editMode)} 
          className="edit-button"
        >
          {editMode ? <FiSave size={18} /> : <FiEdit size={18} />}
          {editMode ? ' Guardar' : ' Editar'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="perfil-form">
        <div className="form-group">
          <label><FiMail /> Email:</label>
          {editMode ? (
            <input
              type="email"
              name="email"
              value={paciente.email}
              onChange={handleChange}
            />
          ) : (
            <p>{paciente.email}</p>
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
            <p>{paciente.telefono}</p>
          )}
        </div>

        <div className="form-group">
          <label><FiCalendar /> Fecha de Nacimiento:</label>
          {editMode ? (
            <input
              type="date"
              name="fechaNacimiento"
              value={paciente.fechaNacimiento}
              onChange={handleChange}
            />
          ) : (
            <p>{new Date(paciente.fechaNacimiento).toLocaleDateString()}</p>
          )}
        </div>

        <div className="form-group">
          <label>Dirección:</label>
          {editMode ? (
            <input
              type="text"
              name="direccion"
              value={paciente.direccion}
              onChange={handleChange}
            />
          ) : (
            <p>{paciente.direccion}</p>
          )}
        </div>

        <div className="form-group">
          <label>Alergias:</label>
          {editMode ? (
            <textarea
              name="alergias"
              value={paciente.alergias}
              onChange={handleChange}
              rows="3"
            />
          ) : (
            <p>{paciente.alergias}</p>
          )}
        </div>

        <div className="form-group">
          <label>Tipo de Sangre:</label>
          {editMode ? (
            <select
              name="sangre"
              value={paciente.sangre}
              onChange={handleChange}
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          ) : (
            <p>{paciente.sangre}</p>
          )}
        </div>

        {editMode && (
          <div className="form-actions">
            <button type="submit" className="save-button">
              Guardar Cambios
            </button>
            <button 
              type="button" 
              onClick={() => setEditMode(false)}
              className="cancel-button"
            >
              Cancelar
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PerfilPaciente;