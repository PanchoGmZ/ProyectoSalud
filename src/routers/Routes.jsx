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


import InicioAdministrador from '../pages/Administrador/InicioAdministrador';
import GestionTurnos from '../pages/Administrador/GestionTurnos';
import GestionUsuarios from '../pages/Administrador/GestionUsuarios';
import Reportes from '../pages/Administrador/Reportes';


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
          <Route path="/consultas-virtuales" element={<ConsultasVirtuales />} />
          <Route path="/resultados-clinicos" element={<ResultadosClinicos />} />
          <Route path="/perfil" element={<PerfilPaciente />} />
          
          {/* Rutas de Medico */}
          <Route path="/inicio-medico" element={<DashboardMedico />} />
          <Route path="/agenda-medico" element={<AgendaMedico />} />
          <Route path="/perfil-medico" element={<PerfilMedico />} />
          <Route path='/resultados-pacientes' element={<ResultadosPacientes/>}/>


          {/* Rutas de Administrador */}
          <Route path='/inicio-administrador' element={<InicioAdministrador />}/>
          <Route path='/gestion-turnos' element={<GestionTurnos />}/>
          <Route path='/gestion-usuarios' element={<GestionUsuarios  />}/> 
          <Route path='/reportes' element={<Reportes />}/>
        </Routes>
      </BrowserRouter>
    );
  };
  
  export default MisRutas;