import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Image, Form, FormControl, InputGroup } from 'react-bootstrap';
import { TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import API from '../../utils/adminApi'
import { element } from 'prop-types';
import { NotificationManager } from 'react-notifications';

const MAX_PADDING = 2;
const SIZE = 4;
export default function TemplateForm(props) {
    const { open, handleClickClose, currentProfile } = props;
    const [type, setType] = useState(0);
    const [preTemplate, setPreTemplate] = useState({});
    const [boxAmount, setBoxAmount] = useState(4);
    const [arrBox, setArrBox] = useState([]);
    const [size, setSize] = React.useState([]);
    const [dataTemplateArr, setDataTempleteArr] = useState([]);
    const [previewFlag, setPreviewFlag] = useState(false);

    //for validate
    const [validated, setValidated] = useState(false);


    useEffect(() => {
        loadAdminBoxSize();
    }, []);

    // const [exampleTemplate, setExampleTemplate] = useState({});

    const loadAdminBoxSize = () => {
        API.getBoxSizes()
            .then((response) => {
                if (response.data.statusCode == 200) {
                    console.log('load size ', response.data.data);
                    setSize(response.data.data);
                } else {
                    alert('Cant get Cabi !')
                }
            }).catch(e => console.log(e + "hihi"));

    }



    const handleBoxAmountChange = (e) => {
        e.preventDefault();


        let amount = e.target.value;
        setBoxAmount(amount);

    }
    const handleAddBoxToCabinet = () => {
        let arr = [];

        for (var i = 0; i < boxAmount; i++) {

            let sampleDiv = <div>
                <Row className="py-2">

                    <Col md={3} xl={3} style={{
                        display: 'flex',
                        alignItems: "center",
                        fontSize: "1.2em"
                    }}>Box {i + 1} </Col>
                    <Col md={6} xl={4}>

                        <div className="btn-group" role="group">

                            <select id={"size" + i} class="form-select" aria-label="Default select example">
                                {

                                    size?.map((value, index) =>
                                        <option value={value.id} selected={index == 0 ? true : false}>{value.sizeName}</option>
                                    )
                                }
                            </select>
                        </div>
                    </Col>
                    <Col md={3} xl={4}>
                        <div className="btn-group d-flex align-items-center justify-content-start" role="group">
                            <label htmlFor={"position" + i} className="mr-2">Position</label>
                            <input type="text" required className="form-control" name={'position' + i} id={"position" + i} />
                        </div>
                    </Col>
                </Row>

            </div>
            arr.push(sampleDiv);
        }

        setArrBox(arr);
        setPreviewFlag(true);

    }
    const handlePreview = () => {
        let boxConfigs = [];

        for (var i = 0; i < boxAmount; i++) {
            var e = document.getElementById("size" + i);
            var value = e.options[e.selectedIndex].value;
            let demoConfigs = {
                boxSizeTypeId: parseInt(value),
                topLeftPosition: document.getElementById('position' + i).value,
                boxNum: i + 1
            }
            boxConfigs.push(demoConfigs);
        }

        let previewTemplate = {
            name: document.getElementById('name').value,
            boxCnt: parseInt(boxAmount),
            imgUrl: 'https://picsum.photos/300/400',
            boxConfigurations: boxConfigs,

        }
        let maxColumn = 0;
        let maxRow = 0;


        previewTemplate.boxConfigurations.map((c) => {
            let index = c.topLeftPosition.indexOf(",");
            let row = parseInt(c.topLeftPosition.substr(0, index), 10);
            let col = parseInt(c.topLeftPosition.substr(index + 1, c.topLeftPosition.length), 10);
            if (maxColumn < col) {
                maxColumn = col;
            }

            if (maxRow < row) {
                maxRow = row;
            }

        })
        previewTemplate.rowsCnt = maxRow;
        previewTemplate.colsCnt = maxColumn;


        console.log("### Box Configs:", previewTemplate);
        let dataView = generateView(previewTemplate);
        setDataTempleteArr(dataView);
        setPreTemplate(previewTemplate);
    }

    const sumbitFormTemplate = () => {



        API.createCabinetTemplate(preTemplate).then((response) => {
            if (response.data.statusCode == 200) {
                console.log('load cabinets ', response.data.data[0]);
                NotificationManager.success('Create template successfully!', 'Create template');

            } else if (response.data.statusCode == 201) {
                NotificationManager.success('Create template successfully!', 'Create template');

            } else {
                NotificationManager.error('Sorry, Create this template!', 'Create template');
            }
        }).catch(e => NotificationManager.error('Sorry, Create this template!', 'Create template'));

        handleClickClose();
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
            let found = size.find(element => element.id == c.boxSizeTypeId);
            console.log('###found', found);
            let numBox = (found.actualHeight) / 30;
            boxView.push({
                id: c.id,
                name: c.boxNum,
                sizeName: found.sizeName,
                top: top,
                numBox: numBox,
                w: found.actualWidth,
                h: found.actualHeight// + ((numBox - 1) * MAX_PADDING / 2)
            });

        });

        data4View.map((e, i) => {
            let currentIndex = 1;
            e.map((e1, iArr) => {
                let boxView = view[i];
                let indexTmp = e1.numBox;
                if (e1.top != currentIndex) {
                    for (let iL = 0; iL < e1.top - currentIndex; iL++) {

                        boxView.push(BoxItem('Hub', iArr, 30, 30));
                    }
                    currentIndex = e1.top;
                }
                currentIndex += indexTmp;

                boxView.push(BoxItem('Box ' + e1.name, e1, e1.w, e1.h));
            })
        });
        return view;
    }

    const BoxItem = (data, e, w, h) => {

        return <div id={e.id} style={{ padding: `${MAX_PADDING}px`, width: `${w * SIZE}px`, height: `${h * SIZE}px` }}>
            <div className="bg-warning w-100 h-100 d-flex align-items-center" >
                <h3 className="text-center mx-auto">  {data}</h3>

            </div>
        </div>
        // }
    }


    console.log(currentProfile);

    return (

        <Dialog maxWidth={'lg'} fullWidth={true} className="dialog-userForm" open={open} onClose={handleClickClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create New Template</DialogTitle>
            <div>

            </div>
            <DialogContent>
                <DialogContentText   >
                    To {currentProfile ? "update" : "create"} Cabinet, please fill all fields below.
                            </DialogContentText>


                <Form noValidate validated={validated} onSubmit={(e) => {
                    const form = e.currentTarget;
                    e.preventDefault();
                    e.stopPropagation();
                    if (form.checkValidity() === false) {
                    } else {
                        sumbitFormTemplate();
                    }
                    setValidated(true);

                }

                }>
                    <Row>

                        <Col md={8} xl={7}>
                            <Form.Label column lg={12}>Name </Form.Label>
                            <Form.Control className="my-1" id="name" name="cabinet-name"
                                label="Name" required={true}
                                type="Text" placeholder="" />
                            <Form.Control.Feedback type="invalid" required={true}>
                                Please input Template name, 8 - 50 characters.
                            </Form.Control.Feedback>

                            <Form.Label column lg={12}>Box Amount</Form.Label>
                            <Form.Control className="my-1" id="base-price" onChange={(e) => handleBoxAmountChange(e)}
                                type="number" required={true} min="1" step="1" />

                            <Form.Control.Feedback type="invalid" required={true}>
                                Please input Box amount, number greater than 0.
                                 </Form.Control.Feedback>

                            <Button onClick={handleAddBoxToCabinet} variant="dark">
                                Generate
                                 </Button>
                            {
                                (previewFlag) && <Button onClick={handlePreview} className="text-dark" variant="warning">
                                    Preview
                            </Button>

                            }



                            <div style={{ overflowY: 'scroll', overflowX: 'hidden', maxHeight: '400px' }}>
                                {
                                    arrBox.map((value, index) => value)
                                }
                            </div>



                        </Col>

                        <Col md={4} xl={5}>
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

                    </Row>

                    <DialogActions>
                        <Button onClick={() => {
                            handleClickClose();
                            setValidated(false);
                        }} variant="secondary">
                            Cancel
                                 </Button>

                        <Button className='px-4'
                            type="submit"
                            color="primary">
                            Save
                    </Button>
                    </DialogActions>
                </Form>
            </DialogContent >



        </Dialog >
    );
}
