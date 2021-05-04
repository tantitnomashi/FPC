import React, { useState, useEffect } from 'react';
import {
    Row, Col, Card, Table, Tabs, Button, Form, FormControl,
    Collapse, InputGroup
} from 'react-bootstrap';
import moment from 'moment';

import Aux from "../../hoc/_Aux";
import DEMO from "../../store/constant";
import Pagination from "react-js-pagination";

import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../assets/images/user/avatar-3.jpg';
import ConfirmDialog from '../commonComponent/Confirm';
import TransactionDetail from './TransactionDetail';
import API from '../../utils/adminApi';
import { NotificationManager } from 'react-notifications';

import { waiting } from '../../utils/waiting';



export default function Transaction() {
    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [currentTransaction, setCurrentTransaction] = React.useState(null);
    const [trans, setTrans] = React.useState([]);
    const [isBasic, setIsBasic] = useState(false);
    var sapmle = require('../../sampleData/transactionStatus.json');


    // for paging

    let [currentProcessPage, setCurrentProcessPage] = useState(1);
    const [totalItemsCount, setTotalItemsCount] = useState(0); //projects count

    // for details
    const [open, setOpen] = React.useState(false);
    const setOpenForm = (currentTrans) => {
        setOpen(true);
        setCurrentTransaction(currentTrans);
    };

    const setCloseForm = () => {
        setOpen(false);
        loadData();
    };

    useEffect(() => {
        waiting.setWait(true);

        loadData();
    }, []);

    const loadData = () => {
        console.log("###reload data...")
        API.getTransaction()
            .then((response) => {
                if (response.data.statusCode == 200) {
                    let tmp = response.data.data;
                    tmp = tmp.sort((a, b) => {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    })
                    setTrans(tmp);
                    setTotalItemsCount(response.data.data.length);
                    // rendered
                    waiting.setWait(false);
                    // setFilterList(tmp)
                } else {
                    alert('Cant get Trans !')
                }
            }).catch(e => console.log(e + "##ERR load data Transactions"));

    }


    // for confirm diaglog
    const handleDelete = (currentTransaction) => {
        setOpenConfirm(true);
        if (currentTransaction) {
            setCurrentTransaction(currentTransaction);
        } else {
            setCurrentTransaction(null);
        }
    }
    const requestDelete = (username) => {
        setTimeout(() => {

            setOpenConfirm(true);
        }, 2000);
    }
    const setCloseConfirmForm = () => {
        setOpenConfirm(false);

    };


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
        filteredList = trans;
        console.log("show res", filteredList);

    } else {
        filteredList = trans.filter(item =>
            activeFilter.includes(item.statusName)
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
            <TransactionDetail open={open} handleClickClose={setCloseForm} currentTransaction={currentTransaction} />

            <ConfirmDialog open={openConfirm}
                tilte="Delete Confirm" message={"Are your sure to delete this transaction:  " + currentTransaction?._id} onAccess={() => requestDelete(currentTransaction?._id)} onCancel={setCloseConfirmForm} />
            <Row className="pb-3">
                <Col className="text-left" md={6} xl={6}>
                    <Button variant="outline-secondary" onClick={() => setIsBasic(!isBasic)}>Filter Status</Button>
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
                                                <React.Fragment className="f-15">

                                                    <input
                                                        className="mx-1" type="checkbox"
                                                        checked={activeFilter.includes(filter.statusName)}
                                                        onClick={() => onFilterChange(filter.statusName)}
                                                    />
                                                    <label htmlFor={filter.status}>{filter.statusName}</label>
                                                </React.Fragment>
                                            ))}
                                        </Form>

                                    </div>
                                </div>

                            </Col>


                        </Row>
                    </Collapse>

                </Col>
                <Col className="text-right justify-content-end" md={6} xl={6}>
                    {/* <Form inline className="justify-content-end">
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                        <Button size="sm" variant="outline-secondary">Search</Button>
                    </Form> */}



                </Col>
            </Row>

            <Row>

                <Col md={6} xl={12}>
                    <Card className='Recent-Users'>
                        <Card.Header>
                            <Card.Title as='h5'>Recent Rental Transaction</Card.Title>
                        </Card.Header>
                        <Card.Body className='px-0 py-2'>
                            <Table responsive hover>
                                <tbody>

                                    {

                                        filteredList.slice((currentProcessPage - 1) * 6, currentProcessPage * 6).map(transaction =>

                                            <tr className="unread row">
                                                <td className="col-md-1 justify-content-center text-center d-flex align-items-center">
                                                    <img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="activity-user" />
                                                </td>
                                                <td className="col-md-3 ">
                                                    {
                                                        (transaction.transactionType == "ThirdParty") &&
                                                        <h6 className="mb-1"> 3rd Party - Box {transaction.boxNum}</h6>

                                                    }
                                                    {
                                                        (transaction.transactionType != "ThirdParty") &&
                                                        <h6 className="mb-1"> {transaction.cabinetName}- Box {transaction.boxNum}</h6>

                                                    }
                                                    <p className="m-0 d-flex align-items-center">
                                                        {transaction.amount > 0 ? transaction.amount : "Unknown"}
                                                        <span class="material-icons f-20 px-2">
                                                            assignment_ind
                                                        </span>
                                                        {transaction.userName}
                                                    </p>
                                                </td>
                                                <td className="col-md-3 d-flex align-items-center text-dark">

                                                    <i className={transaction.Status == 1 ?
                                                        "fa fa-circle text-c-green f-10 m-r-15" :
                                                        "fa fa-circle text-c-red f-10 m-r-15"} />

                                                    {/* {new Date(transaction.rentStartTime).toGMTString()} */}
                                                    {moment(transaction.rentStartTime).add(7, "h").calendar()}


                                                </td>
                                                <td className="col-md-1 d-flex align-items-center text-dark">
                                                    <span class="material-icons f-20 mr-2">
                                                        query_builder
                                                    </span>
                                                    {transaction.rentDuration}
                                                </td>
                                                <td className="col-md-2 d-flex align-items-center">
                                                    {transaction.statusName}
                                                </td>
                                                <td className="col-md-2 d-flex align-items-center">
                                                    {/* <Button size="small" className="label theme-bg2 text-white f-12" onClick={() => handleDelete(transaction)}>Delete</Button> */}
                                                    <Button size="small" className="label theme-bg text-white f-12" onClick={() => setOpenForm(transaction)}>More</Button>
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

