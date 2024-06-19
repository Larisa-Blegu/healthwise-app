import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DoctorManagementGrid({
    initialRows,
    columns,
    url,
}) {
    const [rows, setRows] = React.useState(initialRows);

    React.useEffect(() => {
        setRows(initialRows);
    }, [initialRows]);

    const handleStatusChange = async (id, status) => {
        try {
            const response = await axios.post(`${url}/status/${id}/${status}`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {
                toast.success(`Statusul a fost actualizat la ${status} cu succes!`);
                // Actualizăm și starea locală a rândului
                setRows(prevRows =>
                    prevRows.map(row =>
                        row.id === id ? { ...row, status } : row
                    )
                );
            } else {
                toast.error('A apărut o eroare la actualizarea statusului.');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('A apărut o eroare la actualizarea statusului.');
        }
    };

    return (
        <div style={{ height: 400, width: '100%' }}>
            <ToastContainer />
            <Box
                sx={{
                    '& .super-app-theme--header': {
                        backgroundColor: '#4c657f',
                        color: '#FFFFFF',
                    },
                }}
            >
                <DataGrid
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 5, page: 0 },
                        },
                    }}
                    columns={[
                        ...columns,
                        {
                            field: 'actions',
                            headerName: 'Actions',
                            width: 200,
                            headerClassName: 'super-app-theme--header',
                            renderCell: ({ row }) => (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {row.status === 'PENDING' ? (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() => handleStatusChange(row.id, 'APPROVED')}
                                            >
                                                APPROVE
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleStatusChange(row.id, 'REJECTED')}
                                            >
                                                REJECT
                                            </Button>
                                        </>
                                    ) : (
                                        <Typography>{row.status}</Typography>
                                    )}
                                </div>
                            ),
                        },
                    ]}
                    rows={rows}
                />
            </Box>
        </div>
    );
}
