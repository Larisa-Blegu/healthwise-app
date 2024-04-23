import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import person_icon from '../Assets/person.png';
import './DoctorsHospital.css';

function DoctorsHospital() {
  const { id } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [hospitalName, setHospitalName] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:8081/location/${id}`)
      .then(response => {
        const location = response.data; // Extrage obiectul de locație din răspunsul API
        const doctors2 = response.data.doctors;

        doctors2.forEach(doctor => {
            doctor.image = "data:image/png;base64,"+doctor.image;
        });
        setDoctors(doctors2);
        setHospitalName(location.hospital); // Setează numele spitalului
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
      });
  }, [id]);

  return (
    <div>

      <div className="title">Medicii din {hospitalName}</div>
      <div className="doctor-cards2">
  {doctors.map((doctor, index) => (
    <div key={index} className="doctor-card2">
      <div className="doctor-info2">
        <h3>{doctor.fullName}</h3>
        <p>{doctor.specializations[0].name}</p>
      </div>
      <img src={doctor.image} alt={doctor.fullName} />
    </div>
  ))}
</div>

    </div>
  );
}

export default DoctorsHospital;
