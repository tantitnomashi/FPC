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


    const generateView = (exampleTemplate) => {
        let view = [];
        let data4View = [];
        console.log("##Generate view ....");
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
                name: c.boxNum,
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

                        boxView.push(BoxItem('', iArr, 30, 30));
                    }
                    currentIndex = e1.top;
                }
                currentIndex += indexTmp;

                boxView.push(BoxItem('Box' + e1.name, e1, e1.w, e1.h));
            })
        });
        return view;
    }
    const handlePreview = (previewTemplate) => {
        setSelectedTemplate(previewTemplate)
        console.log("### Box Configs:", previewTemplate);
        let dataView = generateView(previewTemplate);
        setDataTempleteArr(dataView);
        // setPreTemplate(preTemplate);
    }
    const BoxItem = (data, e, w, h) => {

        return <div key={1} id={e.id} style={{ padding: `${MAX_PADDING}px`, width: `${w * SIZE}px`, height: `${h * SIZE}px` }}>
            <div className={"w-100 h-100 d-flex align-items-center" + (data.length > 3 ? " bg-warning" : " bg-secondary")} >
                <h3 className="text-center mx-auto">  {data}</h3>
            </div>
        </div >
        // }
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

                                    <div className="d-flex flex-row" style={{ height: '600px' }}>
                                        {
                                            dataTemplateArr.map((e, i) => (
                                                <div key={i}>
                                                    {e.map((b) => b)}
                                                </div>
                                            ))
                                        }
                                    </div>

                                    <div className="mt-2">
                                        {templates.map((value, index) =>
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

                {/* <Col md={6} xl={6}>
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
 */}

            </Row>

        </Aux>
    );
}