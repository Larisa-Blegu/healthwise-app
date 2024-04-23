import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom'; // importă useNavigate
import axios from 'axios';
import LockIcon from '@mui/icons-material/Lock';
import MailIcon from '@mui/icons-material/Mail'; // Importă iconițele din Material-UI
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

function Login({onLogin}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // obține funcția de navigare
    const role = localStorage.getItem('role');

    async function handleLogin(event) {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8081/user/login', {
                email: email,
                password: password,
            });
            console.log(response);
            setLocalStorage(response);  
            onLogin(response.data.role);
            if (response.data.role === 'ADMIN') {
                navigate('/dashboard');
              }else if ( response.data.role === 'CLIENT'){
                navigate('/');
              }

            // Dacă autentificarea este reușită, poți implementa următorii pași aici, cum ar fi navigarea către pagina principală sau gestionarea token-ului JWT primit.
        } catch (err) {
            toast.error("Invalid email or password.");
            console.error(err);
        }
    }

    function setLocalStorage(response) {
        localStorage.setItem("userId", response.data.id);
        localStorage.setItem("firstName", response.data.firstName);
        localStorage.setItem("lastName", response.data.lastName);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("phoneNumber", response.data.phoneNumber);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("token", response.data.token);    
    }

    // Definirea funcției pentru navigarea către pagina de înregistrare
    function navigateToRegister() {
        navigate('/register'); // navighează către ruta '/register'
    }

    return (
        <div className="containerlogin">
            <ToastContainer />

            <div className="header">
                <div className="text">Login</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <MailIcon className="icon" /> {/* Utilizează MailIcon în loc de imagine */}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className="input">
                    <LockIcon className="icon" /> {/* Utilizează LockIcon în loc de imagine */}
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
