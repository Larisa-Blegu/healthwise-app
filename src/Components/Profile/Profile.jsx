import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import AlertDialogSlide from '../Management/AlertDialogSlide'; // Asigură-te că calea este corectă

function Profile() {
    const [userData, setUserData] = useState({
        nume: localStorage.getItem('firstName') || '',
        prenume: localStorage.getItem('lastName') || '',
        email: localStorage.getItem('email') || '',
        telefon: localStorage.getItem('phoneNumber') || ''
    });

    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        // Verifică dacă există date despre utilizator în localStorage
        const savedUserData = {
            nume: localStorage.getItem('firstName') || '',
            prenume: localStorage.getItem('lastName') || '',
            email: localStorage.getItem('email') || '',
            telefon: localStorage.getItem('phoneNumber') || ''
        };
        // Dacă există, setează datele utilizatorului în starea componentei
        console.log(savedUserData);
        setUserData(savedUserData);
    }, []); // Efectul se va rula o singură dată, la încărcarea componentei

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

    const handleOk = () => {
        // Implementează funcționalitatea pentru a salva modificările aici
        console.log("Modificările au fost salvate:", userData);
        // Salvează datele utilizatorului în localStorage pentru a le putea accesa mai târziu
        localStorage.setItem('firstName', userData.nume);
        localStorage.setItem('lastName', userData.prenume);
        localStorage.setItem('email', userData.email);
        localStorage.setItem('phoneNumber', userData.telefon);
        setOpenDialog(false);
    };

    return (
        <div className='title_specialization'>
            Setari de profil
            <div style={{ border: '2px solid #4c657f', padding: '20px', borderRadius: '10px', width: '700px', margin: 'auto' }}>
                <Grid container spacing={2}>
                    <Grid item xs={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', marginBottom: '100px', paddingRight: '20px' }}>
                        <div>
                            <Avatar
                                alt="Avatar"
                                src={userData.email ? null : "aa"}
                                sx={{ width: 120, height: 120 }} // Ajustează dimensiunile avatarului
                            >
                                {userData.email ? userData.email.charAt(0).toUpperCase() : ''}
                            </Avatar>
                        </div>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Nume"
                            name="nume"
                            value={userData.nume}
                            onChange={handleChange}
                            style={{ marginBottom: '20px' }}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Prenume"
                            name="prenume"
                            value={userData.prenume}
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
                            name="telefon"
                            value={userData.telefon}
                            onChange={handleChange}
                            style={{ marginBottom: '20px' }}
                        />
                    </Grid>
                </Grid>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
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
