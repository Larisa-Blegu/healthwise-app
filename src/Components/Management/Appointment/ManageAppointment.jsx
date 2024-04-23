import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Grid,
    Typography,
    Backdrop,
    CircularProgress,
    Box
} from "@mui/material";
import ManagementGrid from '../ManagementGrid';
import AddRowAccordion from '../AddRowAccordion';
import { addRow } from '../Api';

function ManageAppointment() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    const fields = [
        {
            label: 'Data',
            name: 'date',
            type: 'date',
        },
        {
            label: 'Tip Programare',
            name: 'type',
            type: 'select',
            defaultValue: 'PHYSICAL',
            options: ["PHYSICAL", "ONLINE"]
        },
        {
            label: 'Review Status',
            name: 'reviewStatus',
            type: 'select',
            defaultValue: 'FALSE',
            options: ["TRUE", "FALSE"]
        },
        {
            label: 'Status Programare',
            name: 'status',
            type: 'select',
            defaultValue: 'PENDING',
            options: ["PENDING", "WAITING_FOR_PAYMENT", "APPROVED", "REJECTED"]

        },
        {
            label: 'Nume Doctor',
            name: 'doctorName',
            type: 'text',
        },
        {
            label: 'Spital',
            name: 'locationHospital',
            type: 'text',
        },
        {
            label: 'Nume Procedura Medicala',
            name: 'medicalProcedureName',
            type: 'text',
        },
        {
            label: 'User Nume',
            name: 'userLastName',
            type: 'text',
        },
        {
            label: 'User Prenume',
            name: 'userFirstName',
            type: 'text',
        },
    ]

    const fetchAppointments = async () => {
        try {
            const appointmentResponse = await axios.get('http://localhost:8081/appointment/allAppointments', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setAppointments(appointmentResponse.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching appointments: ', error);
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleUpdateAppointment = async (updatedAppointment) => {
        try {
            console.log('Updated appointment data:', updatedAppointment); // Afișează datele de actualizare

            // Implementarea pentru actualizare aici
        } catch (error) {
            console.error('Error updating appointment:', error);
        }
    };

    const handleDeleteAppointment = async (appointmentId) => {

    };

    const handleSaveNewAppointment = async (formData) => {
        try {
            // Implementare pentru adăugare
        } catch (error) {
            console.error('Error adding new appointment: ', error);
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
                            color: '#4c657f',
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
                                color: '#333',
                            }}
                        >
                            The appointment management page allows administrators to efficiently manage appointments in the system, including functionalities such as updating appointment details, modifying doctor names, hospital locations, medical procedure names, user information, deleting appointments, and searching for appointments, facilitating complete control and administration of user appointments.
                        </Typography>
                    </Box>
                </Grid>
                <Backdrop
                    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <AddRowAccordion title={'Adauga Programare'} fields={fields} onSave={handleSaveNewAppointment} />
                <Grid container direction="row" justifyContent="space-around" marginLeft={2} marginTop={4} >
                    <Box sx={{ maxWidth: '100%', marginRight: 15 }}>
                        <ManagementGrid
                            initialRows={appointments}
                            columns={[
                                { field: 'id', headerName: 'ID', width: 100, editable: false, headerClassName: 'super-app-theme--header' },
                                { field: 'date', headerName: 'Data', width: 200, editable: true, headerClassName: 'super-app-theme--header' },
                                {
                                    field: 'type', headerName: 'Tip Programare', width: 200, editable: true, type: "singleSelect",
                                    valueOptions: ["PHYSICAL", "ONLINE"], headerClassName: 'super-app-theme--header'
                                },
                                {
                                    field: 'doctor',
                                    headerName: 'Nume Doctor',
                                    width: 200,
                                    editable: true,
                                    headerClassName: 'super-app-theme--header',
                                    valueGetter: (params) => params.row.doctor.fullName ? params.row.doctor.fullName : params.row.doctor
                                },
                                {
                                    field: 'location',
                                    headerName: 'Spital',
                                    width: 200,
                                    editable: true,
                                    headerClassName: 'super-app-theme--header',
                                    valueGetter: (params) => params.row.location.hospital ? params.row.location.hospital : params.row.location
                                },
                                {
                                    field: 'procedure',
                                    headerName: 'Nume Procedura Medicala',
                                    width: 200,
                                    editable: true,
                                    headerClassName: 'super-app-theme--header',
                                    valueGetter: (params) => params.row.medicalProcedure.name ? params.row.medicalProcedure.name : params.row.medicalProcedure
                                },
                                {
                                    field: 'user',
                                    headerName: 'User Nume',
                                    width: 200,
                                    editable: true,
                                    headerClassName: 'super-app-theme--header',
                                    valueGetter: (params) => params.row.user.lastName ? params.row.user.lastName : params.row.user
                                },
                                {
                                    field: 'user',
                                    headerName: 'User Prenume',
                                    width: 200,
                                    editable: true,
                                    headerClassName: 'super-app-theme--header',
                                    valueGetter: (params) => params.row.user.firstName ? params.row.user.firstName : params.row.user
                                },
                                {
                                    field: 'reviewStatus', headerName: 'Review Status', width: 200, editable: true, type: "singleSelect",
                                    valueOptions: ["FASLE", "TRUE"], headerClassName: 'super-app-theme--header'
                                },
                                {
                                    field: 'status', headerName: 'Status', width: 200, editable: true, type: "singleSelect",
                                    valueOptions: ["PENDING", "WAITING_FOR_PAYMENT", "APPROVED", "REJECTED"], headerClassName: 'super-app-theme--header'
                                }
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
