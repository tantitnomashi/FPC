import React from 'react';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const DashboardDefault = React.lazy(() => import('./Demo/Dashboard/Default'));
const DashboardUser = React.lazy(() => import('./views/user/User'));
const DashboardTransaction = React.lazy(() => import('./views/transaction/Transaction'));
const DashboardCabinet = React.lazy(() => import('./views/cabinet/Cabinet'));
const Template = React.lazy(() => import('./views/template/Template'));
const Boxsize = React.lazy(() => import('./views/boxsize/BoxSize'));
const Box = React.lazy(() => import('./views/box/Box'));
const RentalTime = React.lazy(() => import('./views/rentTimeSlot/RentTimeSlot'));
const CheckingRequest = React.lazy(() => import('./views/checkingrequest/CheckingRequest'));

const UIBasicButton = React.lazy(() => import('./Demo/UIElements/Basic/Button'));
const UIBasicBadges = React.lazy(() => import('./Demo/UIElements/Basic/Badges'));
const UIBasicBreadcrumbPagination = React.lazy(() => import('./Demo/UIElements/Basic/BreadcrumbPagination'));

const UIBasicCollapse = React.lazy(() => import('./Demo/UIElements/Basic/Collapse'));
const UIBasicTabsPills = React.lazy(() => import('./Demo/UIElements/Basic/TabsPills'));
const UIBasicBasicTypography = React.lazy(() => import('./Demo/UIElements/Basic/Typography'));

const FormsElements = React.lazy(() => import('./Demo/Forms/FormsElements'));

const BootstrapTable = React.lazy(() => import('./Demo/Tables/BootstrapTable'));

const Nvd3Chart = React.lazy(() => import('./Demo/Charts/Nvd3Chart/index'));

const GoogleMap = React.lazy(() => import('./Demo/Maps/GoogleMap/index'));

const OtherSamplePage = React.lazy(() => import('./Demo/Other/SamplePage'));
const OtherDocs = React.lazy(() => import('./Demo/Other/Docs'));

const routes = [
    { path: '/dashboard/default', exact: true, name: 'Default', component: DashboardDefault },
    { path: '/user', exact: true, name: 'User', component: DashboardUser },
    { path: '/cabinet', exact: true, name: 'Cabinet', component: DashboardCabinet },
    { path: '/template', exact: true, name: 'Template', component: Template },
    { path: '/transaction', exact: true, name: 'Transaction', component: DashboardTransaction },
    { path: '/basic/button', exact: true, name: 'Basic Button', component: UIBasicButton },
    { path: '/box-size', exact: true, name: 'Box Size', component: Boxsize },
    { path: '/box/:id', exact: true, name: 'Box', component: Box },
    { path: '/time-slot', exact: true, name: 'Rent Time Slot', component: RentalTime },
    { path: '/checking', exact: true, name: 'Checking Request', component: CheckingRequest },
    { path: '/basic/badges', exact: true, name: 'Basic Badges', component: UIBasicBadges },
    { path: '/basic/breadcrumb-paging', exact: true, name: 'Basic Breadcrumb Pagination', component: UIBasicBreadcrumbPagination },
    { path: '/basic/collapse', exact: true, name: 'Basic Collapse', component: UIBasicCollapse },
    { path: '/basic/tabs-pills', exact: true, name: 'Basic Tabs & Pills', component: UIBasicTabsPills },
    { path: '/basic/typography', exact: true, name: 'Basic Typography', component: UIBasicBasicTypography },
    { path: '/forms/form-basic', exact: true, name: 'Forms Elements', component: FormsElements },
    { path: '/tables/bootstrap', exact: true, name: 'Bootstrap Table', component: BootstrapTable },
    { path: '/charts/nvd3', exact: true, name: 'Nvd3 Chart', component: Nvd3Chart },
    { path: '/maps/google-map', exact: true, name: 'Google Map', component: GoogleMap },
    { path: '/sample-page', exact: true, name: 'Sample Page', component: OtherSamplePage },
    { path: '/docs', exact: true, name: 'Documentation', component: OtherDocs },
];

export default routes;