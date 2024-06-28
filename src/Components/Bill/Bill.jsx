import React, { useState, useEffect } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Button } from '@mui/material';
import axios from 'axios';
import TablePaginationActions from './TablePaginationActions';
import TablePagination from '@mui/material/TablePagination';
import './Bill.css';
import ReactPDF, { PDFDownloadLink, Document, Page, Text } from '@react-pdf/renderer'; // Importați PDFDownloadLink și alte componente necesare
import InvoiceComponent from './InvoiceComponent';
import { saveAs } from 'file-saver';
import { renderToStream } from '@react-pdf/renderer';
import ReactDOMServer from 'react-dom/server';
import { Link, useNavigate } from 'react-router-dom'; // importă useNavigate
import { Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InfoIcon from '@mui/icons-material/Info'

function Bill() {
    const [appointments, setAppointments] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Obține tokenul din local storage
    const [openDrawer, setOpenDrawer] = useState(false);

    const toggleDrawer = (open) => () => {
        setOpenDrawer(open);
      };
    
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        fetchAppointments(userId);
    }, []);

    const fetchAppointments = (userId) => {
        axios.get(`http://localhost:8081/appointment/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}` // Adaugă tokenul în header-ul cererii
            }
        })
            .then(async (response) => {
                const appointmentsData = response.data.filter(appointment => appointment.status === 'APPROVED');
                const appointmentsWithPrice = await Promise.all(appointmentsData.map(async (appointment) => {
                    const doctorId = appointment.doctor.id;
                    const procedureId = appointment.medicalProcedure.id;
                    try {
                        const priceResponse = await axios.get(`http://localhost:8081/price/doctorAndProcedure/${doctorId}/${procedureId}`, {
                            headers: {
                                Authorization: `Bearer ${token}` // Adaugă tokenul în header-ul cererii
                            }
                        });
                        const price = priceResponse.data[0].price;
                        return { ...appointment, price: price };
                    } catch (error) {
                        console.error('Error fetching price:', error);
                        return { ...appointment, price: 'N/A' };
                    }
                }));
                setAppointments(appointmentsWithPrice);
            })
            .catch(error => {
                console.error('Error fetching appointments:', error);
            });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDownload = async (appointment) => {
        navigate("/invoice");
    }


    return (
        <div>
            <div className="title_specialization">Facturile tale</div>

            <div className='drawer'>
                <Button onClick={toggleDrawer(true)}>Deschide meniu</Button>
                <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer(false)}>
                    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
                        <List>
                            {[
                                { text: 'Realizează programare', icon: <EventIcon />, link: '/appointment' },
                                { text: 'Programarile tale', icon: <ListAltIcon />, link: '/yourAppointments' },
                                { text: 'Facturi', icon: <ReceiptIcon />, link: '/bill' },
                            ].map((item, index) => (
                                <ListItem key={item.text} disablePadding>
                                    <ListItemButton component="a" href={item.link}>
                                        <ListItemIcon>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.text} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Drawer>
            </div>


            <div className="content">
                <TableContainer component={Paper} className="bill-table-container">
                    <Table className="appointments-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Data</TableCell>
                                <TableCell>Doctor</TableCell>
                                <TableCell>Plată</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? appointments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : appointments
                            ).map((appointment) => (
                                <TableRow key={appointment.id}>
                                    <TableCell>{appointment.date}</TableCell>
                                    <TableCell>{appointment.doctor.fullName}</TableCell>
                                    <TableCell>
                                        <div className="bill-button-container">
                                            <div className="price-text">{appointment.price} RON </div>

                                            <Button onClick={() => handleDownload(appointment)} className="bill-button" variant="outlined">Descarcă factură</Button>
                                            {/* </div> </PDFDownloadLink> */}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={3}
                                    count={appointments.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}

export default Bill;
