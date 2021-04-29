import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App/index';
import * as serviceWorker from './serviceWorker';
import reducer from './store/reducer';
import config from './config';
import thunk from 'redux-thunk';
import { useState } from 'react';
import { onMessageListener } from './utils/firebase';
import { Button, Row, Col, Toast } from 'react-bootstrap';

const store = createStore(reducer, compose(applyMiddleware(thunk)));

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register(process.env.PUBLIC_URL + "/sw.js")
        .then(function (registration) {
            console.log("Registration successful, scope is:", registration.scope);
        })
        .catch(function (err) {
            console.log("Service worker registration failed, error:", err);
        });
}

const AppMain = () => {

    const [show, setShow] = useState(false);
    const [notification, setNotification] = useState({ title: '', body: '' });

    onMessageListener().then(payload => {
        console.log('####FIREBASE ', payload);
        setShow(true);
        setNotification({ title: payload.notification.title, body: payload.notification.body })
    }).catch(err => console.log('failed: ', err));
    return (
        <div>

            <h1>{notification?.title + notification?.body}</h1>


            <Provider store={store}>
                <BrowserRouter>
                    {/*basename={config.basename}*/}
                    {/* basename="/datta-able" */}
                    <App />
                </BrowserRouter>
            </Provider>
        </div>
    )
};

ReactDOM.render(<AppMain />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
