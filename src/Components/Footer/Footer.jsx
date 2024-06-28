import React from "react";
import "./Footer.css";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-section quick-links">
        <h4>Linkuri rapide</h4>
        <ul>
          <li>
            <a href="/">Acasă</a>
          </li>
          <li>
            <a href="/aboutUs">Despre noi</a>
          </li>
        </ul>
      </div>
      <div className="footer-section contact">
        <h4>Contact</h4>
        <p>Adresa: Strada Eroilor, Nr. 121, Cluj, România</p>
        <p>Telefon: +40 744 455 5666</p>
        <p>Email: healthwisecluj@gmail.com</p>
      </div>
      <div className="footer-section social">
        <h4>Urmărește-ne</h4>
        <div className="social-icons">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookIcon style={{ fontSize: 32, color: "#fff" }} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon style={{ fontSize: 32, color: "#fff" }} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
