import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
<<<<<<< HEAD
  FiCalendar, FiClock, FiUser, FiFilter, FiTrash2, FiEdit, FiDownload
} from 'react-icons/fi';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  onSnapshot, 
  runTransaction, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../Data/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
=======
  FiCalendar, FiClock, FiUser, FiFilter, FiTrash2
} from 'react-icons/fi';
import {
  collection,
  query,
  where,
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../Data/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
>>>>>>> 1825dd297ef88995f34677eb10c5e8fd5050f879
import './MisTurnos.css';

const MisTurnos = () => {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState('todos');
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const q = query(
            collection(db, "agentdaturno"),
            where("pacienteId", "==", user.uid)
          );
<<<<<<< HEAD
          
=======

>>>>>>> 1825dd297ef88995f34677eb10c5e8fd5050f879
          const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
            const turnosData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              fecha: doc.data().fecha?.toDate() || null
            }));
            setTurnos(turnosData);
            setLoading(false);
          });
<<<<<<< HEAD
          
=======

>>>>>>> 1825dd297ef88995f34677eb10c5e8fd5050f879
          return () => unsubscribeSnapshot();
        } catch (error) {
          console.error("Error al obtener turnos:", error);
          setLoading(false);
        }
      } else {
        console.warn("Usuario no autenticado");
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const filtrarTurnos = () => {
    if (filtro === 'todos') return turnos;
    return turnos.filter(turno => turno.estado === filtro);
  };

  const cancelarTurno = async (id) => {
    if (window.confirm('¿Estás seguro de cancelar este turno?')) {
      try {
        const turnoACancelar = turnos.find(turno => turno.id === id);
<<<<<<< HEAD
        
        await runTransaction(db, async (transaction) => {
          // 1. Actualizar en agentdaturno
=======

        await runTransaction(db, async (transaction) => {
>>>>>>> 1825dd297ef88995f34677eb10c5e8fd5050f879
          const agentdaturnoRef = doc(db, "agentdaturno", id);
          transaction.update(agentdaturnoRef, {
            estado: 'cancelado',
            updatedAt: serverTimestamp()
          });

<<<<<<< HEAD
          // 2. Si existe referencia a appointment, actualizarlo también
=======
>>>>>>> 1825dd297ef88995f34677eb10c5e8fd5050f879
          if (turnoACancelar.appointmentId) {
            const appointmentRef = doc(db, "appointments", turnoACancelar.appointmentId);
            transaction.update(appointmentRef, {
              status: "cancelada",
              lastUpdated: serverTimestamp()
            });
          }
        });

<<<<<<< HEAD
        // Actualizar estado local
=======
>>>>>>> 1825dd297ef88995f34677eb10c5e8fd5050f879
        setTurnos(turnos.map(turno =>
          turno.id === id ? { ...turno, estado: 'cancelado' } : turno
        ));

<<<<<<< HEAD
        alert('Turno cancelado con éxito en ambos sistemas');
=======
        alert('Turno cancelado con éxito');
>>>>>>> 1825dd297ef88995f34677eb10c5e8fd5050f879
      } catch (error) {
        console.error("Error al cancelar turno:", error);
        alert('Error al cancelar el turno');
      }
<<<<<<< HEAD
    }
  };

  const reprogramarTurno = async (id, nuevaHora, nuevoTipo) => {
    try {
      const turnoAReprogramar = turnos.find(turno => turno.id === id);
      
      await runTransaction(db, async (transaction) => {
        // 1. Actualizar en agentdaturno
        const agentdaturnoRef = doc(db, "agentdaturno", id);
        transaction.update(agentdaturnoRef, {
          hora: nuevaHora,
          tipoconsulta: nuevoTipo,
          estado: 'reprogramado',
          updatedAt: serverTimestamp()
        });

        // 2. Si existe referencia a appointment, actualizarlo también
        if (turnoAReprogramar.appointmentId) {
          const appointmentRef = doc(db, "appointments", turnoAReprogramar.appointmentId);
          transaction.update(appointmentRef, {
            timeSlot: nuevaHora,
            appointmentType: nuevoTipo,
            status: "reprogramada",
            lastUpdated: serverTimestamp()
          });
        }
      });

      // Actualizar estado local
      setTurnos(turnos.map(turno =>
        turno.id === id ? { 
          ...turno, 
          hora: nuevaHora,
          tipoconsulta: nuevoTipo,
          estado: 'reprogramado' 
        } : turno
      ));

      alert('Turno reprogramado con éxito en ambos sistemas');
    } catch (error) {
      console.error("Error al reprogramar turno:", error);
      alert('Error al reprogramar el turno');
=======
>>>>>>> 1825dd297ef88995f34677eb10c5e8fd5050f879
    }
  };

  if (loading) return <div className="loading">Cargando tus turnos...</div>;

  const exportarAPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Mis Turnos', 14, 20);

    const rows = filtrarTurnos().map(turno => [
      turno.especialidad,
      turno.medico,
      turno.fecha?.toLocaleDateString('es-ES'),
      turno.hora,
      turno.tipoconsulta,
      turno.motivo || '-',
      turno.estado.toUpperCase()
    ]);

    doc.autoTable({
      head: [['Especialidad', 'Médico', 'Fecha', 'Hora', 'Tipo', 'Motivo', 'Estado']],
      body: rows,
      startY: 30
    });

    doc.save('MisTurnos.pdf');
  };

  if (loading) return <div className="loading">Cargando tus turnos...</div>;

  return (
    <div className="mis-turnos-container">
      <div className="mis-turnos-header">
        <h1><FiCalendar /> Mis Turnos</h1>
        <div className="filtros">
          <FiFilter />
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="filtro-select"
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendientes</option>
            <option value="confirmado">Confirmados</option>
            <option value="cancelado">Cancelados</option>
          </select>

          <button className="btn-exportar" onClick={exportarAPDF}>
            <FiDownload /> Exportar PDF
          </button>
        </div>
      </div>

      <div className="turnos-list">
        {filtrarTurnos().length > 0 ? (
          filtrarTurnos().map((turno) => (
            <div key={turno.id} className={`turno-card ${turno.estado}`}>
              <div className="turno-info">
                <h3>{turno.especialidad}</h3>
                <p><FiUser /> {turno.medico}</p>
                <p><FiCalendar /> {turno.fecha?.toLocaleDateString('es-ES')}</p>
                <p><FiClock /> {turno.hora}</p>
                <p>Tipo: {turno.tipoconsulta}</p>
                {turno.motivo && <p>Motivo: {turno.motivo}</p>}
              </div>

              <div className="turno-actions">
                <span className={`estado-badge ${turno.estado}`}>
                  {turno.estado.toUpperCase()}
                </span>

                {turno.estado !== 'cancelado' && (
<<<<<<< HEAD
                  <>
                    <button
                      onClick={() => cancelarTurno(turno.id)}
                      className="action-btn cancel"
                    >
                      <FiTrash2 /> Cancelar
                    </button>
                  </>
=======
                  <button
                    onClick={() => cancelarTurno(turno.id)}
                    className="action-btn cancel"
                  >
                    <FiTrash2 /> Cancelar
                  </button>
>>>>>>> 1825dd297ef88995f34677eb10c5e8fd5050f879
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-turnos">
            <p>No tienes turnos agendados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MisTurnos;
