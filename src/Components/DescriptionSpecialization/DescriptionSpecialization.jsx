import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import person_icon from '../Assets/person.png';
import './DescriptionSpecialization.css'

import specialization_icon from '../Assets/DescriptionSpecialization.png';
import medical_condition_icon from '../Assets/medicalCondition.png';

function DescriptionSpecialization () {
  const { id } = useParams();
  const [specialization, setSpecialization] = useState(null);
  const [expandedFirst, setExpandedFirst] = useState(false);
  const [expandedSecond, setExpandedSecond] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8081/specialization/${id}`)
      .then(response => {
        console.log(response.data); // Verificare răspuns API
        setSpecialization(response.data);
      })
      .catch(error => {
        console.error('Error fetching specialization details:', error);
      });
  }, [id]);

  const handleExpandFirstClick = () => {
    setExpandedFirst(!expandedFirst);
  };

  const handleExpandSecondClick = () => {
    setExpandedSecond(!expandedSecond);
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

      {specialization && (
       <div className='mainTitle'>Despre {specialization.name}</div>
      )}      
      {specialization ? (
        <div className='cardContainer'>
          <div className='firstCard'>
          <Card sx={{ maxWidth: 345 }}>
            <CardHeader
             title={
              <span className="boldTitle">
                {specialization.name}
              </span>
            }
            subheader={
              <span className="boldSubheader">
                Afla mai multe despre aceasta<span> specializare</span>
              </span>
            }            />
            <CardMedia
              component="img"
              height="255"
              image={specialization_icon}
              alt={specialization.name}
            />
            <CardContent>
              <Typography className='textDescription'>
              {expandedFirst ? specialization.description : `${specialization.description.slice(0, 100)}...`}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton
                aria-expanded={expandedFirst}
                aria-label={expandedFirst ? "show less" : "show more"}
                onClick={handleExpandFirstClick}
              >
                  {expandedFirst ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </CardActions>
          </Card>
          </div>
          <div className='secoundCard'>
          <Card sx={{ maxWidth: 345 }}>
          <CardHeader
            title={
              <span className="boldTitle">
                {specialization.name}
              </span>
            }
            subheader={
              <span className="boldSubheader">
                Afla mai multe despre <span>afectiunile tratate</span>
              </span>
            }
          />

            <CardMedia
              component="img"
              height="255"
              image={medical_condition_icon}
              alt={specialization.name}
            />
            {specialization && (
              <CardContent>
                <Typography className='textDescription'>
                {expandedSecond ? specialization.descriptionDisease : `${specialization.descriptionDisease.slice(0, 100)}...`}
                </Typography>
              </CardContent>
            )}

            <CardActions disableSpacing>
              <IconButton
                  aria-expanded={expandedSecond}
                  aria-label={expandedSecond ? "show less" : "show more"}
                  onClick={handleExpandSecondClick}
              >
                  {expandedSecond ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </CardActions>
          </Card>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DescriptionSpecialization;
