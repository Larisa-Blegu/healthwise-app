import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

export default function TodayAppointmentsGrid({
    initialRows,
    columns,
}) {
    const [rows, setRows] = React.useState(initialRows);

    React.useEffect(() => {
        setRows(initialRows);
    }, [initialRows]);

    return (
        <div style={{ height: 400, width: '100%' }}>
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
                    columns={columns}
                    rows={rows}
                />
            </Box>
        </div>
    );
}
