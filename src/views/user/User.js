import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tabs, Tab, Button } from 'react-bootstrap';
import API from '../../utils/adminApi'

import Aux from "../../hoc/_Aux";
import DEMO from "../../store/constant";
import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../assets/images/user/avatar-3.jpg';
import UserForm from './UserForm';
import ConfirmDialog from '../commonComponent/Confirm';
import { NotificationManager } from 'react-notifications';
import Pagination from "react-js-pagination";

// var test = require('../../sampleData.json');

export default function Dashboard() {

    // for paging

    let [currentProcessPage, setCurrentProcessPage] = useState(1);
    const [totalItemsCount, setTotalItemsCount] = useState(0); //projects count


    const [open, setOpen] = React.useState(false);

    const [users, setUser] = React.useState([]);


    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [currentProfile, setCurrentProfile] = React.useState(null);




    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        API.getUser()
            .then((response) => {
                if (response.data.statusCode == 200) {
                    let tmp = response.data.data;
                    tmp = tmp.sort((a, b) => {
                        return new Date(b.updatedAt) - new Date(a.updatedAt);
                    })
                    setUser(tmp);
                    setTotalItemsCount(response.data.data.length);

                } else {
                    NotificationManager.error('Sorry, Cannot get users list !', 'Get Users list');
                }

            }).catch(e => NotificationManager.error('Sorry, Cannot get users list !', 'Get Users list'));

    }




    const setOpenForm = (currentProfile) => {
        setOpen(true);
        setCurrentProfile(currentProfile);
    };

    const setCloseForm = () => {
        setOpen(false);
    };
    const setCloseConfirmForm = () => {
        setOpenConfirm(false);

    };


    const handleActiveUser = (currentProfile) => {
        setOpenConfirm(true);
        if (currentProfile) {
            setCurrentProfile(currentProfile);
        } else {
            setCurrentProfile(null);
        }
    }
    const requestUpdate = (currentProfile) => {
        let currAction = currentProfile?.isActive ? "Disable" : "Enable";
        let tmp = {
            userName: currentProfile?.userName,
            roleId: currentProfile?.roleId,
            isActive: !currentProfile?.isActive
        }
        API.updateStatusUser(tmp).then((response) => {
            console.log("Enable/Disable ", response.data.statusCode);
            if (response.data.statusCode == 200) {
                NotificationManager.success(currAction + ' user successfully!', currAction + " user");
            } else {
                NotificationManager.error('Sorry, Cannot ' + currAction + ' user!', currAction + " user");
            }
        }).catch(e => NotificationManager.error('Sorry, Cannot ' + currAction + ' user!', currAction + " user"))
        setTimeout(() => {
            setOpenConfirm(false);
            loadData();
        }, 2000);
    }

    // Pagination for project process data
    const getProcessData = page => {
        setCurrentProcessPage(page);
        console.log(currentProcessPage)
        console.log(totalItemsCount)
        console.log(page);

    }
    return (



        <Aux>
            <UserForm open={open} handleClickClose={setCloseForm} currentProfile={currentProfile} reload={loadData} />
            <ConfirmDialog open={openConfirm} onAccessLabel={(currentProfile?.isActive ? "Disable" : "Enable")}
                tilte="Confirm Action" message={(currentProfile?.isActive ? "Disable user " : "Enable user ") + currentProfile?.fullName + " ?"} onAccess={() => requestUpdate(currentProfile)} onCancel={setCloseConfirmForm} />
            <Row>
                <Col md={6} xl={8}>
                </Col>

                <Col md={6} xl={4}>
                    <div className="text-right mb-3">
                        <Button size="small" onClick={() => setOpenForm()}>
                            Create User
                        </Button>
                    </div>
                </Col>
            </Row>
            <Row>

                <Col md={6} xl={12}>
                    <Card className='Recent-Users'>
                        <Card.Header>
                            <Card.Title as='h5'>Recent Users</Card.Title>
                        </Card.Header>
                        <Card.Body className='px-0 py-2'>
                            <Table responsive hover>
                                <tbody>
                                    {
                                        users.slice((currentProcessPage - 1) * 6, currentProcessPage * 6).map(user =>
                                            <tr className="">
                                                <td className="text-center text-dark">
                                                    {user?.roleId == 1 && <i class="fa  fa-id-card-o fa-2x" aria-hidden="true"></i>}
                                                    {user?.roleId == 2 && <i class="fa fa-id-badge fa-2x" aria-hidden="true"></i>}
                                                    {user?.roleId == 3 && <i class="fa fa-user-circle fa-2x" aria-hidden="true"></i>}
                                                    {user?.roleId == 1002 && <i class="fa  fa-cart-plus fa-2x" aria-hidden="true"></i>}



                                                </td>
                                                <td>
                                                    <h6 className="mb-1">{user.fullName}</h6>
                                                    <p className="m-0">{user.userName}</p>
                                                </td>
                                                <td>
                                                    <h6 className="text-muted"><i className="fa fa-circle text-c-green f-10 m-r-15" />
                                                        {new Date(user.updatedAt).toGMTString()}
                                                    </h6>
                                                </td>

                                                <td>
                                                    {(user?.isActive == 0) && <Button size="small" className="label theme-bg text-white f-12" onClick={() => handleActiveUser(user)}>Enable</Button>}
                                                    {(user?.isActive == 1) && <Button size="small" className="label theme-bg2 text-white f-12" onClick={() => handleActiveUser(user)}>Disable</Button>}

                                                    <Button size="small" className="label btn btn-dark text-white f-12" onClick={() => setOpenForm(user)}>Details</Button>
                                                </td>
                                            </tr>
                                        )
                                    }

                                </tbody>
                            </Table>
                            <Pagination
                                itemClass="page-item"
                                linkClass="page-link"
                                activePage={currentProcessPage}
                                itemsCountPerPage={6} //projects per page
                                totalItemsCount={totalItemsCount}
                                pageRangeDisplayed={5}
                                onChange={getProcessData}
                                innerClass="pagination justify-content-center mt-3"
                            />
                        </Card.Body>
                    </Card>
                </Col>

                {/* <Col md={6} xl={6}>
                    <Card className='card-social'>
                        <Card.Body className='border-bottom'>
                            <div className="row align-items-center justify-content-center">
                                <div className="col-auto">
                                    <i className="fa fa-users text-c-black f-36" />
                                </div>
                                <div className="col text-right">
                                    <h3>11,200</h3>
                                    <h5 className="text-c-purple mb-0">+6.2% <span className="text-muted">Total Users</span></h5>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Body>
                            <div className="row align-items-center justify-content-center card-active">
                                <div className="col-6">
                                    <h6 className="text-center m-b-10"><span className="text-muted m-r-5">User Active:</span>2,650</h6>
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
                                    <h3>10,500</h3>
                                    <h5 className="text-c-blue mb-0">+5.9% <span className="text-muted">Total Likes</span></h5>
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

               */}
            </Row>

        </Aux>
    );
}