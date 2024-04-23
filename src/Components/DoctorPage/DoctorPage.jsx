import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import person_icon from '../Assets/person.png';
import { Menu, MenuItem, GridColumn, Grid, Segment } from 'semantic-ui-react';
import './DoctorPage.css';
import { Component } from 'react';
import Specialization from '../Specialization/Specialization';



function DoctorPage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [activeItem, setActiveItem] = useState('profil'); // Mențiunea activă inițială
  const [medicalProcedures, setMedicalProcedures] = useState([]);
  const [prices, setPrice] = useState([]);
  const [locations, setLocation] = useState([]);


  useEffect(() => {
    // Cerere pentru detalii despre medic folosind ID-ul
    axios.get(`http://localhost:8081/doctor/${id}`)
      .then(response => {
        const provDoctor = response.data;
        provDoctor.image = "data:image/png;base64," + provDoctor.image;
        setDoctor(provDoctor);
      })
      .catch(error => {
        console.error('Eroare la încărcarea datelor medicului:', error);
      });

      axios.get(`http://localhost:8081/price/doctor/${id}`)
      .then(response => {
        setPrice(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Eroare la încărcarea datelor medicului:', error);
      });

      
  }, [id]);

  useEffect(() => {
    if (doctor && doctor.specializations) {
      setMedicalProcedures([]);
      fetchMedicalProcedures(doctor);
    }
  }, [doctor]);

  const fetchMedicalProcedures = async (doctor) => {
        const procedures = [];
        for (const spec of doctor.specializations) {
          try {
            const response = await axios.get(`http://localhost:8081/medicalProcedure/specialization/${spec.id}`);
            procedures.push(...response.data);
          } catch (error) {
            console.error('Eroare la încărcarea procedurilor medicale:', error);
          }
        }
        setMedicalProcedures(procedures);
      };

  const handleItemClick = (name) => {
    setActiveItem(name); // Actualizarea mențiunii active la făcut clic
  };

  // Funcție pentru a formata lista de specializări sub forma unui șir de caractere separate prin virgulă
  const formatSpecializations = (specializations) => {
    return specializations.map(spec => spec.name).join(', ');
  };

 

  if (!doctor) {
    return <div>Loading...</div>; // Afiseaza un mesaj de incarcare pana cand datele medicului sunt disponibile
  }

  return (
    <div className="doctor-page-container">

      <div className="title_specialization">
      {doctor.medicineDegree} {doctor.fullName}
      </div>

      <Grid>
        <GridColumn width={4}>
          <Menu fluid vertical tabular>
            <MenuItem
              name='profil'
              active={activeItem === 'profil'}
              onClick={() => handleItemClick('profil')}
            />
            <MenuItem
              name='pregatire profesionala'
              active={activeItem === 'pregatire profesionala'}
              onClick={() => handleItemClick('pregatire profesionala')}
            />
            <MenuItem
              name='investigatii'
              active={activeItem === 'investigatii'}
              onClick={() => handleItemClick('investigatii')}
            />
            <MenuItem
              name='locatii'
              active={activeItem === 'locatii'}
              onClick={() => handleItemClick('locatii')}
            />
          </Menu>
        </GridColumn>

        <div className="seg">

        <GridColumn stretched width={12}>
          <Segment>
            {activeItem === 'profil' && (
              <div className='SpecializationImage'>
                <h2 className='List'>Specializări:
                <ul>
                  {doctor.specializations.map(specialization => (
                    <li key={specialization.id}>
                      <h3>{specialization.name}</h3>
                    </li>
                  ))}
                </ul>
                </h2>
                <div className='DoctorImage'><img  src = {doctor.image}/></div>
              </div>
            )}
            {activeItem === 'pregatire profesionala' && (
              <div>
                <p>{doctor.description}</p>
              </div>
            )}
            {activeItem === 'investigatii' && (
              <div>
                <h2>Proceduri Medicale și Prețuri:</h2>
                <ul>
                  {medicalProcedures.map(procedure => (
                    <li key={procedure.id}>
                      <h3>{procedure.name}</h3>
                      <p>Categorie: {procedure.category}</p>
                      <ul>
                        {prices.filter(price => price.medicalProcedure.id === procedure.id).map(filteredPrice => (
                          <li key={filteredPrice.id}>
                            <p>Price: {filteredPrice.price}</p>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeItem === 'locatii' && (
              <div>
                <ul>
                  {doctor.locations.map(location => (
                    <li key={location.id}>
                      <p>Spital {location.hospital}</p>
                      <ul>
                        <p>Adresa {location.adress}, {location.city}</p>
                      </ul>
                    </li>
                  ))}

                </ul>
              </div>
            )}
          </Segment>
        </GridColumn>
        </div>

      </Grid>
    </div>

  );
}

export default DoctorPage;
