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

function ManageSpecialization() {
    const [specializations, setSpecializations] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    const columns = [
        { field: 'id', headerName: 'ID', width: 100, editable: false, headerClassName: 'super-app-theme--header' },
        { field: 'name', headerName: 'Denumire', width: 200, editable: true, headerClassName: 'super-app-theme--header' },
        { field: 'description', headerName: 'Descriere', width: 200, editable: true, headerClassName: 'super-app-theme--header' },
        { field: 'descriptionDisease', headerName: 'Informatii afectiuni', width: 250, editable: true, headerClassName: 'super-app-theme--header' }
    ];

    const fields = [
            {
                label: 'Denumire',
                name: 'name',
                type: 'text',
            },
            {
                label: 'Descriere',
                name: 'description',
                type: 'text',
            },
            {
                label: 'Informatii afectiuni',
                name: 'descriptionDisease',
                type: 'text',
            }
        ]


    const fetchSpecializations = async () => {
        try {
            const response = await axios.get('http://localhost:8081/specialization/allSpecializations', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSpecializations(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching specializations: ', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpecializations();
    }, []);

    const handleUpdateSpecialization = async (updatedSpecialization) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.put(`http://localhost:8081/specialization`, updatedSpecialization, config);
            const updatedSpecializations = specializations.map(spec => spec.id === updatedSpecialization.id ? updatedSpecialization : spec);
            setSpecializations(updatedSpecializations);
        } catch (error) {
            console.error('Error updating specialization: ', error);
        }
    };

    const handleDeleteSpecialization = async (specializationId) => {
        try {
            await axios.delete(`http://localhost:8081/specialization/${specializationId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const updatedSpecializations = specializations.filter(spec => spec.id !== specializationId);
            setSpecializations(updatedSpecializations);
        } catch (error) {
            console.error('Error deleting specialization: ', error);
        }
    };

    const handleSaveNewSpecialization = async (formData) => {
        try {
            const success = await addRow('http://localhost:8081/specialization', formData);
            if (success) {
                // Re-fetch specializations or update local state
                fetchSpecializations();
            } else {
                console.error('Error adding new specialization');
            }
        } catch (error) {
            console.error('Error adding new specialization: ', error);
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
                        Modifica Specializari
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
                            Pagina de administrare a specializărilor este un instrument esențial pentru administratori în gestionarea și ajustarea listei de specializări disponibile în sistem. Această pagină oferă posibilitatea adăugării, actualizării și ștergerii specializărilor, permițând astfel adaptarea rapidă și eficientă a ofertei de specializări în funcție de necesitățile și preferințele utilizatorilor.            </Typography>
                    </Box>
                </Grid>
                <Backdrop
                    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <AddRowAccordion title={'Adauga Specializare'} fields={fields} onSave={handleSaveNewSpecialization} />
                <Grid container direction="row" justifyContent="space-around" marginLeft={2} marginTop={4} >
                    <Box marginBottom={5}>
                        <ManagementGrid
                            initialRows={specializations}
                            columns={columns}
                            url="http://localhost:8081/specialization"
                            updateRow={handleUpdateSpecialization}
                            handleDelete={handleDeleteSpecialization}
                        />
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}

export default ManageSpecialization;
