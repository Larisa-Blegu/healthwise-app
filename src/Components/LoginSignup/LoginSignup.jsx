import React, { useState } from "react";
import "./LoginSignup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MailIcon from "@mui/icons-material/Mail";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";

function LoginSignup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CLIENT");
  const navigate = useNavigate();

  async function save(event) {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8081/user/register", {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        password: password,
        role: role,
      });

      const data = response.data;

      localStorage.setItem("userId", data.id);
      localStorage.setItem("firstName", data.firstName);
      localStorage.setItem("lastName", data.lastName);
      localStorage.setItem("email", data.email);
      localStorage.setItem("phoneNumber", data.phoneNumber);
      localStorage.setItem("token", data.token);

      navigate("/");
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div className="containerSignup">
      <div className="header">
        <div className="titleRegister">Sign Up</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <PersonIcon className="icon" />
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </div>
        <div className="input">
          <PersonIcon className="icon" />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </div>
        <div className="input">
          <MailIcon className="icon" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="input">
          <PhoneIcon className="icon" />
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
          />
        </div>
        <div className="input">
          <LockIcon className="icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
      </div>

      <div className="submit-container">
        <button variant="contained" className="submit" onClick={save}>
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default LoginSignup;
