import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom'; // importă useNavigate

import email_icon from '../Assets/mail.png';
import password_icon from '../Assets/password.png';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // obține funcția de navigare

    async function handleLogin(event) {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8081/user/login', {
                email: email,
                password: password,
            });
            console.log(response);
            localStorage.setItem("userId", response.data.id);
            localStorage.setItem("firstName", response.data.firstName);
            localStorage.setItem("lastName", response.data.lastName);
            localStorage.setItem("email", response.data.email);
            localStorage.setItem("phoneNumber", response.data.phoneNumber);

            alert('Login successful');

            // Dacă autentificarea este reușită, poți implementa următorii pași aici, cum ar fi navigarea către pagina principală sau gestionarea token-ului JWT primit.
        } catch (err) {
            alert('Login failed. Please check your credentials and try again.');
            console.error(err);
        }
    }

    // Definirea funcției pentru navigarea către pagina de înregistrare
    function navigateToRegister() {
        navigate('/register'); // navighează către ruta '/register'
    }

    return (
        <div className="containerlogin">
            <div className="header">
                <div className="text">Login</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
            </div>
            <div className="submit-container">
                <button className="submit" onClick={handleLogin}>
                    Login
                </button>
                {/* Adaugă un link către pagina de înregistrare */}
                <button className="submit" onClick={navigateToRegister}>
                    Crează cont nou
                </button>
            </div>
        </div>
    );
}

export default Login;
