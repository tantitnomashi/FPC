import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tabs, Tab, Button, Form } from 'react-bootstrap';
import API from '../../utils/adminApi';
import BoxHistory from './BoxHistory';
import Aux from "../../hoc/_Aux";
import BoxSizeForm from '../boxsize/BoxSizeForm';
import ConfirmDialog from './ActionDialog';
import { element } from 'prop-types';
import { useDispatch } from 'react-redux';
import BoxDetail from './BoxDetail';
import { NotificationManager } from 'react-notifications';


const MAX_PADDING = 2;
const SIZE = 4;
export default function Box({ match }) {

    const cabinetId = match.params.id;

    // list box from Api 
    const [boxes, setBoxes] = React.useState([]);

    const [open, setOpen] = React.useState(false);
    const [openConfirm, setOpenConfirm] = React.useState(false);

    const [currentBox, setcurrentBox] = React.useState(null);
    const [currentCabinet, setCurrentCabinet] = React.useState(null);
    const [dataTemplateArr, setDataTempleteArr] = useState([]);
    let testData = [];
    //demo => 
    const [exampleTemplate, setExampleTemplate] = useState({});

    useEffect(() => {
        console.log("### Reload data..")
        loadDataRendering();
    }, []);

    useEffect(() => {
        console.log("trigger exampleTemplate", exampleTemplate)
        if (Object.keys(exampleTemplate).length) {
            API.getBoxesInCabinet(cabinetId)
                .then((response) => {
                    if (response.data.statusCode == 200) {
                        console.log("##Checklist boxes fr api", response.data.data);
                        setBoxes(response.data.data);
                        testData = response.data.data;

                        // call generate view
                        let dataView = generateView(response.data.data);
                        console.log("data template", dataView)
                        setDataTempleteArr(dataView);
                    } else {
                        NotificationManager.error('Cannot get box list! Please check the network again!', 'Load data')
                    }
                }).catch(e => NotificationManager.error('Cannot get box list! Please check the network again!', 'Load data'));


            API.getCabinetById(cabinetId)
                .then((response) => {
                    if (response.data.statusCode == 200) {
                        setCurrentCabinet(response.data.data);
                    } else {
                        NotificationManager.error('Cannot get current cabinet! Please check the network again!', 'Load data')
                    }
                }).catch(e => NotificationManager.error('Cannot get current cabinet! Please check the network again!', 'Load data'));

        }
    }, [exampleTemplate])

    console.log("Boxes outside", boxes)
    const loadDataRendering = () => {
        API.getTemplateByCabinetId(cabinetId)
            .then((response) => {
                if (response.data.statusCode == 200) {
                    // force setting current Example immediately
                    setExampleTemplate(response.data.data);
                } else {
                    NotificationManager.error('Cannot get template! Please check the network again!', 'Load data');
                }
            }).catch(e => NotificationManager.error('Cannot get template! Please check the network again!', 'Load data'));
    }
    const setOpenForm = (currentBox) => {
        setOpen(true);
        setcurrentBox(currentBox);
    };

    const setCloseForm = () => {
        setOpen(false);
        setOpenConfirm(false);
    };

    const onOpenBox = (status) => {
        console.log("Current Status update", status);
        API.updateBoxStatus({
            cabinetId: cabinetId,
            boxNum: currentBox.boxNum,
            status: status
        }).then((response) => {

            if (response.data.statusCode == 200) {

                NotificationManager.success('Update box status successfully !', 'Update Box ');

            } else {
                NotificationManager.error('Sorry, Cannot update this box !', 'Update Box');
            }
        }).catch(e => NotificationManager.error('Sorry, Cannot update this box !', 'Update Box'));
        setCloseForm();
        setTimeout(loadDataRendering, 100);
    }

    const handleDetail = (boxId, boxes) => {
        const found = boxes.find(element =>
            element.id == boxId
        );

        if (found) {
            setcurrentBox(found);
        } else {
            setcurrentBox(null);
        }
        setOpenConfirm(true);
    }

    const generateView = (items) => {
        let view = [];
        let data4View = [];
        console.log("##Generate view ....");
        console.log("##Generate current boxes", boxes);
        console.log("##Generate current example", exampleTemplate);
        for (let i = 0; i < exampleTemplate.colsCnt; i++) {
            view.push([]);
            data4View.push([]);
        }


        exampleTemplate.boxConfigurations.map((c) => {
            let index = c.topLeftPosition.indexOf(",");
            let top = parseInt(c.topLeftPosition.substr(0, index), 10);
            let left = parseInt(c.topLeftPosition.substr(index + 1, c.topLeftPosition.length), 10);

            let boxView = data4View[left - 1];
            let numBox = (c.boxSizeType.actualHeight) / 30;
            boxView.push({
                id: c.id,
                name: c.topLeftPosition,
                sizeName: c.boxSizeType.sizeName,
                top: top,
                numBox: numBox,
                w: c.boxSizeType.actualWidth,
                h: c.boxSizeType.actualHeight// + ((numBox - 1) * MAX_PADDING / 2)
            });

        });

        data4View.map((e, i) => {
            let currentIndex = 1;
            e.map((e1, iArr) => {
                let boxView = view[i];
                let indexTmp = e1.numBox;
                if (e1.top != currentIndex) {
                    for (let iL = 0; iL < e1.top - currentIndex; iL++) {

                        boxView.push(BoxItem(null, iArr, 30, 30));
                    }
                    currentIndex = e1.top;
                }
                currentIndex += indexTmp;

                boxView.push(BoxItem(items, e1, e1.w, e1.h));
            })
        });
        return view;
    }

    const BoxItem = (boxNums, e, w, h) => {
        if (e?.id && boxNums?.length > 2) {
            return <div key={e.id}>
                {boxNums?.map((item) => {
                    let bgColor = item.rentingStatus === 1 ? "bg-warning" : item.rentingStatus === 2 ? "bg-danger" : "bg-primary"

                    if (e.id == item.positionId) {
                        return <BoxDetail id={item.id} handleDetail={handleDetail} p={MAX_PADDING} w={w * SIZE} h={h * SIZE} bgColor={bgColor} item={item} boxes={boxNums} ></BoxDetail>
                    } else {
                        return null;
                    }
                })
                }
            </div>
        } else {
            return <div id={e.id} style={{ padding: `${MAX_PADDING}px`, width: `${w * SIZE}px`, height: `${h * SIZE}px` }}>
                <div className="bg-secondary w-100 h-100">

                </div>
            </div>
        }
    }


    return (
        < Aux >
            <Row>
                <Col md={6} xl={12}>
                    <Card className=''>
                        <Card.Header>
                            <Card.Title as='h5'>Box Management</Card.Title>
                        </Card.Header>
                        <Card.Body className='px-3 py-2'>
                            <Row className="text-dark py-3 px-1 my-2 border-bottom border-light">

                                <Col md={3} className='text-left mt-3' >
                                    <Card.Title>{currentCabinet?.name}</Card.Title>
                                    <Card.Text>
                                        {currentCabinet?.location.buildingName}
                                    </Card.Text>
                                    <Card.Title>Address</Card.Title>
                                    <Card.Text>
                                        <span className="material-icons f-20 m-r-5">
                                            room</span>
                                        {currentCabinet?.location.fullAddress}
                                    </Card.Text>
                                    <Card.Title>{boxes?.length + " boxes in cabinet"}</Card.Title>
                                    <Card.Text>
                                        Some quick example text to build on the card title and make up the bulk of
                                        the card's content  .
                                      </Card.Text>

                                </Col>

                                <Col md={4} className='text-left'>
                                    <div className="d-flex flex-row">
                                        {
                                            dataTemplateArr.map((e, i) => (
                                                <div key={i}>
                                                    {e.map((b) => b)}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </Col>
                                <Col md={5} className='text-left' >
                                    <h4>Box Action History</h4>


                                    <BoxHistory boxId={"22"} count={"10"} boxes={boxes}></BoxHistory>
                                </Col>
                            </Row>


                        </Card.Body>
                    </Card>
                </Col>
            </Row>


            <ConfirmDialog open={openConfirm}
                tilte="Box Detail" currentBox={currentBox}
                onAccessLabel={"AAA"}
                message={"Choose an action for this box " + currentBox?.boxNum}
                item={currentBox} onOpenBox={onOpenBox} onCancel={setCloseForm} />



        </Aux >
    );
}