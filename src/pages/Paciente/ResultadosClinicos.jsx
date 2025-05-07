import React, { useState, useEffect } from 'react';
import './ResultadosClinicos.css';
import { db } from '../../Data/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const ResultadosClinicos = () => {
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [correo, setCorreo] = useState(localStorage.getItem('correoPaciente') || '');

  useEffect(() => {
    const obtenerResultados = async () => {
      if (!correo) {
        console.error('No hay correo de paciente almacenado');
        setCargando(false);
        return;
      }

      try {
        const pacientesRef = collection(db, 'registropaciente');
        const qPaciente = query(pacientesRef, where('correo', '==', correo));
        const snapshotPaciente = await getDocs(qPaciente);

        if (snapshotPaciente.empty) {
          console.warn('No se encontró ningún paciente con ese correo');
          setCargando(false);
          return;
        }

        const pacienteData = snapshotPaciente.docs[0].data();
        const nombrePaciente = pacienteData.nombre;

        const resultadosRef = collection(db, 'resultadospacientes');
        const qResultados = query(resultadosRef, where('paciente', '==', nombrePaciente));
        const snapshotResultados = await getDocs(qResultados);

        const resultadosList = snapshotResultados.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setResultados(resultadosList);
      } catch (error) {
        console.error('Error al obtener resultados clínicos:', error);
      } finally {
        setCargando(false);
      }
    };

    obtenerResultados();
  }, [correo]);

  if (cargando) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p>Cargando resultados...</p>
      </div>
    );
  }

  return (
    <div className="resultados-container">
      <header className="header">
        <h1>Mis Resultados Clínicos</h1>
        <div className="header-decoration"></div>
      </header>

      {resultados.length === 0 ? (
        <div className="no-resultados">
          <div className="icono-vacio">🧪</div>
          <p>Aún no tienes resultados registrados</p>
          <p className="subtexto">Cuando tus exámenes estén listos, aparecerán aquí</p>
        </div>
      ) : (
        <div className="resultados-grid">
          {resultados.map((resultado) => (
            <article key={resultado.id} className="resultado-card">
              <div className="card-header">
                <span className="icono-hospital">🏥</span>
                <h3>{resultado.lugarestudiado}</h3>
              </div>
              
              <div className="card-content">
                <div className="info-row">
                  <span className="etiqueta">Médico:</span>
                  <span className="valor">{resultado.nombremedico}</span>
                </div>
                
                <div className="info-row">
                  <span className="etiqueta">Resultado:</span>
                  <span className="valor resultado-valor">{resultado.resultadolab}</span>
                </div>
                
                <div className="info-row">
                  <span className="etiqueta">Observaciones:</span>
                  <span className="valor">{resultado.observaciones || 'Ninguna'}</span>
                </div>
              </div>
              
              <div className="card-footer">
                <span className="icono-fecha">📅</span>
                <time>
                  {resultado.createdAt?.toDate?.().toLocaleString() || 'Sin fecha'}
                </time>
              </div>
            </article>
          ))}
        </div>
      )}

      <button onClick={() => window.history.back()} className="boton-atras">
        <span className="icono-atras">←</span>
        <span>Regresar</span>
      </button>
    </div>
  );
};

export default ResultadosClinicos;