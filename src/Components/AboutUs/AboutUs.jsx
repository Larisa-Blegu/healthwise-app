import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';

const AboutUs = () => {
  
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Despre noi
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Healthwise este o platformă inovatoare dedicată sănătății și bunăstării utilizatorilor noștri. Scopul nostru este de a facilita accesul la servicii medicale de calitate și de a simplifica procesul de programare la medici.
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
          Misiunea noastră
        </Typography>
        <Typography variant="body1" gutterBottom>
          Misiunea noastră este să transformăm modul în care pacienții interacționează cu profesioniștii din domeniul sănătății, oferind o experiență digitală rapidă, sigură și convenabilă.
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
          Echipa noastră
        </Typography>
        <Typography variant="body1" gutterBottom>
          Suntem un grup diversificat de profesioniști în domeniul tehnologiei și sănătății, uniți de dorința de a îmbunătăți accesul la servicii medicale prin intermediul tehnologiei.
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
          Serviciile noastre
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" component="h3" gutterBottom>
              Programări Online
            </Typography>
            <Typography variant="body1">
              Permitem utilizatorilor să-și programeze consultațiile medicale online, economisind timp și eliminând stresul apelurilor telefonice.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" component="h3" gutterBottom>
              Recenzii și Evaluări
            </Typography>
            <Typography variant="body1">
              Oferim o platformă unde pacienții pot lăsa recenzii și evaluări pentru medici și clinici, ajutându-i pe alții să ia decizii informate.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" component="h3" gutterBottom>
              Informații Medicale
            </Typography>
            <Typography variant="body1">
              Furnizăm articole și resurse pentru a ajuta utilizatorii să rămână informați cu privire la cele mai recente tendințe și descoperiri din domeniul sănătății.
            </Typography>
          </Grid>
        </Grid>

        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
          Valori
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Inovație:</strong> Utilizăm cele mai noi tehnologii pentru a oferi soluții inovatoare în domeniul sănătății.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Accesibilitate:</strong> Ne asigurăm că serviciile noastre sunt ușor de utilizat și accesibile tuturor.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Siguranță:</strong> Prioritizăm securitatea datelor utilizatorilor și confidențialitatea informațiilor medicale.
        </Typography>

        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
          Contact
        </Typography>
        <Typography variant="body1" gutterBottom>
          Pentru orice întrebări sau feedback, nu ezitați să ne contactați la <a href="mailto:contact@healthwise.com">contact@healthwise.com</a>. Suntem aici pentru a vă ajuta!
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutUs;
