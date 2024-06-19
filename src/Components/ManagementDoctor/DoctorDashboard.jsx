import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Typography,
  Backdrop,
  CircularProgress,
  Box,
} from "@mui/material";
import DoctorManagementGrid from "./DoctorManagementGrid";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [doctor, setDoctor] = useState();

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
    } catch (error) {
      console.error(`Error fetching doctor and user`, error);
      return "Unknown";
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/user/doctor/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDoctor(response.data);

      console.log(response.data);
      try {
        const appointmentResponse = await axios.get(
          `http://localhost:8081/appointment/doctor/${response.data.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const appointments = appointmentResponse.data;

        for (let appointment of appointments) {
          appointment.location = appointment.location.hospital;
          appointment.procedure = appointment.medicalProcedure.name;
        }

        setAppointments(appointments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      }
    } catch (error) {
      console.error(`Error fetching doctor and user`, error);
      return "Unknown";
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div>
      <Grid container direction="column" justifyContent="space-around">
        <Grid item xs={6} marginTop={2} marginLeft={3}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              textAlign: "left",
              fontFamily: "Roboto, sans-serif",
              fontWeight: 700,
              color: "#4c657f",
            }}
          >
            Doctor Dashboard
          </Typography>
          <Box marginBottom={4}>
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
              Here you can view and manage your appointments.
            </Typography>
          </Box>
        </Grid>
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
            <DoctorManagementGrid
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
              url="http://localhost:8081/appointment"
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default DoctorDashboard;
