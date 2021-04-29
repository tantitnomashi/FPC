import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tabs, Tab, Button, Form, FormControl } from 'react-bootstrap';
import API from '../../utils/adminApi';
import Aux from "../../hoc/_Aux";
import ConfirmDialog from '../commonComponent/Confirm';
import TemplateForm from './TemplateForm';
import { NotificationManager } from 'react-notifications';

export default function Template() {

    const [templates, setTemplates] = React.useState([]);

    const [open, setOpen] = React.useState(false);
    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [openTemplate, setOpenTemplate] = React.useState(false);

    const [currentTemplate, setCurrentTemplate] = React.useState(null);

    useEffect(() => {
        loadAdminCabinets();
    }, []);

    const loadAdminCabinets = () => {
        API.getCabitnetTemplate()
            .then((response) => {
                if (response.data.statusCode == 200) {
                    console.log('load templates ', response.data.data[0]);
                    setTemplates(response.data.data);
                } else if (response.data.statusCode == 201) {
                    setTemplates(response.data.data);

                } else {
                    alert('Cant get Cabi !')
                }
            }).catch(e => console.log(e + "hihi"));

    }

    const setOpenForm = (currentTemplate) => {
        setOpen(true);
        setCurrentTemplate(currentTemplate);
    };

    const setOpenTemplateForm = () => {
        setOpenTemplate(true);
    };

    const setCloseForm = () => {
        setOpen(false);
        setOpenConfirm(false);
        setOpenTemplate(false);
    };


    const handleRedirect = (id) => {
        //  history.push()

        window.location.href = '/box/' + id;

    }

    const handleDelete = (currentTemplate) => {
        setOpenConfirm(true);
        if (currentTemplate) {
            setCurrentTemplate(currentTemplate);
        } else {
            setCurrentTemplate(null);
        }
    }
    const requestDelete = (templateId) => {
        API.deleteCabinet(currentTemplate.id)
            .then((response) => {
                if (response.data.statusCode == 200) {
                    NotificationManager.success('Delete template successfully!', 'Delete Cabinet');
                    setTemplates(response.data.data);
                    loadAdminCabinets();
                } else {
                    NotificationManager.error('Sorry, Cannot delete this template!', 'Delete Cabinet');
                }
            }).catch(e => NotificationManager.error('Sorry, Cannot delete this template!', 'Delete Cabinet'));
        setCloseForm();
    }

    return (



        <Aux>
            <Row>


                <Col className="text-right justify-content-end" md={12}>
                    <div className="text-right mb-3">
                        <Button className="mx-2" size="small" variant="dark" onClick={() => setOpenTemplateForm()}>
                            Create template
                        </Button>
                    </div>
                </Col>

            </Row>
            <TemplateForm open={openTemplate} handleClickClose={setCloseForm} />
            <ConfirmDialog open={openConfirm} onAccessLabel={"Delete"}
                tilte="Delete Confirm" message={"Are you sure to delete " + currentTemplate?.name} onAccess={() => requestDelete(currentTemplate?.name)} onCancel={setCloseForm} />

            <Row>

                <Col md={6} xl={12}>
                    <Card className='Cabinet List'>
                        <Card.Header>
                            <Card.Title as='h5'>Cabinet Template List</Card.Title>
                        </Card.Header>
                        <Card.Body className='px-3 py-2'>
                            <Row>
                                <Col md={12}>
                                    {
                                        templates?.map((template, index) =>
                                            <Row key={template.id} className="unread py-3 px-1 my-2 border-bottom border-light">

                                                <Col md={2} className='d-flex align-items-center text-center text-dark' >
                                                    <span className="f-18">{"Template " + (++index)}</span>
                                                </Col>
                                                <Col md={3} className='text-left d-flex align-items-center'>
                                                    <span className="material-icons f-20 m-r-5">
                                                        dashboard</span>
                                                    <span className="text-dark f-18"> {template.rowsCnt + " rows x " + template.colsCnt + " cols"}</span>

                                                </Col>
                                                <Col md={4} className="d-flex f-18 align-items-center text-dark">

                                                    {new Date(template.updatedAt).toGMTString()}

                                                </Col>

                                                <Col md={3} className='d-flex justify-content-end  '>
                                                    <Button size="small" className="label theme-bg2 text-white f-12" onClick={() => handleDelete(template)}>Delete</Button>
                                                </Col>
                                            </Row>
                                        )
                                    }
                                </Col>
                                <Col md={5}>

                                </Col>
                            </Row>




                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} xl={6}>
                    <Card className='card-social'>
                        <Card.Body className='border-bottom'>
                            <div className="row align-items-center justify-content-center">
                                <div className="col-auto">
                                    <i className="fa fa-templates text-c-black f-36" />
                                </div>
                                <div className="col text-right">
                                    <h3>1210</h3>
                                    <h5 className="text-c-purple mb-0">+6.2% <span className="text-muted">Total Users</span></h5>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Body>
                            <div className="row align-items-center justify-content-center card-active">
                                <div className="col-6">
                                    <h6 className="text-center m-b-10"><span className="text-muted m-r-5">User Active:</span>250</h6>
                                    <div className="progress">
                                        <div className="progress-bar progress-c-green" role="progressbar" style={{ width: '40%', height: '6px' }} aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <h6 className="text-center  m-b-10"><span className="text-muted m-r-5">Customer Retention:</span>800</h6>
                                    <div className="progress">
                                        <div className="progress-bar progress-c-blue" role="progressbar" style={{ width: '70%', height: '6px' }} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" />
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className='card-social'>
                        <Card.Body className='border-bottom'>
                            <div className="row align-items-center justify-content-center">
                                <div className="col-auto">
                                    <i className="fa fa-google-plus text-c-red f-36" />
                                </div>
                                <div className="col text-right">
                                    <h3>1,512</h3>
                                    <h5 className="text-c-blue mb-0">+5.9% <span className="text-muted">Total Transactions</span></h5>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Body>
                            <div className="row align-items-center justify-content-center card-active">
                                <div className="col-6">
                                    <h6 className="text-center m-b-10"><span className="text-muted m-r-5">Target:</span>25,998</h6>
                                    <div className="progress">
                                        <div className="progress-bar progress-c-theme" role="progressbar" style={{ width: '80%', height: '6px' }} aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <h6 className="text-center  m-b-10"><span className="text-muted m-r-5">Duration:</span>900</h6>
                                    <div className="progress">
                                        <div className="progress-bar progress-c-theme2" role="progressbar" style={{ width: '50%', height: '6px' }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" />
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>


            </Row>

        </Aux>
    );
}