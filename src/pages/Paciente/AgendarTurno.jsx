import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { db, Timestamp } from '../../Data/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import './AgendarTurno.css';
import { getAuth } from 'firebase/auth';
const AgendarTurno = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    especialidad: '',
    medico: '',
    fecha: null,
    hora: '',
    tipoconsulta: 'Presencial',
    motivo: ''
  });

  const [especialidades, setEspecialidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [horasDisponibles] = useState(['08:00', '09:30', '11:00', '13:30', '15:00', '16:30']);
  const [loading, setLoading] = useState({
    especialidades: false,
    medicos: false,
    submitting: false
  });

  useEffect(() => {
    const cargarEspecialidades = async () => {
      try {
        setLoading(prev => ({ ...prev, especialidades: true }));
        
        const querySnapshot = await getDocs(collection(db, "registromedico"));
        const especialidadesUnicas = new Set();
        
        querySnapshot.forEach(doc => {
          if (doc.data().especialidad) {
            especialidadesUnicas.add(doc.data().especialidad);
          }
        });

        setEspecialidades(Array.from(especialidadesUnicas).map(esp => ({
          id: esp,
          nombre: esp
        })));

      } catch (error) {
        console.error("Error cargando especialidades:", error);
      } finally {
        setLoading(prev => ({ ...prev, especialidades: false }));
      }
    };

    cargarEspecialidades();
  }, []);

  useEffect(() => {
    if (formData.especialidad) {
      const cargarMedicos = async () => {
        try {
          setLoading(prev => ({ ...prev, medicos: true }));
          setFormData(prev => ({ ...prev, medico: '' }));
        
          const q = query(
            collection(db, "registromedico"),
            where("especialidad", "==", formData.especialidad)
          );
          
          const querySnapshot = await getDocs(q);
          const medicosData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            nombre: doc.data().nombre, 
            especialidad: doc.data().especialidad
          }));

          console.log("Médicos encontrados:", medicosData); 
          setMedicos(medicosData);
        } catch (error) {
          console.error("Error cargando médicos:", error);
        } finally {
          setLoading(prev => ({ ...prev, medicos: false }));
        }
      };

      cargarMedicos();
    }
  }, [formData.especialidad]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, submitting: true }));
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("No se encontró el usuario autenticado");
      if (!formData.especialidad || !formData.medico || !formData.fecha || !formData.hora) {
        throw new Error('Por favor complete todos los campos requeridos');
      }
      
      const medicoSeleccionado = medicos.find(m => m.id === formData.medico);
      
      // Primero crear el documento en agentdaturno
      const citaRef = await addDoc(collection(db, "agentdaturno"), {
        especialidad: formData.especialidad,
        medico: medicoSeleccionado.nombre,
        medicoId: formData.medico,
        fecha: Timestamp.fromDate(formData.fecha),
        hora: formData.hora,
        tipoconsulta: formData.tipoconsulta,
        motivo: formData.motivo || '',
        estado: 'pendiente',
        pacienteId: user.uid,
        pacienteNombre: user.displayName || 'Paciente sin nombre',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
  
      // Luego crear el documento en appointments con el ID del agentdaturno
      await addDoc(collection(db, "appointments"), {
        date: formData.fecha,
        patientName: user.displayName || 'Paciente sin nombre',
        appointmentType: formData.tipoconsulta,
        timeSlot: formData.hora,
        status: "pendiente",
        doctorId: formData.medico,
        doctorName: medicoSeleccionado.nombre,
        patientId: user.uid,
        agentdaturnoId: citaRef.id, // Agregar el ID del documento agentdaturno
        createdAt: new Date(),
        lastUpdated: new Date()
      });
  
      alert('Turno agendado con éxito!');
      navigate('/mis-turnos');
    } catch (error) {
      console.error("Error al agendar turno:", error);
      alert('Error al agendar turno: ' + error.message);
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };
  return (
    <div className="agendar-turno-container">
      <div className="agendar-turno-card">
        <h2>Agendar Turno</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Especialidad:</label>
            <select
              name="especialidad"
              value={formData.especialidad}
              onChange={handleChange}
              disabled={loading.especialidades}
              required
            >
              <option value="">{loading.especialidades ? 'Cargando...' : 'Seleccione especialidad'}</option>
              {especialidades.map(esp => (
                <option key={esp.id} value={esp.id}>{esp.nombre}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Médico:</label>
            <select
              name="medico"
              value={formData.medico}
              onChange={handleChange}
              disabled={!formData.especialidad || loading.medicos}
              required
            >
              <option value="">
                {loading.medicos ? 'Cargando...' : 
                 !formData.especialidad ? 'Seleccione especialidad primero' : 
                 medicos.length === 0 ? 'No hay médicos disponibles' : 'Seleccione médico'}
              </option>
              {medicos.map(med => (
                <option key={med.id} value={med.id}>{med.nombre} - {med.especialidad}</option>
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
            <label>Tipo de Consulta:</label>
            <select
              name="tipoconsulta"
              value={formData.tipoconsulta}
              onChange={handleChange}
              required
            >
              <option value="Presencial">Presencial</option>
              <option value="Virtual">Virtual</option>
              <option value="Domicilio">Domicilio</option>
            </select>
          </div>

          <div className="form-group">
            <label>Motivo (opcional):</label>
            <textarea
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              placeholder="Describa el motivo de su consulta"
              rows="3"
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading.submitting}
          >
            {loading.submitting ? 'Agendando...' : 'Agendar Turno'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgendarTurno;