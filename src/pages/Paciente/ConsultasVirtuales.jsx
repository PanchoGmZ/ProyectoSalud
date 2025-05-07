<<<<<<< HEAD
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
  doc,
  updateDoc,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { JitsiMeeting } from '@jitsi/react-sdk';
import './ConsultasVirtuales.css';

const ConsultaPaciente = () => {
  const [paciente, setPaciente] = useState(null);
  const [medicos, setMedicos] = useState([]);
  const [medicoSeleccionado, setMedicoSeleccionado] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [videoCallId, setVideoCallId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [activeCall, setActiveCall] = useState(null);
  
  const mensajesContainerRef = useRef(null);

  // Función para generar ID de chat consistente
  const getChatId = (uid1, uid2) => {
    return [uid1, uid2].sort().join('_');
  };

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Obtener información del paciente actual
          const pacientesRef = collection(db, 'registropaciente');
          const pacienteQuery = query(pacientesRef, where('uid', '==', user.uid));
          
          const pacienteSnapshot = await getDocs(pacienteQuery);
          
          if (!pacienteSnapshot.empty) {
            const pacienteData = {
              id: pacienteSnapshot.docs[0].id,
              uid: user.uid,
              ...pacienteSnapshot.docs[0].data()
            };
            setPaciente(pacienteData);

            // Actualizar estado en línea del paciente
            const pacienteDocRef = doc(db, 'registropaciente', pacienteData.id);
            await updateDoc(pacienteDocRef, {
              online: true,
              lastActive: serverTimestamp()
            });
          } else {
            setPaciente({
              uid: user.uid,
              nombre: user.displayName || 'Paciente',
              email: user.email
            });
          }

          // Obtener lista de médicos
          const medicosRef = collection(db, 'registromedico');
          const medicosSnapshot = await getDocs(medicosRef);
          const medicosData = medicosSnapshot.docs.map(doc => ({
            id: doc.id,
            uid: doc.data().uid, // Asegurarse de que tenemos el uid
            ...doc.data()
          }));
          setMedicos(medicosData);
          
          // Configurar escucha para mensajes no leídos
          setupUnreadMessagesListener(user.uid, medicosData);
          
          // Configurar escucha para videollamadas activas
          setupVideoCallListener(user.uid);
          
        } catch (err) {
          console.error('Error al cargar datos:', err);
          setError('Error al cargar los datos. Por favor, intente nuevamente.');
        } finally {
          setLoading(false);
        }
      } else {
        setPaciente(null);
        setLoading(false);
        setError('Usuario no autenticado');
      }
    });

    return () => {
      unsubscribeAuth();
      if (paciente?.id) {
        const pacienteDocRef = doc(db, 'registropaciente', paciente.id);
        updateDoc(pacienteDocRef, {
          online: false,
          lastActive: serverTimestamp()
        }).catch(err => console.error("Error updating patient status:", err));
      }
    };
  }, []);

  const setupUnreadMessagesListener = (pacienteUid, medicosList) => {
    const unsubscribers = [];
    
    medicosList.forEach(medico => {
      if (!medico.uid) return; // Asegurarse de que el médico tiene uid
      
      const chatId = getChatId(medico.uid, pacienteUid);
      const mensajesRef = collection(db, 'chats', chatId, 'mensajes');
      
      const mensajesQuery = query(
        mensajesRef, 
        where('receiver', '==', pacienteUid),
        where('read', '==', false)
      );
      
      const unsubscribe = onSnapshot(mensajesQuery, (snapshot) => {
        setUnreadMessages(prev => ({
          ...prev,
          [medico.id]: snapshot.docs.length
        }));
      });
      
      unsubscribers.push(unsubscribe);
    });
    
    return () => unsubscribers.forEach(unsubscribe => unsubscribe());
  };

  const setupVideoCallListener = (pacienteUid) => {
    const videollamadasRef = collection(db, 'videollamadas');
    const videoCallQuery = query(
      videollamadasRef,
      where('pacienteId', '==', pacienteUid),
      where('active', '==', true)
    );
    
    return onSnapshot(videoCallQuery, (snapshot) => {
      if (!snapshot.empty) {
        const callData = snapshot.docs[0].data();
        setActiveCall(callData);
        
        if (!showVideoCall) {
          setVideoCallId(callData.callId);
          setMedicoSeleccionado(medicos.find(m => m.uid === callData.medicoId) || {
            id: callData.medicoId,
            nombre: callData.medicoNombre
          });
          setShowVideoCall(true);
        }
      } else {
        setActiveCall(null);
      }
    });
  };

  useEffect(() => {
    if (mensajesContainerRef.current) {
      mensajesContainerRef.current.scrollTop = mensajesContainerRef.current.scrollHeight;
    }
  }, [mensajes]);
  
  useEffect(() => {
    if (!paciente?.uid || !medicoSeleccionado?.uid) return;

    const chatId = getChatId(medicoSeleccionado.uid, paciente.uid);
    console.log("Cargando mensajes para chatId:", chatId);

    const mensajesRef = collection(db, 'chats', chatId, 'mensajes');
    const mensajesQuery = query(mensajesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(mensajesQuery, (snapshot) => {
      const mensajesData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp)
        };
      });
      setMensajes(mensajesData);
      
      // Marcar mensajes como leídos
      snapshot.docs.forEach(async (docSnapshot) => {
        const mensajeData = docSnapshot.data();
        if (mensajeData.sender !== paciente.uid && !mensajeData.read) {
          const mensajeRef = doc(db, 'chats', chatId, 'mensajes', docSnapshot.id);
          await updateDoc(mensajeRef, {
            read: true,
            readAt: serverTimestamp()
          });
        }
      });
      
      setUnreadMessages(prev => ({
        ...prev,
        [medicoSeleccionado.id]: 0
      }));
    }, (error) => {
      console.error("Error loading messages:", error);
      setError('Error al cargar los mensajes');
    });

    return () => unsubscribe();
  }, [medicoSeleccionado, paciente]);

  const seleccionarMedico = (medico) => {
    setMedicoSeleccionado(medico);
    setShowVideoCall(false);
  };

  const formatHora = (timestamp) => {
    if (!timestamp) return '';
    const fecha = timestamp instanceof Date ? timestamp : timestamp.toDate();
    return fecha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || !paciente?.uid || !medicoSeleccionado?.uid) return;

    try {
      const chatId = getChatId(medicoSeleccionado.uid, paciente.uid);
      const mensajesRef = collection(db, 'chats', chatId, 'mensajes');
      
      const mensaje = {
        texto: nuevoMensaje,
        sender: paciente.uid,
        senderName: paciente.nombre,
        senderType: 'paciente',
        receiver: medicoSeleccionado.uid,
        receiverName: medicoSeleccionado.nombre,
        receiverType: 'medico',
        timestamp: serverTimestamp(),
        read: false
      };
      
      await addDoc(mensajesRef, mensaje);
      setNuevoMensaje('');
      
      if (mensajesContainerRef.current) {
        setTimeout(() => {
          mensajesContainerRef.current.scrollTop = mensajesContainerRef.current.scrollHeight;
        }, 100);
      }
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      setError('Error al enviar el mensaje');
    }
  };

  const unirseAVideollamada = (callId) => {
    setVideoCallId(callId);
    setShowVideoCall(true);
    
    const videollamadasRef = collection(db, 'videollamadas');
    const q = query(videollamadasRef, where('callId', '==', callId));
    
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((document) => {
        updateDoc(doc(db, 'videollamadas', document.id), {
          unido: true,
          joinedAt: serverTimestamp()
        });
      });
    });
  };

  const terminarVideollamada = () => {
    if (videoCallId) {
      const videollamadasRef = collection(db, 'videollamadas');
      const q = query(videollamadasRef, where('callId', '==', videoCallId));
      
      getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((document) => {
          updateDoc(doc(db, 'videollamadas', document.id), {
            active: false,
            endedAt: serverTimestamp()
          });
        });
      });
    }
    
    setShowVideoCall(false);
    setActiveCall(null);
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error && !paciente) return <div className="error">{error}</div>;

  return (
    <div className="consulta-paciente-container">
      <header className="app-header">
        <h1>Sistema de Consulta Médica</h1>
        {paciente && (
          <div className="user-info">
            <span>Paciente: {paciente.nombre}</span>
          </div>
        )}
      </header>

      <div className="main-content">
        <aside className="medicos-sidebar">
          <h2>Médicos Disponibles</h2>
          <ul className="medicos-lista">
            {medicos.map(medico => {
              const unreadCount = unreadMessages[medico.id] || 0;
              
              return (
                <li 
                  key={medico.id} 
                  className={`${medicoSeleccionado?.id === medico.id ? 'selected' : ''} 
                              ${unreadCount > 0 ? 'unread' : ''}`}
                  onClick={() => seleccionarMedico(medico)}
                >
                  <div className="medico-avatar">
                    {medico.nombre?.charAt(0).toUpperCase() || 'D'}
                    {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
                  </div>
                  <div className="medico-info">
                    <h3>Dr. {medico.nombre || 'Médico'}</h3>
                    {medico.especialidad && <p>Especialidad: {medico.especialidad}</p>}
                    {medico.online 
                      ? <span className="status-online">En línea</span>
                      : medico.lastActive && <p>Última conexión: {formatHora(medico.lastActive)}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
          
          {activeCall && !showVideoCall && (
            <div className="videollamada-notificacion">
              <p>El Dr. {activeCall.medicoNombre} te está llamando</p>
              <button 
                className="btn-unirse"
                onClick={() => unirseAVideollamada(activeCall.callId)}
              >
                Unirse a Videollamada
              </button>
            </div>
          )}
        </aside>

        <main className="chat-container">
          {!medicoSeleccionado ? (
            <div className="empty-state">
              <p>Selecciona un médico para comenzar una consulta</p>
            </div>
          ) : showVideoCall ? (
            <div className="videollamada-container">
              <div className="videollamada-header">
                <h2>Videollamada con Dr. {medicoSeleccionado.nombre}</h2>
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
                    displayName: paciente?.nombre || 'Paciente',
                    email: paciente?.email || '',
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
                <h2>Chat con Dr. {medicoSeleccionado.nombre}</h2>
                <div className="medico-detalles">
                  {medicoSeleccionado.especialidad && (
                    <p>Especialidad: {medicoSeleccionado.especialidad}</p>
                  )}
                  {medicoSeleccionado.online 
                    ? <p className="status-online">Médico en línea</p>
                    : <p>Última conexión: {formatHora(medicoSeleccionado.lastActive)}</p>}
                </div>
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
                      className={`mensaje ${
                        mensaje.isSystemMessage ? 'mensaje-sistema' : 
                        mensaje.sender === paciente?.uid ? 'mensaje-enviado' : 'mensaje-recibido'
                      }`}
                    >
                      <div className="mensaje-contenido">
                        <div className="mensaje-remitente">
                          {mensaje.isSystemMessage ? 'Sistema' : 
                           mensaje.sender === paciente?.uid ? paciente.nombre : `Dr. ${medicoSeleccionado.nombre}`}
                        </div>
                        <p>{mensaje.texto}</p>
                        <div className="mensaje-footer">
                          <span className="mensaje-hora">
                            {formatHora(mensaje.timestamp)}
                          </span>
                          {mensaje.sender === paciente?.uid && mensaje.read && 
                            <span className="mensaje-leido">✓ Leído</span>}
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
=======
import React, { useState, useEffect } from 'react';
import './ConsultasVirtuales.css';
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaQuestionCircle,
  FaComments,
  FaTools,
  FaRobot,
  FaInstagram,
  FaFacebookF,
  FaWhatsapp
} from 'react-icons/fa';
import { db } from '../../Data/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = "";
const genAI = new GoogleGenerativeAI(API_KEY);

const ConsultasVirtuales = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', correo: '', consulta: '' });
  const [activeTab, setActiveTab] = useState('form');
  const [consultas, setConsultas] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');

  const toggleForm = () => setFormVisible(!formVisible);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "consultas"), {
        ...formData,
        estado: "Pendiente",
        fecha: new Date()
      });
      alert("Consulta enviada correctamente!");
      setFormVisible(false);
      setFormData({ nombre: '', correo: '', consulta: '' });
    } catch (error) {
      console.error("Error al enviar la consulta:", error);
    }
  };

  const handleTabChange = (tab) => setActiveTab(tab);
  const handleContactEmail = () => alert('Enviando correo...');
  const handleSupport = () => alert('Conectando con soporte...');
  const handleChat = () => setActiveTab('chat');

  useEffect(() => {
    const obtenerConsultas = async () => {
      const snapshot = await getDocs(collection(db, "consultas"));
      const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setConsultas(datos);
    };
    if (activeTab === 'faq') obtenerConsultas();
  }, [activeTab]);

  const handleChatSubmit = async () => {
    if (!userMessage.trim()) return;
  
    const newMessages = [...chatMessages, { user: userMessage }];
    setChatMessages(newMessages);
    setUserMessage('');
  
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
      const prompt = `
  Actúa como un médico enfermero especializado en atención primaria y consultas generales. 
  Tu tarea es brindar orientación inicial, explicar síntomas comunes, cuidados preventivos y primeros auxilios básicos. 
  Responde con empatía, usando un lenguaje sencillo, claro y amigable, sin dar diagnósticos definitivos ni recetar medicamentos. 
  Si una consulta requiere atención médica urgente, recomienda acudir al centro de salud más cercano. 
  Sé profesional pero cálido en tu comunicación.
  
  Consulta del paciente: ${userMessage}
      `;
  
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
  
      setChatMessages([...newMessages, { bot: text }]);
    } catch (error) {
      console.error("Error al conectarse con Gemini:", error);
      setChatMessages([...newMessages, { bot: 'Error al conectarse con Gemini.' }]);
    }
  };
  

  return (
    <div id="consultas-virtuales-page" className="consultas-body">
      <div id="consultas-container" className="consultas-container">
        <header className="consultas-header">
          <img
            src="https://cdn.getmidnight.com/f0f4b6598f2cee45644673998b4f44be/2021/07/close-up-patient-talking-doctor-online.jpg"
            alt="Consultas Virtuales"
            className="header-image"
          />
          <div className="header-content">
            <h1>Consultas Virtuales</h1>
            <p>¡Te ayudamos con lo que necesites! Selecciona una opción y realiza tu consulta.</p>
          </div>
        </header>

        <nav id="consultas-navigation" className="navigation">
          <button className={`nav-btn ${activeTab === 'form' ? 'active' : ''}`} onClick={() => handleTabChange('form')}>Formulario de Consulta</button>
          <button className={`nav-btn ${activeTab === 'faq' ? 'active' : ''}`} onClick={() => handleTabChange('faq')}>Registro de consultas</button>
          <button className={`nav-btn ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => handleTabChange('contact')}>Contacto Rápido</button>
          <button className={`nav-btn ${activeTab === 'support' ? 'active' : ''}`} onClick={() => handleTabChange('support')}>Soporte Técnico</button>
          <button className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => handleTabChange('chat')}><FaRobot /> Chatbot</button>
        </nav>

        {activeTab === 'form' && (
          <section className="consultas-form">
            <h2>Formulario de Consulta</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label><FaUser /> Nombre Completo</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label><FaEnvelope /> Correo Electrónico</label>
                <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label><FaQuestionCircle /> Consulta</label>
                <textarea name="consulta" value={formData.consulta} onChange={handleChange} required />
              </div>
              <button type="submit" className="submit-btn">Enviar Consulta</button>
            </form>
          </section>
        )}

        {activeTab === 'faq' && (
          <section className="consultas-faq">
            <h2>Consultas Recibidas</h2>
            {consultas.length === 0 ? (
              <p>No hay consultas registradas.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Consulta</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {consultas.map((c) => (
                    <tr key={c.id}>
                      <td>{c.nombre}</td>
                      <td>{c.correo}</td>
                      <td>{c.consulta}</td>
                      <td>{c.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {activeTab === 'contact' && (
          <section className="consultas-contact">
            <h2>Contacto Rápido</h2>
            <a href="https://wa.me/59176198288" className="contact-btn whatsapp-btn" target="_blank" rel="noopener noreferrer">
              <FaPhoneAlt /> Llamar por WhatsApp
            </a>
            <button className="contact-btn email-btn" onClick={handleContactEmail}>
              <FaEnvelope /> Enviar Correo
            </button>
          </section>
        )}

        {activeTab === 'support' && (
          <section className="consultas-support">
            <h2>Soporte Técnico</h2>
            <button className="support-btn" onClick={handleSupport}><FaTools /> Soporte Técnico</button>
            <button className="support-btn" onClick={handleChat}><FaComments /> Chatea con Nosotros</button>

            <div className="social-buttons">
              <a href="https://www.instagram.com/vladimirlizarazu46?igsh=cWFwMDJidTlsNG53" target="_blank" rel="noopener noreferrer" className="social-button instagram">
                <FaInstagram /> Instagram
              </a>
              <a href="https://www.facebook.com/share/1Hpys2nw4U/" target="_blank" rel="noopener noreferrer" className="social-button facebook">
                <FaFacebookF /> Facebook
              </a>
              <a href="https://wa.me/59176198288" target="_blank" rel="noopener noreferrer" className="social-button whatsapp">
                <FaWhatsapp /> WhatsApp
              </a>
            </div>
          </section>
        )}

{activeTab === 'chat' && (
  <section className="consultas-chat">
    <h2>Chatbot</h2>
    <div className="chat-container">
      <div className="chat-box">
        {chatMessages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.user ? 'user' : 'bot'}`}>
            <div className="message-content">
              {msg.user ? (
                <p>{msg.user}</p>
              ) : (
                <pre className="bot-message">{msg.bot}</pre>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input-area">
        <textarea
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Escribe tu mensaje"
          className="chat-input"
        />
        <button className="submit-btn" onClick={handleChatSubmit}>Enviar</button>
      </div>
    </div>
  </section>
)}

>>>>>>> 1825dd297ef88995f34677eb10c5e8fd5050f879
      </div>
    </div>
  );
};

export default ConsultaPaciente;