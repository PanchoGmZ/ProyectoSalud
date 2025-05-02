import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
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

          const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
            const turnosData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              fecha: doc.data().fecha?.toDate() || null
            }));
            setTurnos(turnosData);
            setLoading(false);
          });

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

        await runTransaction(db, async (transaction) => {
          const agentdaturnoRef = doc(db, "agentdaturno", id);
          transaction.update(agentdaturnoRef, {
            estado: 'cancelado',
            updatedAt: serverTimestamp()
          });

          if (turnoACancelar.appointmentId) {
            const appointmentRef = doc(db, "appointments", turnoACancelar.appointmentId);
            transaction.update(appointmentRef, {
              status: "cancelada",
              lastUpdated: serverTimestamp()
            });
          }
        });

        setTurnos(turnos.map(turno =>
          turno.id === id ? { ...turno, estado: 'cancelado' } : turno
        ));

        alert('Turno cancelado con éxito');
      } catch (error) {
        console.error("Error al cancelar turno:", error);
        alert('Error al cancelar el turno');
      }
    }
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
                  <button
                    onClick={() => cancelarTurno(turno.id)}
                    className="action-btn cancel"
                  >
                    <FiTrash2 /> Cancelar
                  </button>
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
