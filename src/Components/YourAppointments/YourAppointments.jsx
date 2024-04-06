import React, { useState, useEffect } from 'react';
import person_icon from '../Assets/person.png';
import { Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InfoIcon from '@mui/icons-material/Info';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { styled } from '@mui/material/styles';
import TableHead from '@mui/material/TableHead';
import TablePaginationActions from './TablePaginationActions'; // Asigură-te că acesta este calea corectă către fișierul care conține componenta TablePaginationActions


function YourAppointments() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const toggleDrawer = (open) => () => {
    setOpenDrawer(open);
  };

  useEffect(() => {
    // Fetch appointments for the current user from the API
    const userId = localStorage.getItem('userId');
    fetchAppointments(userId);
  }, []);

  const fetchAppointments = (userId) => {
    fetch(`http://localhost:8081/appointment/user/${userId}`)
      .then(response => response.json())
      .then(data => {
        setAppointments(data);
      })
      .catch(error => console.error('Error fetching appointments:', error));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePaymentClick = (appointmentId) => {
    // Implementați logica pentru acțiunea de plată aici, pe baza appointmentId
    console.log(`Payment button clicked for appointment with ID: ${appointmentId}`);
  };

  const handleReviewClick = (appointmentId) => {
    // Implementați logica pentru acțiunea de review aici, pe baza appointmentId
    console.log(`Review button clicked for appointment with ID: ${appointmentId}`);
  };

  const isReviewButtonVisible = (status, date) => {
    const currentDate = new Date();
    return status === 'APPROVED' && new Date(date) < currentDate;
  };
  return (
    <div>
      {/* Navigation */}
      <nav>
        <ul>
          <li><a href="/">Pagina principală</a></li>
          <li><a href="/doctor">Medici</a></li>
          <li><a href="/specialization">Specializări</a></li>
          <li><a href="/location">Locații</a></li>
          <li><a href="/appointment">Programări</a></li>
          <div className="right-container">
            <li><a href="/login">Login</a></li>
            <li><img src={person_icon} alt="User" className="user-icon" /></li>
          </div>
        </ul>
      </nav>

      {/* Drawer */}
      <div className='drawer'>
        <Button onClick={toggleDrawer(true)}>Deschide meniu</Button>
        <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer(false)}>
          <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
              {[
                { text: 'Realizează programare', icon: <EventIcon />, link: '/appointment' },
                { text: 'Prograamrile tale', icon: <ListAltIcon />, link: '/yourAppointments' },
                { text: 'Facturi', icon: <ReceiptIcon />, link: '/bills' },
                { text: 'Informatii Utile', icon: <InfoIcon />, link: '/usefulInfo' }
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

      {/* Content */}
      <div className="content">
        <h1>Your Appointments</h1>
        {/* Appointments Table */}
        <TableContainer component={Paper}>
          <Table>
          <TableHead>
          <TableRow>
            <TableCell>Data</TableCell>
            <TableCell>Tip Programare</TableCell>
            <TableCell>Doctor</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Plata</TableCell>
            <TableCell>Review</TableCell>

          </TableRow>
        </TableHead>

            <TableBody>
              {appointments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.type}</TableCell>
                  <TableCell>{appointment.doctor.fullName}</TableCell>
                  <TableCell>{appointment.status}</TableCell>
                  <TableCell>
                    {appointment.status === 'WAITING_FOR_PAYMENT' && (
                      <Button onClick={() => handlePaymentClick(appointment.id)}>Plata</Button>
                    )}
                  </TableCell> {/* Payment column */}
                  <TableCell>
                    {isReviewButtonVisible(appointment.status, appointment.date) && (
                      <Button onClick={() => handleReviewClick(appointment.id)}>Review</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={6}
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

export default YourAppointments;
