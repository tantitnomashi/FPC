import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Image, Form, FormControl, InputGroup } from 'react-bootstrap';
import { TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Switch } from '@material-ui/core';
import API from '../../utils/adminApi'
import { NotificationManager } from 'react-notifications';

export default function BoxSizeForm(props) {
    const { open, handleClickClose, reload } = props;

    const [validated, setValidated] = useState(false);

    const [newName, setNewName] = useState('');
    const [virtualWidth, setVirtualWidth] = useState(1);
    const [virtualHeight, setVirtualHeight] = useState(1);
    const [actualWidth, setActualWidth] = useState(1);
    const [actuallHeight, setActualHeight] = useState(1);
    const [basePrice, setBasePrice] = useState(1);


    const submitForm = () => {
        let tmp = {
            sizeName: newName,
            virtualWidth: parseInt(virtualWidth),
            virtualHeight: parseInt(virtualHeight),
            actualWidth: parseInt(actualWidth),
            actualHeight: parseInt(actuallHeight),
            priceWeight: parseFloat(basePrice)
        }


        console.log("#####");
        console.log(tmp);
        console.log("#####");

        API.createBoxSize(tmp).then((response) => {
            console.log("create: ",);
            if (response.data.statusCode == 200) {
                NotificationManager.success('Create Box size successfully!', 'Create Box Size');
            } else {
                NotificationManager.error('Sorry, Cannot create this Box size!', 'Create Box Size')
            }
            reload();
            handleClickClose();

        }).catch(e => NotificationManager.error('Sorry, Cannot create this Box size!', 'Create Box Size'))
    }

    return (
        <div>

            <Dialog maxWidth={'md'} fullWidth={true} className="dialog-userForm" open={open} onClose={handleClickClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title"> New Box Size</DialogTitle>
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

                            <Col md={6} xl={6}>
                                <Form.Label column lg={12}>Name    </Form.Label>
                                <Form.Control className="my-1" id="name"
                                    label="Name"
                                    type="Text" placeholder="" required={true}
                                    onChange={(e) => {
                                        let text = e.target.value;
                                        setNewName(text)
                                    }}
                                />
                                <Form.Control.Feedback type="invalid" required={true}>
                                    Please input username, 8 - 50 characters.
                                 </Form.Control.Feedback>
                            </Col>
                            <Col md={6} xl={6}>
                                <Form.Label column lg={12}>Base Price</Form.Label>
                                <Form.Control className="my-1" id="base-price" required={true}
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

                        <Form.Row>
                            <Col md={6} xl={6}>
                                <Form.Label column lg={12}>Virtual Height </Form.Label>

                                <InputGroup className="my-1 mb-2" id="address" >

                                    <FormControl id="inlineFormInputGroup" required={true}
                                        onChange={(e) => {
                                            let text = e.target.value;
                                            setVirtualHeight(text)
                                        }} />
                                    <Form.Control.Feedback type="invalid">
                                        Field is required !
                                     </Form.Control.Feedback>
                                </InputGroup>

                            </Col>
                            <Col md={6} xl={6}>
                                <Form.Label column lg={12}>Virtual Width </Form.Label>

                                <InputGroup className="my-1 mb-2" id="address" >

                                    <FormControl id="inlineFormInputGroup" required={true}
                                        onChange={(e) => {
                                            let text = e.target.value;
                                            setVirtualWidth(text)
                                        }} />
                                    <Form.Control.Feedback type="invalid">
                                        Field is required !
                                     </Form.Control.Feedback>
                                </InputGroup>
                            </Col>

                        </Form.Row>

                        <Form.Row>
                            <Col md={6} xl={6}>
                                <Form.Label column lg={6}>Actual Height </Form.Label>

                                <InputGroup className="my-1 mb-2" id="address" >

                                    <FormControl id="inlineFormInputGroup" required={true}
                                        onChange={(e) => {
                                            let text = e.target.value;
                                            setActualHeight(text)
                                        }} />
                                    <Form.Control.Feedback type="invalid">
                                        Field is required !
                                     </Form.Control.Feedback>
                                </InputGroup>

                            </Col>
                            <Col md={6} xl={6}>

                                <Form.Label column lg={6}>Actual Width  </Form.Label>

                                <InputGroup className="my-1 mb-2" id="address" >

                                    <FormControl id="inlineFormInputGroup" required={true}
                                        onChange={(e) => {
                                            let text = e.target.value;
                                            setActualWidth(text)
                                        }} />
                                    <Form.Control.Feedback type="invalid">
                                        Field is required !
                                     </Form.Control.Feedback>
                                </InputGroup>
                            </Col>

                        </Form.Row>



                        <div>
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
                            </DialogActions></div>



                    </Form>
                </DialogContent >



            </Dialog >
        </div >
    );
}
