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

function ManageLocation() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    const columns = [
        { field: 'id', headerName: 'ID', width: 100, editable: false, headerClassName: 'super-app-theme--header' },
        { field: 'address', headerName: 'Adresă', width: 200, editable: true, headerClassName: 'super-app-theme--header' },
        { field: 'city', headerName: 'Oraș', width: 200, editable: true, headerClassName: 'super-app-theme--header' },
        { field: 'hospital', headerName: 'Spital', width: 200, editable: true, headerClassName: 'super-app-theme--header' },
        { field: 'latitude', headerName: 'Latitudine', width: 200, editable: true, headerClassName: 'super-app-theme--header' },
        { field: 'longitude', headerName: 'Longitudine', width: 200, editable: true, headerClassName: 'super-app-theme--header' }
    ];

     const fields = [
            {
                label: 'Adresă',
                name: 'address',
                type: 'text',
            },
            {
                label: 'Oraș',
                name: 'city',
                type: 'text',
            },
            {
                label: 'Spital',
                name: 'hospital',
                type: 'text',
            },
            {
                label: 'Latitudine',
                name: 'latitude',
                type: 'text',
            },
            {
                label: 'Longitudine',
                name: 'longitude',
                type: 'text',
            }
        ]

    const fetchLocations = async () => {
        try {
            const response = await axios.get('http://localhost:8081/location/allLocations', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setLocations(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching locations: ', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleUpdateLocation = async (updatedLocation) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.put(`http://localhost:8081/location`, updatedLocation, config);
            const updatedLocations = locations.map(loc => loc.id === updatedLocation.id ? updatedLocation : loc);
            setLocations(updatedLocations);
        } catch (error) {
            console.error('Error updating location: ', error);
        }
    };

    const handleDeleteLocation = async (locationId) => {
        try {
            await axios.delete(`http://localhost:8081/location/${locationId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const updatedLocations = locations.filter(loc => loc.id !== locationId);
            setLocations(updatedLocations);
        } catch (error) {
            console.error('Error deleting location: ', error);
        }
    };

    const handleSaveNewLocation = async (formData) => {
        try {
            const success = await addRow('http://localhost:8081/location', formData);
            if (success) {
                fetchLocations();
            } else {
                console.error('Error adding new location');
            }
        } catch (error) {
            console.error('Error adding new location: ', error);
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
                        Modifica Locatii
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
                            Pagina de administrare a locațiilor este un instrument esențial pentru managerii sistemului, oferindu-le capacitatea de a gestiona cu ușurință și eficiență lista de locații disponibile. Această pagină permite adăugarea, actualizarea și ștergerea locațiilor.                        </Typography>
                    </Box>
                </Grid>
                <Backdrop
                    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <AddRowAccordion title={'Adauga Locatie'} fields={fields} onSave={handleSaveNewLocation} />
                <Grid container direction="row" justifyContent="space-around" marginLeft={2} marginTop={4} >
                    <Box marginBottom={5}>
                        <ManagementGrid
                            initialRows={locations}
                            columns={columns}
                            url="http://localhost:8081/location"
                            updateRow={handleUpdateLocation}
                            handleDelete={handleDeleteLocation}
                        />
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}

export default ManageLocation;
