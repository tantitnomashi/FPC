import React, { Component, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';

import '../../node_modules/font-awesome/scss/font-awesome.scss';
import 'react-notifications/lib/notifications.css';

import Loader from './layout/Loader'
import Aux from "../hoc/_Aux";
import ScrollToTop from './layout/ScrollToTop';
import routes from "../route";
import { NotificationContainer } from 'react-notifications';
import LoadingOverlay from 'react-loading-overlay'
import BounceLoader from 'react-spinners/BounceLoader'
import { waiting } from '../utils/waiting';

const AdminLayout = Loadable({
    loader: () => import('./layout/AdminLayout'),
    loading: Loader
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showNotification: false,
            waiting: false,
            contentNotification: {
                title: "",
                message: ""
            }
        }
        waiting.initStatus(
            (status) => {
                this.setState((prev) => ({
                    ...prev,
                    waiting: status,
                }))
            },
            () => {
                return this.state.waiting
            }

        );
    }
    render() {
        const menu = routes.map((route, index) => {
            return (route.component) ? (
                <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={props => (
                        <route.component {...props} />
                    )} />
            ) : (null);
        });

        return (
            <div>

                <LoadingOverlay
                    active={this.state.waiting}
                    spinner={<BounceLoader />}
                >
                    <NotificationContainer />
                    <Aux>
                        <ScrollToTop>
                            <Suspense fallback={<Loader />}>
                                <Switch>
                                    {menu}
                                    <Route path="/" component={AdminLayout} />
                                </Switch>
                            </Suspense>
                        </ScrollToTop>
                    </Aux>
                </LoadingOverlay>

            </div>
        );
    }
}

export default App;
