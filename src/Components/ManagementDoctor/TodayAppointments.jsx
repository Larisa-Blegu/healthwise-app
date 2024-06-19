import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TodayAppointmentsGrid from './TodayAppointmentsGrid';
import { Grid, Typography, Backdrop, CircularProgress, Box } from "@mui/material";

function TodayAppointments() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = localStorage.getItem('email');
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      fetchUserDoctor(userId);
    }
  }, [isLoggedIn, navigate, userId]);

  const fetchUserDoctor = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/user/doctor/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDoctor(response.data);
      fetchAppointmentsForDate(selectedDate, response.data.id);
    } catch (error) {
      console.error(`Error fetching doctor and user`, error);
    }
  };

  const fetchAppointmentsForDate = async (date, doctorId) => {
    setLoading(true);
    const dateInitial = date.startOf('day').toISOString();
    const dateFinal = date.endOf('day').toISOString();
    try {
      const response = await axios.get(
        `http://localhost:8081/appointment/todayAppointments/${dateInitial}/${dateFinal}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const appointments = response.data.filter(app => app.doctor.id === doctorId);
      appointments.forEach(appointment => {
        appointment.location = appointment.location.hospital;
        appointment.procedure = appointment.medicalProcedure.name;
      });
      setAppointments(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
    setLoading(false);
  };

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    if (doctor) {
      fetchAppointmentsForDate(newValue, doctor.id);
    }
  };

  return (
    <div>
      <div className="title">Programările de astăzi</div>
      <p className='description'>Alege o dată pentru a vedea programările disponibile pentru acea zi.</p>
      <div className='content'>
        <div className='calendar'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={selectedDate}
              onChange={handleDateChange}
            />
          </LocalizationProvider>
        </div>
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Grid container direction="column" justifyContent="space-around">
          <Grid item xs={6} marginTop={2} marginLeft={3}>
            <Box sx={{ maxWidth: "100%", marginRight: 15 }}>
              <TodayAppointmentsGrid
                initialRows={appointments}
                columns={[
                  {
                    field: "id",
                    headerName: "ID",
                    width: 100,
                    editable: false,
                    headerClassName: "super-app-theme--header",
                  },
                  {
                    field: "date",
                    headerName: "Data",
                    width: 200,
                    editable: false,
                    headerClassName: "super-app-theme--header",
                  },
                  {
                    field: "type",
                    headerName: "Tip Programare",
                    width: 200,
                    editable: false,
                    headerClassName: "super-app-theme--header",
                  },
                  {
                    field: "location",
                    headerName: "Locatie",
                    width: 200,
                    editable: false,
                    headerClassName: "super-app-theme--header",
                  },
                  {
                    field: "procedure",
                    headerName: "Procedura",
                    width: 200,
                    editable: false,
                    headerClassName: "super-app-theme--header",
                  },
                ]}
              />
            </Box>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default TodayAppointments;
