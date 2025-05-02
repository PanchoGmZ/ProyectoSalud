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

const API_KEY = "AIzaSyAjp59jJ9-pysw_a98adAhfVPbJD_JA4F8";
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

      </div>
    </div>
  );
};

export default ConsultasVirtuales;
