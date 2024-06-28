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


function ManageUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false); 
  const token = localStorage.getItem('token');
  const roles = ['CLIENT', 'MEDIC', 'ADMIN'];

  const columns = [
    { field: 'id', headerName: 'ID', width: 100, editable: false, headerClassName: 'super-app-theme--header' },
    { field: 'lastName', headerName: 'Nume', width: 150, editable: true, headerClassName: 'super-app-theme--header' },
    { field: 'firstName', headerName: 'Prenume', width: 150, editable: true, headerClassName: 'super-app-theme--header' },
    { field: 'email', headerName: 'Email', width: 200, editable: true, headerClassName: 'super-app-theme--header' },
    { field: 'phoneNumber', headerName: 'Numar de telefon', width: 150, editable: true, headerClassName: 'super-app-theme--header' },
    {
      field: 'role',
      headerName: 'Rol',
      width: 150,
      editable: true,
      type: "singleSelect",
      valueOptions: roles,
      headerClassName: 'super-app-theme--header'
    }
  ];

  const fields = [
    {
      label: 'Nume',
      name: 'lastName',
      type: 'text',
    },
    {
      label: 'Prenume',
      name: 'firstName',
      type: 'text',
    },
    {
      label: 'Email',
      name: 'email',
      type: 'text',
      
    },
    {
      label: 'Parola',
      name: 'password',
      type: 'password',
    },
    {
      label: 'Numar de telefon',
      name: 'phoneNumber',
      type: 'text',
    },
    {
      label: 'Rol',
      name: 'role',
      type: 'select',
      defaultValue: 'CLIENT',
      options: roles
    }
  ]

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8081/user/allUsers', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users: ', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUser = async (updatedUser) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      console.log(updatedUser);
      await axios.put(`http://localhost:8081/user`, updatedUser, config);
      const updatedUsers = users.map(user => user.id === updatedUser.id ? updatedUser : user);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error updating user: ', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8081/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting user: ', error);
    }
  };

  const handleSaveNewUser = async (formData) => {
    try {
      const success = await axios.post('http://localhost:8081/user/register', formData);
      if (success) {
        fetchUsers();
      } else {
        console.error('Error adding new user');
      }
    } catch (error) {
      console.error('Error adding new user: ', error);
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
            Modifica Users
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
              Pagina de administrare a utilizatorilor oferă administratorilor posibilitatea de a gestiona eficient utilizatorii în sistem, inclusiv funcționalități precum modificarea privilegiilor și rolurilor, ștergerea și căutarea utilizatorilor, facilitând astfel controlul și administrarea completă a utilizatorilor.
            </Typography>
          </Box>
        </Grid>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <AddRowAccordion title={'Adauga user'} fields={fields} onSave={handleSaveNewUser} />
        <Grid container direction="row" justifyContent="space-around" marginLeft={2} marginTop={4} >
          <Box marginBottom={5}>
            <ManagementGrid
              initialRows={users}
              columns={columns}
              url="http://localhost:8081/user"
              updateRow={handleUpdateUser}
              handleDelete={handleDeleteUser}
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default ManageUser;
