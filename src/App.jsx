import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import {Inicio} from './pages/Principal/Inicio.jsx';
import {MisRutas} from './routers/Routes.jsx';

function App() {
  return (
    <MisRutas />

  );
}

export default App;
