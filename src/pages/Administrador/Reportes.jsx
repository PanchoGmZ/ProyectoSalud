import React from 'react';
import './Reportes.css'; // Importar el nuevo CSS

const Reportes = () => {
  const reportes = [
    { id: 1, tipo: 'Consultas por día', descripcion: 'Número de consultas atendidas por día', fecha: '01/06/2023' },
    { id: 2, tipo: 'Pacientes nuevos', descripcion: 'Registro de pacientes nuevos por mes', fecha: '01/06/2023' },
    { id: 3, tipo: 'Ingresos', descripcion: 'Ingresos generados por consultas', fecha: '01/06/2023' }
  ];

  return (
    <div className="container">
      <h1>Reportes</h1>
      
      <div className="tarjetas-resumen">
        <div className="tarjeta bg-blue-100">
          <h2>Consultas Hoy</h2>
          <p>24</p>
        </div>
        <div className="tarjeta bg-green-100">
          <h2>Pacientes Nuevos</h2>
          <p>5</p>
        </div>
        <div className="tarjeta bg-purple-100">
          <h2>Ingresos Hoy</h2>
          <p>$1,250</p>
        </div>
      </div>

      <div className="formulario-reporte">
        <h2>Generar Reportes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label>Tipo de Reporte</label>
            <select>
              <option>Seleccionar reporte</option>
              <option>Consultas por día</option>
              <option>Pacientes nuevos</option>
              <option>Ingresos</option>
              <option>Horarios más solicitados</option>
            </select>
          </div>
          <div>
            <label>Rango de Fechas</label>
            <div className="flex gap-2">
              <input type="date" />
              <span className="self-center">a</span>
              <input type="date" />
            </div>
          </div>
        </div>
        <button>Generar Reporte</button>
      </div>

      <div className="tabla-reportes">
        <h2>Reportes Generados</h2>
        <div className="overflow-x-auto">
          <table>
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
                  <td>{reporte.descripcion}</td>
                  <td>{reporte.fecha}</td>
                  <td>
                    <button className="text-blue-500">Ver</button>
                    <button className="text-green-500">Descargar</button>
                    <button className="text-red-500">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reportes;