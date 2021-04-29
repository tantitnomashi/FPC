import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tabs, Tab, Button } from 'react-bootstrap';
import API from '../../utils/adminApi'
import Aux from "../../hoc/_Aux";


export default function BoxDetail(props) {
    const { handleDetail, id, w, h, bgColor, item, boxes, p } = props;


    console.log("boxes", boxes, id);

    return (

        <div //className="d-flex align-items-center justify-content-center"
            style={{ width: `${w}px`, height: `${h}px`, padding: `${p}px` }}
            onClick={() => {
                console.log("in detail", boxes);
                handleDetail(id, boxes)
            }}

        >
            <div className={" d-flex align-items-center  justify-content-center w-100 h-100 " + bgColor}>
                <div className="text-center"    >
                    <div className="text-dark text-center  f-20"
                    >
                        {(item?.status == 0) && <span className="material-icons">lock</span>}
                        {(item?.status == 1) && <span className="material-icons"> lock_open </span>}
                        {(item?.status == 2) && <span className="material-icons">gavel</span>}
                        {(item?.status == 3) && <span className="material-icons">verified_user</span>}


                    </div>
                    <div className="text-dark text-center f-20 font-weight-bold" >
                        {` Box ${item.boxNum}`}

                    </div>
                    <div className="text-dark text-center f-20" >
                        {(item?.rentingStatus == 0) && 'FREE'}
                        {(item?.rentingStatus == 1) && 'RENTING'}
                        {(item?.rentingStatus == 2) && 'EXPIRED'}

                    </div>
                </div>
            </div>
        </div >


    );
}