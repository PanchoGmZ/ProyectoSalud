import React, { useEffect, useState } from 'react';
import './ResultadosPacientes.css';

const ResultadosPacientes = () => {
  const [resultados, setResultados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch('/data/resultados.json')
      .then(response => response.json())
      .then(data => {
        setResultados(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar los resultados:', error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="resultados-container">
      <h1 className="resultados-titulo">Resultados de Pacientes</h1>
      
      {isLoading ? (
        <div className="cargando">Cargando resultados...</div>
      ) : resultados.length === 0 ? (
        <div className="sin-resultados">No se encontraron resultados disponibles</div>
      ) : (
        <ul className="resultados-lista">
          {resultados.map((resultado) => (
            <li key={resultado.id} className="resultado-item">
              <div className="resultado-info">
                <h3 className="resultado-paciente">{resultado.paciente}</h3>
                <p><strong>Tipo:</strong> {resultado.tipo}</p>
                <p><strong>Fecha:</strong> {resultado.fecha}</p>
                <p><strong>Observaciones:</strong> {resultado.observaciones}</p>
              </div>
              <a
                href={`/archivos/${resultado.archivo}`}
                download
                className="resultado-link"
              >
                Descargar PDF
              </a>
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => window.history.back()} className="boton-atras">
        Atrás
      </button>
    </div>
  );
};

export default ResultadosPacientes;