import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Image, Form, FormControl, InputGroup } from 'react-bootstrap';
import { TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import API from '../../utils/adminApi'
import { element } from 'prop-types';
import { NotificationManager } from 'react-notifications';

const MAX_PADDING = 2;
const SIZE = 4;
const MAX_COL = "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr";
const MAX_ROW = "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr";
const MAX_COL_NUM = 10;
const MAX_ROW_NUM = 10;
const COLOR_CATE = ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green',
    'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'red',
    'silver', 'teal', 'white', 'yellow'];
let indexLayout = -1;
let selectedSize = {};
let isAddCompleted = true;
let maxCol = 0;
let maxRow = 0;
export default function TemplateForm(props) {
    const { open, handleClickClose, currentProfile, reload } = props;
    const [size, setSize] = React.useState([]);



    // for grid
    const [arrView, setArrView] = useState([]);
    const [dataArrView, setDataArrView] = useState([]);

    useEffect(() => {
        indexLayout = -1;
        isAddCompleted = true;
        loadAdminBoxSize();
        handleAddBoxToCabinet([])
    }, []);

    // const [exampleTemplate, setExampleTemplate] = useState({});

    const loadAdminBoxSize = () => {
        API.getBoxSizes()
            .then((response) => {
                if (response.data.statusCode == 200) {
                    console.log('load size ', response.data.data);
                    setSize(response.data.data);
                    selectedSize = response.data.data[0];
                } else {
                    alert('Cant get Cabi !')
                }
            }).catch(e => console.log(e + "hihi"));

    }


    const handleRenderBoxDesign = (cellNum) => {
        let currentData = dataArrView;
        let isExisted = false;
        dataArrView.map(value => {
            if (value.index == cellNum) {
                isExisted = true;
            }
        })

        if (isExisted) {
            return;
        }
        if (!isAddCompleted) {

        } else {
            indexLayout++;
            isAddCompleted = false;
        }
        if (indexLayout == -1) {
            currentData.push({
                index: cellNum,
                boxNum: 1,
                sizeId: selectedSize.id,
                virtualHeight: selectedSize.virtualHeight,
                virtualWidth: selectedSize.virtualWidth,
                topLeft: (Math.floor(cellNum / MAX_COL_NUM) + 1) + "," + ((cellNum % MAX_ROW_NUM) + 1)
            });
            ++indexLayout;
        } else {
            currentData[indexLayout] = {
                index: cellNum,
                boxNum: indexLayout + 1,
                sizeId: selectedSize.id,
                virtualHeight: selectedSize.virtualHeight,
                virtualWidth: selectedSize.virtualWidth,
                topLeft: (Math.floor(cellNum / MAX_COL_NUM) + 1) + "," + ((cellNum % MAX_ROW_NUM) + 1)

            }
        }
        setDataArrView(currentData);
        handleAddBoxToCabinet(currentData);

    }
    const handleAddBoxToCabinet = (dataArrView) => {
        console.log("Inside handle render")
        let arr = [];
        let dataView = []
        dataArrView.map((val, index) => {

            let currentIndex = val.index;
            for (let i = 0; i < val.virtualHeight; i++) {
                for (let j = 0; j < val.virtualWidth; j++) {
                    dataView.push({
                        index: currentIndex + i + j,
                        color: (index % 2) == 1 ? "#f3ff0a" : "#aeff0d",
                        name: index + 1
                    })
                }
                currentIndex += MAX_COL_NUM - 1;
            }
        })
        for (let i = 0; i < MAX_COL_NUM * MAX_ROW_NUM; i++) {
            let hadBox = false;
            let e = (<div style={{
                width: "50px",
                height: "50px",
                display: "flex",
                margin: "0",
                border: "1px solid gray"
            }}
                onClick={() => handleRenderBoxDesign(i)}
            >
                {dataView.map((val, index, arr) => {
                    if (val.index == i) {
                        hadBox = true;
                        return (<div key={index} style={{
                            backgroundColor: val.color,
                            flex: 1
                        }}> {val.name}

                        </div>)
                    }
                })}

            </div>);
            arr.push(e);
        }
        console.log("#DATA VIEW", dataView);
        console.log("#DATA VIEW ARR", dataArrView);

        if (dataArrView?.lengthc) {
            for (var i = 0; i < dataArrView?.length; i++) {
                //+1 cause index from 0, -1 cause  the root size
                if (maxCol < (dataArrView[i].index % MAX_COL_NUM + 1 + dataArrView[i].virtualWidth - 1)) {
                    maxCol = (dataArrView[i].index % MAX_COL_NUM + 1 + dataArrView[i].virtualWidth - 1)
                }
                if (maxRow < (Math.floor(dataArrView[i].index / MAX_ROW_NUM + 1) + dataArrView[i].virtualHeight - 1)) {
                    maxRow = (Math.floor(dataArrView[i].index / MAX_ROW_NUM + 1) + dataArrView[i].virtualHeight - 1)
                }

            }
        }

        console.log("MAX COL - " + maxCol + " MAX ROW - " + maxRow);

        setArrView(arr);
    }
    const handleBackChange = () => {
        if (indexLayout == -1) {
            return
        }
        indexLayout--;
        let currentData = dataArrView;
        currentData.pop();
        setDataArrView(currentData);
        handleAddBoxToCabinet(currentData);
    }



    const sumbitFormTemplate = () => {


        let boxConfig = dataArrView.map((value, index) => {
            let box = {
                boxSizeTypeId: value.sizeId,
                topLeftPosition: value.topLeft,
                boxNum: value.boxNum
            }
            return box;

        });

        console.log("##### BOX CONFIG", boxConfig);

        let preTemplate = {
            boxCnt: dataArrView?.length,
            rowsCnt: maxRow,
            colsCnt: maxCol,
            imgUrl: "string",
            boxConfigurations: boxConfig

        }
        console.log("##### PRE", preTemplate);

        API.createCabinetTemplate(preTemplate).then((response) => {
            if (response.data.statusCode == 200) {
                NotificationManager.success('Create template successfully!', 'Create Template');
                reload();
                resetView();
            } else {
                NotificationManager.error('Sorry, Cannot create this Template!', 'Create Template')
            }
        }).catch(e => NotificationManager.warning('Create template!', 'Create Template')
        );
        handleClickClose();

    }
    const resetView = () => {
        setArrView([]);
        setDataArrView([]);
        handleAddBoxToCabinet([]);
    }

    return (

        <Dialog maxWidth={'sm'} fullWidth={true} className="dialog-userForm" open={open} onClose={handleClickClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create New Template</DialogTitle>
            <div>

            </div>
            <DialogContent>


                <Form>
                    <Row>

                        {/* <Col md={8} xl={4}>
                            <Form.Label column lg={12}>Name </Form.Label>
                            <Form.Control className="my-1" id="name" name="cabinet-name"
                                label="Name"
                                type="Text" placeholder="" />


                        </Col> */}


                        {/* the right part of create form */}
                        <Col md={4} xl={12}>
                            <Row >
                                <Col md={6}>   <Button variant="warning" className="text-dark" onClick={() => {
                                    isAddCompleted = true;
                                    console.log(dataArrView[dataArrView.length - 1]);
                                    NotificationManager.info('Added !', '');


                                }}>
                                    New Box
                                 </Button>

                                    <Button variant="dark" onClick={handleBackChange}>
                                        Undo
                                 </Button>
                                </Col>
                                <Col md={6}>
                                    <div className="btn-group d-flex align-items-center justify-content-center" role="group">

                                        <select id={"size"} class="form-select" onChange={(val) => {
                                            size?.map((value, index) => {
                                                if (val.target.value == value.id) {
                                                    console.log(value);
                                                    selectedSize = value;
                                                }
                                            })

                                        }} aria-label="Default select example">
                                            {

                                                size?.map((value, index) =>
                                                    <option value={value.id} selected={index == 0 ? true : false}>{value.sizeName}</option>
                                                )
                                            }
                                        </select>
                                        <label for="size" className="ml-3">Size</label>

                                    </div>
                                </Col>


                            </Row>




                            <div style={{
                                border: "2px dashed grey",
                                padding: "2px",
                                width: "507px",

                            }}>

                                <div style={{
                                    display: "grid",
                                    height: "500px",
                                    width: "500px",
                                    gridTemplateColumns: MAX_COL,
                                    gridTemplateRows: MAX_ROW
                                }}>
                                    {
                                        arrView.map(val => {
                                            return val;
                                        })
                                    }
                                </div>
                            </div>

                        </Col>

                    </Row>


                </Form>
            </DialogContent >


            <DialogActions>
                <Button onClick={() => {
                    handleClickClose();
                    resetView();
                }}
                    variant="secondary">
                    Cancel
              </Button>
                <Button className='px-4' onClick={sumbitFormTemplate} variant="success">
                    Save
              </Button>
            </DialogActions>
        </Dialog >
    );
}
