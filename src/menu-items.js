export default {
    items: [
        {
            id: 'navigation',
            title: 'CABINET',
            type: 'group',
            icon: 'icon-navigation',
            display: true,
            children: [

                {
                    id: 'cabinet',
                    title: 'Cabinets',
                    type: 'item',
                    url: '/cabinet',
                    icon: 'feather icon-sidebar',
                    display: true,

                },
                {
                    id: 'template',
                    title: 'Cabinet Templates',
                    type: 'item',
                    url: '/template',
                    icon: 'feather icon-grid',
                    display: true,

                },

                {
                    id: 'boxsize',
                    title: 'Box Size',
                    type: 'item',
                    url: '/box-size',
                    icon: 'feather icon-box',
                    display: true,

                }
                ,
                {
                    id: 'rentTime',
                    title: 'Rental Time Slot',
                    type: 'item',
                    url: '/time-slot',
                    icon: 'feather icon-clock',
                    display: true,

                }
                ,
                {
                    id: 'box',
                    title: 'Box',
                    type: 'item',
                    url: '/box',
                    icon: 'feather icon-box',
                    display: false,

                }
            ]
        },
        {
            id: 'ui-element',
            title: 'OTHER',
            type: 'group',
            icon: 'icon-ui',
            display: true,

            children: [
                // {
                //     id: 'dashboard',
                //     title: 'Dashboard',
                //     type: 'item',
                //     url: '/dashboard/default',
                //     display: true,

                //     icon: 'feather icon-home',
                // },
                {
                    id: 'transaction',
                    title: 'Transactions',
                    type: 'item',
                    url: '/transaction',
                    icon: 'feather icon-trending-up',
                    display: true,

                }
                ,
                {
                    id: 'user',
                    title: 'Users',
                    type: 'item',
                    url: '/user',
                    icon: 'feather icon-users',
                    display: true,

                }
                ,
                {
                    id: 'request',
                    title: 'Checking Request',
                    type: 'item',
                    url: '/checking',
                    icon: 'feather icon-triangle',
                    display: true,

                }
                ,
                {
                    id: 'basic',
                    title: 'Others',
                    type: 'collapse',
                    icon: 'feather icon-box',
                    display: true,

                    children: [
                        {
                            id: 'button',
                            title: 'Button',
                            type: 'item',
                            url: '/basic/button',
                            display: true,

                        },
                        {
                            id: 'badges',
                            title: 'Badges',
                            type: 'item',
                            display: true,

                            url: '/basic/badges'
                        },
                        {
                            id: 'breadcrumb-pagination',
                            title: 'Breadcrumb & Pagination',
                            type: 'item',
                            display: true,

                            url: '/basic/breadcrumb-paging'
                        },
                        {
                            id: 'collapse',
                            title: 'Collapse',
                            type: 'item',
                            display: true,

                            url: '/basic/collapse'
                        },
                        {
                            id: 'tabs-pills',
                            title: 'Tabs & Pills',
                            type: 'item',
                            display: true,

                            url: '/basic/tabs-pills'
                        },
                        {
                            id: 'typography',
                            title: 'Typography',
                            type: 'item',
                            display: true,

                            url: '/basic/typography'
                        }
                    ]
                }
            ]
        },
        // {
        //     id: 'ui-forms',
        //     title: 'FPC Config',
        //     type: 'group',
        //     icon: 'icon-group',
        //     display: true,

        //     children: [
        //         {
        //             id: 'form-basic',
        //             title: 'Config',
        //             type: 'item',
        //             url: '/forms/form-basic',
        //             display: true,

        //             icon: 'feather icon-file-text'
        //         },
        //         {
        //             id: 'bootstrap',
        //             title: 'Spoil History',
        //             type: 'item',
        //             display: true,

        //             icon: 'feather icon-server',
        //             url: '/tables/bootstrap'
        //         }
        //     ]
        // },
        // {
        //     id: 'chart-maps',
        //     title: 'Chart ',
        //     type: 'group',
        //     display: true,

        //     icon: 'icon-charts',
        //     children: [
        //         {
        //             id: 'charts',
        //             title: 'Charts',
        //             type: 'item',
        //             display: true,

        //             icon: 'feather icon-pie-chart',
        //             url: '/charts/nvd3'
        //         },
        //         {
        //             id: 'maps',
        //             title: 'Statistics',
        //             type: 'item',
        //             display: true,

        //             icon: 'feather icon-map',
        //             url: '/maps/google-map'
        //         }
        //     ]
        // },
        // {
        //     id: 'pages',
        //     title: 'Pages',
        //     type: 'group',
        //     display: true,

        //     icon: 'icon-pages',
        //     children: [
        //         {
        //             id: 'auth',
        //             title: 'Authentication',
        //             type: 'collapse',
        //             display: true,

        //             icon: 'feather icon-lock',
        //             badge: {
        //                 title: 'New',
        //                 type: 'label-danger'
        //             },
        //             children: [
        //                 {
        //                     id: 'signup-1',
        //                     title: 'Sign up',
        //                     type: 'item',
        //                     url: '/auth/signup-1',
        //                     target: true,
        //                     display: true,

        //                     breadcrumbs: false
        //                 },
        //                 {
        //                     id: 'signin-1',
        //                     title: 'Sign in',
        //                     type: 'item',
        //                     url: '/auth/signin-1',
        //                     target: true,
        //                     display: true,

        //                     breadcrumbs: false
        //                 }
        //             ]
        //         },

        //         {
        //             id: 'sample-page',
        //             title: 'Sample Page',
        //             type: 'item',
        //             url: '/sample-page',
        //             classes: 'nav-item',
        //             display: true,

        //             icon: 'feather icon-sidebar'
        //         },
        //         {
        //             id: 'docs',
        //             title: 'Documentation',
        //             type: 'item',
        //             url: '/docs',
        //             classes: 'nav-item',
        //             display: true,

        //             icon: 'feather icon-help-circle'
        //         },
        //         {
        //             id: 'menu-level',
        //             title: 'Menu Levels',
        //             type: 'collapse',
        //             display: true,

        //             icon: 'feather icon-menu',
        //             children: [
        //                 {
        //                     id: 'menu-level-1.1',
        //                     title: 'Menu Level 1.1',
        //                     type: 'item',

        //                     display: true,

        //                     url: '#!',
        //                 },
        //                 {
        //                     id: 'menu-level-1.2',
        //                     title: 'Menu Level 2.2',
        //                     type: 'collapse',
        //                     display: true,

        //                     children: [
        //                         {
        //                             id: 'menu-level-2.1',
        //                             title: 'Menu Level 2.1',
        //                             type: 'item',
        //                             display: true,

        //                             url: '#',
        //                         },
        //                         {
        //                             id: 'menu-level-2.2',
        //                             title: 'Menu Level 2.2',
        //                             display: true,

        //                             type: 'collapse',
        //                             children: [
        //                                 {
        //                                     id: 'menu-level-3.1',
        //                                     title: 'Menu Level 3.1',
        //                                     type: 'item',
        //                                     display: true,

        //                                     url: '#',
        //                                 },
        //                                 {
        //                                     id: 'menu-level-3.2',
        //                                     title: 'Menu Level 3.2',
        //                                     type: 'item',
        //                                     display: true,

        //                                     url: '#',
        //                                 }
        //                             ]
        //                         }
        //                     ]
        //                 }
        //             ]
        //         },
        //         {
        //             id: 'disabled-menu',
        //             title: 'Disabled Menu',
        //             type: 'item',
        //             url: '#',
        //             classes: 'nav-item disabled',
        //             display: true,

        //             icon: 'feather icon-power'
        //         },
        /*{
            id: 'buy-now',
            title: 'Buy Now',
            type: 'item',
            icon: 'feather icon-user',
            classes: 'nav-item',
            url: 'https://codedthemes.com',
            target: true,
            display: true,

            external: true,
            badge: {
                title: 'v1.0',
                type: 'label-primary'
            }
        }*/
        //     ]
        // }
    ]
}