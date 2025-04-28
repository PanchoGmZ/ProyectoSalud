import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AgendarTurno.css'; // Archivo de estilos (abajo)

const AgendarTurno = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    especialidad: '',
    medico: '',
    fecha: null,
    hora: '',
    tipoConsulta: ''
  });

  // Datos de ejemplo (reemplazar con llamadas a API)
  const especialidades = ['Cardiología', 'Dermatología', 'Pediatría', 'Neurología'];
  const medicos = {
    'Cardiología': ['Dra. Pérez', 'Dr. Gómez'],
    'Dermatología': ['Dra. Martínez'],
    'Pediatría': ['Dr. Rodríguez', 'Dra. López'],
    'Neurología': ['Dr. Sánchez']
  };
  const horasDisponibles = ['08:00', '09:30', '11:00', '13:30', '15:00', '16:30'];
  const tiposConsulta = ['Presencial', 'Virtual', 'Domicilio'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación básica
    if (!formData.especialidad || !formData.medico || !formData.fecha || !formData.hora) {
      alert('Por favor complete todos los campos');
      return;
    }
    // Aquí iría la llamada a la API
    console.log('Turno agendado:', formData);
    alert('Turno agendado con éxito!');
    navigate('/mis-turnos');
  };

  return (
    <div className="agendar-turno-container">
      <div className="agendar-turno-card">
        <h2 className="agendar-title">Agendar Consulta</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Especialidad:</label>
            <select 
              name="especialidad" 
              value={formData.especialidad}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione especialidad</option>
              {especialidades.map((esp, index) => (
                <option key={index} value={esp}>{esp}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Médico:</label>
            <select 
              name="medico" 
              value={formData.medico}
              onChange={handleChange}
              disabled={!formData.especialidad}
              required
            >
              <option value="">{formData.especialidad ? 'Seleccione médico' : 'Primero seleccione especialidad'}</option>
              {formData.especialidad && medicos[formData.especialidad]?.map((med, index) => (
                <option key={index} value={med}>{med}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Fecha:</label>
            <DatePicker
              selected={formData.fecha}
              onChange={(date) => setFormData({...formData, fecha: date})}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
              placeholderText="Seleccione fecha"
              className="date-picker"
              required
            />
          </div>

          <div className="form-group">
            <label>Hora:</label>
            <select 
              name="hora" 
              value={formData.hora}
              onChange={handleChange}
              disabled={!formData.fecha}
              required
            >
              <option value="">{formData.fecha ? 'Seleccione hora' : 'Primero seleccione fecha'}</option>
              {formData.fecha && horasDisponibles.map((hora, index) => (
                <option key={index} value={hora}>{hora}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tipo de consulta:</label>
            <select 
              name="tipoConsulta" 
              value={formData.tipoConsulta}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione tipo</option>
              {tiposConsulta.map((tipo, index) => (
                <option key={index} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="submit-button">
            Confirmar Turno
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgendarTurno;