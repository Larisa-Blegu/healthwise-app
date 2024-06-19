import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Grid } from '@mui/material';
import { PieChart } from '@mui/x-charts';
import { BarChart } from '@mui/x-charts/BarChart'; // Adaugă importul pentru BarChart
import './Dashboard.css';
import { startOfYear, endOfYear, format } from 'date-fns';

function Dashboard({ user }) {
  const currentYearStart = format(startOfYear(new Date()), 'yyyy-MM-dd\'T\'HH:mm:ss');
  const currentYearEnd = format(endOfYear(new Date()), 'yyyy-MM-dd\'T\'HH:mm:ss');
  const token = localStorage.getItem('token');
  const appointmentsValueFormatter = (value) => `${value} programări`;

  const chartSetting = {
    width: 500,
    height: 300,
  };

  const [topCities, setTopCities] = useState([]);
  const [monthlyAppointments, setMonthlyAppointments] = useState([]);
  const [appointmentsDataset, setAppointmentsDataset] = useState([
    { month: 'Jan', appointments: 0 },
    { month: 'Feb', appointments: 0 },
    { month: 'Mar', appointments: 0 },
    { month: 'Apr', appointments: 0 },
    { month: 'Mai', appointments: 0 },
    { month: 'Iun', appointments: 0 },
    { month: 'Iul', appointments: 0 },
    { month: 'Aug', appointments: 0 },
    { month: 'Sept', appointments: 0 },
    { month: 'Oct', appointments: 0 },
    { month: 'Noi', appointments: 0 },
    { month: 'Dec', appointments: 0 },
  ]);

  const fetchTopCities = async () => {
    try {
      const response = await axios.get("http://localhost:8081/location/topCities");
      setTopCities(response.data);
    } catch (error) {
      console.error("Error fetching cities: ", error);
    }
  };

  const fetchMonthlyCount = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/appointment/countAppointment/${currentYearStart}/${currentYearEnd}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }}
      );
      setMonthlyAppointments(response.data);
    } catch (error) {
      console.error("Error fetching monthly counts: ", error);
    }
  };

  useEffect(() => {
    fetchTopCities();
    fetchMonthlyCount();
  }, []);

  useEffect(() => {
    if (monthlyAppointments.length > 0) {
      setAppointmentsDataset(prevDataset =>
        prevDataset.map((item, index) => ({
          ...item,
          appointments: monthlyAppointments[index] || 0,
        }))
      );
    }
  }, [monthlyAppointments]);

  return (
    <>
      <div className='title-dashboard'> Panou de control</div>
      <div className='welcome-text'>Bun venit în panoul de control al administratorului Healthwise!</div>
      <div className='info'>Această pagină este dedicată administratorului site-ului Healthwise, oferindu-i acces la instrumentele necesare pentru gestionarea eficientă a sistemului. </div>
      <Grid
        container
        direction="row"
        justifyContent="space-around"
        marginTop={10}
        marginLeft={2}
      >
        <Grid item xs={6}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: 'left', fontFamily: 'Roboto, sans-serif' }}
            marginLeft={1}
          >
            Locații principale Healthwise:
          </Typography>
          {topCities.length > 0 && (
            <PieChart
              series={[
                {
                  data: topCities.map((city, index) => ({
                    id: index,
                    value: city.hospitalsNumber,
                    label: city.city,
                  })),
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: 'gray',
                  },
                  innerRadius: 10,
                  outerRadius: 140,
                  paddingAngle: 1,
                  cornerRadius: 5,
                  startAngle: -90,
                  endAngle: 280,
                  cx: 140,
                  cy: 150,
                },
              ]}
              width={500}
              height={300}
              sx={{
                tspan: {
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '16px',
                },
              }}
            />
          )}
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: 'left', fontFamily: 'Roboto, sans-serif' }}
            marginLeft={1}
          >
            Numărul de programări realizate în fiecare lună:
          </Typography>
          <BarChart
            dataset={appointmentsDataset}
            xAxis={[
              {
                dataKey: 'month', 
                label: 'Lună', 
                scaleType: 'band', 
              }
            ]}
            yAxis={[{ scaleType: 'linear' }]} 
            series={[{ dataKey: 'appointments', label: 'Număr de programări', valueFormatter: appointmentsValueFormatter }]}
            colors={['#4c657f']} 

            {...chartSetting}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default Dashboard;
