import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  // Estado para almacenar los mensajes del chat
  const [messages, setMessages] = useState([]);
  // Estado para controlar el input del usuario
  const [userInput, setUserInput] = useState('');

  // Función para enviar el mensaje del usuario al bot y recibir la respuesta
  const sendMessageToBot = async (message) => {
    try {
      // Realizar la solicitud a la API de Rasa (asegurarse de que Rasa está en ejecución)
      const response = await axios.post('http://localhost:5005/webhooks/rest/webhook', {
        sender: 'user',  // El nombre de la sesión de usuario
        message: message,
      });

      // Agregar el mensaje del usuario y las respuestas del bot al estado
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'user', text: message },
        ...response.data.map((msg) => ({
          type: 'bot',
          text: msg.text,
        })),
      ]);
    } catch (error) {
      console.error('Error al comunicarse con Rasa:', error);
    }
  };

  // Manejar el envío del formulario (cuando el usuario presiona Enter o hace clic en "Enviar")
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (userInput.trim() !== '') {
      sendMessageToBot(userInput);
      setUserInput('');  // Limpiar el campo de entrada
    }
  };

  return (
    <div className="chatbot-container">
      <h2>Bot Médico</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.type === 'bot' ? 'bot-message' : 'user-message'}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Chatbot;
