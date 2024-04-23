import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
  const { open, handleClose, handleOk, title, contentText, disagreeLabel, agreeLabel } = props;

  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{ fontFamily: 'Nunito Sans, sans-serif' }}>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
            {contentText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{ fontFamily: 'Nunito Sans, sans-serif' }}>{disagreeLabel}</Button>
          <Button onClick={handleOk} style={{ fontFamily: 'Nunito Sans, sans-serif' }}>{agreeLabel}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}