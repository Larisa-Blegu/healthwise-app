import React from 'react';
import { Typography, Grid } from '@mui/material';
import { PieChart } from '@mui/x-charts';
import { BarChart } from '@mui/x-charts/BarChart'; // Adaugă importul pentru BarChart
import './Dashboard.css';

function Dashboard({ user }) {
  // Dataset-ul pentru BarChart cu numărul de programări realizate în fiecare lună
  const appointmentsDataset = [
    { month: 'Jan', appointments: 20 },
    { month: 'Feb', appointments: 25 },
    { month: 'Mar', appointments: 30 },
    { month: 'Apr', appointments: 100 },
    { month: 'Mai', appointments: 10 },
    { month: 'Iun', appointments: 30 },
    { month: 'Iul', appointments: 70 },
    { month: 'Aug', appointments: 30 },
    { month: 'Sept', appointments: 30 },
    { month: 'Oct', appointments: 30 },
    { month: 'Noiemb', appointments: 30 },
    { month: 'Dec', appointments: 30 },

    // Continuă cu datele pentru celelalte luni ale anului
  ];

  // Formatter pentru valorile axei Y (numărul de programări)
  const appointmentsValueFormatter = (value) => `${value} programări`;

  // Setările pentru graficul BarChart
  const chartSetting = {
    width: 500,
    height: 300,
  };

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
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 10, label: 'Category A' },
                  { id: 1, value: 15, label: 'Category B' },
                  { id: 2, value: 20, label: 'Category C' },
                  { id: 3, value: 5, label: 'Category D' },
                ],
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
                dataKey: 'month', // specifică cheia de date pentru axa x
                label: 'Lună', // specifică eticheta axei x
                scaleType: 'band', // specifică tipul de scală pentru axa x
              }
            ]}
            yAxis={[{ scaleType: 'linear' }]} // Specifice tipul de scalare și pentru axa y
            series={[{ dataKey: 'appointments', label: 'Număr de programări', valueFormatter: appointmentsValueFormatter }]}
            colors={['#4c657f']} // Set the color of the bars

            {...chartSetting}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default Dashboard;
