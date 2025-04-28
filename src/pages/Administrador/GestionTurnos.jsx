import React, { useState } from 'react';
import './GestionTurnos.css'; // Asegúrate de que este archivo esté en el mismo directorio

const GestionTurnos = () => {
  const [turnos, setTurnos] = useState([
    { id: 1, paciente: 'Hitotsuki', fecha: '', hora: '', edadSexo: '', motivo: '', estado: '' },
    { id: 2, paciente: 'Boercias', fecha: '14/06/2021', hora: 'cma', edadSexo: '30 Percentile', motivo: 'Ngozsoneda', estado: 'Amalab' },
    { id: 3, paciente: 'Ibanabadou', fecha: '14/06/2021', hora: 'Lara', edadSexo: '40 Percentile', motivo: 'Radeira', estado: 'Esperando' }
  ]);

  const [nuevoTurno, setNuevoTurno] = useState({
    paciente: '',
    fecha: '',
    hora: '',
    edadSexo: '',
    motivo: '',
    estado: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoTurno({ ...nuevoTurno, [name]: value });
  };

  const agregarTurno = () => {
    if (nuevoTurno.paciente && nuevoTurno.fecha) {
      setTurnos([...turnos, { ...nuevoTurno, id: turnos.length + 1 }]);
      setNuevoTurno({
        paciente: '',
        fecha: '',
        hora: '',
        edadSexo: '',
        motivo: '',
        estado: ''
      });
    }
  };

  return (
    <div className="gestion-turnos-container">
      <h1>Gestión de Turnos</h1>

      <div className="nuevo-turno">
        <h2>Agregar Nuevo Turno</h2>
        <div className="grid">
          <input
            type="text"
            name="paciente"
            value={nuevoTurno.paciente}
            onChange={handleInputChange}
            placeholder="Nombre del Paciente"
          />
          <input
            type="date"
            name="fecha"
            value={nuevoTurno.fecha}
            onChange={handleInputChange}
          />
          <input
            type="time"
            name="hora"
            value={nuevoTurno.hora}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="edadSexo"
            value={nuevoTurno.edadSexo}
            onChange={handleInputChange}
            placeholder="Edad/Sexo"
          />
          <input
            type="text"
            name="motivo"
            value={nuevoTurno.motivo}
            onChange={handleInputChange}
            placeholder="Motivo"
          />
          <select
            name="estado"
            value={nuevoTurno.estado}
            onChange={handleInputChange}
          >
            <option value="">Seleccionar Estado</option>
            <option value="Esperando">Esperando</option>
            <option value="En consulta">En consulta</option>
            <option value="Atendido">Atendido</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
        <button onClick={agregarTurno}>Agregar Turno</button>
      </div>

      <div className="lista-turnos">
        <h2>Lista de Turnos</h2>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Consultas</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Edad/Sexo</th>
                <th>Motivo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {turnos.map((turno) => (
                <tr key={turno.id}>
                  <td>{turno.paciente}</td>
                  <td>{turno.fecha}</td>
                  <td>{turno.hora}</td>
                  <td>{turno.edadSexo}</td>
                  <td>{turno.motivo}</td>
                  <td>{turno.estado}</td>
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

export default GestionTurnos;