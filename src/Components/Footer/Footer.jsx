import React from 'react';
import './Footer.css';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-section quick-links">
        <h4>Linkuri rapide</h4>
        <ul>
          <li><a href="/">Acasă</a></li>
          <li><a href="/about">Despre noi</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
      <div className="footer-section contact">
        <h4>Contact</h4>
        <p>Adresa: Strada Exemplu, Nr. 1, București, România</p>
        <p>Telefon: +40 123 456 789</p>
        <p>Email: contact@healthwise.com</p>
      </div>
      <div className="footer-section social">
        <h4>Urmărește-ne</h4>
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FacebookIcon style={{ fontSize: 32, color: '#fff' }} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <InstagramIcon style={{ fontSize: 32, color: '#fff' }} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
