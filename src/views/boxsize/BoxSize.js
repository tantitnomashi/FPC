import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tabs, Tab, Button, Alert } from 'react-bootstrap';
import { Snackbar } from '@material-ui/core';

import API from '../../utils/adminApi'
import Aux from "../../hoc/_Aux";
import BoxSizeForm from './BoxSizeForm';
import ConfirmDialog from '../commonComponent/Confirm';
import { NotificationManager } from 'react-notifications';


export default function BoxSize({ match }) {

    const [size, setSize] = React.useState([]);

    const [open, setOpen] = React.useState(false);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState("");

    const [currentSize, setCurrentSize] = React.useState(null);


    useEffect(() => {
        loadAdminBoxSize();
    }, []);

    const loadAdminBoxSize = () => {
        API.getBoxSizes()
            .then((response) => {
                if (response.data.statusCode == 200) {
                    console.log('load size ', response.data.data);
                    setSize(response.data.data);
                } else {
                    NotificationManager.error('Sorry, Cannot get Box size list', 'Loading data ...');
                }
            }).catch(e => console.log(e));

    }

    const setOpenForm = (currentSize) => {
        setOpen(true);
        setCurrentSize(currentSize);
    };


    const setCloseForm = () => {
        setOpen(false);
        setOpenConfirm(false);
    };




    const handleDelete = (currentSize) => {
        setOpenConfirm(true);
        if (currentSize) {
            setCurrentSize(currentSize);
        } else {
            setCurrentSize(null);
        }
    }
    const notifyByAlert = (title, type) => {
        setOpenAlert(true);

    }
    const requestDelete = () => {
        API.deleteBoxSize(currentSize.id)
            .then((response) => {
                if (response.data.statusCode == 200) {
                    console.log(response.data, 'delete size ');
                    NotificationManager.success('Delete Box size successfully!', 'Delete');
                    setSize(response.data.data);
                    loadAdminBoxSize();
                } else {
                    NotificationManager.error('Sorry, Cannot delete this Box size!', 'Delete');
                }
            }).catch(e => console.log(" ##  Delete Size ERR", e));
        setCloseForm();

    }


    return (



        <Aux>

            <BoxSizeForm reload={loadAdminBoxSize} open={open} handleClickClose={setCloseForm} currentSize={currentSize} />
            <ConfirmDialog open={openConfirm} onAccessLabel={"Delete"}
                tilte="Delete Confirm" message={"Are your sure to delete " + currentSize?.sizeName} onAccess={() => requestDelete(currentSize?.name)} onCancel={setCloseForm} />
            <Row>
                <Col md={6} xl={8}>

                </Col>

                <Col md={6} xl={4}>
                    <div className="text-right mb-3">
                        <Button className="mx-2" variant="primary" size="small" onClick={() => setOpenForm()}>
                            Add Box Size
                        </Button>

                    </div>


                </Col>
            </Row>
            <Row>

                <Col md={6} xl={12}>
                    <Card className=''>
                        <Card.Header>
                            <Card.Title as='h5'>Box Size List</Card.Title>
                        </Card.Header>
                        <Card.Body className='px-3 py-2'>
                            <Row className="unread py-3 px-1 my-2 border-bottom border-light">

                                <Col md={3} className='text-left' >
                                    Size Name
                                </Col>

                                <Col md={2} className='text-left'>
                                    Virtual Size
                                </Col>
                                <Col md={2} className='text-left '>
                                    Actual Size
                                </Col>
                                <Col md={2} className='justify-content-center'>
                                    Price Weight
                                </Col>
                                <Col md={2} className='justify-content-center'>
                                </Col>
                            </Row>
                            {
                                size?.map(element =>
                                    <Row className="unread py-3 px-1 my-2 border-bottom border-light">

                                        <Col md={3} className='text-left d-flex align-items-center'>
                                            <h5 className="mb-1">{element.sizeName}</h5>
                                        </Col>

                                        <Col md={2} className='text-left '>
                                            <h5 className="d-flex align-items-center">
                                                <span class="material-icons f-30 m-r-5">
                                                    crop_free</span>

                                                {"   " + element.virtualHeight + " x " + element.virtualWidth}



                                            </h5>
                                        </Col>
                                        <Col md={2} className='text-left '>
                                            <h5 className=" d-flex align-items-center">
                                                <span class="material-icons f-30 m-r-5">
                                                    expand
                                                </span>

                                                {element.actualHeight + " cm  x " + element.actualWidth + " cm "}


                                            </h5>
                                        </Col>
                                        <Col md={2} className='text-left '>
                                            <h5 className=" d-flex align-items-center">
                                                <span class="material-icons f-30 m-r-5">
                                                    perm_data_setting
                                                </span>

                                                {element.priceWeight}


                                            </h5>
                                        </Col>
                                        <Col md={2} className='d-flex justify-content-center '>
                                            <Button size="small" variant="dark" className="label text-white f-12" onClick={() => handleDelete(element)}>Delete</Button>
                                        </Col>
                                    </Row>
                                )
                            }


                        </Card.Body>
                    </Card>
                </Col>




            </Row>

        </Aux >
    );
}