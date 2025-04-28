import React from 'react';
import { Link } from 'react-router-dom';

const TarjetaOpcion = ({ ruta, icono, titulo, descripcion }) => {
  return (
    <Link to={ruta} className="tarjeta-opcion">
      <div className="contenedor-icono">{icono}</div>
      <h3 className="titulo-tarjeta">{titulo}</h3>
      <p className="descripcion-tarjeta">{descripcion}</p>
    </Link>
  );
};

export default TarjetaOpcion;