import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  Typography,
  Backdrop,
  CircularProgress,
  Box
} from "@mui/material";
import TextField from '@mui/material/TextField';
import ManagementGrid from '../ManagementGrid';
import AddRowAccordion from '../AddRowAccordion';
import { addRow } from '../Api';

function ManageReview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const token = localStorage.getItem('token');

  const fields = [
    {
      label: 'Nota',
      name: 'grade',
      type: 'number',
    },
    {
      label: 'Comentariu',
      name: 'text',
      type: 'text',
    },
    {
      label: 'Nume Doctor',
      name: 'doctorName',
      type: 'select',
      defaultValue: doctors.length > 0 ? doctors[0].fullName : '',
      options: doctors.map(doctor => doctor.fullName)
    }
  ]

  const fetchReviews = async () => {
    try {
      const reviewResponse = await axios.get('http://localhost:8081/review', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const reviews = reviewResponse.data.map(review => ({
        id: review.id,
        grade: review.grade,
        text: review.text,
        doctor: review.doctor ? review.doctor.fullName : ''
      }))
      setReviews(reviews);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews: ', error);
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
    fetchReviews();
    fetchDoctors().then(data => {
      setDoctors(data);
      setLoading(false);
    });
  }, []);

  const handleUpdateReview = async (updatedReview) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.put(`http://localhost:8081/review`, updatedReview, config);
      const updatedReviews = reviews.map(review => review.id === updatedReview.id ? updatedReview : review);
      setReviews(updatedReviews);
    } catch (error) {
      console.error('Error updating review: ', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:8081/review/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedReviews = reviews.filter(review => review.id !== reviewId);
      setReviews(updatedReviews);
    } catch (error) {
      console.error('Error deleting review: ', error);
    }
  };

  const handleSaveNewReview = async (formData) => {
    try {
      const response = await axios.get(`http://localhost:8081/doctor/getDoctor/${formData.doctorName}`);

      const doctor = response.data;

      const updatedData = {
        grade: formData.grade,
        text: formData.text,
        doctor: doctor[0],  
      };

      const success = await addRow('http://localhost:8081/review', updatedData);
      if (success) {
        fetchReviews();
      } else {
        console.error('Error adding new review');
      }
    } catch (error) {
      console.error('Error adding new review: ', error);
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
            Modifica Review-uri
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
              Pagina "Modifică Review-uri" oferă funcționalități avansate pentru gestionarea eficientă a feedback-ului utilizatorilor, permițând administratorilor să monitorizeze, să editeze și să șteargă recenziile, asigurând astfel o experiență de utilizare optimă a platformei.            </Typography>
          </Box>
        </Grid>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <AddRowAccordion title={'Adauga Review'} fields={fields} onSave={handleSaveNewReview} />
        <Grid container direction="row" justifyContent="space-around" marginLeft={2} marginTop={4} >
          <Box marginBottom={5}>
            <ManagementGrid
              initialRows={reviews}
              columns={[
                { field: 'id', headerName: 'ID', width: 100, editable: false, headerClassName: 'super-app-theme--header' },
                { field: 'text', headerName: 'Comentariu', width: 250, editable: true, headerClassName: 'super-app-theme--header' },
                { field: 'grade', headerName: 'Nota', type: 'number', width: 100, editable: true, headerClassName: 'super-app-theme--header' },
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
              url="http://localhost:8081/review"
              updateRow={handleUpdateReview}
              handleDelete={handleDeleteReview}
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default ManageReview;
