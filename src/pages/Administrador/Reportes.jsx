import React, { useEffect, useState } from 'react';
import { db } from '../../Data/firebase'; 
import { collection, onSnapshot } from 'firebase/firestore'; 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, FileText, Trash2, TrendingUp } from 'lucide-react';
import './Reportes.css';

const Reportes = () => {
  const [chartData, setChartData] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]); 

  
  useEffect(() => {
    
    const fetchReportes = () => {
      const reportesCol = collection(db, "reportes");
      const unsubscribe = onSnapshot(reportesCol, (reportesSnapshot) => {
        const reportesList = reportesSnapshot.docs.map(doc => doc.data());
        setReportes(reportesList);
      });

      return unsubscribe; 
    };

    
    const fetchConsultas = () => {
      const consultasCol = collection(db, "agentdaturno");
      const unsubscribe = onSnapshot(consultasCol, (consultasSnapshot) => {
        const consultasData = consultasSnapshot.docs.map(doc => doc.data());

       
        const groupedData = consultasData.reduce((acc, consulta) => {
          const day = consulta.fecha.toDate().toLocaleString('en-us', { weekday: 'short' });
          if (!acc[day]) acc[day] = 0;
          acc[day] += 1;
          return acc;
        }, {});

        const chartData = Object.entries(groupedData).map(([day, count]) => ({
          name: day,
          consultas: count
        }));

        setChartData(chartData);
      });

      return unsubscribe;
    };

  
    const fetchPacientes = () => {
      const pacientesCol = collection(db, "registropaciente");
      const unsubscribe = onSnapshot(pacientesCol, (pacientesSnapshot) => {
        const pacientesList = pacientesSnapshot.docs.map(doc => doc.data());
        setPacientes(pacientesList);
      });

      return unsubscribe;
    };

   
    const fetchMedicos = () => {
      const medicosCol = collection(db, "registromedico"); 
      const unsubscribe = onSnapshot(medicosCol, (medicosSnapshot) => {
        const medicosList = medicosSnapshot.docs.map(doc => doc.data());
        setMedicos(medicosList);
      });

      return unsubscribe;
    };

  
    const unsubscribeReportes = fetchReportes();
    const unsubscribeConsultas = fetchConsultas();
    const unsubscribePacientes = fetchPacientes();
    const unsubscribeMedicos = fetchMedicos();

    
    return () => {
      unsubscribeReportes();
      unsubscribeConsultas();
      unsubscribePacientes();
      unsubscribeMedicos();
    };
  }, []);

  return (
    <div id="dashboard-container" className="dashboard-container">
      <header id="dashboard-header" className="dashboard-header">
        <h1>Dashboard de Reportes</h1>
        <p className="header-subtitle">Visualiza y genera informes estadísticos de tu clínica</p>
      </header>
      
      <div id="resumen-cards" className="resumen-cards">
        <div id="consultas-card" className="card card-blue">
          <div className="card-content">
            <div className="card-info">
              <h2>Consultas Hoy</h2>
              <p className="card-value">{chartData.length ? chartData[0].consultas : 0}</p> {}
              <span className="card-trend card-trend-blue">
                <TrendingUp size={16} className="trend-icon" />
                8% más que ayer
              </span>
            </div>
            <div className="card-icon card-icon-blue">
              <FileText size={24} />
            </div>
          </div>
        </div>

        <div id="pacientes-card" className="card card-green">
          <div className="card-content">
            <div className="card-info">
              <h2>Pacientes Nuevos</h2>
              <p className="card-value">{pacientes.length}</p>
              <span className="card-trend card-trend-green">
                <TrendingUp size={16} className="trend-icon" />
                {pacientes.length > 0 ? `${pacientes.length} pacientes registrados` : 'Sin cambios'}
              </span>
            </div>
            <div className="card-icon card-icon-green">
              <FileText size={24} />
            </div>
          </div>
        </div>

        <div id="medicos-card" className="card card-purple">
          <div className="card-content">
            <div className="card-info">
              <h2>Médicos Registrados</h2>
              <p className="card-value">{medicos.length}</p> {}
              <span className="card-trend card-trend-purple">
                <TrendingUp size={16} className="trend-icon" />
                {medicos.length > 0 ? `${medicos.length} médicos registrados` : 'Sin cambios'}
              </span>
            </div>
            <div className="card-icon card-icon-purple">
              <FileText size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="main-grid">
        <div id="chart-container" className="chart-section">
          <div id="weekly-chart" className="panel">
            <h2 className="panel-title">Consultas Semanales</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="consultas" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div id="tabla-reportes-container" className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Reportes Generados</h2>
              <span className="report-badge">Total: {reportes.length}</span>
            </div>
            <div className="table-container">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reportes.map((reporte) => (
                    <tr key={reporte.id}>
                      <td>{reporte.tipo}</td>
                      <td className="description-cell">{reporte.descripcion}</td>
                      <td>{reporte.fecha}</td>
                      <td>
                        <div className="action-buttons">
                          <button id={`ver-btn-${reporte.id}`} className="action-btn view-btn">
                            <FileText size={18} />
                          </button>
                          <button id={`download-btn-${reporte.id}`} className="action-btn download-btn">
                            <Download size={18} />
                          </button>
                          <button id={`delete-btn-${reporte.id}`} className="action-btn delete-btn">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
