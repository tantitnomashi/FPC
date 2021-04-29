import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Image, Form, FormControl, InputGroup } from 'react-bootstrap';
import { TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Switch } from '@material-ui/core';
import API from '../../utils/adminApi'
import { NotificationManager } from 'react-notifications';

export default function BoxSizeForm(props) {
    const [validated, setValidated] = useState(false);

    const { open, handleClickClose, currentCabinet, reload } = props;
    const [duration, setDuration] = useState('');
    const [basePrice, setBasePrice] = useState(1);

    const submitForm = () => {
        let tmp = {
            duration: parseInt(duration),
            basePrice: parseFloat(basePrice)
        }
        console.log("#####");
        console.log(tmp);
        console.log("#####");

        API.createTimeSlot(tmp).then((response) => {
            if (response.data.statusCode == 200) {
                NotificationManager.success('Create Rental time slot successfully!', 'Create Rental time slot');
                reload();
            } else {
                NotificationManager.error('Already has this duration in system, try another!', 'Create Rental time slot');
            }
        }).catch(e => NotificationManager.error('Sorry, Cannot create this Rental time slot!', 'Create Rental time slot'))

        handleClickClose();
    }

    return (
        <div>

            <Dialog maxWidth={'xs'} fullWidth={true} className="dialog-userForm" open={open} onClose={handleClickClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title"> New Time Slot</DialogTitle>
                <DialogContent>
                    <Form noValidate validated={validated} onSubmit={(e) => {
                        const form = e.currentTarget;
                        e.preventDefault();
                        e.stopPropagation();
                        if (form.checkValidity() === false) {
                        } else {
                            submitForm();
                        }
                        setValidated(true);
                    }

                    }>
                        <Form.Row>

                            <Col md={12} xl={12}>
                                <Form.Label column lg={12}>Duration    </Form.Label>
                                <Form.Control className="my-1" id="name"
                                    label="Name" required={true}
                                    type="number" min="1" step="0.01"
                                    onChange={(e) => {
                                        let text = e.target.value;
                                        setDuration(text)
                                    }}
                                    defaultValue={currentCabinet?.name} />
                                <Form.Control.Feedback type="invalid">
                                    Duration is required, number greater than 0 !
                                     </Form.Control.Feedback>
                            </Col>
                            <Col md={12} xl={12}>
                                <Form.Label column lg={12}>Base Price</Form.Label>
                                <Form.Control className="my-1" id="base-price"
                                    required={true}
                                    type="number" min="1" step="0.01"
                                    onChange={(e) => {
                                        let text = e.target.value;
                                        setBasePrice(text)
                                    }}
                                />
                                <Form.Control.Feedback type="invalid" required={true}>
                                    Please input valid number, greater than or equal 1 [Ex: 1.28].
                                 </Form.Control.Feedback>
                            </Col>


                        </Form.Row>

                        <DialogActions>
                            <Button onClick={() => {
                                handleClickClose();
                                setValidated(false);
                            }} variant="secondary">
                                Cancel
                                 </Button>

                            <Button className='px-4'
                                type="submit"
                                color="primary">
                                Save
                                   </Button>
                        </DialogActions>
                    </Form>
                </DialogContent >
            </Dialog >
        </div >
    );
}
