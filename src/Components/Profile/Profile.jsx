import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography'; // Adaugă importul pentru Typography
import AlertDialogSlide from '../Management/AlertDialogSlide'; // Asigură-te că calea este corectă
import axios from 'axios';
import { logout } from '../Logout/Logout';
import { compareObjects } from '../Logout/Logout';

function Profile() {
    const [userData, setUserData] = useState({
        id: localStorage.getItem('userId') || '',
        firstName: localStorage.getItem('firstName') || '',
        lastName: localStorage.getItem('lastName') || '',
        email: localStorage.getItem('email') || '',
        phoneNumber: localStorage.getItem('phoneNumber') || ''
    });

    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const savedUserData = {
            id: localStorage.getItem('userId') || '',
            firstName: localStorage.getItem('firstName') || '',
            lastName: localStorage.getItem('lastName') || '',
            email: localStorage.getItem('email') || '',
            phoneNumber: localStorage.getItem('phoneNumber') || ''
        };
        setUserData(savedUserData);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSaveChanges = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleOk = async () => {
        console.log(userData);
        try {
            const response = await axios.put('http://localhost:8081/user', userData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log("Modificările au fost salvate:", response.data);
             // Actualizează localStorage cu noile date
            localStorage.setItem('firstName', userData.firstName);
            localStorage.setItem('lastName', userData.lastName);
            localStorage.setItem('email', userData.email);
            localStorage.setItem('phoneNumber', userData.phoneNumber);
            if (userData.email !== localStorage.getItem('email')) {
                logout();
            } else {
                setOpenDialog(false);
            }
        } catch (error) {
            console.error('Eroare la salvarea modificărilor:', error);
        }
    };

    return (
        <div className='title_specialization'>
            Setări de profil
            <div style={{ border: '2px solid #4c657f', padding: '20px', borderRadius: '10px', width: '700px', margin: 'auto' }}>
                <Grid container spacing={2}>
                    <Grid item xs={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', marginBottom: '100px', paddingRight: '20px' }}>
                        <div style={{ border: '1px solid #4c657f', padding: '20px', borderRadius: '10px', margin: 'auto' }}>
                            <Avatar
                                alt="Avatar"
                                src={userData.email ? null : "aa"}
                                sx={{ width: 150, height: 150 }} // Ajustează dimensiunile avatarului
                            >
                                {userData.email ? userData.email.charAt(0).toUpperCase() : ''}
                            </Avatar>
                            <Typography variant="body1" align="center" style={{ marginTop: '10px' }}>
                                {userData.lastName} {userData.firstName}
                            </Typography>
                        </div>
                    </Grid>

                    <Grid item xs={8}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Nume"
                            name="lastName"
                            value={userData.lastName}
                            onChange={handleChange}
                            style={{ marginBottom: '20px' }}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Prenume"
                            name="firstName"
                            value={userData.firstName}
                            onChange={handleChange}
                            style={{ marginBottom: '20px' }}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            style={{ marginBottom: '20px' }}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Telefon"
                            name="phoneNumber"
                            value={userData.phoneNumber}
                            onChange={handleChange}
                            style={{ marginBottom: '20px' }}
                        />
                    </Grid>
                </Grid>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-20px' }}>
                    <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                        Salvează modificările
                    </Button>
                </div>
                <AlertDialogSlide
                    open={openDialog}
                    handleClose={handleCloseDialog}
                    handleOk={handleOk}
                    title="Salvează modificările"
                    contentText="Ești sigur că vrei să salvezi modificările?"
                    disagreeLabel="Anulează"
                    agreeLabel="Salvează"
                />
            </div>
        </div>
    );
}

export default Profile;
