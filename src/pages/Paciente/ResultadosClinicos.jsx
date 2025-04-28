import React, { useState } from 'react';
import './ResultadosClinicos.css';

// Componente para ver detalles de resultados
function VerDetallesResultado({ resultado, closeModal }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>✖️</button>
        <div>
          <h2 className="modal-title">
            📊 Detalles del Resultado
          </h2>
          
          <div className="result-header">
            <h3 className="result-title">{resultado.tipoExamen}</h3>
            <span className="result-date">{resultado.fecha}</span>
          </div>
          
          <div className="result-info">
            <p><strong>Médico solicitante:</strong> {resultado.medico}</p>
            <p><strong>Laboratorio:</strong> {resultado.laboratorio}</p>
          </div>
          
          <h3 className="section-title">
            Resultados
          </h3>
          
          {resultado.detalles.map((item, index) => (
            <div className="result-item" key={index}>
              <span className="result-label">{item.parametro}:</span>
              <span className={`result-value ${item.estado === 'Alto' || item.estado === 'Bajo' ? 'abnormal' : 
                              item.estado === 'Moderado' ? 'warning' : ''}`}>
                {item.valor} {item.unidad} 
                {item.estado !== 'Normal' && ` (${item.estado})`}
              </span>
            </div>
          ))}
          
          {resultado.observaciones && (
            <>
              <h3 className="section-title">
                Observaciones
              </h3>
              <p>{resultado.observaciones}</p>
            </>
          )}
          
          <div className="modal-actions">
            <button className="secondary-button" onClick={() => alert('Descargando resultados...')}>
              ⬇️ Descargar PDF
            </button>
            <button className="secondary-button" onClick={() => alert('Compartiendo resultados...')}>
              ↗️ Compartir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente principal de resultados clínicos
export default function ResultadosClinicos() {
  const [resultados, setResultados] = useState([
    {
      id: 1,
      tipoExamen: 'Hemograma Completo',
      fecha: '15/03/2023',
      medico: 'Dr. Carlos Mendoza',
      laboratorio: 'Laboratorio Central',
      estado: 'Anormal',
      detalles: [
        { parametro: 'Hemoglobina', valor: '18.5', unidad: 'g/dL', estado: 'Alto', rango: '13.5-17.5' },
        { parametro: 'Hematocrito', valor: '52', unidad: '%', estado: 'Alto', rango: '40-50' },
        { parametro: 'Leucocitos', valor: '6.500', unidad: '/mm³', estado: 'Normal', rango: '4.500-11.000' }
      ],
      observaciones: 'Niveles elevados de hemoglobina y hematocrito. Se recomienda evaluación por hematología.'
    },
    {
      id: 2,
      tipoExamen: 'Perfil Lipídico',
      fecha: '10/02/2023',
      medico: 'Dra. Laura Sánchez',
      laboratorio: 'LabSalud',
      estado: 'Moderado',
      detalles: [
        { parametro: 'Colesterol Total', valor: '210', unidad: 'mg/dL', estado: 'Moderado', rango: '<200' },
        { parametro: 'HDL', valor: '45', unidad: 'mg/dL', estado: 'Normal', rango: '>40' },
        { parametro: 'LDL', valor: '140', unidad: 'mg/dL', estado: 'Moderado', rango: '<130' },
        { parametro: 'Triglicéridos', valor: '180', unidad: 'mg/dL', estado: 'Moderado', rango: '<150' }
      ],
      observaciones: 'Perfil lipídico moderadamente elevado. Se sugiere modificación de dieta y control en 3 meses.'
    },
    {
      id: 3,
      tipoExamen: 'Glucosa en Ayunas',
      fecha: '05/01/2023',
      medico: 'Dr. Javier Rodríguez',
      laboratorio: 'Laboratorio Central',
      estado: 'Normal',
      detalles: [
        { parametro: 'Glucosa', valor: '92', unidad: 'mg/dL', estado: 'Normal', rango: '70-99' }
      ]
    }
  ]);

  const [filter, setFilter] = useState('todos');
  const [selectedResult, setSelectedResult] = useState(null);

  const filteredResults = resultados.filter(resultado => {
    if (filter === 'todos') return true;
    if (filter === 'anormales') return resultado.estado === 'Anormal';
    if (filter === 'moderados') return resultado.estado === 'Moderado';
    if (filter === 'recientes') {
      const examDate = new Date(resultado.fecha.split('/').reverse().join('-'));
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return examDate > monthAgo;
    }
    return true;
  });

  return (
    <div className="main-container">
      <div className="header-section">
        <div className="title-section">
          <h1 className="title">Resultados<br />Clínicos</h1>
          <p className="description">
            Consulta tus exámenes<br />
            de laboratorio y<br />
            resultados de estudios<br />
            médicos.<br />
            Puedes filtrar,<br />
            descargar y compartir<br />
            tus resultados.
          </p>
        </div>
        
        <div className="filters-section">
          <button 
            className={`filter-button ${filter === 'todos' ? 'active' : ''}`}
            onClick={() => setFilter('todos')}
          >
            Todos
          </button>
          <button 
            className={`filter-button ${filter === 'recientes' ? 'active' : ''}`}
            onClick={() => setFilter('recientes')}
          >
            Último mes
          </button>
          <button 
            className={`filter-button ${filter === 'anormales' ? 'active' : ''}`}
            onClick={() => setFilter('anormales')}
          >
            Anormales
          </button>
          <button 
            className={`filter-button ${filter === 'moderados' ? 'active' : ''}`}
            onClick={() => setFilter('moderados')}
          >
            Moderados
          </button>
        </div>
      </div>

      <div className="results-section">
        {filteredResults.length > 0 ? (
          filteredResults.map(resultado => (
            <div 
              key={resultado.id}
              className={`result-card ${resultado.estado === 'Anormal' ? 'urgent' : 
                          resultado.estado === 'Moderado' ? 'warning' : ''}`}
              onClick={() => setSelectedResult(resultado)}
            >
              <div className="result-card-header">
                <div className="result-card-title">
                  <h3>{resultado.tipoExamen}</h3>
                  <span className="result-date">{resultado.fecha}</span>
                </div>
              </div>
              
              <div className="result-card-content">
                <div className="result-item">
                  <span className="result-label">Estado:</span>
                  <span className={`result-value ${resultado.estado === 'Anormal' ? 'abnormal' : 
                                  resultado.estado === 'Moderado' ? 'warning' : ''}`}>
                    {resultado.estado}
                  </span>
                </div>
                
                <div className="result-item">
                  <span className="result-label">Médico:</span>
                  <span className="result-value doctor-name">{resultado.medico}</span>
                </div>
                
                <div className="result-item">
                  <span className="result-label">Laboratorio:</span>
                  <span className="result-value lab-name">{resultado.laboratorio}</span>
                </div>
                
                <button 
                  className="detail-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedResult(resultado);
                  }}
                >
                  Ver detalles completos
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">
            No hay resultados que coincidan con el filtro seleccionado.
          </p>
        )}
      </div>

      {selectedResult && (
        <VerDetallesResultado 
          resultado={selectedResult} 
          closeModal={() => setSelectedResult(null)} 
        />
      )}
    </div>
  );
}