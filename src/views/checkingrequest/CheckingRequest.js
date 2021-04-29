import React, { useState, useEffect } from 'react';
import {
    Row, Col, Card, Table, Tabs, Button, Form, FormControl,
    Collapse, InputGroup
} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import DEMO from "../../store/constant";
import Pagination from "react-js-pagination";

import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../assets/images/user/avatar-3.jpg';
import ConfirmDialog from '../commonComponent/Confirm';
import RequestForm from './RequestForm';
import API from '../../utils/adminApi';
import { NotificationManager } from 'react-notifications';


export default function Request() {

    // for paging

    let [currentProcessPage, setCurrentProcessPage] = useState(1);
    const [totalItemsCount, setTotalItemsCount] = useState(0); //projects count


    //for data
    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [currentRequest, setCurrentRequest] = React.useState(null);
    const [requestList, setRequestList] = React.useState([]);
    const [isBasic, setIsBasic] = useState(false);
    // var sapmle = require('../../sampleData/transactionStatus.json');

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
    // for details
    const [open, setOpen] = React.useState(false);
    const setOpenForm = (currentReq) => {
        setOpen(true);
        setCurrentRequest(currentReq);
        console.log(currentReq);
    };

    const setCloseForm = () => {
        setOpen(false);
        loadData();
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        console.log("###reload data...")
        API.getCheckingRequest()
            .then((response) => {
                if (response.data.statusCode == 200) {
                    let tmp = response.data.data;
                    tmp = tmp.sort((a, b) => {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    })
                    setRequestList(tmp);
                    setTotalItemsCount(response.data.data.length);
                    // setFilterList(tmp)
                } else {
                    alert('Cant get Checking request !')
                }
            }).catch(e => console.log(e + "##ERR load data Checkign req"));

    }




    //for filter 
    var sample = require('../../sampleData/transactionStatus.json');
    const [filterList, setFilterList] = useState(sapmle);
    const [activeFilter, setActiveFilter] = useState([]);

    const onFilterChange = (filter) => {

        if (filter === "ALL") {
            if (activeFilter.length === filterList.length) {
                setActiveFilter([]);

            } else {
                setActiveFilter(filterList.map(filter => filter.statusName));
            }
        } else {
            if (activeFilter.includes(filter)) {
                const filterIndex = activeFilter.indexOf(filter);
                const newFilter = [...activeFilter];
                newFilter.splice(filterIndex, 1);
                setActiveFilter(newFilter);

            } else {
                setActiveFilter([...activeFilter, filter]);
            }
            setTimeout(console.log("active filter", activeFilter)
                , 200);

        }
    }



    let filteredList;
    if (
        activeFilter.length === 0 ||
        activeFilter.length === filterList.length
    ) {
        filteredList = requestList;
        console.log("show res", filteredList);

    } else {
        filteredList = requestList.filter(item =>
            activeFilter.includes(item.name)
        );
        console.log("show res", filteredList);

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
            <RequestForm open={open} handleClickClose={setCloseForm} currentRequest={currentRequest} reload={loadData} />


            <Row className="pb-3">
                <Col className="text-left" md={6} xl={6}>
                    {/* <Button variant="outline-secondary" onClick={() => setIsBasic(!isBasic)}>Filter Status</Button>
                    <Collapse in={isBasic}>
                        <Row>
                            <Col md={12}>
                                <div id="basic-collapse">
                                    <div>
                                        <Form className="text-dark">
                                            <input
                                                className="mx-1" type="checkbox"
                                                type="checkbox"
                                                onClick={() => onFilterChange("ALL")}
                                                checked={activeFilter.length === filterList.length}
                                            />
                                            <label className="mx-1" type="checkbox"
                                                htmlFor="myInput">All</label>

                                            {filterList.map(filter => (
                                                <React.Fragment>
                                                    <input
                                                        className="mx-1 f-15" type="checkbox"
                                                        checked={activeFilter.includes(filter.name)}
                                                        onClick={() => onFilterChange(filter.name)}
                                                    />
                                                    <label className="mx-1 f-15" htmlFor={filter.type}>{filter.name}</label>
                                                </React.Fragment>
                                            ))}
                                        </Form>

                                    </div>
                                </div>

                            </Col>


                        </Row>
                    </Collapse> */}

                </Col>
                <Col className="text-right justify-content-end" md={6} xl={6}>
                    <div className="text-right mb-3">
                        <Button className="mx-2" variant="primary" size="small" onClick={() => setOpenForm()}>
                            Create New Request
                        </Button>

                    </div>

                </Col>
            </Row>

            <Row>


                <Col md={6} xl={12}>
                    <Card className='Recent-Users'>
                        <Card.Header>
                            <Card.Title as='h5'>Recent Checking Request</Card.Title>
                        </Card.Header>
                        <Card.Body className='px-0 py-2'>
                            <Table responsive hover>
                                <tbody>

                                    {
                                        requestList.slice((currentProcessPage - 1) * 6, currentProcessPage * 6).map(request =>

                                            <tr key={request.id} className="unread row">
                                                <td className="col-md-1 justify-content-center text-center d-flex align-items-center">
                                                    <img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="activity-user" />
                                                </td>
                                                <td className="col-md-3 ">
                                                    <h6 className="mb-1"> {request.cabinetName} - Box {request.boxNum}</h6>
                                                    <p className="m-0 d-flex align-items-center">
                                                        {(request?.requestType == 0) && <span>Check Box</span>}
                                                        {(request?.requestType == 1) && <span>Check Connection</span>}
                                                        {(request?.requestType == 2) && <span>Check Expired Items</span>}
                                                        <span className="material-icons f-20 px-2">
                                                            assignment_ind
                                                        </span>

                                                        {request.assigneeFullName}

                                                    </p>
                                                </td>
                                                <td className="col-md-3 text-dark d-flex align-items-center">


                                                    <span class="material-icons f-20 mr-2">
                                                        query_builder
                                                    </span>

                                                    {new Date(request.createdAt).toGMTString()}


                                                </td>
                                                <td className="col-md-1 d-flex align-items-center">

                                                    <i className={request.done == 1 ?
                                                        "fa fa-circle text-c-green f-10 m-r-15" :
                                                        "fa fa-circle text-c-red f-10 m-r-15"} />
                                                    {request.done ? "Done" : "Checking"}
                                                </td>
                                                <td className="col-md-2 d-flex align-items-center">
                                                    {request.statusName}
                                                </td>
                                                <td className="col-md-2 d-flex align-items-center">
                                                    {/* <Button size="small" className="label theme-bg2 text-white f-12" onClick={() => handleDelete(request)}>Delete</Button> */}
                                                    <Button size="small" className="label theme-bg text-white f-12" onClick={() => setOpenForm(request)}>More</Button>
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

            </Row>
        </Aux>
    );

}

