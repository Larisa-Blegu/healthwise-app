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

function ManagePrice() {
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [doctors, setDoctors] = useState([]);
    const [procedures, setProcedures] = useState([]);

    const token = localStorage.getItem('token');

    const fields = [
        {
            label: 'Pret',
            name: 'price',
            type: 'text',
        },
        {
            label: 'Nume Doctor',
            name: 'doctorName',
            type: 'selectDoctor',
            defaultValue: doctors.length > 0 ? doctors[0].fullName : '',
            options: doctors.map(doctor => doctor.fullName)
        },
        {
            label: 'Nume Procedura Medicala',
            name: 'procedureName',
            type: 'select',
            defaultValue: procedures.length > 0 ? procedures[0].name : '',
            options: procedures.map(procedure => procedure.name)
        }
    ]

    const fetchPrices = async () => {
        try {
            const priceResponse = await axios.get('http://localhost:8081/price/allPrices', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setPrices(priceResponse.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching prices: ', error);
            setLoading(false);
        }
    };

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://localhost:8081/doctor/allDoctors', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            
            return response.data;
        } catch (error) {
            console.error('Error fetching specializations: ', error);
            return [];
        }
    };

    const fetchProcedures = async () => {
        try {
            const response = await axios.get('http://localhost:8081/medicalProcedure/allProcedures', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching specializations: ', error);
            return [];
        }
    };

    useEffect(() => {
        fetchPrices();
        fetchDoctors().then(data => {
            setDoctors(data);
            setLoading(false);
        });
        fetchProcedures().then(data => {
            setProcedures(data);
            setLoading(false);
        });
    }, []);

    const handleUpdatePrice = async (updatedPrice) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.put(`http://localhost:8081/price`, updatedPrice, config);
            const updatedPrices = prices.map(price => price.id === updatedPrice.id ? updatedPrice : price);
            setPrices(updatedPrices);
        } catch (error) {
            console.error('Error updating price: ', error);
        }
    };

    const handleDeletePrice = async (priceId) => {
        try {
            await axios.delete(`http://localhost:8081/price/${priceId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const updatedPrices = prices.filter(price => price.id !== priceId);
            setPrices(updatedPrices);
        } catch (error) {
            console.error('Error deleting price: ', error);
        }
    };

    const handleSaveNewPrice = async (formData) => {
        try {
            console.log(formData.procedureName);
            const response = await axios.get(`http://localhost:8081/doctor/getDoctor/${formData.doctorName}`);
            const doctor = response.data;
            console.log(doctor);
            const responseProcedure = await axios.get(`http://localhost:8081/medicalProcedure/name/${formData.procedureName}`);
            console.log(responseProcedure.data); // Afiseaza obiectul in consola pentru a vedea structura si proprietatile

            const procedure = responseProcedure.data;

            const updatedData = {
                price: formData.price,
                doctor: doctor[0],
                medicalProcedure: procedure[0],
            };
            console.log(updatedData);

            const success = await addRow('http://localhost:8081/price', updatedData);
            if (success) {
                // Re-fetch prices or update local state
                fetchPrices();
            } else {
                console.error('Error adding new price');
            }
        } catch (error) {
            console.error('Error adding new price: ', error);
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
                        Modifica Preturi
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
                            Pagina "Modifica Preturi" oferă o interfață intuitivă și funcțională pentru gestionarea eficientă a prețurilor în cadrul sistemului medical, contribuind la transparența și eficiența procesului de facturare și încasare a plăților pentru serviciile medicale oferite.                        </Typography>
                    </Box>
                </Grid>
                <Backdrop
                    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <AddRowAccordion title={'Adauga Pret'} fields={fields} onSave={handleSaveNewPrice} />
                <Grid container direction="row" justifyContent="space-around" marginLeft={2} marginTop={4} >
                    <Box marginBottom={5}>
                        <ManagementGrid
                            initialRows={prices}
                            columns={[
                                { field: 'id', headerName: 'ID', width: 100, editable: false, headerClassName: 'super-app-theme--header' },
                                { field: 'price', headerName: 'Pret', width: 100, editable: false, headerClassName: 'super-app-theme--header' },
                                {
                                    field: 'doctor',
                                    headerName: 'Doctor',
                                    width: 200,
                                    editable: true,
                                    headerClassName: 'super-app-theme--header',
                                    valueGetter: (params) => params.row.doctor.fullName ? params.row.doctor.fullName : params.row.doctor
                                },
                                {
                                    field: 'procedure',
                                    headerName: 'Procedure Medicala',
                                    width: 200,
                                    editable: true,
                                    headerClassName: 'super-app-theme--header',
                                    valueGetter: (params) => params.row.medicalProcedure.name ? params.row.medicalProcedure.name : params.row.medicalProcedure
                                }
                            ]}
                            url="http://localhost:8081/price"
                            updateRow={handleUpdatePrice}
                            handleDelete={handleDeletePrice}
                        />
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}

export default ManagePrice;
