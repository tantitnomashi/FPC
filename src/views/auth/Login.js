import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import API from '../../utils/adminApi'

import './../../assets/scss/style.scss';
import Aux from "../../hoc/_Aux";
import Breadcrumb from "../../App/layout/AdminLayout/Breadcrumb";
import { data } from 'jquery';

export default function Login() {
    const [newName, setNewName] = useState('');
    const [errName, setErrName] = useState('');

    const [pass, setPass] = useState('');
    const [errPass, setErrPass] = useState('');


    useEffect(() => {
        if (localStorage.getItem('admin-token')?.length > 1) {
            window.location.href = '/cabinet';
        }
    }, []);

    const validData = (text = '', fieldIndex = -1) => {
        switch (fieldIndex) {
            case 0:
                if (text.length >= 30) {
                    setErrName("Email too long ! Under 30 digits please!");
                } else if (text === '') {
                    setErrName("Email is required!");
                } else {
                    setErrName("");
                }
                break;
            case 1:
                if (text == '') {
                    setErrPass("Password is required!");
                } else {
                    setErrPass("");
                }
                break;

            default:
                if ((errName + errPass).length == 0) {
                    return true;
                }
                break;
        }
        return false;
    }
    const loginSubmit = () => {
        console.log("login: ", newName, pass)
        API.login({
            username: newName,
            password: pass
        }).then((response) => {
            console.log("create: ", response.data.statusCode);
            if (response.data.statusCode == 200 && response.data.data.roleId == 1) {
                setErrName("");
                localStorage.setItem('admin-token', response.data.data.tokenAccess);
                localStorage.setItem('username', response.data.data.username);
                window.location.href = '/cabinet';
            } else if (response.data.statusCode == 404) {
                setErrName("Wrong username or Password ! Try Again !");
            }

        }).catch(e => {
            console.log("login ERR", e)
            setErrName("Wrong username or Password ! Try Again !");
        })
    }
    return (
        <Aux>
            <Breadcrumb />
            <div className="auth-wrapper">
                <div className="auth-content">
                    <div className="auth-bg">
                        <span className="r" />
                        <span className="r s" />
                        <span className="r s" />
                        <span className="r" />
                    </div>
                    <div className="card">
                        <div className="card-body text-center">
                            <div className="mb-4">
                                <i className="feather icon-unlock auth-icon" />
                            </div>
                            <h3 className="mb-4">Login</h3>
                            <div className="input-group mb-3">
                                <input onChange={(e) => {
                                    let text = e.target.value;
                                    console.log(text);
                                    setNewName(text)
                                    validData(text, 0);
                                }} type="email" className="form-control" placeholder="Email" />
                            </div>
                            <div className="input-group mb-4">
                                <input onChange={(e) => {
                                    let text = e.target.value;
                                    console.log(text);
                                    setPass(text)
                                    validData(text, 1);
                                }} type="password" className="form-control" placeholder="password" />
                            </div>
                            <div className="form-group text-left">
                                <span className="text-danger">{errName + errPass}</span>
                            </div>
                            <button onClick={loginSubmit} className="btn btn-primary shadow-2 mb-4">Login</button>
                            <p className="mb-2 text-muted">Forgot password? <NavLink to="/auth/reset-password-1">Reset</NavLink></p>
                            <p className="mb-0 text-muted">Don’t have an account? <NavLink to="/auth/signup-1">Signup</NavLink></p>
                        </div>
                    </div>
                </div>
            </div>
        </Aux>
    );

}

