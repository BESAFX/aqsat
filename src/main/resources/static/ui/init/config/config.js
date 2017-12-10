var app = angular.module('Application',
    [
        'ui.router',
        'ngAnimate',
        'toggle-switch',
        'jcs-autoValidate',
        'fm',
        'ui.select',
        'ngSanitize',
        'counter',
        'FBAngular',
        'ui.bootstrap',
        'angularCSS',
        'smart-table',
        'lrDragNDrop',
        'nya.bootstrap.select',
        'localytics.directives',
        'angularFileUpload',
        'ngLoadingSpinner',
        'ngStomp',
        'luegg.directives',
        'monospaced.elastic',
        'pageslide-directive',
        'ui.bootstrap.contextMenu',
        'kdate',
        'ui.sortable',
        'timer',
        'chart.js'
    ]);

app.factory('errorInterceptor', ['$q', '$rootScope', '$location', '$log',
    function ($q, $rootScope, $location, $log) {
        return {
            request: function (config) {
                return config || $q.when(config);
            },
            requestError: function (request) {
                return $q.reject(request);
            },
            response: function (response) {
                return response || $q.when(response);
            },
            responseError: function (response) {
                if (response && response.status === 404) {
                }
                if (response && response.status >= 500) {
                    $rootScope.showTechnicalNotify("الدعم الفني", response.data.message, "error", "fa-ban");
                }
                return $q.reject(response);
            }
        };
    }]);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$cssProvider', 'ChartJsProvider', '$httpProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider, $cssProvider, ChartJsProvider, $httpProvider) {

        ChartJsProvider.setOptions({colors: ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']});

        $urlRouterProvider.otherwise("/menu");

        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push('errorInterceptor');

        /**************************************************************
         *                                                            *
         * Home State                                                 *
         *                                                            *
         *************************************************************/
        $stateProvider.state("home", {
            url: "/home",
            css: [
                '/ui/css/mdl-style.css',
                '/ui/css/theme-black.css'
            ],
            views: {
                '': {
                    templateUrl: "/ui/partials/home/home.html",
                    controller: "homeCtrl"
                }
            }
        });

        /**************************************************************
         *                                                            *
         * Menu State                                                 *
         *                                                            *
         *************************************************************/
        $stateProvider.state("menu", {
            url: "/menu",
            css: [
                '/ui/css/mdl-style.css',
                '/ui/css/theme-black.css'
            ],
            templateUrl: "/ui/partials/menu/menu.html",
            controller: "menuCtrl"
        });

        /**************************************************************
         *                                                            *
         * Company State                                              *
         *                                                            *
         *************************************************************/
        $stateProvider.state("company", {
            url: "/company",
            css: [
                '/ui/css/mdl-style-purple-pink.css',
                '/ui/css/theme-black.css'
            ],
            templateUrl: "/ui/partials/company/company.html",
            controller: "companyCtrl"
        });

        /**************************************************************
         *                                                            *
         * Customer State                                             *
         *                                                            *
         *************************************************************/
        $stateProvider.state("customer", {
            url: "/customer",
            templateUrl: "/ui/partials/customer/customer.html",
            controller: "customerCtrl",
            controllerAs: "customerCtrl"
        });

        $stateProvider.state("customer.list", {
            url: "/list",
            css: [
                '/ui/css/mdl-style-green-orange.css',
                '/ui/css/theme-black.css'
            ],
            views:{
                'body@customer':{
                    templateUrl: "/ui/partials/customer/list/list.html"
                },
                'options@customer':{
                    templateUrl: "/ui/partials/customer/list/options.html"
                }
            }
        });

        $stateProvider.state("customer.details", {
            url: "/details",
            css: [
                '/ui/css/mdl-style-indigo-pink.css',
                '/ui/css/theme-black.css'
            ],
            views:{
                'body@customer':{
                    templateUrl: "/ui/partials/customer/details/details.html"
                },
                'options@customer':{
                    templateUrl: "/ui/partials/customer/details/options.html"
                }
            }
        });

        /**************************************************************
         *                                                            *
         * Supplier State                                             *
         *                                                            *
         *************************************************************/
        $stateProvider.state("supplier", {
            url: "/supplier",
            css: [
                '/ui/css/mdl-style-lime-orange.css',
                '/ui/css/theme-black.css'
            ],
            templateUrl: "/ui/partials/supplier/supplier.html",
            controller: "supplierCtrl"
        });

        /**************************************************************
         *                                                            *
         * Employee State                                             *
         *                                                            *
         *************************************************************/
        $stateProvider.state("employee", {
            url: "/employee",
            templateUrl: "/ui/partials/employee/employee.html",
            controller: "employeeCtrl",
            controllerAs: "employeeCtrl"
        });

        $stateProvider.state("employee.list", {
            url: "/list",
            css: [
                '/ui/css/mdl-style-indigo-pink.css',
                '/ui/css/theme-black.css'
            ],
            views:{
                'body@employee':{
                    templateUrl: "/ui/partials/employee/list/list.html"
                },
                'options@employee':{
                    templateUrl: "/ui/partials/employee/list/listOptions.html"
                }
            }
        });

        /**************************************************************
         *                                                            *
         * Receipt State                                              *
         *                                                            *
         *************************************************************/
        $stateProvider.state("receipt", {
            url: "/receipt",
            templateUrl: "/ui/partials/receipt/receipt.html",
            controller: "receiptCtrl",
            controllerAs: "receiptCtrl"
        });

        $stateProvider.state("receipt.in", {
            url: "/in",
            css: [
                '/ui/css/mdl-style-indigo-pink.css',
                '/ui/css/mdl-ext.css',
                '/ui/css/theme-black.css'
            ],
            views:{
                'body@receipt':{
                    templateUrl: "/ui/partials/receipt/in/in.html"
                },
                'options@receipt':{
                    templateUrl: "/ui/partials/receipt/in/inOptions.html"
                }
            }
        });

        $stateProvider.state("receipt.out", {
            url: "/out",
            css: [
                '/ui/css/mdl-style-light_green-lime.css',
                '/ui/css/theme-black.css'
            ],
            views:{
                'body@receipt':{
                    templateUrl: "/ui/partials/receipt/out/out.html"
                },
                'options@receipt':{
                    templateUrl: "/ui/partials/receipt/out/outOptions.html"
                }
            }
        });

        $stateProvider.state("receipt.term", {
            url: "/term",
            css: [
                '/ui/css/mdl-style-lime-orange.css',
                '/ui/css/theme-black.css'
            ],
            views:{
                'body@receipt':{
                    templateUrl: "/ui/partials/receipt/term/term.html"
                },
                'options@receipt':{
                    templateUrl: "/ui/partials/receipt/term/termOptions.html"
                }
            }
        });

        /**************************************************************
         *                                                            *
         * Contract State                                             *
         *                                                            *
         *************************************************************/
        $stateProvider.state("contract", {
            url: "/contract",
            css: [
                '/ui/css/mdl-style-red-deep_orange.css',
                '/ui/css/theme-black.css'
            ],
            templateUrl: "/ui/partials/contract/contract.html",
            controller: "contractCtrl"
        });

        /**************************************************************
         *                                                            *
         * Team State                                                 *
         *                                                            *
         *************************************************************/
        $stateProvider.state("team", {
            url: "/team",
            css: [
                '/ui/css/mdl-style-red-deep_orange.css',
                '/ui/css/theme-black.css'
            ],
            templateUrl: "/ui/partials/team/team.html",
            controller: "teamCtrl"
        });

        /**************************************************************
         *                                                            *
         * Help State                                                 *
         *                                                            *
         *************************************************************/
        $stateProvider.state("help", {
            url: "/help",
            css: [
                '/ui/css/mdl-style-green-orange.css',
                '/ui/css/theme-black.css'
            ],
            templateUrl: "/ui/partials/help/help.html",
            controller: "helpCtrl"
        });

        /**************************************************************
         *                                                            *
         * Profile State                                              *
         *                                                            *
         *************************************************************/
        $stateProvider.state("profile", {
            url: "/profile",
            css: [
                '/ui/css/mdl-style-green-orange.css',
                '/ui/css/theme-black.css'
            ],
            templateUrl: "/ui/partials/profile/profile.html",
            controller: "profileCtrl"
        });

        /**************************************************************
         *                                                            *
         * About State                                                *
         *                                                            *
         *************************************************************/
        $stateProvider.state("about", {
            url: "/about",
            css: [
                '/ui/css/mdl-style-green-orange.css',
                '/ui/css/theme-black.css'
            ],
            templateUrl: "/ui/partials/about/about.html",
            controller: "aboutCtrl"
        });

        /**************************************************************
         *                                                            *
         * Report State                                               *
         *                                                            *
         *************************************************************/
        $stateProvider.state("report", {
            url: "/report",
            css: [
                '/ui/css/mdl-style-green-orange.css',
                '/ui/css/theme-black.css'
            ],
            templateUrl: "/ui/partials/report/report.html",
            controller: "reportCtrl"
        });
    }
]);


