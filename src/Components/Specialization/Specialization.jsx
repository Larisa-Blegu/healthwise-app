import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/system';
import axios from 'axios';
import person_icon from '../Assets/person.png';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import specialization_icon from '../Assets/DespreSpecialization.png';
import investigatii_icon from '../Assets/InvestigatiiSiProceduri.png';
import './Specialization.css'; // Importați fișierul CSS

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary ? theme.palette.primary.main : 'black',
}));

const GroupItems = styled('ul')({
  padding: 0,
});

function Specialization() {
  const [specializations, setSpecializations] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8081/specialization/allSpecializations')
      .then(response => {
        setSpecializations(response.data);
      })
      .catch(error => {
        console.error('Error fetching specializations:', error);
      });
  }, []);



  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  
  const SpecializationSearch = (event, value) => {
    const specializationName = value;

    if(specializationName !== null){
      console.log(specializations);
    const filteredSpecializations = specializations.filter(specialization => {
      // Verificăm dacă numele specializării conține numele introdus de utilizator
      return specialization.name === specializationName.name;
    });
    setSpecializations(filteredSpecializations);
    console.log(filteredSpecializations);
   }
    else{
      axios.get('http://localhost:8081/specialization/allSpecializations')
        .then(response => {
          setSpecializations(response.data);
        })
        .catch(error => {
          console.error('Error fetching specializations:', error);
        });
      }
    }

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
      <div className="title_specialization">Specializari</div>
      <p className='SpecializationDescription'>Fie că sunteți în căutarea unui specialist pentru o afecțiune specifică sau doriți să înțelegeți mai bine opțiunile disponibile, pagina noastră despre specializări medicale vă ajută să faceți alegeri informate în ceea ce privește îngrijirea sănătății dumneavoastră.</p>
     
      <div className='AccordeonAutocomplete'>
      <div className="autocomplete-wrapper">
      <Autocomplete
        id="grouped-demo"
        options={specializations.sort((a, b) => a.name.localeCompare(b.name))}
        groupBy={(option) => option.name[0].toUpperCase()}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label="Specializări" />}
        renderGroup={(params) => (
          <li key={params.key}>
            <GroupHeader>{params.group}</GroupHeader>
            <GroupItems>{params.children}</GroupItems>
          </li>
        )}
        onChange={(event, value) => SpecializationSearch(event, value)}
      />

      </div>

      <div className="accordeonSpecialization">
        {specializations.map((specialization, index) => (
          <div className="specializationDetails" key={index}>
            <Accordion
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}bh-content`}
                id={`panel${index}bh-header`}
              >
                <Typography variant="span" className="AccordionNumber">{index + 1}</Typography>
                <Typography variant="span" className="AccordionName">{specialization.name}</Typography>
              </AccordionSummary>
              <AccordionDetails className="AccordionDetails">
              <div className='AboutButton'>
                 <Link to={`/DescriptionSpecialization/${specialization.id}`} className='AboutLink'>Despre {specialization.name}</Link>              
                  <img className='AboutPhoto' src={specialization_icon} alt={`Despre ${specialization.name}`}/>
                </div>

                <div className='AboutButton'>
                <Link to={`/medicalProcedure/${specialization.id}`} className='AboutLink'>Investigatii si proceduri medicale</Link>
                <img className='AboutPhoto' src={investigatii_icon} alt={`Despre ${specialization.name}`}/>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

export default Specialization;
