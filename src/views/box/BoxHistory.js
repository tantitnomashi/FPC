import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tabs, Tab, Button, Form } from 'react-bootstrap';
import API from '../../utils/adminApi'
import Pagination from "react-js-pagination";

import Aux from "../../hoc/_Aux";
import BoxSizeForm from '../boxsize/BoxSizeForm';
import ConfirmDialog from './ActionDialog';
import { element } from 'prop-types';
import { useDispatch } from 'react-redux';
import BoxDetail from './BoxDetail';
import { NotificationManager } from 'react-notifications';

export default function BoxHistory(props) {
    const { boxId, count, boxes } = props;
    // for paging

    let [currentProcessPage, setCurrentProcessPage] = useState(1);
    const [totalItemsCount, setTotalItemsCount] = useState(0); //projects count

    //demo => 
    const [history, setHistory] = useState([]);
    const [currentBoxHis, setcurrentBoxHis] = React.useState(null);

    useEffect(() => {
        console.log("### Reload data..")
        loadDataRendering();
    }, [currentBoxHis, boxes]);



    const loadDataRendering = () => {

        console.log("#### Boxes", boxes);
        if (boxes.length) {

            let params = {
                boxId: currentBoxHis ? currentBoxHis : boxes[0].id,
                count: count
            }
            API.getBoxHistoryCount(params)
                .then((response) => {
                    if (response.data.statusCode == 200) {
                        // force setting current Example immediately
                        setHistory(response.data.data);
                        setTotalItemsCount(response.data.data.length);
                        NotificationManager.info('Load History', 'Load data');

                    } else {
                        NotificationManager.error('Cannot get history! Please check the network again!', 'Load data');
                    }
                }).catch(e => NotificationManager.error('Cannot get history! Please check the network again!', 'Load data'));
        }
    }

    const handleBoxChange = () => {

    }


    // Pagination for project process data
    const getProcessData = page => {
        setCurrentProcessPage(page);
        console.log(currentProcessPage)
        console.log(totalItemsCount)
        console.log(page);

    }
    return (
        < Aux >
            <Row>
                <Col md={6} xl={12}>
                    <Card className=''>

                        <Card.Body className='px-3 py-2'>
                            <Row className="d-flex justify-content-center text-center d-flex align-items-center">
                                <Col md={3}>
                                    <h5>Choose Box:</h5>
                                </Col>
                                <Col md={2}>
                                    <Form>
                                        <Form.Control as="select" custom
                                            onChange={(e) => {
                                                let text = e.target.value;
                                                setcurrentBoxHis(text)
                                            }} >

                                            {
                                                boxes.map((value, index) =>
                                                    <option className="mx-auto" key={value} value={value.id}> {++index} </option>
                                                )
                                            }

                                        </Form.Control>
                                    </Form>
                                </Col>

                            </Row>
                            {history.length > 0 &&
                                <Row className="unread py-3 px-1 my-2 border-bottom border-light">

                                    <Table>

                                        <tbody className="px-2">

                                            {
                                                history.slice((currentProcessPage - 1) * 6, currentProcessPage * 6).map((item, index) =>

                                                    <tr key={item.id} className="row">
                                                        <td className="col-md-3 justify-content-center text-center d-flex align-items-center">
                                                            {++index}
                                                        </td>
                                                        <td className="col-md-3 ">
                                                            {!(item.operationType) && <span className="text-danger">CLOSE</span>}

                                                            {(item.operationType) && <span className="text-success"> OPEN </span>}
                                                        </td>
                                                        <td className="col-md-6 text-dark d-flex align-items-center">
                                                            <span className="material-icons f-20 mr-2">
                                                                query_builder
                                                                  </span>

                                                            {new Date(item.createdAt).toGMTString()}
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


                                </Row>
                            }
                            {history.length == 0 &&

                                <Row className="d-flex justify-content-center text-center d-flex align-items-center">
                                    <h4 className="mt-3">No action found !</h4>
                                </Row>
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>


        </Aux >
    );
}