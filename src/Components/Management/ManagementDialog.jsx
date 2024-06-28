import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import AlertDialogSlide from './AlertDialogSlide'; 


export default function ManagementDialog({ title, tabelConnection, operation, initialDoctors, initialConnections }) {

    const [open, setOpen] = React.useState(false);
    const [doctor, setDoctor] = React.useState('');
    const [doctors, setDoctors] = React.useState([...initialDoctors].sort((a, b) => a.fullName.localeCompare(b.fullName))); 
    const [connection, setConnection] = React.useState('');
    const [connections, setConnections] = React.useState([...initialConnections].sort((a, b) => (a.name || a.hospital).localeCompare(b.name || b.hospital))); 
    const [openErrorDialog, setOpenErrorDialog] = React.useState(false); 
    const [errorDialogContent, setErrorDialogContent] = React.useState(''); 

    const handleChange = (event) => {
        setDoctor(event.target.value || '');
        console.log('Doctor selected:', event.target.value);

        if (operation === "Delete") {
            axios.get(`http://localhost:8081/doctor/${event.target.value}`)
                .then(response => {
                    console.log('Success:', response);
                    if (tabelConnection === 'Specializari') {
                        setConnections(response.data.specializations);
                    } else {
                        setConnections(response.data.locations);

                    }
                })
                .catch(error => {
                    console.error('Error:', error); 
                    setOpen(false);
                    setDoctor('');
                    setConnection('');
                    setOpenErrorDialog(true); 
                    setErrorDialogContent('There was an error fetching data.'); 
                });
        }
    };

    const handleChangeConnection = (event) => {
        setConnection(event.target.value || '');
        console.log('Connection selected:', event.target.value);
    };


    const handleClickOpen = () => {
        setOpen(true);
        console.log(connections);

    };

    const handleClose = (event, reason) => {
        if (reason !== 'backdropClick') {
            setOpen(false);
            setDoctor('');
            setConnection('');
        }
    };

    const handleSave = () => {

        if (operation === "Add") {

            if (tabelConnection === 'Specializari') {

                axios.get(`http://localhost:8081/specialization/${connection}`)
                    .then(response => {
                        console.log('Success:', response);
                        axios.post(`http://localhost:8081/doctor/specialization/${doctor}`, response.data)
                            .then(response => {
                                console.log('Success:', response);
                                setOpen(false);
                                setDoctor('');
                                setConnection('');
                            })
                            .catch(error => {
                                console.error('Error:', error); 
                                setOpen(false);
                                setDoctor('');
                                setConnection('');
                                setOpenErrorDialog(true); 
                                setErrorDialogContent('There was an error adding data.'); 
                            });
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        setOpen(false);
                        setDoctor('');
                        setConnection('');
                        setOpenErrorDialog(true);
                        setErrorDialogContent('There was an error fetching data.');
                    });

            } else if (tabelConnection === 'Locatii') {
                axios.get(`http://localhost:8081/location/${connection}`)
                    .then(response => {
                        console.log('Success:', response);
                        axios.post(`http://localhost:8081/doctor/location/${doctor}`, response.data)
                            .then(response => {
                                console.log('Success:', response);
                                setOpen(false);
                                setDoctor('');
                                setConnection('');
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                setOpen(false);
                                setDoctor('');
                                setConnection('');
                                setOpenErrorDialog(true);
                                setErrorDialogContent('There was an error adding data.');
                            });
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        setOpen(false);
                        setDoctor('');
                        setConnection('');
                        setOpenErrorDialog(true);
                        setErrorDialogContent('There was an error fetching data.');
                    });
            }
        } else {
            if (tabelConnection === 'Specializari') {

                axios.get(`http://localhost:8081/specialization/${connection}`)
                    .then(response => {
                        const specializationId = response.data.id; 
                        axios.delete(`http://localhost:8081/doctor/deleteSpecialization/${doctor}`, { data: { id: specializationId } })
                            .then(response => {
                                console.log('Success:', response);
                                setOpen(false);
                                setDoctor('');
                                setConnection('');

                            })
                            .catch(error => {
                                console.error('Error:', error); 
                                setOpen(false);
                                setDoctor('');
                                setConnection('');
                                setOpenErrorDialog(true);
                                setErrorDialogContent('There was an error deleting data.');
                            });
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        setOpen(false);
                        setDoctor('');
                        setConnection('');
                        setOpenErrorDialog(true);
                        setErrorDialogContent('There was an error fetching data.');
                    });
            } else if (tabelConnection === 'Locatii') {
                axios.get(`http://localhost:8081/location/${connection}`)
                    .then(response => {
                        const locationId = response.data.id; 
                        axios.delete(`http://localhost:8081/doctor/deleteLocation/${doctor}`, { data: { id: locationId } })
                            .then(response => {
                                console.log('Success:', response);
                                setDoctor('');
                                setConnection('');
                                setOpen(false);

                            })
                            .catch(error => {
                                console.error('Error:', error);
                                setOpen(false);
                                setDoctor('');
                                setConnection('');
                                setOpenErrorDialog(true);
                                setErrorDialogContent('There was an error deleting data.');
                            });
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        setOpen(false);
                        setDoctor('');
                        setConnection('');
                        setOpenErrorDialog(true);
                        setErrorDialogContent('There was an error fetching data.');
                    });
            }
        }
    };

    return (
        <div>
            <Button onClick={handleClickOpen}>{title}</Button>
            <Dialog disableEscapeKeyDown open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { maxHeight: '50vh' } }}>
                <DialogTitle>Completeaza datele formularului</DialogTitle>
                <DialogContent dividers>
                <Box sx={{ marginTop: 0 }}>
                        <FormControl sx={{ m: 1, minWidth: 200 }}>
                            <InputLabel id="demo-dialog-select-label">Doctor</InputLabel>
                            <Select
                                labelId="demo-dialog-select-label"
                                id="demo-dialog-select"
                                value={doctor}
                                onChange={handleChange}
                                input={<OutlinedInput label="Doctor" />}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: '200px', 
                                            overflowY: 'auto', 
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {doctors.map((doctor) => (
                                    <MenuItem key={doctor.id} value={doctor.id}>
                                        {doctor.fullName}
                                    </MenuItem>
                                ))}
                            </Select>

                        </FormControl>

                        <FormControl sx={{ m: 1, minWidth: 200 }}>
                            <InputLabel id="demo-dialog-select-label">{tabelConnection}</InputLabel>
                            <Select
                                labelId="demo-dialog-select-label"
                                id="demo-dialog-select"
                                value={connection}
                                onChange={handleChangeConnection}
                                input={<OutlinedInput label={tabelConnection} />}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: '200px', 
                                            overflowY: 'auto', 
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {connections.map((connection) => (
                                    <MenuItem key={connection.id} value={connection.id}>
                                        {connection.name ? connection.name : connection.hospital}
                                    </MenuItem>
                                ))}
                            </Select>

                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Ok</Button>
                </DialogActions>
            </Dialog>
            <AlertDialogSlide 
                open={openErrorDialog}
                handleClose={() => setOpenErrorDialog(false)}
                title="Error"
                contentText={errorDialogContent}
                disagreeLabel="Close"
            />
        </div>
    );
}