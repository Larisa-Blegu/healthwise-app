import React from 'react'
import './LoginSignup.css'
import user_icon from '../Assets/user.png'
import email_icon from '../Assets/mail.png'
import password_icon from '../Assets/password.png'
import phone_icon from '../Assets/phone.png'
import {  useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function LoginSignup() {
    //const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("CLIENT");

    async function save(event) {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:8081/user/register", {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber,
                password: password,
                role:role,
            });
            console.log(response);
            alert("User registration successful");

            const data = response.data; // Not await here, as response.data is already the JSON response
            console.log(data);
            localStorage.setItem("id", data.id);
            localStorage.setItem("email", data.email);
            // navigate("/main");
        } catch (err) {
            alert(err);
        }
    }

    return (
        <div className='containerSignup'>
            <div className="header">
                <div className="text">Sign Up</div>
                <div className="undeline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder='First Name'
                     value={firstName} 
                     onChange={(event) => {
                        setFirstName(event.target.value)}}
                     />
                </div>
                <div className="input">
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder='Last Name' 
                    value={lastName} 
                    onChange={(event) =>{
                         setLastName(event.target.value)}}
                     />
                </div>
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="4e" placeholder='Email' 
                    value={email} onChange={(event) =>{
                         setEmail(event.target.value)}}
                    />
                </div>
                <div className="input">
                    <img src={phone_icon} alt="" />
                    <input type="text" placeholder='Phone Number'
                     value={phoneNumber} onChange={(event) =>{
                         setPhoneNumber(event.target.value)}}
                     />
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder='Password' 
                    value={password} onChange={(event) =>{
                         setPassword(event.target.value)}}
                     />
                </div>
            </div>

            <div className="submit-container">
                <button variant="contained" className="submit" onClick={save}>Sign Up</button>
              {/*}  <div className="submit">Login</div> */}
            </div>
        </div>
    )
}
export default LoginSignup;
