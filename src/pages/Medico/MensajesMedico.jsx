import React, { useEffect, useState } from 'react';
import { db, auth } from '../../Data/firebase';
import { collection, query, where, getDocs, onSnapshot, addDoc, orderBy } from 'firebase/firestore';


const MensajeMedico = () => {
  const [medico, setMedico] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Obtener datos del médico autenticado
        const ref = collection(db, 'registromedico');
        const q = query(ref, where('uid', '==', user.uid));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const medicoData = {
            id: snapshot.docs[0].id,
            uid: user.uid,
            ...snapshot.docs[0].data(),
          };
          setMedico(medicoData);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Cargar pacientes que tienen chats con este médico
  useEffect(() => {
    if (!medico) return;

    const cargarPacientes = async () => {
      const chatsRef = collection(db, 'chats');
      const snapshot = await getDocs(chatsRef);

      const pacientesUnicos = new Set();

      snapshot.forEach(doc => {
        const [uid1, uid2] = doc.id.split('_');
        if (uid1 === medico.uid || uid2 === medico.uid) {
          const pacienteId = uid1 === medico.uid ? uid2 : uid1;
          pacientesUnicos.add(pacienteId);
        }
      });

      const pacientesData = [];
      for (const pid of pacientesUnicos) {
        const ref = collection(db, 'registropaciente');
        const q = query(ref, where('uid', '==', pid));
        const psnap = await getDocs(q);
        if (!psnap.empty) {
          pacientesData.push({ id: psnap.docs[0].id, ...psnap.docs[0].data() });
        }
      }

      setPacientes(pacientesData);
    };

    cargarPacientes();
  }, [medico]);

  // Cargar mensajes con el paciente seleccionado
  useEffect(() => {
    if (!pacienteSeleccionado || !medico) return;

    const chatId = [pacienteSeleccionado.uid, medico.uid].sort().join('_');
    const mensajesRef = collection(db, 'chats', chatId, 'mensajes');
    const q = query(mensajesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mensajesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMensajes(mensajesData);
    });

    return () => unsubscribe();
  }, [pacienteSeleccionado, medico]);

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || !pacienteSeleccionado || !medico) return;

    try {
      const chatId = [pacienteSeleccionado.uid, medico.uid].sort().join('_');
      const mensajesRef = collection(db, 'chats', chatId, 'mensajes');

      await addDoc(mensajesRef, {
        texto: nuevoMensaje,
        sender: medico.uid,
        senderName: medico.nombre || 'Médico',
        timestamp: new Date(),
      });

      setNuevoMensaje('');
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
    }
  };

  return (
    <div className="mensaje-medico-container">
      <aside className="pacientes-sidebar">
        <h2>Pacientes</h2>
        <ul>
          {pacientes.map(p => (
            <li
              key={p.id}
              onClick={() => setPacienteSeleccionado(p)}
              className={pacienteSeleccionado?.uid === p.uid ? 'selected' : ''}
            >
              {p.nombre}
            </li>
          ))}
        </ul>
      </aside>

      <main className="chat-area">
        {pacienteSeleccionado ? (
          <>
            <h3>Conversación con {pacienteSeleccionado.nombre}</h3>
            <div className="mensajes">
              {mensajes.map(m => (
                <div
                  key={m.id}
                  className={`mensaje ${m.sender === medico.uid ? 'propio' : 'ajeno'}`}
                >
                  <strong>{m.senderName}:</strong> {m.texto}
                </div>
              ))}
            </div>
            <form onSubmit={enviarMensaje} className="formulario-mensaje">
              <input
                type="text"
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                placeholder="Escribe un mensaje..."
              />
              <button type="submit">Enviar</button>
            </form>
          </>
        ) : (
          <p>Selecciona un paciente para ver los mensajes</p>
        )}
      </main>
    </div>
  );
};

export default MensajeMedico;
