app.controller("contractReceiptCtrl", ['ContractReceiptService', 'ModalProvider', '$rootScope', '$state', '$timeout', '$uibModal',
    function (ContractReceiptService, ModalProvider, $rootScope, $state, $timeout, $uibModal) {


        var vm = this;

        /**************************************************************
         *                                                            *
         * Contract Receipt In                                        *
         *                                                            *
         *************************************************************/
        vm.selectedIn = {};
        vm.contractReceiptsIn = [];
        vm.itemsIn = [];
        vm.itemsIn.push(
            {'id': 1, 'type': 'link', 'name': $rootScope.lang === 'AR' ? 'البرامج' : 'Application', 'link': 'menu'},
            {'id': 2, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'ايرادات العقود' : 'Contract Receipts'}
        );

        vm.setSelectedIn = function (object) {
            if (object) {
                angular.forEach(vm.contractReceiptsIn, function (contractReceipt) {
                    if (object.id == contractReceipt.id) {
                        vm.selectedIn = contractReceipt;
                        return contractReceipt.isSelected = true;
                    } else {
                        return contractReceipt.isSelected = false;
                    }
                });
            }
        };

        vm.filterIn = function () {

            var search = [];

            if (vm.paramIn.contractCodeFrom) {
                search.push('contractCodeFrom=');
                search.push(vm.paramIn.contractCodeFrom);
                search.push('&');
            }
            if (vm.paramIn.contractCodeTo) {
                search.push('contractCodeTo=');
                search.push(vm.paramIn.contractCodeTo);
                search.push('&');
            }
            //
            if (vm.paramIn.contractCustomerName) {
                search.push('contractCustomerName=');
                search.push(vm.paramIn.contractCustomerName);
                search.push('&');
            }
            if (vm.paramIn.contractCustomerMobile) {
                search.push('contractCustomerMobile=');
                search.push(vm.paramIn.contractCustomerMobile);
                search.push('&');
            }
            if (vm.paramIn.contractCustomerIdentityNumber) {
                search.push('contractCustomerIdentityNumber=');
                search.push(vm.paramIn.contractCustomerIdentityNumber);
                search.push('&');
            }
            //
            if (vm.paramIn.contractSupplierName) {
                search.push('contractSupplierName=');
                search.push(vm.paramIn.contractSupplierName);
                search.push('&');
            }
            if (vm.paramIn.contractSupplierMobile) {
                search.push('contractSupplierMobile=');
                search.push(vm.paramIn.contractSupplierMobile);
                search.push('&');
            }
            if (vm.paramIn.contractSupplierIdentityNumber) {
                search.push('contractSupplierIdentityNumber=');
                search.push(vm.paramIn.contractSupplierIdentityNumber);
                search.push('&');
            }
            //
            if (vm.paramIn.contractAmountFrom) {
                search.push('contractAmountFrom=');
                search.push(vm.paramIn.contractAmountFrom);
                search.push('&');
            }
            if (vm.paramIn.contractAmountTo) {
                search.push('contractAmountTo=');
                search.push(vm.paramIn.contractAmountTo);
                search.push('&');
            }
            //
            if (vm.paramIn.contractRegisterDateFrom) {
                search.push('contractRegisterDateFrom=');
                search.push(vm.paramIn.contractRegisterDateFrom.getTime());
                search.push('&');
            }
            if (vm.paramIn.contractRegisterDateTo) {
                search.push('contractRegisterDateTo=');
                search.push(vm.paramIn.contractRegisterDateTo.getTime());
                search.push('&');
            }
            //

            //
            if (vm.paramIn.receiptCodeFrom) {
                search.push('receiptCodeFrom=');
                search.push(vm.paramIn.receiptCodeFrom);
                search.push('&');
            }
            if (vm.paramIn.receiptCodeTo) {
                search.push('receiptCodeTo=');
                search.push(vm.paramIn.receiptCodeTo);
                search.push('&');
            }
            //
            if (vm.paramIn.receiptDateFrom) {
                search.push('receiptDateFrom=');
                search.push(vm.paramIn.receiptDateFrom.getTime());
                search.push('&');
            }
            if (vm.paramIn.receiptDateTo) {
                search.push('receiptDateTo=');
                search.push(vm.paramIn.receiptDateTo.getTime());
                search.push('&');
            }
            //
            search.push('receiptType=In');
            search.push('&');
            //

            ContractReceiptService.filter(search.join("")).then(function (data) {
                vm.contractReceiptsIn = data;
                vm.setSelectedIn(data[0]);
                vm.totalAmount = 0;
                angular.forEach(data, function (contractReceipt) {
                    vm.totalAmount+=contractReceipt.receipt.amountNumber;
                });
                vm.itemsIn = [];
                vm.itemsIn.push(
                    {
                        'id': 1,
                        'type': 'link',
                        'name': $rootScope.lang === 'AR' ? 'البرامج' : 'Application',
                        'link': 'menu'
                    },
                    {
                        'id': 2,
                        'type': 'title',
                        'name': $rootScope.lang === 'AR' ? 'ايرادات العقود' : 'Contract Receipts'
                    },
                    {'id': 3, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'بحث مخصص' : 'Custom Filters'}
                );
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        vm.findContractsReceiptsInByToday = function () {
            ContractReceiptService.findByTodayIn().then(function (data) {
                vm.contractReceiptsIn = data;
                vm.setSelectedIn(data[0]);
                vm.totalAmount = 0;
                angular.forEach(data, function (contractReceipt) {
                    vm.totalAmount+=contractReceipt.receipt.amountNumber;
                });
                vm.itemsIn = [];
                vm.itemsIn.push(
                    {
                        'id': 1,
                        'type': 'link',
                        'name': $rootScope.lang === 'AR' ? 'البرامج' : 'Application',
                        'link': 'menu'
                    },
                    {
                        'id': 2,
                        'type': 'title',
                        'name': $rootScope.lang === 'AR' ? 'ايرادات العقود' : 'Contract Receipts'
                    },
                    {'id': 3, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'ايرادات اليوم' : 'Contract Incomes For Today'}
                );
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        vm.findContractsReceiptsInByWeek = function () {
            ContractReceiptService.findByWeekIn().then(function (data) {
                vm.contractReceiptsIn = data;
                vm.setSelectedIn(data[0]);
                vm.totalAmount = 0;
                angular.forEach(data, function (contractReceipt) {
                    vm.totalAmount+=contractReceipt.receipt.amountNumber;
                });
                vm.itemsIn = [];
                vm.itemsIn.push(
                    {
                        'id': 1,
                        'type': 'link',
                        'name': $rootScope.lang === 'AR' ? 'البرامج' : 'Application',
                        'link': 'menu'
                    },
                    {
                        'id': 2,
                        'type': 'title',
                        'name': $rootScope.lang === 'AR' ? 'ايرادات العقود' : 'Contract Receipts'
                    },
                    {'id': 3, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'ايرادات الاسبوع' : 'Contract Incomes For Week'}
                );
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        vm.findContractsReceiptsInByMonth = function () {
            ContractReceiptService.findByMonthIn().then(function (data) {
                vm.contractReceiptsIn = data;
                vm.setSelectedIn(data[0]);
                vm.totalAmount = 0;
                angular.forEach(data, function (contractReceipt) {
                    vm.totalAmount+=contractReceipt.receipt.amountNumber;
                });
                vm.itemsIn = [];
                vm.itemsIn.push(
                    {
                        'id': 1,
                        'type': 'link',
                        'name': $rootScope.lang === 'AR' ? 'البرامج' : 'Application',
                        'link': 'menu'
                    },
                    {
                        'id': 2,
                        'type': 'title',
                        'name': $rootScope.lang === 'AR' ? 'ايرادات العقود' : 'Contract Receipts'
                    },
                    {'id': 3, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'ايرادات الشهر' : 'Contract Incomes For Month'}
                );
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        vm.findContractsReceiptsInByYear = function () {
            ContractReceiptService.findByYearIn().then(function (data) {
                vm.contractReceiptsIn = data;
                vm.setSelectedIn(data[0]);
                vm.totalAmount = 0;
                angular.forEach(data, function (contractReceipt) {
                    vm.totalAmount+=contractReceipt.receipt.amountNumber;
                });
                vm.itemsIn = [];
                vm.itemsIn.push(
                    {
                        'id': 1,
                        'type': 'link',
                        'name': $rootScope.lang === 'AR' ? 'البرامج' : 'Application',
                        'link': 'menu'
                    },
                    {
                        'id': 2,
                        'type': 'title',
                        'name': $rootScope.lang === 'AR' ? 'ايرادات العقود' : 'Contract Receipts'
                    },
                    {'id': 3, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'ايرادات العام' : 'Contract Incomes For Year'}
                );
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        vm.deleteIn = function (contractReceipt) {
            if (contractReceipt) {
                $rootScope.showConfirmNotify("حذف البيانات", "هل تود حذف السند وكل ما يتعلق به من حسابات فعلاً؟", "error", "fa-trash", function () {
                    ContractReceiptService.remove(contractReceipt.id).then(function () {
                        var index = vm.contractReceiptsIn.indexOf(contractReceipt);
                        vm.contractReceiptsIn.splice(index, 1);
                        vm.setSelectedIn(vm.contractReceiptsIn[0]);
                        vm.totalAmount = 0;
                        angular.forEach(vm.contractReceiptsIn, function (contractReceipt) {
                            vm.totalAmount+=contractReceipt.receipt.amountNumber;
                        });
                    });
                });
                return;
            }

            $rootScope.showConfirmNotify("حذف البيانات", "هل تود حذف السند وكل ما يتعلق به من حسابات فعلاً؟", "error", "fa-trash", function () {
                ContractReceiptService.remove(vm.selectedIn.id).then(function () {
                    var index = vm.contractReceiptsIn.indexOf(vm.selectedIn);
                    vm.contractReceiptsIn.splice(index, 1);
                    vm.setSelectedIn(vm.contractReceiptsIn[0]);
                    vm.totalAmount = 0;
                    angular.forEach(vm.contractReceiptsIn, function (contractReceipt) {
                        vm.totalAmount+=contractReceipt.receipt.amountNumber;
                    });
                });
            });
        };

        vm.newContractReceiptIn = function () {
            ModalProvider.openContractReceiptInCreateModel().result.then(function (data) {
                vm.contractReceiptsIn.splice(0, 0, data);
                vm.totalAmount = 0;
                angular.forEach(vm.contractReceiptsIn, function (contractReceipt) {
                    vm.totalAmount+=contractReceipt.receipt.amountNumber;
                });
            }, function () {
                console.info('ContractReceiptCreateModel Closed.');
            });
        };

        vm.rowMenuIn = [
            {
                html: '<div class="drop-menu">انشاء سند جديد<span class="fa fa-pencil fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_CONTRACT_RECEIPT_IN_CREATE']);
                },
                click: function ($itemScope, $event, value) {
                    vm.newContractReceiptIn();
                }
            },
            {
                html: '<div class="drop-menu">حذف السند<span class="fa fa-trash fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_CONTRACT_RECEIPT_IN_DELETE']);
                },
                click: function ($itemScope, $event, value) {
                    vm.deleteIn($itemScope.contractReceipt);
                }
            }
        ];

        $timeout(function () {
            window.componentHandler.upgradeAllRegistered();
        }, 1500);

    }]);