app.controller("customerCtrl", ['CustomerService', 'ModalProvider', '$scope', '$rootScope', '$state', '$timeout', '$uibModal',
    function (CustomerService, ModalProvider, $scope, $rootScope, $state, $timeout, $uibModal) {

        var vm = this;

        /**************************************************************
         *                                                            *
         * GENERAL                                                    *
         *                                                            *
         *************************************************************/
        vm.state = $state;

        vm.param = {};

        vm.toggleList = 1;

        vm.selected = {};

        vm.customers = [];

        vm.print = function (customer) {
            window.open('/report/customer/' + customer.id + '/PDF');
        };

        /**************************************************************
         *                                                            *
         * SEARCH                                                     *
         *                                                            *
         *************************************************************/
        vm.search = function () {

            var search = [];

            //
            if (vm.param.code) {
                search.push('code=');
                search.push(vm.param.code);
                search.push('&');
            }
            if (vm.param.name) {
                search.push('name=');
                search.push(vm.param.name);
                search.push('&');
            }
            if (vm.param.mobile) {
                search.push('mobile=');
                search.push(vm.param.mobile);
                search.push('&');
            }
            if (vm.param.identityNumber) {
                search.push('identityNumber=');
                search.push(vm.param.identityNumber);
                search.push('&');
            }
            if (vm.param.email) {
                search.push('email=');
                search.push(vm.param.email);
                search.push('&');
            }
            CustomerService.filter(search.join("")).then(function (data) {
                vm.customers = data;
                vm.setSelected(data[0]);
            });

        };

        vm.fetchTableData = function () {
            CustomerService.findAllInfo().then(function (data) {
                vm.customers = data;
                vm.setSelected(data[0]);
            });
        };

        vm.goToCustomer = function () {
            CustomerService.findOne(vm.selected.id).then(function (data) {
                vm.selected = data;
                vm.state.go('customer.details');
            });
        };

        vm.setSelected = function (object) {
            if (object) {
                angular.forEach(vm.customers, function (customer) {
                    if (object.id == customer.id) {
                        vm.selected = customer;
                        return customer.isSelected = true;
                    } else {
                        return customer.isSelected = false;
                    }
                });
            }
        };

        vm.delete = function (customer) {
            if (customer) {
                $rootScope.showConfirmNotify("حذف البيانات", "هل تود حذف العميل وكل ما يتعلق به من حسابات فعلاً؟", "error", "fa-trash", function () {
                    CustomerService.remove(customer.id).then(function () {
                        var index = vm.customers.indexOf(customer);
                        vm.customers.splice(index, 1);
                        vm.setSelected(vm.customers[0]);
                    });
                });
                return;
            }

            $rootScope.showConfirmNotify("حذف البيانات", "هل تود حذف العميل وكل ما يتعلق به من حسابات فعلاً؟", "error", "fa-trash", function () {
                CustomerService.remove(vm.selected.id).then(function () {
                    var index = vm.customers.indexOf(vm.selected);
                    vm.customers.splice(index, 1);
                    vm.setSelected(vm.customers[0]);
                });
            });
        };

        vm.newCustomer = function () {
            ModalProvider.openCustomerCreateModel().result.then(function (data) {
                vm.customers.splice(0, 0, data);
            }, function () {
                console.info('CustomerCreateModel Closed.');
            });
        };

        vm.enable = function () {
            CustomerService.enable(vm.selected).then(function (data) {
                vm.fetchTableData();
            });
        };

        vm.disable = function () {
            CustomerService.disable(vm.selected).then(function (data) {
                vm.fetchTableData();
            });
        };

        vm.rowMenu = [
            {
                html: '<div class="drop-menu">انشاء عميل جديد<span class="fa fa-pencil fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_CUSTOMER_CREATE']);
                },
                click: function ($itemScope, $event, value) {
                    vm.newCustomer();
                }
            },
            {
                html: '<div class="drop-menu">تعديل بيانات العميل<span class="fa fa-edit fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_CUSTOMER_UPDATE']);
                },
                click: function ($itemScope, $event, value) {
                    ModalProvider.openCustomerUpdateModel($itemScope.customer);
                }
            },
            {
                html: '<div class="drop-menu">تفعيل العميل<span class="fa fa-edit fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_CUSTOMER_ENABLE']);
                },
                click: function ($itemScope, $event, value) {
                    vm.enable($itemScope.customer);
                }
            },
            {
                html: '<div class="drop-menu">تعطيل العميل<span class="fa fa-edit fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_CUSTOMER_DISABLE']);
                },
                click: function ($itemScope, $event, value) {
                    vm.disable($itemScope.customer);
                }
            },
            {
                html: '<div class="drop-menu">حذف العميل<span class="fa fa-trash fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_CUSTOMER_DELETE']);
                },
                click: function ($itemScope, $event, value) {
                    vm.delete($itemScope.customer);
                }
            },
            {
                html: '<div class="drop-menu">التفاصيل<span class="fa fa-info fa-lg"></span></div>',
                enabled: function () {
                    return true;
                },
                click: function ($itemScope, $event, value) {
                    ModalProvider.openCustomerDetailsModel($itemScope.customer);
                }
            },
            {
                html: '<div class="drop-menu">كشف حساب<span class="fa fa-print fa-lg"></span></div>',
                enabled: function () {
                    return true;
                },
                click: function ($itemScope, $event, value) {
                    vm.print($itemScope.customer);
                }
            }
        ];

        $timeout(function () {
            vm.fetchTableData();
            window.componentHandler.upgradeAllRegistered();
        }, 1500);

    }]);