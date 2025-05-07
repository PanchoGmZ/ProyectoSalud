import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../Data/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { JitsiMeeting } from '@jitsi/react-sdk';
import './Consultas.css';

const ConsultaMedica = () => {
  const [medico, setMedico] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [videoCallId, setVideoCallId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mensajesContainerRef = useRef(null);

<<<<<<< HEAD
  // Función para generar un ID de chat consistente
  const getChatId = (uid1, uid2) => {
    return [uid1, uid2].sort().join('_');
=======


  const filtrarConsultas = () => {
    if (filtro === 'todas') return consultas;
    return consultas.filter((consulta) => consulta.tipo === filtro);
>>>>>>> 1825dd297ef88995f34677eb10c5e8fd5050f879
  };

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Obtener información del médico actual
          const medicosRef = collection(db, 'registromedico');
          const medicoQuery = query(medicosRef, where('uid', '==', user.uid));
          
          const medicoSnapshot = await getDocs(medicoQuery);
          
          if (!medicoSnapshot.empty) {
            const medicoData = {
              id: medicoSnapshot.docs[0].id,
              uid: user.uid,
              ...medicoSnapshot.docs[0].data()
            };
            setMedico(medicoData);
          } else {
            setMedico({
              uid: user.uid,
              nombre: user.displayName || 'Médico',
              email: user.email
            });
          }

          // Obtener lista de pacientes
          const pacientesRef = collection(db, 'registropaciente');
          const pacientesSnapshot = await getDocs(pacientesRef);
          const pacientesData = pacientesSnapshot.docs.map(doc => ({
            id: doc.id,
            uid: doc.data().uid || doc.id, // Asegurar que tenemos uid
            ...doc.data()
          }));
          setPacientes(pacientesData);
          
        } catch (err) {
          console.error('Error al cargar datos:', err);
          setError('Error al cargar los datos. Por favor, intente nuevamente.');
        } finally {
          setLoading(false);
        }
      } else {
        setMedico(null);
        setLoading(false);
        setError('Usuario no autenticado');
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Cargar mensajes cuando se selecciona un paciente
  useEffect(() => {
    if (!medico?.uid || !pacienteSeleccionado?.uid) return;

    const chatId = getChatId(medico.uid, pacienteSeleccionado.uid);
    console.log("Cargando mensajes para chatId:", chatId);

    const mensajesRef = collection(db, 'chats', chatId, 'mensajes');
    const mensajesQuery = query(mensajesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(mensajesQuery, (snapshot) => {
      const mensajesData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date()
        };
      });
      setMensajes(mensajesData);
      
      // Auto-scroll al final de los mensajes
      setTimeout(() => {
        if (mensajesContainerRef.current) {
          mensajesContainerRef.current.scrollTop = mensajesContainerRef.current.scrollHeight;
        }
      }, 100);
    }, (error) => {
      console.error("Error loading messages:", error);
      setError('Error al cargar los mensajes');
    });

    return () => unsubscribe();
  }, [pacienteSeleccionado, medico]);

  const seleccionarPaciente = (paciente) => {
    setPacienteSeleccionado(paciente);
    setShowVideoCall(false);
  };

  const formatHora = (timestamp) => {
    if (!timestamp) return '';
    const fecha = timestamp instanceof Date ? timestamp : timestamp.toDate();
    return fecha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || !medico?.uid || !pacienteSeleccionado?.uid) return;

    try {
      const chatId = getChatId(medico.uid, pacienteSeleccionado.uid);
      
      const mensajesRef = collection(db, 'chats', chatId, 'mensajes');
      
      const messageData = {
        texto: nuevoMensaje,
        sender: medico.uid,
        senderName: medico.nombre,
        senderType: 'medico',
        receiver: pacienteSeleccionado.uid,
        receiverName: pacienteSeleccionado.nombre,
        timestamp: serverTimestamp(),
        read: false
      };
      
      await addDoc(mensajesRef, messageData);
      setNuevoMensaje('');
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      setError('Error al enviar el mensaje');
    }
  };

  const iniciarVideollamada = () => {
    if (!pacienteSeleccionado || !medico) return;
    
    const callId = `consulta_${medico.uid.substring(0, 5)}_${pacienteSeleccionado.uid.substring(0, 5)}_${Date.now()}`;
    setVideoCallId(callId);
    setShowVideoCall(true);
    
    try {
      const videollamadasRef = collection(db, 'videollamadas');
      addDoc(videollamadasRef, {
        pacienteId: pacienteSeleccionado.uid,
        pacienteNombre: pacienteSeleccionado.nombre,
        medicoId: medico.uid,
        medicoNombre: medico.nombre,
        callId: callId,
        active: true,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error('Error al registrar videollamada:', err);
    }
  };

  const terminarVideollamada = () => {
    setShowVideoCall(false);
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error && !medico) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="consulta-medica-container">
      <header className="app-header">
        <h1>Sistema de Consulta Médica</h1>
        {medico && (
          <div className="user-info">
            <span>Doctor: {medico.nombre}</span>
            {medico.especialidad && <span> - {medico.especialidad}</span>}
          </div>
        )}
      </header>

      <div className="main-content">
        <aside className="pacientes-sidebar">
          <h2>Pacientes Registrados</h2>
          <ul className="pacientes-lista">
            {pacientes.map(paciente => (
              <li 
                key={paciente.id} 
                className={pacienteSeleccionado?.id === paciente.id ? 'selected' : ''}
                onClick={() => seleccionarPaciente(paciente)}
              >
                <div className="paciente-avatar">
                  {paciente.nombre ? paciente.nombre.charAt(0).toUpperCase() : 'P'}
                </div>
                <div className="paciente-info">
                  <h3>{paciente.nombre || 'Paciente'}</h3>
                  <p>Tel: {paciente.telefono || 'No disponible'}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <main className="chat-container">
          {!pacienteSeleccionado ? (
            <div className="empty-state">
              <p>Selecciona un paciente para comenzar una consulta</p>
            </div>
          ) : showVideoCall ? (
            <div className="videollamada-container">
              <div className="videollamada-header">
                <h2>Videollamada con {pacienteSeleccionado.nombre}</h2>
                <button className="btn-terminar" onClick={terminarVideollamada}>
                  Terminar Videollamada
                </button>
              </div>
              <div className="jitsi-container">
                <JitsiMeeting
                  roomName={videoCallId}
                  configOverwrite={{
                    startWithAudioMuted: false,
                    startWithVideoMuted: false,
                    prejoinPageEnabled: false
                  }}
                  userInfo={{
                    displayName: medico?.nombre || 'Doctor',
                    email: medico?.email || '',
                  }}
                  getIFrameRef={(iframeRef) => {
                    iframeRef.style.height = '100%';
                    iframeRef.style.width = '100%';
                  }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="chat-header">
                <h2>Chat con {pacienteSeleccionado.nombre}</h2>
                <button 
                  className="btn-videollamada" 
                  onClick={iniciarVideollamada}
                >
                  Iniciar Videollamada
                </button>
              </div>

              <div className="mensajes-container" ref={mensajesContainerRef}>
                {mensajes.length === 0 ? (
                  <div className="empty-chat">
                    <p>No hay mensajes. ¡Inicia la conversación!</p>
                  </div>
                ) : (
                  mensajes.map(mensaje => (
                    <div 
                      key={mensaje.id} 
                      className={`mensaje ${mensaje.sender === medico?.uid ? 'mensaje-enviado' : 'mensaje-recibido'}`}
                    >
                      <div className="mensaje-contenido">
                        <div className="mensaje-remitente">
                          {mensaje.sender === medico?.uid ? 'Tú' : pacienteSeleccionado.nombre}
                        </div>
                        <p>{mensaje.texto}</p>
                        <div className="mensaje-footer">
                          <span className="mensaje-hora">
                            {formatHora(mensaje.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form className="mensaje-form" onSubmit={enviarMensaje}>
                <input
                  type="text"
                  value={nuevoMensaje}
                  onChange={(e) => setNuevoMensaje(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="mensaje-input"
                />
                <button type="submit" className="btn-enviar">Enviar</button>
              </form>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ConsultaMedica;