import * as React from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Box } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AlertDialogSlide from './AlertDialogSlide';
import { deleteRow, updateRow } from './Api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function formatData(rows, keys) {
  return rows.map(row => {
    const formattedRow = {};
    keys.forEach(key => {
      if (row.hasOwnProperty(key)) {
        formattedRow[key] = row[key];
      }
    });
    return formattedRow;
  });
}

export default function ManagementGrid({
  initialRows,
  columns,
  url,
  handleDelete,
}) {
  const [rows, setRows] = React.useState(initialRows);
  const [keys, setKeys] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);
  const [dialogType, setDialogType] = React.useState(null);

  const actionsColumn = {
    field: 'actions',
    type: 'actions',
    width: 80,
    headerClassName: 'super-app-theme--header',
    getActions: (params) => [
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Delete"
        onClick={deleteUser(params.id)}
      />,
      <GridActionsCellItem
        icon={<SaveIcon />}
        label="Save Changes"
        onClick={saveChanges(params.id)}
      />,
    ],
  };

  const updatedColumns = [...columns, actionsColumn];
  const deleteUser = React.useCallback(
    (id) => () => {
      setSelectedId(id);
      setDialogType('delete');
      setOpenDialog(true);
    },
    []
  );
  
  const saveChanges = React.useCallback(
    (id) => () => {
      setSelectedId(id);
      setDialogType('save');
      setOpenDialog(true);
    },
    []
  );

  React.useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

  const handleConfirm = async () => {
    if (dialogType === 'delete') {
      if (openDialog) {
        setOpenDialog(false);
        const deleteResult = await deleteRow(url + `/${selectedId}`);
        if (deleteResult) {
          toast.success('The row was deleted successfully!');
          setRows((prevRows) => prevRows.filter((row) => row.id !== selectedId));
        } else {
          toast.error('There was an error deleting the row.');
        }
      }
    } else if (dialogType === 'save') {
      if (openDialog) {
        setOpenDialog(false);
        var data;
        if (keys.length) {
          const formattedData = formatData(rows, keys);
          data = formattedData.filter((row) => row.id === selectedId)[0];
        } else {
          data = rows.filter((row) => row.id === selectedId)[0];
        }
  
        console.log(data);
        const saveResult = await updateRow(url, data);
  
        if (saveResult) {
          toast.success('The row was updated successfully!');
        } else {
          toast.error('There was an error updating the row.');
        }
      }
    }
    setDialogType(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleRowUpdate = (updatedRow) => {
    console.log(updatedRow);
    const { id, ...updatedData } = updatedRow;
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === updatedRow.id ? { ...row, ...updatedData } : row
      )
    );
    return updatedRow;
  };

  const handleRowUpdateError = (error) => {
    console.error('Error updating row:', error);
    toast.error('There was an error updating the row!');
  };

  return (
    <div style={{ height: 200, width: '100%' }}>
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
          autosizeOnMount
          editMode="row"
          columns={updatedColumns}
          rows={rows}
          processRowUpdate={(updatedRow, originalRow) =>
            handleRowUpdate(updatedRow)
          }
          onProcessRowUpdateError={handleRowUpdateError}
        />
      </Box>
      <AlertDialogSlide
        open={openDialog}
        handleClose={handleCloseDialog}
        handleOk={handleConfirm}
        title={dialogType === 'delete' ? 'Confirm Deletion' : 'Confirm Save'}
        contentText={
          dialogType === 'delete'
            ? 'This action is not reversible. Are you sure you want to delete this row?'
            : 'Do you want to save the changes you made?'
        }
        disagreeLabel="Cancel"
        agreeLabel={dialogType === 'delete' ? 'Delete' : 'Save'}
      />
    </div>
  );
}