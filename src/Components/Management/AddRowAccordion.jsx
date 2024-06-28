import * as React from 'react';
import { Select, TextField, MenuItem } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import AlertDialogSlide from './AlertDialogSlide'; 
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FormInput } from 'semantic-ui-react';
import axios from 'axios';

export default function AddRowAccordion({ title, fields, onSave }) {
  const [formData, setFormData] = React.useState({});
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openErrorDialog, setOpenErrorDialog] = React.useState(false);
  const [accordionOpen, setAccordionOpen] = React.useState(false); 
  const [showPassword, setShowPassword] = React.useState(false);
  const accordionHeight = fields.length * 80;
  var initialValues = {};

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  React.useEffect(() => {
    fields.forEach((field) => {
      initialValues[field.name] =
        field.defaultValue ||
        (field.type === "select" ? field.options[0] : "");
    });
    setFormData(initialValues);
  }, [fields]);

  const handleChange = (e, field) => {
    if (field === 'password') {
      setFormData({ ...formData, [field]: e.target.value });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const handleChangeValue = (e, field) => {
    const doctor = e.target.value;
    console.log(e.target.value);
    axios.get(`http://localhost:8081/medicalProcedure/doctor/${doctor}`)
    .then(response => {
      const procedures = response.data; 
      const updatedOptions = fields.map(f => {
        if (f.name === "procedureName") {
          return { ...f, options: procedures };
        }
        return f;
      });
      console.log(updatedOptions);
      fields = updatedOptions;
    })
    .catch(error => {
      console.error('Eroare la obținerea procedurilor medicale:', error);
    });

  setFormData({ ...formData, [field]: e.target.value });
  }

  const handleSave = () => {
    const allFieldsFilled = Object.values(formData).every(value => value !== '');

    if (allFieldsFilled) {
      setOpenDialog(true);
    } else {
      setOpenErrorDialog(true);
    }
  };

  const handleConfirm = () => {
    onSave(formData);
    setOpenDialog(false);
    setFormData(initialValues); 
    setAccordionOpen(false); 
  };

  const handleCancelErrorDialog = () => {
    setOpenErrorDialog(false);
  };

  const handleCancel = () => {
    setFormData(initialValues); 
    setAccordionOpen(false); 
  }

  const toggleAccordion = () => {
    setAccordionOpen(!accordionOpen); 
  };

  const renderFields = () =>
    fields.map(field => {
      if (field.type === 'select') {
        return (
          <Select
            key={field.name}
            value={formData[field.name] ?? field.defaultValue}
            onChange={e => handleChange(e, field.name)}
            style={{ marginBottom: '10px', width: '500px' }}
            variant="outlined"
          >
            {field.options.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        );
      } else if (field.type === 'password') {
        return (
          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Parolă</InputLabel>
            <OutlinedInput
              {...field}
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              style={{ marginBottom: '10px', width: '500px' }}
              label="Parolă"
              value={formData[field.name] || ''}
              onChange={e => handleChange(e, field.name)}
            />
          </FormControl>
        )

      } else if (field.type === 'number') {
        return (
          <TextField
            key={field.name}
            id={`outlined-${field.name}`}
            label={field.label}
            type="number"
            defaultValue={0}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: 0,
              max: 5,
            }}
            style={{ marginBottom: '10px', width: '500px' }}
            onChange={e => handleChange(e, field.name)}

          />
        )
      }
      else if(field.type === "text"){
        return (
          <TextField
            key={field.name}
            label={field.label}
            value={formData[field.name]}
            onChange={e => handleChange(e, field.name)}
            style={{ marginBottom: '10px', width: '500px' }}
            variant="outlined"
          />
        );
      } else if (field.type === 'date') {
      return (
        <div key={field.name} style={{ marginBottom: '10px', width: '500px' }}>
          <TextField
            label="Date"
            type="date"
            value={formData.date || ''}
            onChange={e => handleChange(e, 'date')}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            style={{ marginRight: '10px', width: '240px' }}
          />
          <TextField
            label="Time"
            type="time"
            value={formData.time || ''}
            onChange={e => handleChange(e, 'time')}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            style={{ width: '240px' }}
          />
        </div>
      );
    } else if (field.type === 'email') {
      return (
        <TextField
          key={field.name}
          label={field.label}
          type="email"
          value={formData[field.name] || ''}
          onChange={e => handleChange(e, field.name)}
          style={{ marginBottom: '10px', width: '500px' }}
          variant="outlined"
        />
      );
    } else{
        return (
          <Select
            key={field.name}
            value={formData[field.name] ?? field.defaultValue}
            onChange={e => handleChangeValue(e, field.name)}
            style={{ marginBottom: '10px', width: '500px' }}
            variant="outlined"
          >
            {field.options.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        );
      }
    })

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Accordion style={{ height: "fit-content", width: "950px" }} expanded={accordionOpen}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          style={{ backgroundColor: '#4c657f', color: 'white' }}
          onClick={toggleAccordion}
          sx={{ fontWeight: 500 }} 
        >
          {title}
        </AccordionSummary>
        <AccordionDetails>
          <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: accordionHeight }}>
            {renderFields()}
          </form>
        </AccordionDetails>
        <AccordionActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </AccordionActions>
      </Accordion>
      <AlertDialogSlide
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        handleOk={handleConfirm}
        title="Confirm Save"
        contentText="Do you want to save the changes you made?"
        disagreeLabel="Cancel"
        agreeLabel="Save"
      />
      <AlertDialogSlide
        open={openErrorDialog}
        handleClose={handleCancelErrorDialog}
        title="Error"
        contentText="All fields are mandatory."
        disagreeLabel="Close"
      />
    </div>
  );
}
