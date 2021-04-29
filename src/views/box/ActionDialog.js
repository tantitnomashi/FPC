import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Switch } from '@material-ui/core';

export default function ActionDialog(props) {
    const { open, title, message, onOpenBox, onCancel, currentBox, item } = props;
    const [isActive, setIsActive] = React.useState({
        checkedB: true
    });
    const handleChange = (event) => {
        console.log("^^^");
        setIsActive({ ...isActive, [event.target.name]: event.target.checked });
    };
    return (
        <div>

            <Dialog open={open} onClose={onCancel} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Box Details</DialogTitle>
                {(item?.rentingStatus != 1) &&
                    <div>
                        <DialogContent>
                            <DialogContentText fullWidth>
                                <h4 className="font-weight-light">{message} !</h4>
                            </DialogContentText>
                            <DialogContentText fullWidth>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={onCancel} variant="secondary">
                                Cancel
                    </Button>
                            {(item?.status == 0) &&
                                <div>

                                    {(item?.rentingStatus != 1) &&

                                        <Button className='px-4' onClick={() => onOpenBox(2)} variant="danger">
                                            DeActive
                             </Button>
                                    }
                                </div>

                            }
                            {(item?.status == 1) &&

                                <div>

                                    {(item?.rentingStatus != 1) &&

                                        <Button className='px-4' onClick={() => onOpenBox(2)} variant="danger">
                                            DeActive
                             </Button>
                                    }

                                </div>}
                            {(item?.status == 2) && <Button className='px-4' onClick={() => onOpenBox(3)} variant="success">
                                Active
                             </Button>}
                            {(item?.status == 3) &&
                                <div>

                                    {(item?.rentingStatus != 1) &&

                                        <Button className='px-4' onClick={() => onOpenBox(2)} variant="danger">
                                            DeActive
                             </Button>
                                    }
                                </div>
                            }

                        </DialogActions>


                    </div>
                }
            </Dialog>
        </div>
    );
}
