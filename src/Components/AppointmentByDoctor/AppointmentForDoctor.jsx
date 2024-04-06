import * as React from 'react';
import { useState, useEffect } from 'react';
import { Stepper, Step, StepLabel, Button, TextField, MenuItem } from '@mui/material';
import person_icon from '../Assets/person.png';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EventIcon from '@mui/icons-material/Event';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AppointmentForDoctor.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock'; // Importați DigitalClock aici
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; // Importați LocalizationProvider aici

function AppointmentForDoctor() {
  const [activeStep, setActiveStep] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [location, setLocation] = useState();
  const [user, setUser] = useState();
  
  const [formData, setFormData] = useState({
    firstName: localStorage.firstName,
    lastName: localStorage.lastName,
    email: localStorage.email,
    phoneNumber: localStorage.phoneNumber,
    city: '',
    hospital: '', 
    medicalProcedure: '',
    doctor: '',
    selectedDate: null, // New state for selected date
    selectedTime: null, // Adaugă o stare pentru ora selectată
  });
  const [cities, setCities] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [procedure, setProcedure] = useState();
  const [doctor, setDoctor] = useState();
  const [showClock, setShowClock] = useState(false); // State pentru afișarea ceasului digital
  const selectedDoctor = JSON.parse(localStorage.getItem('selectedDoctor'));
  const selectedProcedure = JSON.parse(localStorage.getItem('selectedProcedure'));

    useEffect(() => {

      fetchUser(localStorage.userId);

          if (selectedDoctor && selectedProcedure) {

            setFormData(prevData => ({
              ...prevData,
              doctor: selectedDoctor,
              medicalProcedure: selectedProcedure,

            }));
            setProcedure(selectedProcedure);
            setDoctor(selectedDoctor);
          }

          const locations = selectedDoctor.locations;
          const hospitals = locations.map(location => location.hospital);
          const cities = locations.map(location => location.city);
          setHospitals(hospitals);
          setCities(cities);
          

      }, []);
  
  const handleNext = () => {
    const { firstName, lastName, email, phoneNumber, city, hospital, medicalProcedure, doctor } = formData;
    console.log(formData);
   

  
    // Verificăm dacă toate câmpurile sunt completate/selectate
    if (firstName && lastName && email && phoneNumber && city && hospital && medicalProcedure && doctor) {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    } else {
      alert('Te rog completează toate câmpurile înainte de a continua.');
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const toggleDrawer = open => () => {
    setOpenDrawer(open);
  };
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
}

  const handleChangeCity = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  
    
    // Fetch hospitals based on selected city or show all hospitals if no city selected
    fetch('http://localhost:8081/location/allLocations')
      .then(response => response.json())
      .then(data => {
        let filteredHospitals = data.filter(location => location.hospital);
        if (value) {
          filteredHospitals = filteredHospitals.filter(location => location.city === value);
        }
        const hospitals = filteredHospitals.map(location => location.hospital);
        setHospitals(hospitals);
      })
      .catch(error => console.error('Error fetching hospitals:', error));
  };

  const handleChangeHospital = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    fetchLocation(value);
    // Fetch hospitals based on selected city or show all hospitals if no city selected
    fetch('http://localhost:8081/location/allLocations')
      .then(response => response.json())
      .then(data => {
        let filteredCity = data.filter(location => location.city);
        if (value) {
          filteredCity = filteredCity.filter(location => location.hospital === value);
        }
        const cities = filteredCity.map(location => location.city);
        setCities(cities);
    })
      .catch(error => console.error('Error fetching cities:', error));
  };


  const handleDateChange = date => {
    setFormData(prevData => ({
      ...prevData,
      selectedDate: date,
      selectedTime: null, // Resetează selectedTime la null la selectarea unei date noi
    }));
    // Show clock only if a date is selected
    setShowClock(!!date);
  };

  const handleTimeChange = time => {
    setFormData(prevData => ({
      ...prevData,
      selectedTime: time,
    }));
  };

  const fetchLocation = async (hospital) => {
    var location;
      try {
        const response = await axios.get(`http://localhost:8081/location/hospital/${hospital}`);
        location=response.data;
      } catch (error) {
        console.error('Eroare la aducerea locatiei', error);
      }
      const flatLocation=location.flat();
    setLocation(flatLocation);
  };

  const fetchUser = async (userID) => {
    var user;
      try {
        const response = await axios.get(`http://localhost:8081/user/${userID}`);
        user=response.data;
      } catch (error) {
        console.error('Eroare la aducerea locatiei', error);
      }
    setUser(user);
  };

  async function save(doctor,location,medicalProcedure,tipProgramare,finalDate) {

    try {
        const response = await axios.post("http://localhost:8081/appointment", {
            date: finalDate,
            type: tipProgramare,
            doctor: doctor, // Presupunând că doctor este un obiect cu un câmp id
            location: location, // Presupunând că hospital este un obiect cu un câmp id
            medicalProcedure: medicalProcedure, // Presupunând că medicalProcedure este un obiect cu un câmp id
            user: user, // Presupunând că avem id-ul utilizatorului salvat în localStorage
            reviewStatus:"FALSE",
            status:"PENDING"
        });
        if (response.status === 200) {
            console.log('Cererea de programare a fost trimisă cu succes!');
            // Aici puteți adăuga orice alte acțiuni necesare după ce cererea a fost trimisă cu succes
        } else {
            console.error('Eroare la trimiterea cererii de programare:', response.statusText);
        }
    } catch (error) {
        console.error('Eroare la trimiterea cererii de programare:', error);
    }
}
  
  const handleAppointmentSubmit = () => {
    const { doctor, hospital, medicalProcedure, selectedDate, selectedTime, tipProgramare } = formData;
    const data= new Date(selectedDate.$d);
    const year = data.getFullYear();
    var month = data.getMonth() + 1; // Adăugăm 1 pentru că luna începe de la 0 
    var day = data.getDate();
    const time=new Date(selectedTime);
    var hours = time.getHours();
    var minutes = time.getMinutes();
    if(day<10){
        day="0"+day;
    }  
    if(month<10){
        month="0"+month;
    }
    if(hours<10){
        hours="0"+hours;
    } 
    if(minutes<10){
        minutes="0"+minutes;
    } 
    const finalDate = year+"-"+month+"-"+day+"T"+hours+":"+minutes+":00";

    console.log(doctor);
    console.log(hospital);
    console.log(medicalProcedure);
    console.log(selectedDate);
    console.log(selectedTime);
    console.log(tipProgramare);


    if (doctor && hospital && medicalProcedure && selectedDate && selectedTime && tipProgramare) {
console.log(formData);
        save(doctor,location[0],medicalProcedure,tipProgramare,finalDate);
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
};


  return (
    <div>
      {/* Navigation */}
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

      {/* Title */}
      <div className="title_specialization">Cerere programare la {selectedDoctor.fullName}, pentru procedura {selectedProcedure.name}</div>

      {/* Drawer */}
      <div className='drawer'>
  <Button onClick={toggleDrawer(true)}>Deschide meniu</Button>
  <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer(false)}>
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {[
          { text: 'Realizează programare', icon: <EventIcon />, link: '/appointment' },
          { text: 'Programarile tale', icon: <ListAltIcon />, link: '/yourAppointments' },
          { text: 'Facturi', icon: <ReceiptIcon />, link: '/bills' },
          { text: 'Informatii Utile', icon: <InfoIcon />, link: '/usefulInfo' }
        ].map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.link}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  </Drawer>
</div>

    {/* Content */}
    <div className='content'>
        <div className='stepper'>
        <Stepper activeStep={activeStep} alternativeLabel>
            <Step>
            <StepLabel>Completează datele</StepLabel>
            </Step>
            <Step>
            <StepLabel>Alege data</StepLabel>
            </Step>
            <Step>
            <StepLabel>Așteaptă răspuns</StepLabel>
            </Step>
        </Stepper>

        {activeStep === 0 && (
            <div>
            <h2>Completează datele</h2>
            <TextField
                name="firstName"
                label="Nume"
                value={formData.firstName}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
            />
            <TextField
                name="lastName"
                label="Prenume"
                value={formData.lastName}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
            />
            <TextField
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
            />
            <TextField
                name="phoneNumber"
                label="Număr de telefon"
                value={formData.phoneNumber}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
            />
            {/* City Select */}
            <TextField
                name="city"
                select
                label="Oraș"
                value={formData.city}
                onChange={handleChangeCity}
                variant="outlined"
                fullWidth
                margin="normal"
            >
                {cities.map(city => (
                <MenuItem key={city} value={city}>
                    {city}
                </MenuItem>
                ))}
            </TextField>
            {/* Hospital Select */}
            <TextField
                name="hospital"
                select
                label="Spital"
                value={formData.hospital}
                onChange={handleChangeHospital}
                variant="outlined"
                fullWidth
                margin="normal"
            >
                {hospitals.map(hospital => (
                <MenuItem key={hospital} value={hospital}>
                    {hospital}
                </MenuItem>
                ))}
            </TextField>
           
            <div>
            <h3>Alege tipul de programare:</h3>
            <div>
                <input
                    type="radio"
                    id="programareFizica"
                    name="tipProgramare"
                    value="PHYSICAL"
                    checked={formData.tipProgramare === "PHYSICAL"}
                    onChange={(e) => handleChange({ target: { name: "tipProgramare", value: e.target.value } })}
                />
                <label htmlFor="programareFizica">Programare fizică</label>
            </div>
            <div>
                <input
                    type="radio"
                    id="programareOnline"
                    name="tipProgramare"
                    value="ONLINE"
                    checked={formData.tipProgramare === "ONLINE"}
                    onChange={(e) => handleChange({ target: { name: "tipProgramare", value: e.target.value } })}
                />
                <label htmlFor="programareOnline">Programare online</label>
            </div>
        </div>


            {/* Restul câmpurilor de completat */}
            <Button variant="contained" color="primary" onClick={handleNext}>
                Continuă
            </Button>
            </div>
        )}

        {activeStep === 1 && (
        <div>
            <h2>Alege data</h2>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
                orientation="landscape"
                value={formData.selectedDate}
                onChange={handleDateChange}
            />
            </LocalizationProvider>
            
            {showClock && (
                 <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div>
                    <DigitalClock key={`${formData.selectedDate}-${formData.selectedTime}-${Math.random()}`} hourformat12 = "true" onChange={handleTimeChange}/>
                    </div>
                </LocalizationProvider>
            )}


            <Button variant="contained" onClick={handleBack}>
                     Înapoi
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleAppointmentSubmit}>
                Trimite cerere de programare
            </Button>
        </div>
        )}

        {activeStep === 2 && (
            <div>
                <h2>Așteaptă răspuns</h2>
                <div className="response-message">
                    <p>Cererea dumneavoastră s-a trimis către medicul {formData.doctor.fullName}. Veți fi notificat cu privire la răspunsul său pe adresa de email: {formData.email} sau pe pagina "Programarile tale"</p>
                </div>
            </div>
        )}

            </div>
        </div>
        </div>
        );
  }

        export default AppointmentForDoctor;