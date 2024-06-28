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
import { styled } from '@mui/material/styles';
import TableHead from '@mui/material/TableHead';
import axios from 'axios';
import TablePaginationActions from './TablePaginationActions'; 
import './YourAppointments.css'; 
import { Link, useNavigate } from 'react-router-dom'; 

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 'none',
  padding: '12px'
}));

function YourAppointments() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate(); 
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const token = localStorage.getItem('token'); 

  const toggleDrawer = (open) => () => {
    setOpenDrawer(open);
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    fetchAppointments(userId);
  }, []);

  const fetchAppointments = (userId) => {
    fetch(`http://localhost:8081/appointment/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    })
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

  const handlePaymentClick = (appointment) => {
    console.log(`Payment button clicked for appointment with ID: ${appointment}`);
  };

  const handleReviewClick = (appointmentId) => {
    navigate(`/review/${appointmentId}`);
  };

  const isReviewButtonVisible = (status, reviewStatus, date) => {
    const currentDate = new Date();
    return status === 'APPROVED' && reviewStatus === 'FALSE';
    //  && new Date(date) < currentDate
  };

  async function makePayment(appointment) {
    console.log(appointment.doctor.id);
    console.log(token);
    console.log(appointment.id);
    try {
      const response = await axios.post(`http://localhost:8081/appointment/payment/${appointment.id}`, {}, {
        headers: {
            Authorization: `Bearer ${token}` 
        }
    });
  
      if (response.status === 200) {
        console.log(`Payment button clicked for appointment with ID: ${appointment.id}`);
        if (response.data.payment_url) {
          window.location.href = response.data.payment_url;
        }
        console.log(response.data.payment_url);
  
        
      } else {
        console.error('Eroare la trimiterea cererii de programare:', response.statusText);
      }
    } catch (error) {
      console.error('Eroare la trimiterea cererii de programare:', error);
    }
  }

  return (
    <div>
      <div className="title_specialization">Programarile tale</div>
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

        <TableContainer component={Paper} className="appointments-table-container">
          <Table className="appointments-table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Data</StyledTableCell>
                <StyledTableCell>Tip Programare</StyledTableCell>
                <StyledTableCell>Doctor</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Plata</StyledTableCell>
                <StyledTableCell>Review</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((appointment) => (
                <TableRow key={appointment.id}>
                  <StyledTableCell>{appointment.date}</StyledTableCell>
                  <StyledTableCell>{appointment.type}</StyledTableCell>
                  <StyledTableCell>{appointment.doctor.fullName}</StyledTableCell>
                  <StyledTableCell>{appointment.status}</StyledTableCell>

                  {!paymentCompleted && (
                    <StyledTableCell>
                      {appointment.status === 'WAITING_FOR_PAYMENT' && (
                        <Button onClick={() => makePayment(appointment)}>Plata</Button>
                      )}
                    </StyledTableCell>
                  )}

                  <StyledTableCell>
                    {isReviewButtonVisible(appointment.status, appointment.reviewStatus, appointment.date) && (
                      <Button onClick={() => handleReviewClick(appointment.id)}>Review</Button>
                    )}
                  </StyledTableCell>
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
