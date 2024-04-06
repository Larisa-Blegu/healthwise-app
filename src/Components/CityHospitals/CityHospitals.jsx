import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useHistory
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button } from '@mui/material';
import './CityHospitals.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer ,Marker, Popup} from 'react-leaflet';
import {Icon} from 'leaflet';
import person_icon from '../Assets/person.png';


function CityHospitals() {
  const { city } = useParams();
  const navigate = useNavigate(); // obține funcția de navigare

  const [locations, setLocations] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
    iconSize: [38, 38] // size of the icon
  });

  useEffect(() => {
    axios.get(`http://localhost:8081/location/city/${city}`)
      .then(response => {
        setLocations(response.data);
      })
      .catch(error => {
        console.error('Error fetching hospitals:', error);
      });
  }, [city]);

  const handleShowMap = (location) => {
    setSelectedLocation(location);
    setShowMap(!showMap); // Inversăm valoarea lui showMap
  };

  const handleViewDoctors = (locationId) => {
    navigate(`/doctors/${locationId}`); // Navigăm către ruta specificată
  };

  return (
    <div>
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

      <div className="mainTitle">Spitale {city}</div>
      <div className="accordeonSpecialization">
        {locations.map((location, index) => (
          <div className="specializationDetails" key={index}>
          <Accordion >       
            <AccordionSummary>
              <Typography  variant="span" className="AccordionName">{location.hospital}</Typography>
              <Typography  variant="span" className="AccordionAddress">Adresa: {location.address}</Typography>

            </AccordionSummary>
            <div className='buttons'>
            <Button onClick={() => handleShowMap(location)}>Vezi hartă</Button>
            <Button onClick={() => handleViewDoctors(location.id)}>Vezi medici</Button>
            </div>

            <AccordionDetails className="AccordionDetails">
  {showMap && selectedLocation === location && (
    <div className="map-container" style={{ backgroundColor: '#4c657f' }}>
    <MapContainer center={[location.latitude, location.longitude]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.latitude, location.longitude]} icon={customIcon}>
          <Popup>{location.hospital}</Popup>
        </Marker>
      </MapContainer>
    </div>
  )}
          </AccordionDetails>

          </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CityHospitals;
