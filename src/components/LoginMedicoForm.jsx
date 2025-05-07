import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Data/firebase';
<<<<<<< HEAD
=======
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
>>>>>>> 1825dd297ef88995f34677eb10c5e8fd5050f879
import './LoginMedicoForm.css'

export const LoginMedicoForm = () => {
    const navigate = useNavigate();
<<<<<<< HEAD
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
=======
    const [values, setValues] = useState({ email: "", pass: "" });
    const [errorMsg, setErrorMsg] = useState("");
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const Iniciar = () => {
        if (!values.email || !values.pass) {
            setErrorMsg("Debe ingresar correo y contraseña");
            return;
        }

        setErrorMsg("");
        setSubmitButtonDisabled(true);

        signInWithEmailAndPassword(auth, values.email, values.pass)
            .then(() => {
                setSubmitButtonDisabled(false);
                navigate("/inicio-medico");
            })
            .catch(() => {
                setSubmitButtonDisabled(false);
                setErrorMsg("Credenciales incorrectas o usuario no registrado.");
            });
>>>>>>> 1825dd297ef88995f34677eb10c5e8fd5050f879
    };

    return (
        <div className="login-container">
            <div className="login-card">
<<<<<<< HEAD
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
=======
                <h1 className="login-title">Iniciar Sesión</h1>
                <div className="login-form">
                    <div className="input-with-icon">
                        <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={values.email}
                            onChange={(e) => setValues((prev) => ({ ...prev, email: e.target.value }))}
                            className="login-input"
                        />
                    </div>
                    <div className="input-with-icon">
                        <FontAwesomeIcon icon={faLock} className="input-icon" />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={values.pass}
                            onChange={(e) => setValues((prev) => ({ ...prev, pass: e.target.value }))}
                            className="login-input"
                        />
                    </div>
                    {errorMsg && <span className="login-error">{errorMsg}</span>}
                    <button
                        onClick={Iniciar}
                        disabled={submitButtonDisabled}
                        className={`login-button ${submitButtonDisabled ? 'disabled' : ''}`}
                    >
                        {submitButtonDisabled ? 'Cargando...' : 'Iniciar Sesión'}
>>>>>>> 1825dd297ef88995f34677eb10c5e8fd5050f879
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginMedicoForm;