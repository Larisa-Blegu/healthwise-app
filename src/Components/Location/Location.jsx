import React, { useState, useEffect } from 'react';
import axios from 'axios';
import person_icon from '../Assets/person.png';
import { Link } from 'react-router-dom';

import './Location.css';

function Location() {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/location/allLocations')
      .then(response => {
        const uniqueCities = response.data.reduce((acc, location) => {
          if (!acc.includes(location.city)) {
            acc.push(location.city);
          }
          return acc;
        }, []);
        setCities(uniqueCities);
      })
      .catch(error => {
        console.error('Error fetching locations:', error);
      });
  }, []);

  return (
    <div >
      <nav>
        <ul>
          <li><a href="/">Pagina principală</a></li>
          <li><a href="/doctor">Medici</a></li>
          <li><a href="/specialization">Specializări</a></li>
          <li><a href="/location">Locații</a></li>
          <li><a href="/appointment">Programări</a></li>
          <div className="right-container">
            <li><a href="/login">Login</a></li>
            <li><img src={person_icon} alt="User" className="user-icon" /></li>
          </div>
        </ul>
      </nav>
      <div className="title">Locatii</div>
      <p className='LocationDescription'>Într-o lume plină de opțiuni, vă oferim o rețea vastă de îngrijire medicală la îndemâna dvs. - indiferent de nevoile dvs. de sănătate, găsiți pe pagina noastră spitalele care vă pot ajuta să vă atingeți obiectivele de sănătate și să vă redobândiți vitalitatea.</p>
      
      <div className="LocationContainer">
      <ul>
          {cities.map((city, index) => (
            <Link to={`/location/${city}`} key={index}>
              <div className="CityItem">{city}</div>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Location;
