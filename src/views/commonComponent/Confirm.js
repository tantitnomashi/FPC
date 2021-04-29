import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Switch } from '@material-ui/core';

export default function ConfirmDialog(props) {
  const { open, title, message, onAccess, onCancel, item, onAccessLabel } = props;
  return (
    <div>

      <Dialog open={open} onClose={onCancel} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText fullWidth>
            {message}
          </DialogContentText>

        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} variant="secondary">
            Cancel
              </Button>
          <Button className='px-4' onClick={onAccess} color="primary">
            {onAccessLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
