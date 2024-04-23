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

function ManageContact() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [doctors, setDoctors] = useState([]);

    const token = localStorage.getItem('token');

    const fields = [
        {
            label: 'Email',
            name: 'email',
            type: 'email',
        },
        {
            label: 'Doctor Name',
            name: 'doctorName',
            type: 'select',
            defaultValue: doctors.length > 0 ? doctors[0].fullName : '',
            options: doctors.map(doctor => doctor.fullName)
        }
    ]


    const fetchContacts = async () => {
        try {
            const contactResponse = await axios.get('http://localhost:8081/contact/allContacts', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const contacts = contactResponse.data.map(contact => ({
                id: contact.id,
                email: contact.email,
                doctor: contact.doctor ? contact.doctor.fullName : ''
            }))
            setContacts(contacts);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching contacts: ', error);
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



    useEffect(() => {
        fetchContacts();
        fetchDoctors().then(data => {
            setDoctors(data);
            setLoading(false);
        });
    }, []);

    const handleUpdateContact = async (updatedContact) => {

    };


    const handleDeleteContact = async (contactId) => {

    };

    const handleSaveNewContact = async (formData) => {
        try {
            const response = await axios.get(`http://localhost:8081/doctor/getDoctor/${formData.doctorName}`);

            const doctor = response.data;

            // Trimite cererea de adăugare către server
            const updatedData = {
                email: formData.email,
                doctor: doctor[0],  // Trimitem doar ID-ul doctorului
            };

            const success = await addRow('http://localhost:8081/contact', updatedData);
            if (success) {
                // Re-fetch contacts or update local state
                fetchContacts();
            } else {
                console.error('Error adding new contact');
            }
        } catch (error) {
            console.error('Error adding new contact: ', error);
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
                        Modifica Contacte
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
                            Aceasta interfata este realizata pentru a permite administratorilor sa realizeze modificarile necesare in ceea ce priveste contactele medicilor. Astfel, se pot adauga noi contacte, se mod updata cele existente in cazul in care exista noi modificari sau se pot sterge contactele ce nu mai sunt valabile.
                        </Typography>
                    </Box>
                </Grid>
                <Backdrop
                    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <AddRowAccordion title={'Adauga Contact'} fields={fields} onSave={handleSaveNewContact} />
                <Grid container direction="row" justifyContent="space-around" marginLeft={2} marginTop={4} >
                    <Box marginBottom={5}>
                        <ManagementGrid
                            initialRows={contacts}
                            columns={[
                                { field: 'id', headerName: 'ID', width: 100, editable: false, headerClassName: 'super-app-theme--header' },
                                { field: 'email', headerName: 'Email', width: 200, editable: true, headerClassName: 'super-app-theme--header' },
                                {
                                    field: 'doctor',
                                    headerName: 'Doctor',
                                    width: 200,
                                    type: 'singleSelect',
                                    editable: true,
                                    valueOptions: doctors,
                                    headerClassName: 'super-app-theme--header',
                                    getOptionValue: (value) => value.fullName,
                                    getOptionLabel: (value) => value.fullName
                                }
                            ]}
                            url="http://localhost:8081/contact"
                            updateRow={handleUpdateContact}
                            handleDelete={handleDeleteContact}
                        />
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}

export default ManageContact;
