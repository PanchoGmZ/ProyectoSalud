import React, { useState, useEffect } from 'react';
import './ResultadosPacientes.css';
import { db, auth } from '../../Data/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const ResultadosPacientes = () => {
  const [formData, setFormData] = useState({
    nombremedico: '',
    paciente: '',
    pacienteUID: '',
    resultadolab: '',
    observaciones: '',
    lugarestudiado: '',
  });

  const [pacientes, setPacientes] = useState([]);
  const [lugaresFicticios] = useState(['HHSJ', 'Obrero', 'San Gabriel', 'Clinimedic']);

  // Obtener nombre del médico logueado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const nombre = user.displayName || user.email || 'Médico Desconocido';
        setFormData((prev) => ({
          ...prev,
          nombremedico: nombre,
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  // Cargar pacientes desde Firebase (nombre + UID)
  useEffect(() => {
    const cargarPacientes = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'registropaciente'));
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          nombre: doc.data().nombre,
          uid: doc.data().uid, // Asegúrate de tener este campo en cada registro
        }));
        setPacientes(lista);
      } catch (error) {
        console.error("Error al cargar pacientes:", error);
      }
    };

    cargarPacientes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'paciente') {
      const pacienteSeleccionado = pacientes.find(p => p.nombre === value);
      setFormData(prev => ({
        ...prev,
        paciente: value,
        pacienteUID: pacienteSeleccionado?.uid || '',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'resultadospacientes'), {
        nombremedico: formData.nombremedico,
        resultadolab: formData.resultadolab,
        observaciones: formData.observaciones,
        lugarestudiado: formData.lugarestudiado,
        paciente: formData.paciente,
        pacienteUID: auth.currentUser?.uid || "",
        createdAt: new Date(),
      });
      

      alert('Resultado registrado con éxito 🧪✨');

      setFormData(prev => ({
        ...prev,
        paciente: '',
        pacienteUID: '',
        resultadolab: '',
        observaciones: '',
        lugarestudiado: '',
      }));
    } catch (error) {
      console.error('Error al guardar resultado:', error);
      alert('Ocurrió un error al registrar el resultado');
    }
  };

  return (
    <div className="resultados-container">
      <h1 className="resultados-titulo">Registrar Resultado Médico</h1>

      <form className="formulario-personalizado" onSubmit={handleSubmit}>
        <div className="campo-formulario">
          <label>Médico responsable</label>
          <input type="text" value={formData.nombremedico} disabled />
        </div>

        <div className="campo-formulario">
          <label>Paciente</label>
          <select name="paciente" value={formData.paciente} onChange={handleChange} required>
            <option value="">Selecciona un paciente</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.nombre}>{p.nombre}</option>
            ))}
          </select>
        </div>

        <div className="campo-formulario">
          <label>Resultados de laboratorio</label>
          <textarea
            name="resultadolab"
            value={formData.resultadolab}
            onChange={handleChange}
            rows="4"
            required
            placeholder="Ej. Hemoglobina baja, glucosa normal..."
          />
        </div>

        <div className="campo-formulario">
          <label>Observaciones</label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            rows="3"
            placeholder="Comentario adicional del médico..."
          />
        </div>

        <div className="campo-formulario">
          <label>Lugar de estudio</label>
          <select name="lugarestudiado" value={formData.lugarestudiado} onChange={handleChange} required>
            <option value="">Selecciona un lugar</option>
            {lugaresFicticios.map((lugar, i) => (
              <option key={i} value={lugar}>{lugar}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="resultado-link" style={{ marginTop: '30px' }}>
          Guardar Resultado
        </button>
      </form>

      <button onClick={() => window.history.back()} className="boton-atras">
        Atrás
      </button>
    </div>
  );
};

export default ResultadosPacientes;
