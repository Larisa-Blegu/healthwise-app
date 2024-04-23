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
import ManagementDialog from '../ManagementDialog';

function ManageDoctor() {
    const [doctors, setDoctors] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [locations, setLocations] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false); // Starea pentru controlul momentului încărcării datelor
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    const columns = [
        { field: 'id', headerName: 'ID', width: 100, editable: false, headerClassName: 'super-app-theme--header' },
        { field: 'fullName', headerName: 'Nume', width: 200, editable: true, headerClassName: 'super-app-theme--header' },
        { field: 'description', headerName: 'Descriere', width: 200, editable: true, headerClassName: 'super-app-theme--header' },
        { field: 'image', headerName: 'Imagine', width: 200, editable: true, headerClassName: 'super-app-theme--header' },
        { field: 'medicineDegree', headerName: 'Titulatura', width: 200, editable: true, headerClassName: 'super-app-theme--header' }
    ];

    const fields = [
        {
            label: 'Nume complet',
            name: 'fullName',
            type: 'text',
        },
        {
            label: 'Descriere',
            name: 'description',
            type: 'text',
        },
        {
            label: 'Imagine',
            name: 'image',
            type: 'text',
        },
        {
            label: 'Grad medical',
            name: 'medicineDegree',
            type: 'text',
        }
    ]


    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://localhost:8081/doctor/allDoctors', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDoctors(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching doctors: ', error);
            setLoading(false);
        }
    };

    const fetchSpecializations = async () => {
        try {
            const response = await axios.get('http://localhost:8081/specialization/allSpecializations', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSpecializations(response.data);
            setLoading(false);
            setDataLoaded(true);

        } catch (error) {
            console.error('Error fetching doctors: ', error);
            setLoading(false);
        }
    };

    const fetchLocations = async () => {
        try {
            const response = await axios.get('http://localhost:8081/location/allLocations', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setLocations(response.data);
            setLoading(false);
            setDataLoaded(true);

        } catch (error) {
            console.error('Error fetching doctors: ', error);
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchDoctors();
        fetchSpecializations();
        fetchLocations();
    }, []);

    const handleUpdateDoctor = async (updatedDoctor) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.put(`http://localhost:8081/doctor`, updatedDoctor, config);
            const updatedDoctors = doctors.map(doctor => doctor.id === updatedDoctor.id ? updatedDoctor : doctor);
            setDoctors(updatedDoctors);
        } catch (error) {
            console.error('Error updating doctor: ', error);
        }
    };

    const handleDeleteDoctor = async (doctorId) => {
        try {
            await axios.delete(`http://localhost:8081/doctor/${doctorId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const updatedDoctors = doctors.filter(doctor => doctor.id !== doctorId);
            setDoctors(updatedDoctors);
        } catch (error) {
            console.error('Error deleting doctor: ', error);
        }
    };

    const handleSaveNewDoctor = async (formData) => {
        try {
            const success = await addRow('http://localhost:8081/doctor', formData);
            if (success) {
                // Re-fetch doctors or update local state
                fetchDoctors();
            } else {
                console.error('Error adding new doctor');
            }
        } catch (error) {
            console.error('Error adding new doctor: ', error);
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
                        Modifica Doctori
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
                            Aceasta pagina este un panou de control care permite administratorilor să gestioneze informațiile despre medici în cadrul sistemului site-ului Healthwise. Aceasta oferă funcționalități pentru vizualiza și edita detaliile individuale ale fiecărui medic, adăugarea de noi medici și ștergerea medicilor care nu mai sunt necesari.                         </Typography>
                    </Box>
                </Grid>
                <Backdrop
                    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <AddRowAccordion title={'Adauga Doctor'} fields={fields} onSave={handleSaveNewDoctor} />
                <Grid container direction="row" justifyContent="space-around" marginLeft={2} marginTop={4} >
                    <Box marginBottom={5}>
                        <ManagementGrid
                            initialRows={doctors}
                            columns={columns}
                            url="http://localhost:8081/doctor"
                            updateRow={handleUpdateDoctor}
                            handleDelete={handleDeleteDoctor}
                        />
                    </Box>
                </Grid>
            </Grid>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {dataLoaded && (
                    <div style={{ marginRight: '40px', border: '1px solid #4c657f' }}>
                        <ManagementDialog
                            title={'Adauga Doctor-Specializare'}
                            tabelConnection={'Specializari'}
                            operation={'Add'}
                            initialDoctors={doctors}
                            initialConnections={specializations}
                        />
                    </div>
                )}

                {dataLoaded && (
                    <div style={{ marginRight: '40px', border: '1px solid #4c657f' }}>
                        <ManagementDialog
                            title={'Sterge Doctor-Specializare'}
                            tabelConnection={'Specializari'}
                            operation={'Delete'}
                            initialDoctors={doctors}
                            initialConnections={specializations}
                        />
                    </div>
                )}

                {dataLoaded && (
                    <div style={{ marginRight: '40px', border: '1px solid #4c657f' }}>
                        <ManagementDialog
                            title={'Adauga Doctor-Locatie'}
                            tabelConnection={'Locatii'}
                            operation={'Add'}
                            initialDoctors={doctors}
                            initialConnections={locations}
                        />
                    </div>
                )}

                {dataLoaded && (
                    <div style={{ border: '1px solid #4c657f' }}>
                        <ManagementDialog
                            title={'Sterge Doctor-Location'}
                            tabelConnection={'Locatii'}
                            operation={'Delete'}
                            initialDoctors={doctors}
                            initialConnections={locations}
                        />
                    </div>
                )}
            </div>

        </div>
    );
}

export default ManageDoctor;
