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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ManageProcedure() {
  const [procedures, setProcedures] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fields = [
    {
      label: 'Nume Procedura',
      name: 'name',
      type: 'text',
    },
    {
      label: 'Informatii categorie',
      name: 'category',
      type: 'text',
    },
    {
      label: 'Nume Specializare',
      name: 'specializationName',
      type: 'select',
      defaultValue: specializations.length > 0 ? specializations[0].name : '',
      options: specializations.map(specialization => specialization.name)
    }
  ]

  const fetchProcedures = async () => {
    try {
      const procedureResponse = await axios.get('http://localhost:8081/medicalProcedure/allProcedures', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const procedures = procedureResponse.data.map(procedure => ({
        id: procedure.id,
        category: procedure.category,
        name: procedure.name,
        specialization: procedure.specialization ? procedure.specialization.name : ''
      }))

      setProcedures(procedures);
      console.log(procedureResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching procedures: ', error);
      setLoading(false);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const response = await axios.get('http://localhost:8081/specialization/allSpecializations', {
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
    fetchProcedures();
    fetchSpecializations().then(data => {
      setSpecializations(data);
      setLoading(false);
    });
  }, []);

  const handleUpdateProcedure = async (updatedProcedure) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.put(`http://localhost:8081/medicalProcedure`, updatedProcedure, config);
      const updatedProcedures = procedures.map(procedure => procedure.id === updatedProcedure.id ? updatedProcedure : procedure);
      setProcedures(updatedProcedures);
    } catch (error) {
      console.error('Error updating procedure: ', error);
    }
  };

  const handleDeleteProcedure = async (procedureId) => {
    try {
      await axios.delete(`http://localhost:8081/medicalProcedure/${procedureId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedProcedures = procedures.filter(procedure => procedure.id !== procedureId);
      setProcedures(updatedProcedures);
    } catch (error) {
      console.error('Error deleting procedure: ', error);
    }
  };

  const handleSaveNewProcedure = async (formData) => {
    try {
      const response = await axios.get(`http://localhost:8081/specialization/getSpecialization/${formData.specializationName}`);

      const specialization = response.data;

      const updatedData = {
        category: formData.category,
        name: formData.name,
        specialization: specialization[0],  
      };

      await addRow('http://localhost:8081/medicalProcedure', updatedData)
      fetchProcedures();
    } catch (error) {
      console.error('Error adding new procedure: ', error);
    }
  };

  return (
    <div>
      <ToastContainer />
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
            Modifica Proceduri Medicale
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
              Pagina "Modifica Proceduri Medicale" oferă administratorilor site-ului un instrument puternic pentru gestionarea eficientă a procedurilor medicale în cadrul sistemului, permițându-le să mențină și să actualizeze în mod corespunzător informațiile despre procedurile disponibile.            </Typography>
          </Box>
        </Grid>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <AddRowAccordion title={'Adauga Procedura Medicala'} fields={fields} onSave={handleSaveNewProcedure} />
        <Grid container direction="row" justifyContent="space-around" marginLeft={2} marginTop={4} >
          <Box marginBottom={5}>
            <ManagementGrid
              initialRows={procedures}
              columns={[
                { field: 'id', headerName: 'ID', width: 100, editable: false, headerClassName: 'super-app-theme--header' },
                { field: 'name', headerName: 'Nume Procedura', width: 200, editable: true, headerClassName: 'super-app-theme--header' },
                { field: 'category', headerName: 'Informatii categorie', width: 300, editable: true, headerClassName: 'super-app-theme--header' },
                {
                  field: 'specialization',
                  headerName: 'Specializare',
                  width: 200,
                  type: 'singleSelect',
                  editable:true,
                  valueOptions: specializations,
                  headerClassName: 'super-app-theme--header',
                  getOptionValue: (value) => value.name,
                  getOptionLabel: (value) => value.name
                }
              ]}
              url="http://localhost:8081/medicalProcedure"
              updateRow={handleUpdateProcedure}
              handleDelete={handleDeleteProcedure}
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default ManageProcedure;
