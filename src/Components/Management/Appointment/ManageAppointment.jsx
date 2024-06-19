import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Typography,
  Backdrop,
  CircularProgress,
  Box,
} from "@mui/material";
import ManagementGrid from "../ManagementGrid";
import AddRowAccordion from "../AddRowAccordion";
import { addRow } from "../Api";

function ManageAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctor] = useState([]);
  const [locations, setLocation] = useState([]);
  const [procedures, setProcedure] = useState([]);
  const [users, setUser] = useState([]);
  const token = localStorage.getItem("token");

  const fields = [
    {
      label: "Data",
      name: "date",
      type: "text",
    },
    {
      label: "Tip Programare",
      name: "type",
      type: "select",
      defaultValue: "PHYSICAL",
      options: ["PHYSICAL", "ONLINE"],
    },
    {
      label: "Review Status",
      name: "reviewStatus",
      type: "select",
      defaultValue: "FALSE",
      options: ["TRUE", "FALSE"],
    },
    {
      label: "Status Programare",
      name: "status",
      type: "select",
      defaultValue: "PENDING",
      options: ["PENDING", "WAITING_FOR_PAYMENT", "APPROVED", "REJECTED"],
    },
    {
      label: "Nume Doctor",
      name: "doctor",
      type: "select",
      defaultValue: doctors.length > 0 ? doctors[0].fullName : "",
      options: doctors.map((doctor) => doctor.fullName),
    },
    {
      label: "Spital",
      name: "location",
      type: "select",
      defaultValue: locations.length > 0 ? locations[0].hospital : "",
      options: locations.map((location) => location.hospital),
    },
    {
      label: "Nume Procedura Medicala",
      name: "medicalProcedure",
      type: "select",
      defaultValue: procedures.length > 0 ? procedures[0].name : "",
      options: procedures.map((procedure) => procedure.name),
    },
    {
      label: "User email",
      name: "user",
      type: "select",
      defaultValue: users.length > 0 ? users[0].email : "",
      options: users.map((user) => user.email),
    },
  ];

  const fetchAppointments = async () => {
    try {
      const appointmentResponse = await axios.get(
        "http://localhost:8081/appointment/allAppointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointments(appointmentResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointments: ", error);
      setLoading(false);
    }
  };
  const fetchDoctors = async () => {
    try {
      const doctorResponse = await axios.get(
        "http://localhost:8081/doctor/allDoctors",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDoctor(doctorResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching doctors: ", error);
      setLoading(false);
    }
  };
  const fetchLocation = async () => {
    try {
      const locationResponse = await axios.get(
        "http://localhost:8081/location/allLocations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLocation(locationResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching doctors: ", error);
      setLoading(false);
    }
  };
  const fetchProcedures = async () => {
    try {
      const proceduresResponse = await axios.get(
        "http://localhost:8081/medicalProcedure/allProcedures",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProcedure(proceduresResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching doctors: ", error);
      setLoading(false);
    }
  };
  const fetchUsers = async () => {
    try {
      const usersResponse = await axios.get(
        "http://localhost:8081/user/allUsers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(usersResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user: ", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchLocation();
    fetchProcedures();
    fetchUsers();
  }, []);

  const handleUpdateAppointment = async (updatedAppointment) => {
    try {
      console.log("Updated appointment data:", updatedAppointment); // Afișează datele de actualizare

      // Implementarea pentru actualizare aici
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {};

  const handleSaveNewAppointment = async (formData) => {
    try {
      console.log(formData);
      const doctorResponse = await axios.get(`http://localhost:8081/doctor/getDoctor/${formData.doctor}`);
      const locationResponse = await axios.get(`http://localhost:8081/location/hospital/${formData.location}`);
      const proceduresResponse = await axios.get(`http://localhost:8081/medicalProcedure/name/${formData.medicalProcedure}`);
      const usersResponse = await axios.get(`http://localhost:8081/user/email/${formData.user}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const doctor = doctorResponse.data;
      const location = locationResponse.data;
      const procedure = proceduresResponse.data;
      const user = usersResponse.data;
      console.log(user);
      // Trimite cererea de adăugare către server
      const updatedData = {
        date: formData.date,
        type: formData.type,
        doctor: doctor[0],
        location: location[0],
        medicalProcedure: procedure[0],
        user: { id: user.id },
        reviewStatus: formData.reviewStatus,
        status: formData.status,
      };
      console.log(updatedData);
      const success = await addRow(
        "http://localhost:8081/appointment",updatedData
      );

      if (success) {
        // Re-fetch doctors or update local state
        fetchAppointments();
      } else {
        console.error("Error adding new doctor");
      }
    } catch (error) {
      console.error("Error adding new doctor: ", error);
    }
  };

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
            Modifica Programari
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
              The appointment management page allows administrators to
              efficiently manage appointments in the system, including
              functionalities such as updating appointment details, modifying
              doctor names, hospital locations, medical procedure names, user
              information, deleting appointments, and searching for
              appointments, facilitating complete control and administration of
              user appointments.
            </Typography>
          </Box>
        </Grid>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <AddRowAccordion
          title={"Adauga Programare"}
          fields={fields}
          onSave={handleSaveNewAppointment}
        />
        <Grid
          container
          direction="row"
          justifyContent="space-around"
          marginLeft={2}
          marginTop={4}
        >
          <Box sx={{ maxWidth: "100%", marginRight: 15 }}>
            <ManagementGrid
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
                  editable: true,
                  headerClassName: "super-app-theme--header",
                },
                {
                  field: "type",
                  headerName: "Tip Programare",
                  width: 200,
                  editable: true,
                  type: "singleSelect",
                  valueOptions: ["PHYSICAL", "ONLINE"],
                  headerClassName: "super-app-theme--header",
                },
                {
                  field: "doctor",
                  headerName: "Nume Doctor",
                  width: 200,
                  editable: true,
                  headerClassName: "super-app-theme--header",
                  valueGetter: (params) =>
                    params.row.doctor.fullName
                      ? params.row.doctor.fullName
                      : params.row.doctor,
                },
                {
                  field: "location",
                  headerName: "Spital",
                  width: 200,
                  editable: true,
                  headerClassName: "super-app-theme--header",
                  valueGetter: (params) =>
                    params.row.location.hospital
                      ? params.row.location.hospital
                      : params.row.location,
                },
                {
                  field: "procedure",
                  headerName: "Nume Procedura Medicala",
                  width: 200,
                  editable: true,
                  headerClassName: "super-app-theme--header",
                  valueGetter: (params) =>
                    params.row.medicalProcedure.name
                      ? params.row.medicalProcedure.name
                      : params.row.medicalProcedure,
                },
                {
                  field: "userLastName",
                  headerName: "User Nume",
                  width: 200,
                  editable: true,
                  headerClassName: "super-app-theme--header",
                  valueGetter: (params) =>
                    params.row.user.lastName
                      ? params.row.user.lastName
                      : params.row.user,
                },
                {
                  field: "userFirstName",
                  headerName: "User Prenume",
                  width: 200,
                  editable: true,
                  headerClassName: "super-app-theme--header",
                  valueGetter: (params) =>
                    params.row.user.firstName
                      ? params.row.user.firstName
                      : params.row.user,
                },
                {
                  field: "reviewStatus",
                  headerName: "Review Status",
                  width: 200,
                  editable: true,
                  type: "singleSelect",
                  valueOptions: ["FASLE", "TRUE"],
                  headerClassName: "super-app-theme--header",
                },
                {
                  field: "status",
                  headerName: "Status",
                  width: 200,
                  editable: true,
                  type: "singleSelect",
                  valueOptions: [
                    "PENDING",
                    "WAITING_FOR_PAYMENT",
                    "APPROVED",
                    "REJECTED",
                  ],
                  headerClassName: "super-app-theme--header",
                },
              ]}
              url="http://localhost:8081/appointment"
              updateRow={handleUpdateAppointment}
              handleDelete={handleDeleteAppointment}
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default ManageAppointment;
