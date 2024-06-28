import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TodayAppointmentsGrid from "./TodayAppointmentsGrid";
import {
  Grid,
  Typography,
  Backdrop,
  CircularProgress,
  Box,
} from "@mui/material";
import { startOfDay, endOfDay, format } from "date-fns";

function TodayAppointments() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = localStorage.getItem("email");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
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
    const dateInitial = format(
      startOfDay(new Date(date)),
      "yyyy-MM-dd'T'HH:mm:ss"
    );
    const dateFinal = format(endOfDay(new Date(date)), "yyyy-MM-dd'T'HH:mm:ss");
    try {
      const response = await axios.get(
        `http://localhost:8081/appointment/todayAppointments/${dateInitial}/${dateFinal}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);

      const filteredAppointments = response.data.filter(
        (app) =>
          app.doctor.id === doctorId &&
          (app.status === "WAITING_FOR_PAYMENT" || app.status === "APPROVED")
      );

      filteredAppointments.forEach((appointment) => {
        appointment.location = appointment.location.hospital;
        appointment.procedure = appointment.medicalProcedure.name;
        appointment.patientName = `${appointment.user.firstName} ${appointment.user.lastName}`;
        appointment.patientEmail = appointment.user.email;
        appointment.patientPhoneNumber = appointment.user.phoneNumber;
      });
      setAppointments(filteredAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
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
    <div className="today-appointments">
      <div className="title">Agendă de programări</div>
      <Box marginBottom={4} marginLeft={4}>
        <Typography
          variant="body1"
          gutterBottom
          sx={{
            textAlign: "left",
            fontFamily: "Roboto, sans-serif",
            fontWeight: 400,
            fontSize: 17,
            color: "#333",
          }}
        >
          Utilizați calendarul interactiv pentru a selecta orice zi a anului și
          a vedea programările pentru acea zi. Această funcționalitate vă ajută
          să planificați din timp și să gestionați eficient activitatea
          clinicii.
        </Typography>
      </Box>

      <div className="content">
        <div className="calendar">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar value={selectedDate} onChange={handleDateChange} />
          </LocalizationProvider>
        </div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Grid
          container
          direction="row"
          justifyContent="space-around"
          marginLeft={2}
          marginTop={4}
        >
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
                {
                  field: "patientName",
                  headerName: "Nume Pacient",
                  width: 200,
                  editable: false,
                  headerClassName: "super-app-theme--header",
                },
                {
                  field: "patientEmail",
                  headerName: "Email Pacient",
                  width: 250,
                  editable: false,
                  headerClassName: "super-app-theme--header",
                },
                {
                  field: "patientPhoneNumber",
                  headerName: "Telefon Pacient",
                  width: 200,
                  editable: false,
                  headerClassName: "super-app-theme--header",
                },
                {
                  field: "status",
                  headerName: "Status",
                  width: 200,
                  editable: false,
                  headerClassName: "super-app-theme--header",
                },
              ]}
            />
          </Box>
        </Grid>
      </div>
    </div>
  );
}

export default TodayAppointments;
