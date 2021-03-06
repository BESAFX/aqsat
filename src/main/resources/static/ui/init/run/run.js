app.run(['$http', '$location', '$state', '$timeout', '$window', 'PersonService', '$rootScope', '$stateParams', '$log', '$css', '$stomp', 'defaultErrorMessageResolver', 'ModalProvider', 'Fullscreen', '$anchorScroll',
    function ($http, $location, $state, $timeout, $window, PersonService, $rootScope, $stateParams, $log, $css, $stomp, defaultErrorMessageResolver, ModalProvider, Fullscreen, $anchorScroll) {

        $rootScope.state = $state;
        $rootScope.stateParams = $stateParams;
        $anchorScroll.yOffset = 122;

        defaultErrorMessageResolver.getErrorMessages().then(function (errorMessages) {
            errorMessages['fieldRequired'] = 'هذا الحقل مطلوب';
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams, options) {
            $.noty.clearQueue(); // Clears the notification queue
            $.noty.closeAll(); // Close all notifications
            switch (toState.name) {
                case 'home': {
                    $rootScope.applyTitleLang();
                    $rootScope.MDLIcon = 'dashboard';
                    $rootScope.applyCssLang();
                    break;
                }
                case 'menu': {
                    $rootScope.applyTitleLang();
                    $rootScope.MDLIcon = 'widgets';
                    $rootScope.applyCssLang();
                    break;
                }
                case 'company': {
                    $rootScope.applyTitleLang();
                    $rootScope.MDLIcon = 'business';
                    $rootScope.applyCssLang();
                    break;
                }
                case 'customer':
                case 'customer.list':
                case 'customer.details': {
                    $rootScope.applyTitleLang();
                    $rootScope.MDLIcon = 'account_circle';
                    $rootScope.applyCssLang();
                    break;
                }
                case 'supplier': {
                    $rootScope.applyTitleLang();
                    $rootScope.MDLIcon = 'store';
                    $rootScope.applyCssLang();
                    break;
                }
                case 'contract': {
                    $rootScope.applyTitleLang();
                    $rootScope.MDLIcon = 'import_contacts';
                    $rootScope.applyCssLang();
                    break;
                }
                case 'employee':
                case 'employee.list': {
                    $rootScope.applyTitleLang();
                    $rootScope.MDLIcon = 'person_pin_circle';
                    $rootScope.applyCssLang();
                    break;
                }
                case 'team': {
                    $rootScope.applyTitleLang();
                    $rootScope.MDLIcon = 'security';
                    $rootScope.applyCssLang();
                    break;
                }
                case 'profile': {
                    $rootScope.applyTitleLang();
                    $rootScope.MDLIcon = 'book';
                    $rootScope.applyCssLang();
                    break;
                }
                case 'help': {
                    $rootScope.applyTitleLang();
                    $rootScope.MDLIcon = 'help';
                    $rootScope.applyCssLang();
                    break;
                }
                case 'about': {
                    $rootScope.applyTitleLang();
                    $rootScope.MDLIcon = 'info';
                    $rootScope.applyCssLang();
                    break;
                }
                case 'report': {
                    $rootScope.applyTitleLang();
                    $rootScope.MDLIcon = 'assignment';
                    $rootScope.applyCssLang();
                    break;
                }
            }
        });

        $rootScope.contains = function (list, values) {
            return list ? _.intersection(values, list.split(',')).length > 0 : false;
        };

        $rootScope.refreshGUI = function () {
            $timeout(function () {
                window.componentHandler.upgradeAllRegistered();
            }, 600);
        };

        $rootScope.logout = function () {
            $http.post('/logout');
            $window.location.href = '/logout';
        };

        $rootScope.dateType = 'H';

        $rootScope.lang = 'AR';

        $rootScope.switchDateType = function () {
            $rootScope.dateType === 'H' ? $rootScope.dateType = 'G' : $rootScope.dateType = 'H';
            PersonService.setDateType($rootScope.dateType);
        };

        $rootScope.switchLang = function () {
            switch ($rootScope.lang) {
                case 'AR':
                    $rootScope.lang = 'EN';
                    $css.remove('/ui/css/style.css');
                    $css.add('/ui/css/style-en.css');
                    break;
                case 'EN':
                    $rootScope.lang = 'AR';
                    $css.remove('/ui/css/style-en.css');
                    $css.add('/ui/css/style.css');
                    break;
            }
            $rootScope.applyTitleLang();
            window.componentHandler.upgradeAllRegistered();
            $rootScope.state.reload();
            PersonService.setGUILang($rootScope.lang);
        };

        $rootScope.applyTitleLang = function () {
            $timeout(function () {
                switch ($rootScope.state.current.name) {
                    case 'home':
                        if ($rootScope.lang === 'AR') {
                            $rootScope.pageTitle = 'الرئيسية';
                        } else {
                            $rootScope.pageTitle = 'Dashboard';
                        }
                        break;
                    case 'menu':
                        if ($rootScope.lang === 'AR') {
                            $rootScope.pageTitle = 'البرامج';
                        } else {
                            $rootScope.pageTitle = 'Application';
                        }
                        break;
                    case 'company':
                        if ($rootScope.lang === 'AR') {
                            $rootScope.pageTitle = 'الشركة';
                        } else {
                            $rootScope.pageTitle = 'Company';
                        }
                        break;
                    case 'team':
                        if ($rootScope.lang === 'AR') {
                            $rootScope.pageTitle = 'الصلاحيات';
                        } else {
                            $rootScope.pageTitle = 'Privileges';
                        }
                        break;
                    case 'customer':
                    case 'customer.list':
                    case 'customer.details':
                        if ($rootScope.lang === 'AR') {
                            $rootScope.pageTitle = 'العملاء';
                        } else {
                            $rootScope.pageTitle = 'Customers';
                        }
                        break;
                    case 'supplier':
                        if ($rootScope.lang === 'AR') {
                            $rootScope.pageTitle = 'التجار';
                        } else {
                            $rootScope.pageTitle = 'Sellers';
                        }
                        break;
                    case 'contract':
                        if ($rootScope.lang === 'AR') {
                            $rootScope.pageTitle = 'العقود';
                        } else {
                            $rootScope.pageTitle = 'Contract';
                        }
                        break;
                    case 'employee':
                    case 'employee.list':
                        if ($rootScope.lang === 'AR') {
                            $rootScope.pageTitle = 'الموظفون';
                        } else {
                            $rootScope.pageTitle = 'Employees';
                        }
                        break;
                    case 'profile':
                        if ($rootScope.lang === 'AR') {
                            $rootScope.pageTitle = 'الملف الشخصي';
                        } else {
                            $rootScope.pageTitle = 'Profile';
                        }
                        break;
                    case 'help':
                        if ($rootScope.lang === 'AR') {
                            $rootScope.pageTitle = 'المساعدة';
                        } else {
                            $rootScope.pageTitle = 'Help';
                        }
                        break;
                    case 'about':
                        if ($rootScope.lang === 'AR') {
                            $rootScope.pageTitle = 'عن البرنامج';
                        } else {
                            $rootScope.pageTitle = 'About';
                        }
                        break;
                    case 'report':
                        if ($rootScope.lang === 'AR') {
                            $rootScope.pageTitle = 'التقارير';
                        } else {
                            $rootScope.pageTitle = 'Reports';
                        }
                        break;
                }
            }, 1000);
        };

        $rootScope.applyCssLang = function () {
            switch ($rootScope.lang) {
                case 'AR':
                    $css.remove('/ui/css/style-en.css');
                    $css.add('/ui/css/style.css');
                    break;
                case 'EN':
                    $css.remove('/ui/css/style.css');
                    $css.add('/ui/css/style-en.css');
                    break;
            }
            $timeout(function () {
                window.componentHandler.upgradeAllRegistered();
            }, 1500);
        };

        $rootScope.ModalProvider = ModalProvider;

        $rootScope.toggleDrawer =function () {
            $rootScope.drawer = document.querySelector('.mdl-layout');
            $rootScope.drawer.MaterialLayout.toggleDrawer();
        };

        $rootScope.me = {};

        PersonService.findActivePerson().then(function (data) {
            $rootScope.me = data;
            $rootScope.options = JSON.parse($rootScope.me.options);
            $rootScope.lang = $rootScope.options.lang;
            $rootScope.dateType = $rootScope.options.dateType;
            $rootScope.applyTitleLang();
            $rootScope.applyCssLang();
        });

        $rootScope.goFullscreen = function () {
            if (Fullscreen.isEnabled())
                Fullscreen.cancel();
            else
                Fullscreen.all();
        };

        $rootScope.showNotify = function (title, message, type, icon) {
            noty({
                layout: 'bottomCenter',
                theme: 'relax', // or relax, metroui
                type: type, // success, error, warning, information, notification
                text: '<div class="activity-item text-center"><div class="activity">' + message + '</div></div>',
                dismissQueue: true, // [boolean] If you want to use queue feature set this true
                force: true, // [boolean] adds notification to the beginning of queue when set to true
                maxVisible: 3, // [integer] you can set max visible notification count for dismissQueue true option,
                template: '<div class="noty_message text-center"><span class="noty_text"></span></div>',
                timeout: 1500, // [integer|boolean] delay for closing event in milliseconds. Set false for sticky notifications
                progressBar: true, // [boolean] - displays a progress bar
                animation: {
                    open: 'animated fadeIn',
                    close: 'animated fadeOut',
                    easing: 'swing',
                    speed: 100 // opening & closing animation speed
                },
                closeWith: ['hover'], // ['click', 'button', 'hover', 'backdrop'] // backdrop click will close all notifications
                modal: false, // [boolean] if true adds an overlay
                killer: false, // [boolean] if true closes all notifications and shows itself
                buttons: false // [boolean|array] an array of buttons, for creating confirmation dialogs.
            });
        };

        $rootScope.showConfirmNotify = function (title, message, type, icon, callback) {
            noty({
                layout: 'center',
                theme: 'metroui', // or relax
                type: type, // success, error, warning, information, notification
                text: '<div class="activity-item text-right"><span>' + title + '</span> <i class="fa ' + icon + '"></i><div class="activity">' + message + '</div></div>',
                dismissQueue: true, // [boolean] If you want to use queue feature set this true
                force: false, // [boolean] adds notification to the beginning of queue when set to true
                maxVisible: 3, // [integer] you can set max visible notification count for dismissQueue true option,
                template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
                timeout: false, // [integer|boolean] delay for closing event in milliseconds. Set false for sticky notifications
                progressBar: true, // [boolean] - displays a progress bar
                animation: {
                    open: 'animated fadeIn',
                    close: 'animated fadeOut',
                    easing: 'swing',
                    speed: 100 // opening & closing animation speed
                },
                closeWith: ['button'], // ['click', 'button', 'hover', 'backdrop'] // backdrop click will close all notifications
                modal: true, // [boolean] if true adds an overlay
                killer: false, // [boolean] if true closes all notifications and shows itself
                callback: {
                    onShow: function () {
                    },
                    afterShow: function () {
                    },
                    onClose: function () {
                    },
                    afterClose: function () {
                    },
                    onCloseClick: function () {
                    },
                },
                buttons: [
                    {
                        addClass: 'btn btn-primary', text: 'نعم', onClick: function ($noty) {
                        $noty.close();
                        callback();
                    }
                    },
                    {
                        addClass: 'btn btn-danger', text: 'إلغاء', onClick: function ($noty) {
                        $noty.close();
                    }
                    }
                ]
            });
        };

        $rootScope.showIndicatorNotify = function (message, type) {
            noty({
                layout: 'center',
                theme: 'metroui', // or relax
                type: type, // success, error, warning, information, notification
                text: '<div class="activity-item text-center"><strong class="activity">' + message + '</strong></div>',
                dismissQueue: true, // [boolean] If you want to use queue feature set this true
                force: false, // [boolean] adds notification to the beginning of queue when set to true
                maxVisible: 1, // [integer] you can set max visible notification count for dismissQueue true option,
                template: '<div class="noty_message lang-dir"><span class="noty_text"></span></div>',
                timeout: false, // [integer|boolean] delay for closing event in milliseconds. Set false for sticky notifications
                progressBar: false, // [boolean] - displays a progress bar
                animation: {
                    open: 'animated fadeIn',
                    close: 'animated fadeOut',
                    easing: 'swing',
                    speed: 100 // opening & closing animation speed
                },
                closeWith: ['button'], // ['click', 'button', 'hover', 'backdrop'] // backdrop click will close all notifications
                modal: true, // [boolean] if true adds an overlay
                killer: true, // [boolean] if true closes all notifications and shows itself
                buttons: false // [boolean|array] an array of buttons, for creating confirmation dialogs.
            });
        };

        $rootScope.showTechnicalNotify = function (title, message, type, icon) {
            noty({
                layout: 'center',
                theme: 'metroui', // or relax
                type: type, // success, error, warning, information, notification
                text: '<div class="activity-item text-right"><span>' + title + '</span> <i class="fa ' + icon + '"></i><div class="activity">' + message + '</div></div>',
                dismissQueue: true, // [boolean] If you want to use queue feature set this true
                force: false, // [boolean] adds notification to the beginning of queue when set to true
                maxVisible: 3, // [integer] you can set max visible notification count for dismissQueue true option,
                template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
                timeout: false, // [integer|boolean] delay for closing event in milliseconds. Set false for sticky notifications
                progressBar: true, // [boolean] - displays a progress bar
                animation: {
                    open: 'animated fadeIn',
                    close: 'animated fadeOut',
                    easing: 'swing',
                    speed: 100 // opening & closing animation speed
                },
                closeWith: ['button'], // ['click', 'button', 'hover', 'backdrop'] // backdrop click will close all notifications
                modal: true, // [boolean] if true adds an overlay
                killer: true, // [boolean] if true closes all notifications and shows itself
                buttons: [
                    {
                        addClass: 'btn btn-primary', text: 'إعادة تحميل الصفحة', onClick: function ($noty) {
                        $noty.close();
                        location.reload(true);
                    }
                    },
                    {
                        addClass: 'btn btn-danger', text: 'إغلاق', onClick: function ($noty) {
                        $noty.close();
                    }
                    }
                ]
            });
        };

        /**************************************************************
         *                                                            *
         * STOMP Connect                                              *
         *                                                            *
         *************************************************************/
        $rootScope.chats = [];
        $stomp.connect('/ws').then(function () {
            $stomp.subscribe('/user/queue/notify', function (payload, headers, res) {
                $rootScope.showNotify(payload.title, payload.message, payload.type, payload.icon, payload.layout);
            }, {'headers': 'notify'});
        });
        $rootScope.today = new Date();

        /**************************************************************
         *                                                            *
         * Printer Connect                                            *
         *                                                            *
         *************************************************************/

    }]);