import React from "react";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import {green} from '@mui/material/colors';
import { Link, useNavigate } from 'react-router-dom'; // importă useNavigate
import {Button, Card} from '@mui/material';

export const PaymentSuccess = () => {

    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>
            <div style={{ width: '400px', height: '400px' }}>
                <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '8px', padding: '20px' }}>
                    <TaskAltIcon sx={{fontSize:"5rem", color:green[500]}}/>
                    <h1 style={{ paddingTop: '20px', fontSize: '1.5rem', fontWeight: 'bold' }}>Payment Success</h1>
                    <p>Multumim pentru alegerea servicilor Healthwise!</p>
                    <p style={{ paddingTop: '10px', color: '#ccc', fontSize: '1rem', textAlign: 'center' }}>Sa aveti o zi buna!</p>
                    <Button onClick={()=>navigate("/")} variant="contained" style={{ marginTop: '20px' }}>Pagina Principala</Button>
                </Card>
            </div>
        </div>
    )
}
