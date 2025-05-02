import React, { useState, useEffect } from 'react';
import { db } from '../../Data/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import './GestionTurnos.css';

const GestionTurnos = () => {
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'agentdaturno'), orderBy('fecha', 'asc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const turnosData = [];
            querySnapshot.forEach((doc) => {
                const turno = doc.data();
                turnosData.push({
                    id: doc.id,
                    createdAt: turno.createdAt?.toDate(),
                    especialidad: turno.especialidad || '',
                    estado: turno.estado || '',
                    fecha: turno.fecha?.toDate(),
                    hora: turno.hora || '',
                    medico: turno.medico || '',
                    medicoId: turno.medicoId || '',
                    motivo: turno.motivo || '',
                    pacienteId: turno.pacienteId || '',
                    pacienteNombre: turno.pacienteNombre || '',
                    tipoconsulta: turno.tipoconsulta || '',
                    updatedAt: turno.updatedAt?.toDate()
                });
            });
            setTurnos(turnosData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Función para formatear fechas
    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });
    };

    if (loading) {
        return <div>Cargando turnos...</div>;
    }

    return (
        <div className="gestion-turnos-container">
            <div className="lista-turnos">
                <h2>Lista de Turnos</h2>
                <div className="overflow-x-auto">
                    <table>
                        <thead>
                            <tr>
                                <th>Paciente Nombre</th>
                                <th>Médico</th>
                                <th>Especialidad</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Tipo Consulta</th>
                                <th>Motivo</th>
                                <th>Fecha de Creación</th>
                                <th>Última Actualización</th>
                            </tr>
                        </thead>
                        <tbody>
                            {turnos.map((turno) => (
                                <tr key={turno.id}>
                                    <td>{turno.pacienteNombre}</td>
                                    <td>{turno.medico}</td>
                                    <td>{turno.especialidad}</td>
                                    <td>
                                        <span className={`estado ${turno.estado.toLowerCase()}`}>
                                            {turno.estado}
                                        </span>
                                    </td>
                                    <td>{formatDate(turno.fecha)}</td>
                                    <td>{turno.hora}</td>
                                    <td>{turno.tipoconsulta}</td>
                                    <td>{turno.motivo}</td>
                                    <td>{formatDate(turno.createdAt)}</td>
                                    <td>{formatDate(turno.updatedAt)}</td>
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