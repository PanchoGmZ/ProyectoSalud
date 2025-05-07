import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Data/firebase';
import './LoginMedicoForm.css'

export const LoginMedicoForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ correo: "", contrasena: "" });
    const [errorMsg, setErrorMsg] = useState("");
    const [cargando, setCargando] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async () => {
        if (!formData.correo || !formData.contrasena) {
            setErrorMsg('Debe ingresar correo y contraseña');
            return;
        }

        setCargando(true);
        setErrorMsg('');

        try {
            await signInWithEmailAndPassword(auth, formData.correo, formData.contrasena);
            localStorage.setItem('correoMedico', formData.correo);
            navigate('/inicio-medico');
        } catch (error) {
            setErrorMsg('Credenciales incorrectas o usuario no registrado.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Iniciar Sesión Médico</h1>
                <div className="login-form">
                    <input
                        type="email"
                        name="correo"
                        placeholder="Correo electrónico"
                        value={formData.correo}
                        onChange={handleChange}
                        className="login-input"
                    />
                    <input
                        type="password"
                        name="contrasena"
                        placeholder="Contraseña"
                        value={formData.contrasena}
                        onChange={handleChange}
                        className="login-input"
                    />
                    {errorMsg && <span className="login-error">{errorMsg}</span>}
                    <button
                        onClick={handleLogin}
                        disabled={cargando}
                        className={`login-button ${cargando ? 'disabled' : ''}`}
                    >
                        {cargando ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginMedicoForm;