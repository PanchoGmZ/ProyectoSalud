import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InicioPaciente from '../pages/Paciente/InicioPaciente';
import AgendarTurno from '../pages/Paciente/AgendarTurno';
import MisTurnos from '../pages/Paciente/MisTurnos';
import ConsultasVirtuales from '../pages/Paciente/ConsultasVirtuales';
import ResultadosClinicos from '../pages/Paciente/ResultadosClinicos';
import PerfilPaciente from '../pages/Paciente/PerfilPaciente';
import Inicio from '../pages/Principal/Inicio';


import AgendaMedico from '../pages/Medico/AgendaMedico';
import Login from '../pages/Principal/Login';
import Registro from '../pages/Principal/Registro';
import DashboardMedico from '../pages/Medico/InicioMedico';
import PerfilMedico from '../pages/Medico/PerfilMedico';
import ResultadosPacientes from '../pages/Medico/ResultadosPacientes';
import Consultas from '../pages/Medico/ConsultasVirtualesMedico';
import LoginMedico from '../pages/Principal/LoginMedico';

import InicioAdministrador from '../pages/Administrador/InicioAdministrador';
import GestionTurnos from '../pages/Administrador/GestionTurnos';
import GestionMedicos from '../pages/Administrador/GestionMedicos';
import Reportes from '../pages/Administrador/Reportes';
import LoginAdmin from '../pages/Administrador/LoginAdmin';
<<<<<<< HEAD
import ConsultaMedicaApp from '../pages/Paciente/ConsultasVirtuales';
import ConsultaMedica from '../pages/Medico/ConsultasVirtualesMedico';
import CrearChat from '../pages/Paciente/ConsultasVirtuales';
=======
>>>>>>> 1825dd297ef88995f34677eb10c5e8fd5050f879



export const MisRutas = () => {
    return (
      <BrowserRouter>
        <Routes>
          {/* PRINCIPAL */}
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />


          {/* Rutas de Paciente */}
          <Route path="/inicio-paciente" element={<InicioPaciente />} />
          <Route path="/agendar-turno" element={<AgendarTurno />} />
          <Route path="/mis-turnos" element={<MisTurnos />} />
          <Route path="/consultas-virtuales" element={<CrearChat />} />
          <Route path="/resultados-clinicos" element={<ResultadosClinicos />} />
          <Route path="/perfil" element={<PerfilPaciente />} />
          <Route path="/turno-paciente" element={<crearTurno/>} />
          
          {/* Rutas de Medico */}
          <Route path="/inicio-medico" element={<DashboardMedico />} />
          <Route path="/agenda-medico" element={<AgendaMedico />} />
          <Route path="/perfil-medico" element={<PerfilMedico />} />
          <Route path='/resultados-pacientes' element={<ResultadosPacientes/>}/>
<<<<<<< HEAD
          <Route path='/consultas' element={<ConsultaMedica/>}/>
          
        <Route path="/loginmedico" element={<LoginMedico/>} />
        
=======
          <Route path='/consultas' element={<Consultas/>}/>
          
        <Route path="/loginmedico" element={<LoginMedico/>} />
>>>>>>> 1825dd297ef88995f34677eb10c5e8fd5050f879


          {/* Rutas de Administrador */}
          <Route path='/login-administrador' element={<LoginAdmin />}/>
          <Route path='/inicio-administrador' element={<InicioAdministrador />}/>
          <Route path='/gestion-turnos' element={<GestionTurnos />}/>
          <Route path='/gestion-medicos' element={<GestionMedicos />}/>
          <Route path='/reportes' element={<Reportes />}/>
        </Routes>
      </BrowserRouter>
    );
  };
  
  export default MisRutas;