import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Data/firebase';
import './LoginAdmin.css';

const LoginAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/inicio-administrador');
    } catch (err) {
      setError('Credenciales incorrectas o no tiene permisos de administrador');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-admin-container">
      <div className="login-admin-box">
        <div className="login-admin-header">
          <h2>Acceso Administrativo</h2>
          
        </div>
        
        {error && <div className="login-admin-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-admin-form">
          <div className="login-admin-input-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@centrosalud.com"
            />
          </div>
          
          <div className="login-admin-input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="login-admin-button"
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Verificando...
              </>
            ) : 'Ingresar'}
          </button>
        </form>

        <div className="login-admin-footer">
          <p>Área restringida al personal autorizado</p>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;