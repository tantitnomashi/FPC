import React, { useState, useEffect } from 'react';
import { TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Switch } from '@material-ui/core';
import { Row, Col, Button, Image, Form, FormControl, InputGroup } from 'react-bootstrap';
import API from '../../utils/adminApi'
import { NotificationManager } from 'react-notifications';

export default function RequestForm(props) {
    var sapmle = [
        {
            type: 1,
            name: "Check Box"
        },
        {
            type: 0,
            name: "Check Connection"
        },
        {
            type: 2,
            name: "Check Expired Items"
        }
    ];



    // for data

    const { open, handleClickClose, currentRequest, reload } = props;
    const [statusList, setStatusList] = useState(sapmle);
    const [selectedCabinet, setSelectedCabinet] = useState();
    const [selectedStaff, setSelectedStaff] = useState('');
    const [selectedType, setSelectedType] = useState(0);
    const [desc, setDesc] = useState('');
    const [type, setType] = useState(sapmle);


    const [cabinets, setCabinets] = React.useState([]);
    const [users, setUser] = React.useState([]);

    useEffect(() => {

        loadAdminCabinets();

    }, []);

    const loadAdminCabinets = () => {
        API.getCabitnet()
            .then((response) => {
                if (response.data.statusCode == 200) {
                    console.log('load cabinets ', response.data.data[0]);
                    setCabinets(response.data.data);
                    setSelectedCabinet(response.data.data[0]?.id);

                } else {
                    alert('Cant get Cabi !')
                }
            }).catch(e => console.log(e + "hihi"));
        API.getUser()
            .then((response) => {
                if (response.data.statusCode == 200) {
                    //  console.log('load users ', response.data.data[0]);
                    setUser(response.data.data);
                    const found = response.data.data.find(element =>
                        element.roleId == 2
                    );
                    if (found) {
                        setSelectedStaff(found.userName);

                    }
                } else {
                    alert('Cant get Users !')
                }
            }).catch(e => console.log(e + "hihi"));
    }


    const submitForm = () => {

        const found = cabinets.find(element =>
            element.id == selectedCabinet
        );
        if (selectedCabinet != '' && selectedStaff != '' && found) {
            let tmp = {
                cabinetId: found.id,
                boxNum: 1,
                cabinetName: found.name,
                cabinetLocation: found.location.buildingName,
                requestType: parseInt(selectedType),
                description: desc,
                assignee: selectedStaff
            }
            console.log("### REQ", tmp);

            console.log("req ID:  " + currentRequest?.id + " ---" + currentRequest?.assignee + " from " + selectedStaff);


            if (currentRequest) {
                console.log("### ####### UPDATE CHECKING REQ");

                API.updateCheckingRequest(currentRequest.id, selectedStaff).then((response) => {

                    // console.log("rs Checking status: ", response.data.statusCode);
                    // console.log("req ID:  " + currentRequest?.assignee + " from " + selectedStaff);

                    if (response.data.statusCode == 200) {
                        NotificationManager.success('Update Checking request successfully !', 'Checking request');
                        reload();
                    } else {
                        NotificationManager.error('Sorry, Cannot update Checking request!', 'Checking request');
                    }

                }).catch(e => console.log(e))
            } else {
                API.createCheckingRequest(tmp).then((response) => {

                    console.log("rs Checking status: ", response.data.statusCode);
                    if (response.data.statusCode == 200) {
                        NotificationManager.success('Create Checking request successfully !', 'Checking request');
                        reload();
                    } else {
                        NotificationManager.error('Sorry, Cannot create Checking request!', 'Checking request');
                    }

                }).catch(e => NotificationManager.error('Sorry, Cannot create Checking request!', 'Checking request'))
            }

        }
        setTimeout(handleClickClose, 200);

        // handleClickClose();



    }
    return (
        <div>

            <Dialog maxWidth={'xs'} fullWidth={true} className="dialog-userForm" open={open} onClose={handleClickClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Checking Request Form </DialogTitle>
                <DialogContent>

                    <Form>

                        {
                            (currentRequest?.id) &&
                            <Form.Row>
                                <Col md={12} xl={12}>
                                    <Form.Label column lg={12}>Cabinet</Form.Label>
                                    <Form.Control type="text" disabled={true} defaultValue={currentRequest?.cabinetName}>
                                    </Form.Control>
                                </Col>

                                <Col md={12} xl={12}>
                                    <Form.Label column lg={12}>Location</Form.Label>
                                    <Form.Control type="text" disabled={true} defaultValue={currentRequest?.cabinetLocation}>
                                    </Form.Control>
                                </Col>
                            </Form.Row>

                        }
                        <Form.Row>
                            {
                                (!currentRequest?.id) &&

                                <Col md={12} xl={12}>
                                    <Form.Label column lg={12}>Cabinet</Form.Label>
                                    <Form.Control as="select" custom defaultValue={currentRequest?.cabinetId}
                                        onChange={(e) => {
                                            let text = e.target.value;
                                            setSelectedCabinet(text)
                                        }}>

                                        {
                                            cabinets.map(value =>
                                                <option value={value.id}>{value.name}</option>
                                            )
                                        }

                                    </Form.Control>
                                </Col>

                            }



                            <Col md={12} xl={12}>
                                <Form.Label column lg={12}>Assign for</Form.Label>
                                <Form.Control as="select" custom defaultValue={users[0]?.userName}
                                    onChange={(e) => {
                                        let text = e.target.value;

                                        setSelectedStaff(text)

                                    }} >
                                    {
                                        users.map(value => {
                                            console.log("role", value.roleId);
                                            return (value.roleId == 2) && <option value={value.userName}>{value.fullName}</option>

                                        })

                                    }

                                </Form.Control>
                            </Col>
                            <Col md={12} xl={12}>
                                <Form.Label column lg={12}>Type of request</Form.Label>
                                <Form.Control as="select" custom defaultValue={type[0]?.type}
                                    onChange={(e) => {
                                        let text = e.target.value;
                                        setSelectedType(text)
                                    }} >

                                    {
                                        type.map(value =>
                                            <option value={value.type}>{value.name}</option>
                                        )
                                    }

                                </Form.Control>
                            </Col>
                            <Col md={12} xl={12}>
                                <Form.Label column lg={12}>Description</Form.Label>
                                <Form.Control type="textarea" defaultValue={currentRequest?.description}
                                    onChange={(e) => {
                                        let text = e.target.value;
                                        setDesc(text)

                                    }}
                                >


                                </Form.Control>
                            </Col>


                        </Form.Row>


                        <DialogActions>
                            <Button onClick={handleClickClose} variant="secondary">
                                Cancel
                                  </Button>
                            <Button className='px-4' onClick={submitForm} color="primary">
                                Save
                                      </Button>
                        </DialogActions>


                    </Form>
                </DialogContent >



            </Dialog >
        </div>
    );
}