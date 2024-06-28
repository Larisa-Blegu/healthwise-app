import * as React from 'react';
import { useState, useEffect } from 'react';
import { Stepper, Step, StepLabel, Button, TextField, MenuItem } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ReceiptIcon from '@mui/icons-material/Receipt';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Appointment.css';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; 
import Autocomplete from '@mui/material/Autocomplete';

function Appointment() {

  const [activeStep, setActiveStep] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [location, setLocation] = useState();
  const [user, setUser] = useState();
  const token = localStorage.getItem('token'); 
  const isLoggedIn = localStorage.getItem('email');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: localStorage.firstName,
    lastName: localStorage.lastName,
    email: localStorage.email,
    phoneNumber: localStorage.phoneNumber,
    city: '',
    hospital: '',
    medicalProcedure: '',
    doctor: '',
    selectedDate: null, 
    selectedTime: null, 
  });
  const [cities, setCities] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showClock, setShowClock] = useState(false); 
  const startTime = 8; 
  const endTime = 18; 
  const timeSlots = Array.from(new Array((endTime - startTime) * 2)).map(
    (_, index) => {
      const hour = Math.floor(index / 2) + startTime;
      const minute = index % 2 === 0 ? '00' : '30';
      return `${hour < 10 ? '0' : ''}${hour}:${minute}`;
    }
  );
  const [occupiedTimeSlots, setOccupiedTimeSlots] = useState([]);
  const isTimeSlotOccupied = (timeSlot) => occupiedTimeSlots.includes(timeSlot);

  useEffect(() => {

    if (!isLoggedIn) {
      navigate('/login');
    } else {
      const selectedDoctor = JSON.parse(localStorage.getItem('selectedDoctor'));
      const selectedProcedure = JSON.parse(localStorage.getItem('selectedProcedure'));
      fetchUser(localStorage.userId);

      fetch('http://localhost:8081/location/allLocations', {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      })
        .then(response => response.json())
        .then(data => {
          const uniqueCities = [...new Set(data.map(location => location.city))];
          const uniqueHospitals = [...new Set(data.map(location => location.hospital))];

          setCities(uniqueCities);
          setHospitals(uniqueHospitals);
        })
        .catch(error => console.error('Error fetching cities:', error));

      fetch('http://localhost:8081/doctor/allDoctors', {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      })
        .then(response => response.json())
        .then(data => {
          setDoctors(data);
        })
        .catch(error => console.error('Error fetching doctors:', error));

      fetch('http://localhost:8081/medicalProcedure/allProcedures', {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      })
        .then(response => response.json())
        .then(data => {
          setProcedures(data);
        })
        .catch(error => console.error('Error fetching procedures:', error));

      if (selectedDoctor && selectedProcedure) {
        console.log(formData);
        setFormData(prevData => ({
          ...prevData,
          doctor: selectedDoctor,
        }));
        setProcedures([selectedProcedure]);
        setDoctors([selectedDoctor]);
        console.log(formData);
      }
    }
  }, []);

  const handleNext = () => {
    const { firstName, lastName, email, phoneNumber, city, hospital, medicalProcedure, doctor } = formData;

    if (firstName && lastName && email && phoneNumber && city && hospital && medicalProcedure && doctor) {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    } else {
      alert('Te rog completează toate câmpurile înainte de a continua.');
    }
  };

  const handleNextForPayment = () => {
    if (formData.selectedDate && formData.selectedTime) {
      console.log("Treci la următoarea etapă");
    } else {
      console.log("Te rog selectează o dată și o oră pentru a continua.");
    }
  };
  const incercareNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
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


    fetch('http://localhost:8081/location/allLocations', {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    })
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

    if (!value) {
      fetch('http://localhost:8081/location/allLocations', {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      })
        .then(response => response.json())
        .then(data => {
          const hospitals = data
            .filter(location => location.hospital)
            .map(location => location.hospital);
          setHospitals(hospitals);
        })
        .catch(error => console.error('Error fetching hospitals:', error));

    }
  };

  const handleChangeHospital = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    fetchLocation(value);
    fetch('http://localhost:8081/location/allLocations', {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    })
      .then(response => response.json())
      .then(data => {
        let filteredCity = data.filter(location => location.city);
        if (value) {
          filteredCity = filteredCity.filter(location => location.hospital === value);
        }
        const cities = filteredCity.map(location => location.city);
        const doctors = [];
        filteredCity.forEach(location => {
          location.doctors.forEach(doctor => {
            doctors.push(doctor);
          });
        });
          setCities(cities);
        if (formData.doctor === '') {
          setDoctors(doctors);
        }
      })
      .catch(error => console.error('Error fetching cities:', error));

    if (!value) {
      fetch('http://localhost:8081/location/allLocations', {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      })
        .then(response => response.json())
        .then(data => {
          const cities = data
            .filter(location => location.city)
            .map(location => location.city);
          setCities(cities);
        })
        .catch(error => console.error('Error fetching cities:', error));
    }
  };

  const handleChangeDoctor = e => {
    const { name, value } = e.target;
    console.log([name]);
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    if (value.locations) {
      const locations = value.locations;
      const hospitals = locations.map(location => location.hospital);
      const cities = locations.map(location => location.city);
      if (formData.hospital === '') {
        setHospitals(hospitals);
      }
      if (formData.city === '') {
        setCities(cities);
      }
    }
    if (value.specializations) {

      fetch('http://localhost:8081/medicalProcedure/allProcedures', {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      })
        .then(response => response.json())
        .then(data => {
      
          const procedures = data;
          const newProcedures = [];
          value.specializations.forEach(specialization => {
            newProcedures.push(procedures.filter(procedure => procedure.specialization.id === specialization.id));
          });
          const flatNewProcedures = newProcedures.flat();
          setProcedures(flatNewProcedures);
        })
        .catch(error => console.error('Error fetching procedures:', error));
    }
  };

  const handleChangeProcedure = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    if (formData.doctor === '' && (formData.city === '' || formData.hospital === '') ) {
      setDoctors(value.specialization.doctors);
    }
  }

  const handleDateChange = async (date) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedDate: date,
      selectedTime: null, 
    }));
    const doctorId = formData.doctor.id; 
    await fetchAppointments(doctorId, date); 
  };

  const fetchAppointments = async (doctorId, date) => {
    try {
      const response = await fetch(`http://localhost:8081/appointment/doctor/${doctorId}`, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      const data = await response.json();
      const selectedDate = date.$d;
      const appointments = data
        .filter(appointment => {
          const appointmentDate = new Date(appointment.date);

          return (
            appointmentDate.getFullYear() === selectedDate.getFullYear() &&
            appointmentDate.getMonth() === selectedDate.getMonth() &&
            appointmentDate.getDate() === selectedDate.getDate()
          );
        })
        .map(appointment => {
          const date = new Date(appointment.date);
          const hour = date.getHours();
          const minute = date.getMinutes();
          return `${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute}`;
        });
      setOccupiedTimeSlots(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  };

  const handleTimeChange = (event, value) => {
    const time = value;
    console.log(time);
    setFormData(prevData => ({
      ...prevData,
      selectedTime: time,
    }));
  };

  const fetchLocation = async (hospital) => {
    var location;
    try {
      const response = await axios.get(`http://localhost:8081/location/hospital/${hospital}`, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      location = response.data;
    } catch (error) {
      console.error('Eroare la aducerea locatiei', error);
    }
    const flatLocation = location.flat();
    setLocation(flatLocation);
  };

  const fetchUser = async (userID) => {
    var user;
    try {
      const response = await axios.get(`http://localhost:8081/user/${userID}`, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      user = response.data;
    } catch (error) {
      console.error('Eroare la aducerea locatiei', error);
    }
    setUser(user);
  };

  async function save(doctor, location, medicalProcedure, tipProgramare, finalDate) {

    try {
      const response = await axios.post("http://localhost:8081/appointment", {
        date: finalDate,
        type: tipProgramare,
        doctor: doctor, 
        location: location, 
        medicalProcedure: medicalProcedure,
        user: user, 
        reviewStatus: "FALSE",
        status: "PENDING"
      }, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      if (response.status === 200) {
        console.log('Cererea de programare a fost trimisă cu succes!');
      } else {
        console.error('Eroare la trimiterea cererii de programare:', response.statusText);
      }
    } catch (error) {
      console.error('Eroare la trimiterea cererii de programare:', error);
    }
  }

  const handleAppointmentSubmit = () => {
    const { doctor, hospital, medicalProcedure, selectedDate, selectedTime, tipProgramare } = formData;
    const data = new Date(selectedDate.$d);
    const year = data.getFullYear();
    var month = data.getMonth() + 1;  
    var day = data.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    if (month < 10) {
      month = "0" + month;
    }

    const finalDate = year + "-" + month + "-" + day + "T" + selectedTime + ":00";
  
    if (doctor && hospital && medicalProcedure && selectedDate && selectedTime && tipProgramare) {
      const dataToSend = {
        doctor_id: doctor, 
        location_id: location, 
        procedure_id: medicalProcedure[0], 
        user_id: localStorage.userId, 
        type: tipProgramare,
        date: finalDate,
        reviewStatus: "FALSE",
        status: "PENDING"
      };
      save(doctor, location[0], medicalProcedure, tipProgramare, finalDate);
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  };

  return (
    <div>

      <div className="title">Programari</div>
      <p className='description'>Prin intermediul sistemului nostru de programare avansat, îți oferim posibilitatea de a programa consultații, teste și alte servicii medicale într-un mod transparent și convenabil. În plus, echipa noastră dedicată este întotdeauna aici pentru a te ghida și a te sprijini în fiecare pas al drumului către sănătatea ta optimă.</p>

      <div className='drawer'>
        <Button onClick={toggleDrawer(true)} className="menu-button">Deschide meniu</Button>
        <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer(false)}>
          <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
              {[
                { text: 'Realizează programare', icon: <EventIcon />, link: '/appointment' },
                { text: 'Programarile tale', icon: <ListAltIcon />, link: '/yourAppointments' },
                { text: 'Facturi', icon: <ReceiptIcon />, link: '/bill' },
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
            <div className='stepperDetails'>
              <h2 className='stepperTitle'>Completează datele</h2>
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
              <TextField
                name="medicalProcedure"
                select
                label="Procedură medicală"
                value={formData.medicalProcedure}
                onChange={handleChangeProcedure}
                variant="outlined"
                fullWidth
                margin="normal"
              >
                {procedures.map(procedure => (
                  <MenuItem key={procedure.id} value={procedure}>
                    {procedure.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                name="doctor"
                select
                label="Medic"
                value={formData.doctor}
                onChange={handleChangeDoctor}
                variant="outlined"
                fullWidth
                margin="normal"
              >
                {doctors.map(doctor => (
                  <MenuItem key={doctor.id} value={doctor}>
                    {doctor.fullName}
                  </MenuItem>
                ))}
              </TextField>
              <div>

                <FormControl component="fieldset">
                  <FormLabel component="legend">Alege tipul de programare:</FormLabel>
                  <RadioGroup
                    row
                    aria-label="tipProgramare"
                    name="tipProgramare"
                    value={formData.tipProgramare}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="PHYSICAL"
                      control={<Radio />}
                      label="Programare fizică"
                    />
                    <FormControlLabel
                      value="ONLINE"
                      control={<Radio />}
                      label="Programare online"
                    />
                  </RadioGroup>
                </FormControl>
              </div>

              <Button variant="contained" color="primary" onClick={handleNext} className='continue-button'>
                Continuă
              </Button>
            </div>
          )}

          {activeStep === 1 && (
            <div className='stepperDetails'>
              <h2 className='stepperTitle'>Alege data</h2>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker
                  orientation="landscape"
                  value={formData.selectedDate}
                  onChange={handleDateChange}
                />
              </LocalizationProvider>
              <Autocomplete
                id="disabled-options-demo"
                options={timeSlots}
                getOptionDisabled={(option) => isTimeSlotOccupied(option)}
                sx={{ width: 300 }}
                onChange={handleTimeChange}

                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Alege ora"
                  />
                )}
              />

              <Button variant="contained" onClick={handleBack}>
                Înapoi
              </Button>
              <Button variant="contained" color="primary" onClick={handleAppointmentSubmit}>
                Trimite cerere de programare
              </Button>
            </div>
          )}

          {activeStep === 2 && (
            <div className='stepperDetails'>
              <h2 className='stepperTitle'>Așteaptă răspuns</h2>
              <div className="response-message">
                <p>Cererea dumneavoastră s-a trimis către medicul {formData.doctor.fullName}.
                   Veți fi notificat cu privire la răspunsul său pe adresa de email: {formData.email}
                  sau pe pagina "Programarile tale"</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Appointment;