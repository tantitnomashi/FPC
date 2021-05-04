import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tabs, Tab, Button, Form, FormControl } from 'react-bootstrap';
import API from '../../utils/adminApi';
import Aux from "../../hoc/_Aux";
import ConfirmDialog from '../commonComponent/Confirm';
import TemplateForm from './TemplateForm';
import { NotificationManager } from 'react-notifications';
import { waiting } from '../../utils/waiting';
import moment from 'moment';

const MAX_PADDING = 2;
const SIZE = 4;
export default function Template() {

    const [templates, setTemplates] = React.useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState({});
    // for preview template
    const [dataTemplateArr, setDataTempleteArr] = useState([]);

    const [open, setOpen] = React.useState(false);
    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [openTemplate, setOpenTemplate] = React.useState(false);

    const [currentTemplate, setCurrentTemplate] = React.useState(null);


    // for new template 
    // for grid
    const [arrView, setArrView] = useState([]);
    const [dataArrView, setDataArrView] = useState([]);


    const [maxCol, setMaxCol] = useState('');
    const [maxRow, setMaxRow] = useState('');
    const [maxColNum, setMaxColNum] = useState(0);
    const [maxRowNum, setMaxRowNum] = useState(0);






    useEffect(() => {
        waiting.setWait(true);

        loadAdminCabinets();
    }, []);

    const loadAdminCabinets = () => {
        API.getCabitnetTemplate()
            .then((response) => {
                if (response.data.statusCode == 200) {
                    console.log('load templates ', response.data.data);
                    setTemplates(response.data.data);
                    setSelectedTemplate(response.data.data[0]);
                    let dataView = generateView(response.data.data[0]);
                    setDataTempleteArr(dataView);
                    // rendered
                    waiting.setWait(false);
                } else if (response.data.statusCode == 201) {
                    setTemplates(response.data.data);

                } else {
                    alert('Cant get Cabi !')
                }
            })
        // .catch(e => console.log(e + "hihi"));

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
        API.deleteCabinetTemplate(currentTemplate.id)
            .then((response) => {
                if (response.data.statusCode == 200) {
                    NotificationManager.success('Delete template successfully!', 'Delete Template');
                    setTemplates(response.data.data);
                    loadAdminCabinets();
                } else {
                    NotificationManager.error('Sorry, Cannot delete this template!', 'Delete Template');
                }
            }).catch(e => NotificationManager.error('Sorry, Cannot delete this template!', 'Delete Template'));
        setCloseForm();
    }


    const generateView = (previewTemplate) => {
        // generate view from a template here
        let dataView = [];


        for (var i = 0; i < previewTemplate.rowsCnt * previewTemplate.colsCnt; i++) {
            dataView.push({
                color: "",
                name: "",
            });
        }


        for (var i = 0; i < previewTemplate.boxConfigurations.length; i++) {

            //each box 
            let boxSize = previewTemplate.boxConfigurations[i].boxSizeType;
            let topLeft = previewTemplate.boxConfigurations[i].topLeftPosition;
            let left = parseInt(topLeft.split(",")[1]);
            let top = parseInt(topLeft.split(",")[0]);
            let position = 0;

            if (left % previewTemplate.colsCnt == 0) {
                position = (top - 1) * previewTemplate.colsCnt + previewTemplate.colsCnt - 1;

            } else {
                position = (top - 1) * previewTemplate.colsCnt + (left % previewTemplate.colsCnt) - 1;

            }
            console.log("dataView Wi", top, left, position, boxSize.sizeName)
            let isTop = true;
            let isLeft = true;
            for (var wi = position; wi < (boxSize.virtualWidth + position); wi++) {

                let currentIndex = wi;
                for (var hi = wi; hi < boxSize.virtualHeight + wi; hi++) {
                    // dataView[hi + previewTemplate.colsCnt].color = "red";
                    // console.log("hi", hi, boxSize.sizeName, previewTemplate.colsCnt, hi + previewTemplate.colsCnt)
                    dataView[currentIndex].name = " ";
                    if (isTop) {
                        dataView[currentIndex].top = "1px solid white";

                        dataView[currentIndex].name = "Box " + previewTemplate.boxConfigurations[i].boxNum;
                    }
                    if (isLeft) {
                        dataView[currentIndex].left = "1px solid white";
                    }
                    if (wi == boxSize.virtualWidth + position - 1) {
                        dataView[currentIndex].right = "1px solid white";
                    }

                    if (hi == boxSize.virtualHeight + wi - 1) {
                        dataView[currentIndex].bottom = "1px solid white";
                    }
                    isTop = false;
                    currentIndex += previewTemplate.colsCnt;
                }
                isLeft = false;
            }

        }
        let arrView = [];

        for (let i = 0; i < dataView.length; i++) {
            let data = dataView[i];
            let dataDiv = <div key={`${i}`}
                className={(data.name ? "bg-warning" : "bg-secondary") + (data.name ? " text-dark" : " text-light")}
                style={{
                    borderTop: data.top ? data.top : "",
                    borderLeft: data.left ? data.left : "",
                    borderRight: data.right ? data.right : "",
                    borderBottom: data.bottom ? data.bottom : "",
                    justifyItems: "center",
                    alignItems: "center",
                    textAlign: "center",
                    display: "flex",
                    fontSize: "1.5em"
                }}

            ><div style={{
                flex: 1,
            }}>{data.name ? data.name : "Hub"}</div></div>
            arrView.push(dataDiv);
        }
        setArrView(arrView);

        // setArrView(gridArr);
        let maxRowString = "";
        let size = 110;
        let rowNum = 0;
        for (let i = 0; i < previewTemplate.rowsCnt; i++) {
            maxRowString += "1fr ";
            rowNum += size;
        }
        let maxColString = "";
        let colNum = 0;
        for (let i = 0; i < previewTemplate.colsCnt; i++) {
            maxColString += "1fr ";
            colNum += size;
        }
        setMaxCol(maxColString);
        setMaxColNum(colNum);
        setMaxRow(maxRowString);
        setMaxRowNum(rowNum);



    }
    const handlePreview = (previewTemplate) => {
        setSelectedTemplate(previewTemplate)
        console.log("### Box Configs:", previewTemplate);
        let dataView = generateView(previewTemplate);
        setDataTempleteArr(dataView);
        // setPreTemplate(preTemplate);
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
            <TemplateForm reload={loadAdminCabinets} open={openTemplate} handleClickClose={setCloseForm} />
            <ConfirmDialog open={openConfirm} onAccessLabel={"Delete"}
                tilte="Delete Confirm" message={"Are you sure to delete " + currentTemplate?.id} onAccess={() => requestDelete(currentTemplate?.name)} onCancel={setCloseForm} />

            <Row>

                <Col md={6} xl={12}>
                    <Card className='Cabinet List'>
                        <Card.Header>
                            <Card.Title as='h5'>Cabinet Template List</Card.Title>
                        </Card.Header>
                        <Card.Body className='px-3 py-2'>
                            <Row>
                                <Col md={8}>
                                    {
                                        templates?.map((template, index) =>
                                            <Row key={template.id} className="unread py-3 px-1 my-2 border-bottom border-light">

                                                <Col md={2} className='d-flex align-items-center text-center text-dark' >
                                                    <span className="f-18">{"Template " + (++index)}</span>
                                                </Col>
                                                <Col md={4} className='text-left d-flex align-items-center'>
                                                    <span className="material-icons f-20 m-r-5">
                                                        dashboard</span>
                                                    <span className="text-dark f-18"> {template.rowsCnt + " rows x " + template.colsCnt + " cols"}</span>

                                                </Col>
                                                <Col md={4} className="d-flex f-18 align-items-center text-dark">

                                                    {moment(template.updatedAt).add(7, "h").calendar()}


                                                </Col>

                                                <Col md={2} className='d-flex justify-content-end  '>
                                                    <Button size="small" className="label theme-bg2 text-white f-12" onClick={() => handleDelete(template)}>Delete</Button>
                                                </Col>
                                            </Row>
                                        )
                                    }
                                </Col>
                                <Col md={4}>





                                    <div style={{
                                        display: "grid",
                                        height: maxRowNum + "px",
                                        width: maxColNum + "px",
                                        gridTemplateColumns: maxCol,
                                        gridTemplateRows: maxRow
                                    }}>
                                        {
                                            arrView.map(val => {
                                                return val;
                                            })
                                        }
                                    </div>


                                    <div className="mt-2">
                                        {templates?.map((value, index) =>
                                            <div key={index} className="btn btn-dark" style={{
                                                position: 'relative', display: 'inline-block', width: '60px', height: '40px', marginRight: '3px'
                                            }} onClick={() => handlePreview(value)}>

                                                {index + 1}
                                                {selectedTemplate.id == value.id && <div style={{ position: 'absolute', top: '0', right: '0', color: 'greenyellow' }}>
                                                    <span className="material-icons">check_circle</span>
                                                </div>}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            </Row>




                        </Card.Body>
                    </Card>
                </Col>



            </Row>

        </Aux>
    );
}