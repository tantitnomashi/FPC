import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tabs, Tab, Button, Form, FormControl } from 'react-bootstrap';
import API from '../../utils/adminApi';
import Aux from "../../hoc/_Aux";
import CabinetForm from './CabinetForm';
import ConfirmDialog from '../commonComponent/Confirm';
import TemplateForm from './TemplateForm';
import BoxList from '../box/Box';
import { Redirect } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import Pagination from "react-js-pagination";

export default function Dashboard() {

    // for paging

    let [currentProcessPage, setCurrentProcessPage] = useState(1);
    const [totalItemsCount, setTotalItemsCount] = useState(0); //projects count


    // const history = useHistory();
    const [cabinets, setCabinets] = React.useState([]);

    const [open, setOpen] = React.useState(false);
    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [openTemplate, setOpenTemplate] = React.useState(false);

    const [currentCabinet, setCurrentCabinet] = React.useState(null);

    useEffect(() => {
        loadAdminCabinets();
    }, []);

    const loadAdminCabinets = () => {
        API.getCabitnet()
            .then((response) => {
                if (response.data.statusCode == 200) {
                    setCabinets(response.data.data);
                    setTotalItemsCount(response.data.data.length);
                } else if (response.data.statusCode == 201) {
                    setCabinets(response.data.data);

                } else {
                    NotificationManager.error('Sorry, Cannot get cabinet list!', "Get Cabinets");
                }
            }).catch(e => NotificationManager.error('Sorry, Cannot get cabinet list!', "Get Cabinets"));

    }

    const setOpenForm = (currentCabinet) => {
        setOpen(true);
        setCurrentCabinet(currentCabinet);
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

    const handleDelete = (currentCabinet) => {
        setOpenConfirm(true);
        if (currentCabinet) {
            setCurrentCabinet(currentCabinet);
        } else {
            setCurrentCabinet(null);
        }
    }
    const requestDelete = (cabinetId) => {
        API.deleteCabinet(currentCabinet.id)
            .then((response) => {
                if (response.data.statusCode == 200) {
                    NotificationManager.success('Delete cabinet successfully!', 'Delete Cabinet');
                    setCabinets(response.data.data);
                    loadAdminCabinets();
                } else {
                    NotificationManager.error('Sorry, Cannot delete this cabinet!', 'Delete Cabinet');
                }
            }).catch(e => NotificationManager.error('Sorry, Cannot delete this cabinet!', 'Delete Cabinet'));
        setCloseForm();
    }

    // Pagination for project process data
    const getProcessData = page => {
        setCurrentProcessPage(page);

    }

    return (



        <Aux>
            <Row>

                <Col className="text-left justify-content-start" md={6} xl={6}>
                    {/* <Form inline className=" justify-content-start d-flex align-items-center ">
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                        <Button variant="outline-secondary" className="mt-1">Search</Button>
                    </Form> */}
                </Col>
                <Col className="text-right justify-content-end" md={6} xl={6}>
                    <div className="text-right mb-3">
                        <Button className="mx-2" size="small" onClick={() => setOpenForm()}>
                            Create Cabinet
                        </Button>
                        <Button className="mx-2" size="small" variant="dark" onClick={() => setOpenTemplateForm()}>
                            Create Template
                        </Button>
                    </div>

                </Col>

            </Row>
            <CabinetForm reload={loadAdminCabinets} open={open} handleClickClose={setCloseForm} currentCabinet={currentCabinet} />
            <TemplateForm open={openTemplate} handleClickClose={setCloseForm} />
            <ConfirmDialog open={openConfirm} onAccessLabel={"Delete"}
                tilte="Delete Confirm" message={"Are you sure to delete " + currentCabinet?.name} onAccess={() => requestDelete(currentCabinet?.name)} onCancel={setCloseForm} />

            <Row>

                <Col md={6} xl={12}>
                    <Card className='Cabinet List'>
                        <Card.Header>
                            <Card.Title as='h5'>Cabinet List</Card.Title>
                        </Card.Header>
                        <Card.Body className='px-3 py-2'>

                            {
                                cabinets?.slice((currentProcessPage - 1) * 4, currentProcessPage * 4).map(cabinet =>
                                    <Row key={cabinet.id} className="unread py-3 px-1 my-2 border-bottom border-light">
                                        <Col md={1} className='text-center' >

                                            {/* <img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="activity-user" /> */}

                                            <i className={cabinet.isActive == true ?
                                                "fa fa-circle text-c-green f-30 m-r-15" :
                                                "fa fa-circle text-c-red f-30 m-r-15"} />
                                        </Col>
                                        <Col md={2} className='text-left' >
                                            <h6 className="mb-1">{cabinet.name}</h6>
                                            <p className="m-0">{cabinet.location.buildingName}</p>
                                        </Col>
                                        <Col md={4} className='text-left'>
                                            <h6 className="text-muted">
                                                {/* <i className="fa fa-room text-c-black f-20 m-r-15" /> */}
                                                <span className="material-icons f-20 m-r-5">
                                                    room</span>
                                                {cabinet.location.fullAddress}
                                            </h6>
                                        </Col>
                                        <Col md={4} className='d-flex justify-content-end  '>
                                            <Button size="small" className="label theme-bg2 text-white f-12" onClick={() => handleDelete(cabinet)}>Delete</Button>
                                            <Button size="small" className="label theme-bg text-white f-12" onClick={() => setOpenForm(cabinet)}>Details</Button>
                                            <Button variant="dark" size="small" className="label text-white f-12" onClick={() => handleRedirect(cabinet.id)}> Manage Box</Button>
                                        </Col>
                                    </Row>
                                )
                            }


                        </Card.Body>
                        <Pagination
                            itemClass="page-item"
                            linkClass="page-link"
                            activePage={currentProcessPage}
                            itemsCountPerPage={4} //projects per page
                            totalItemsCount={totalItemsCount}
                            pageRangeDisplayed={5}
                            onChange={getProcessData}
                            innerClass="pagination justify-content-center mt-3"
                        />
                    </Card>
                </Col>

                {/* <Col md={6} xl={6}>
                    <Card className='card-social'>
                        <Card.Body className='border-bottom'>
                            <div className="row align-items-center justify-content-center">
                                <div className="col-auto">
                                    <i className="fa fa-cabinets text-c-black f-36" />
                                </div>
                                <div className="col text-right">
                                    <h3>12</h3>
                                    <h5 className="text-c-purple mb-0">+6.2% <span className="text-muted">Total Users</span></h5>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Body>
                            <div className="row align-items-center justify-content-center card-active">
                                <div className="col-6">
                                    <h6 className="text-center m-b-10"><span className="text-muted m-r-5">User Active:</span>7</h6>
                                    <div className="progress">
                                        <div className="progress-bar progress-c-green" role="progressbar" style={{ width: '40%', height: '6px' }} aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <h6 className="text-center  m-b-10"><span className="text-muted m-r-5">Customer Retention:</span>8</h6>
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
                </Col> */}


            </Row>

        </Aux>
    );
}