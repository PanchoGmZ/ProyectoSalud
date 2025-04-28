import React, { useState } from 'react';
import './GestionUsuarios.css'; // Asegúrate de que este archivo esté en el mismo directorio

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: 'Funancial', tipo: 'Administrador', email: 'funancial@example.com' },
    { id: 2, nombre: 'Gala-Villa', tipo: 'Médico', email: 'gala@example.com' },
    { id: 3, nombre: 'Anu-Loper', tipo: 'Paciente', email: 'anu@example.com' }
  ]);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    tipo: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario({ ...nuevoUsuario, [name]: value });
  };

  const agregarUsuario = () => {
    if (nuevoUsuario.nombre && nuevoUsuario.tipo && nuevoUsuario.email) {
      setUsuarios([...usuarios, { ...nuevoUsuario, id: usuarios.length + 1 }]);
      setNuevoUsuario({
        nombre: '',
        tipo: '',
        email: '',
        password: ''
      });
    }
  };

  return (
    <div className="gestion-usuarios-container">
      <h1>Gestión de Usuarios</h1>

      <div className="nuevo-usuario">
        <h2>Agregar Nuevo Usuario</h2>
        <div className="grid">
          <input
            type="text"
            name="nombre"
            value={nuevoUsuario.nombre}
            onChange={handleInputChange}
            placeholder="Nombre Completo"
          />
          <select
            name="tipo"
            value={nuevoUsuario.tipo}
            onChange={handleInputChange}
          >
            <option value="">Seleccionar Tipo</option>
            <option value="Administrador">Administrador</option>
            <option value="Médico">Médico</option>
            <option value="Paciente">Paciente</option>
          </select>
          <input
            type="email"
            name="email"
            value={nuevoUsuario.email}
            onChange={handleInputChange}
            placeholder="Correo Electrónico"
          />
          <input
            type="password"
            name="password"
            value={nuevoUsuario.password}
            onChange={handleInputChange}
            placeholder="Contraseña"
          />
        </div>
        <button onClick={agregarUsuario}>Agregar Usuario</button>
      </div>

      <div className="lista-usuarios">
        <h2>Lista de Usuarios</h2>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.tipo}</td>
                  <td>{usuario.email}</td>
                  <td className="acciones">
                    <button className="editar">Editar</button>
                    <button className="eliminar">Eliminar</button>
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

export default GestionUsuarios;