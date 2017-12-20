app.controller("supplierCtrl", ['SupplierService', 'ModalProvider', '$rootScope', '$state', '$timeout', '$uibModal',
    function (SupplierService, ModalProvider, $rootScope, $state, $timeout, $uibModal) {

        var vm = this;
        
        /**************************************************************
         *                                                            *
         * List                                                       *
         *                                                            *
         *************************************************************/
        vm.selectedSupplier = {};
        vm.suppliers = [];

        vm.fetchSupplierTableData = function () {
            SupplierService.findAll().then(function (data) {
                vm.suppliers = data;
                vm.setSelectedSupplier(data[0]);
            });
        };

        vm.setSelectedSupplier = function (object) {
            if (object) {
                angular.forEach(vm.suppliers, function (supplier) {
                    if (object.id == supplier.id) {
                        vm.selectedSupplier = supplier;
                        return supplier.isSelected = true;
                    } else {
                        return supplier.isSelected = false;
                    }
                });
            }
        };

        vm.deleteSupplier = function (supplier) {
            if (supplier) {
                $rootScope.showConfirmNotify("حذف البيانات", "هل تود حذف التاجر وكل ما يتعلق به من حسابات فعلاً؟", "error", "fa-trash", function () {
                    SupplierService.remove(supplier.id).then(function () {
                        var index = vm.suppliers.indexOf(supplier);
                        vm.suppliers.splice(index, 1);
                        vm.setSelectedSupplier(vm.suppliers[0]);
                    });
                });
                return;
            }

            $rootScope.showConfirmNotify("حذف البيانات", "هل تود حذف التاجر وكل ما يتعلق به من حسابات فعلاً؟", "error", "fa-trash", function () {
                SupplierService.remove(vm.selectedSupplier.id).then(function () {
                    var index = vm.suppliers.indexOf(vm.selectedSupplier);
                    vm.suppliers.splice(index, 1);
                    vm.setSelectedSupplier(vm.suppliers[0]);
                });
            });
        };

        vm.newSupplier = function () {
            ModalProvider.openSupplierCreateModel().result.then(function (data) {
                vm.suppliers.splice(0, 0, data);
            }, function () {
                console.info('SupplierCreateModel Closed.');
            });
        };

        vm.print = function (supplier) {
            window.open('/report/supplier/' + supplier.id + '/PDF');
        };

        vm.rowMenuSupplier = [
            {
                html: '<div class="drop-menu">انشاء تاجر جديد<span class="fa fa-pencil fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_SUPPLIER_CREATE']);
                },
                click: function ($itemScope, $event, value) {
                    vm.newSupplier();
                }
            },
            {
                html: '<div class="drop-menu">تعديل بيانات التاجر<span class="fa fa-edit fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_SUPPLIER_UPDATE']);
                },
                click: function ($itemScope, $event, value) {
                    ModalProvider.openSupplierUpdateModel($itemScope.supplier);
                }
            },
            {
                html: '<div class="drop-menu">حذف التاجر<span class="fa fa-trash fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_SUPPLIER_DELETE']);
                },
                click: function ($itemScope, $event, value) {
                    vm.deleteSupplier($itemScope.supplier);
                }
            },
            {
                html: '<div class="drop-menu">كشف حساب<span class="fa fa-print fa-lg"></span></div>',
                enabled: function () {
                    return true;
                },
                click: function ($itemScope, $event, value) {
                    vm.print($itemScope.supplier);
                }
            }
        ];

        /**************************************************************
         *                                                            *
         * Receipt In                                                 *
         *                                                            *
         *************************************************************/
        vm.selectedReceiptIn = {};
        vm.receiptsIn = [];
        vm.itemsIn = [];
        vm.itemsIn.push(
            {'id': 1, 'type': 'link', 'name': $rootScope.lang === 'AR' ? 'البرامج' : 'Application', 'link': 'menu'},
            {'id': 2, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'ايرادات العقود' : 'Contract Receipts'}
        );

        vm.setSelectedReceiptIn = function (object) {
            if (object) {
                angular.forEach(vm.receiptsIn, function (contractReceipt) {
                    if (object.id == contractReceipt.id) {
                        vm.selectedReceiptIn = contractReceipt;
                        return contractReceipt.isSelected = true;
                    } else {
                        return contractReceipt.isSelected = false;
                    }
                });
            }
        };

        vm.filterReceiptsIn = function () {

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
                vm.receiptsIn = data;
                vm.setSelectedReceiptIn(data[0]);
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
                vm.receiptsIn = data;
                vm.setSelectedReceiptIn(data[0]);
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
                vm.receiptsIn = data;
                vm.setSelectedReceiptIn(data[0]);
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
                vm.receiptsIn = data;
                vm.setSelectedReceiptIn(data[0]);
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
                vm.receiptsIn = data;
                vm.setSelectedReceiptIn(data[0]);
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
                        var index = vm.receiptsIn.indexOf(contractReceipt);
                        vm.receiptsIn.splice(index, 1);
                        vm.setSelectedReceiptIn(vm.receiptsIn[0]);
                        vm.totalAmount = 0;
                        angular.forEach(vm.receiptsIn, function (contractReceipt) {
                            vm.totalAmount+=contractReceipt.receipt.amountNumber;
                        });
                    });
                });
                return;
            }

            $rootScope.showConfirmNotify("حذف البيانات", "هل تود حذف السند وكل ما يتعلق به من حسابات فعلاً؟", "error", "fa-trash", function () {
                ContractReceiptService.remove(vm.selectedReceiptIn.id).then(function () {
                    var index = vm.receiptsIn.indexOf(vm.selectedReceiptIn);
                    vm.receiptsIn.splice(index, 1);
                    vm.setSelectedReceiptIn(vm.receiptsIn[0]);
                    vm.totalAmount = 0;
                    angular.forEach(vm.receiptsIn, function (contractReceipt) {
                        vm.totalAmount+=contractReceipt.receipt.amountNumber;
                    });
                });
            });
        };

        vm.newSupplierReceiptIn = function () {
            ModalProvider.openSupplierReceiptInCreateModel().result.then(function (data) {
                vm.receiptsIn.splice(0, 0, data);
                vm.totalAmount = 0;
                angular.forEach(vm.receiptsIn, function (contractReceipt) {
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
                    vm.newSupplierReceiptIn();
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

        /**************************************************************
         *                                                            *
         * Receipt Out                                                *
         *                                                            *
         *************************************************************/
        vm.selectedOut = {};
        vm.receiptsOut = [];
        vm.itemsOut = [];
        vm.itemsOut.push(
            {'id': 1, 'type': 'link', 'name': $rootScope.lang === 'AR' ? 'البرامج' : 'Application', 'link': 'menu'},
            {'id': 2, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'سداد العقود' : 'Seller Receipts'}
        );

        vm.setSelectedOut = function (object) {
            if (object) {
                angular.forEach(vm.receiptsOut, function (contractReceipt) {
                    if (object.id == contractReceipt.id) {
                        vm.selectedOut = contractReceipt;
                        return contractReceipt.isSelected = true;
                    } else {
                        return contractReceipt.isSelected = false;
                    }
                });
            }
        };

        vm.filterOut = function () {

            var search = [];

            if (vm.paramOut.contractCodeFrom) {
                search.push('contractCodeFrom=');
                search.push(vm.paramOut.contractCodeFrom);
                search.push('&');
            }
            if (vm.paramOut.contractCodeTo) {
                search.push('contractCodeTo=');
                search.push(vm.paramOut.contractCodeTo);
                search.push('&');
            }
            //
            if (vm.paramOut.contractCustomerName) {
                search.push('contractCustomerName=');
                search.push(vm.paramOut.contractCustomerName);
                search.push('&');
            }
            if (vm.paramOut.contractCustomerMobile) {
                search.push('contractCustomerMobile=');
                search.push(vm.paramOut.contractCustomerMobile);
                search.push('&');
            }
            if (vm.paramOut.contractCustomerIdentityNumber) {
                search.push('contractCustomerIdentityNumber=');
                search.push(vm.paramOut.contractCustomerIdentityNumber);
                search.push('&');
            }
            //
            if (vm.paramOut.contractSupplierName) {
                search.push('contractSupplierName=');
                search.push(vm.paramOut.contractSupplierName);
                search.push('&');
            }
            if (vm.paramOut.contractSupplierMobile) {
                search.push('contractSupplierMobile=');
                search.push(vm.paramOut.contractSupplierMobile);
                search.push('&');
            }
            if (vm.paramOut.contractSupplierIdentityNumber) {
                search.push('contractSupplierIdentityNumber=');
                search.push(vm.paramOut.contractSupplierIdentityNumber);
                search.push('&');
            }
            //
            if (vm.paramOut.contractAmountFrom) {
                search.push('contractAmountFrom=');
                search.push(vm.paramOut.contractAmountFrom);
                search.push('&');
            }
            if (vm.paramOut.contractAmountTo) {
                search.push('contractAmountTo=');
                search.push(vm.paramOut.contractAmountTo);
                search.push('&');
            }
            //
            if (vm.paramOut.contractRegisterDateFrom) {
                search.push('contractRegisterDateFrom=');
                search.push(vm.paramOut.contractRegisterDateFrom.getTime());
                search.push('&');
            }
            if (vm.paramOut.contractRegisterDateTo) {
                search.push('contractRegisterDateTo=');
                search.push(vm.paramOut.contractRegisterDateTo.getTime());
                search.push('&');
            }
            //

            //
            if (vm.paramOut.receiptCodeFrom) {
                search.push('receiptCodeFrom=');
                search.push(vm.paramOut.receiptCodeFrom);
                search.push('&');
            }
            if (vm.paramOut.receiptCodeTo) {
                search.push('receiptCodeTo=');
                search.push(vm.paramOut.receiptCodeTo);
                search.push('&');
            }
            //
            if (vm.paramOut.receiptDateFrom) {
                search.push('receiptDateFrom=');
                search.push(vm.paramOut.receiptDateFrom.getTime());
                search.push('&');
            }
            if (vm.paramOut.receiptDateTo) {
                search.push('receiptDateTo=');
                search.push(vm.paramOut.receiptDateTo.getTime());
                search.push('&');
            }
            //
            search.push('receiptType=Out');
            search.push('&');
            //

            ContractReceiptService.filter(search.join("")).then(function (data) {
                vm.receiptsOut = data;
                vm.setSelectedOut(data[0]);
                vm.totalAmount = 0;
                angular.forEach(data, function (contractReceipt) {
                    vm.totalAmount+=contractReceipt.receipt.amountNumber;
                });
                vm.itemsOut = [];
                vm.itemsOut.push(
                    {
                        'id': 1,
                        'type': 'link',
                        'name': $rootScope.lang === 'AR' ? 'البرامج' : 'Application',
                        'link': 'menu'
                    },
                    {
                        'id': 2,
                        'type': 'title',
                        'name': $rootScope.lang === 'AR' ? 'سداد العقود' : 'Seller Receipts'
                    },
                    {'id': 3, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'بحث مخصص' : 'Custom Filters'}
                );
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        vm.findContractsReceiptsOutByToday = function () {
            ContractReceiptService.findByTodayOut().then(function (data) {
                vm.receiptsOut = data;
                vm.setSelectedOut(data[0]);
                vm.totalAmount = 0;
                angular.forEach(data, function (contractReceipt) {
                    vm.totalAmount+=contractReceipt.receipt.amountNumber;
                });
                vm.itemsOut = [];
                vm.itemsOut.push(
                    {
                        'id': 1,
                        'type': 'link',
                        'name': $rootScope.lang === 'AR' ? 'البرامج' : 'Application',
                        'link': 'menu'
                    },
                    {
                        'id': 2,
                        'type': 'title',
                        'name': $rootScope.lang === 'AR' ? 'سداد العقود' : 'Seller Receipts'
                    },
                    {'id': 3, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'دفعات اليوم' : 'Contract Outcomes For Today'}
                );
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        vm.findContractsReceiptsOutByWeek = function () {
            ContractReceiptService.findByWeekOut().then(function (data) {
                vm.receiptsOut = data;
                vm.setSelectedOut(data[0]);
                vm.totalAmount = 0;
                angular.forEach(data, function (contractReceipt) {
                    vm.totalAmount+=contractReceipt.receipt.amountNumber;
                });
                vm.itemsOut = [];
                vm.itemsOut.push(
                    {
                        'id': 1,
                        'type': 'link',
                        'name': $rootScope.lang === 'AR' ? 'البرامج' : 'Application',
                        'link': 'menu'
                    },
                    {
                        'id': 2,
                        'type': 'title',
                        'name': $rootScope.lang === 'AR' ? 'سداد العقود' : 'Seller Receipts'
                    },
                    {'id': 3, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'دفعات الاسبوع' : 'Contract Outcomes For Week'}
                );
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        vm.findContractsReceiptsOutByMonth = function () {
            ContractReceiptService.findByMonthOut().then(function (data) {
                vm.receiptsOut = data;
                vm.setSelectedOut(data[0]);
                vm.totalAmount = 0;
                angular.forEach(data, function (contractReceipt) {
                    vm.totalAmount+=contractReceipt.receipt.amountNumber;
                });
                vm.itemsOut = [];
                vm.itemsOut.push(
                    {
                        'id': 1,
                        'type': 'link',
                        'name': $rootScope.lang === 'AR' ? 'البرامج' : 'Application',
                        'link': 'menu'
                    },
                    {
                        'id': 2,
                        'type': 'title',
                        'name': $rootScope.lang === 'AR' ? 'سداد العقود' : 'Seller Receipts'
                    },
                    {'id': 3, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'دفعات الشهر' : 'Contract Outcomes For Month'}
                );
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        vm.findContractsReceiptsOutByYear = function () {
            ContractReceiptService.findByYearOut().then(function (data) {
                vm.receiptsOut = data;
                vm.setSelectedOut(data[0]);
                vm.totalAmount = 0;
                angular.forEach(data, function (contractReceipt) {
                    vm.totalAmount+=contractReceipt.receipt.amountNumber;
                });
                vm.itemsOut = [];
                vm.itemsOut.push(
                    {
                        'id': 1,
                        'type': 'link',
                        'name': $rootScope.lang === 'AR' ? 'البرامج' : 'Application',
                        'link': 'menu'
                    },
                    {
                        'id': 2,
                        'type': 'title',
                        'name': $rootScope.lang === 'AR' ? 'سداد العقود' : 'Seller Receipts'
                    },
                    {'id': 3, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'دفعات العام' : 'Contract Outcomes For Year'}
                );
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        vm.deleteOut = function (contractReceipt) {
            if (contractReceipt) {
                $rootScope.showConfirmNotify("حذف البيانات", "هل تود حذف السند وكل ما يتعلق به من حسابات فعلاً؟", "error", "fa-trash", function () {
                    ContractReceiptService.remove(contractReceipt.id).then(function () {
                        var index = vm.receiptsOut.indexOf(contractReceipt);
                        vm.receiptsOut.splice(index, 1);
                        vm.setSelectedOut(vm.receiptsOut[0]);
                        vm.totalAmount = 0;
                        angular.forEach(vm.receiptsOut, function (contractReceipt) {
                            vm.totalAmount+=contractReceipt.receipt.amountNumber;
                        });
                    });
                });
                return;
            }

            $rootScope.showConfirmNotify("حذف البيانات", "هل تود حذف السند وكل ما يتعلق به من حسابات فعلاً؟", "error", "fa-trash", function () {
                ContractReceiptService.remove(vm.selectedOut.id).then(function () {
                    var index = vm.receiptsOut.indexOf(vm.selectedOut);
                    vm.receiptsOut.splice(index, 1);
                    vm.setSelectedOut(vm.receiptsOut[0]);
                    vm.totalAmount = 0;
                    angular.forEach(vm.receiptsOut, function (contractReceipt) {
                        vm.totalAmount+=contractReceipt.receipt.amountNumber;
                    });
                });
            });
        };

        vm.newContractReceiptOut = function () {
            ModalProvider.openContractReceiptOutCreateModel().result.then(function (data) {
                vm.receiptsOut.splice(0, 0, data);
                vm.totalAmount = 0;
                angular.forEach(vm.receiptsOut, function (contractReceipt) {
                    vm.totalAmount+=contractReceipt.receipt.amountNumber;
                });
            }, function () {
                console.info('ContractReceiptCreateModel Closed.');
            });
        };

        vm.rowMenuOut = [
            {
                html: '<div class="drop-menu">انشاء سند جديد<span class="fa fa-pencil fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_CONTRACT_RECEIPT_OUT_CREATE']);
                },
                click: function ($itemScope, $event, value) {
                    vm.newContractReceiptOut();
                }
            },
            {
                html: '<div class="drop-menu">حذف السند<span class="fa fa-trash fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_CONTRACT_RECEIPT_OUT_DELETE']);
                },
                click: function ($itemScope, $event, value) {
                    vm.deleteOut($itemScope.contractReceipt);
                }
            }
        ];

        $timeout(function () {
            vm.fetchSupplierTableData();
            window.componentHandler.upgradeAllRegistered();
        }, 1500);

    }]);