import React, { useState } from 'react';
import './ConsultasVirtuales.css';
import { FaUser, FaEnvelope, FaPhoneAlt, FaQuestionCircle, FaComments, FaTools } from 'react-icons/fa';

const ConsultasVirtuales = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    consulta: ''
  });
  const [activeTab, setActiveTab] = useState('form');

  const toggleForm = () => setFormVisible(!formVisible);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Consulta enviada correctamente!');
    setFormVisible(false);
  };
  const handleTabChange = (tab) => setActiveTab(tab);

  const handleContactCall = () => alert('Llamando...');
  const handleContactEmail = () => alert('Enviando correo...');
  const handleSupport = () => alert('Conectando con soporte...');
  const handleChat = () => alert('Iniciando chat...');

  return (
    <div className="consultas-container">
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

      <nav className="navigation">
        <button className={`nav-btn ${activeTab === 'form' ? 'active' : ''}`} onClick={() => handleTabChange('form')}>Formulario de Consulta</button>
        <button className={`nav-btn ${activeTab === 'faq' ? 'active' : ''}`} onClick={() => handleTabChange('faq')}>Preguntas Frecuentes</button>
        <button className={`nav-btn ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => handleTabChange('contact')}>Contacto Rápido</button>
        <button className={`nav-btn ${activeTab === 'support' ? 'active' : ''}`} onClick={() => handleTabChange('support')}>Soporte Técnico</button>
      </nav>

      {/* Formulario */}
      {activeTab === 'form' && (
        <section className="consultas-form">
          <h2>Formulario de Consulta</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre"><FaUser /> Nombre Completo</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ingresa tu nombre"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="correo"><FaEnvelope /> Correo Electrónico</label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="Ingresa tu correo"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="consulta"><FaQuestionCircle /> Consulta</label>
              <textarea
                id="consulta"
                name="consulta"
                value={formData.consulta}
                onChange={handleChange}
                placeholder="Escribe tu consulta"
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">Enviar Consulta</button>
          </form>
        </section>
      )}

      {/* Preguntas Frecuentes */}
      {activeTab === 'faq' && (
        <section className="consultas-faq">
          <h2>Preguntas Frecuentes</h2>
          <ul>
            <li>¿Cómo puedo recibir una respuesta a mi consulta?</li>
            <li>¿El servicio es gratuito?</li>
            <li>¿Puedo realizar consultas por teléfono?</li>
          </ul>
        </section>
      )}

      {/* Contacto rápido */}
      {activeTab === 'contact' && (
        <section className="consultas-contact">
          <h2>Contacto Rápido</h2>
          <button className="contact-btn" onClick={handleContactCall}><FaPhoneAlt /> Llamar Ahora</button>
          <button className="contact-btn" onClick={handleContactEmail}><FaEnvelope /> Enviar Correo</button>
        </section>
      )}

      {/* Soporte Técnico */}
      {activeTab === 'support' && (
        <section className="consultas-support">
          <h2>Soporte Técnico</h2>
          <button className="support-btn" onClick={handleSupport}><FaTools /> Soporte Técnico</button>
          <button className="support-btn" onClick={handleChat}><FaComments /> Chatea con Nosotros</button>
        </section>
      )}
    </div>
  );
};

export default ConsultasVirtuales;
