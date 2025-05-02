import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Data/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import './LoginMedicoForm.css'

export const LoginMedicoForm = () => {
    const navigate = useNavigate();
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
    };

    return (
        <div className="login-container">
            <div className="login-card">
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
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginMedicoForm;