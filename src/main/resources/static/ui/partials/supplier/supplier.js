app.controller("supplierCtrl", ['SupplierService', 'SupplierReceiptService', 'ModalProvider', '$rootScope', '$state', '$timeout', '$uibModal',
    function (SupplierService, SupplierReceiptService, ModalProvider, $rootScope, $state, $timeout, $uibModal) {

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

        vm.printCustomers = function (supplier) {
            window.open('/report/supplier/' + supplier.id + '/customers/' +  '/PDF');
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
            },
            {
                html: '<div class="drop-menu">كشف العملاء<span class="fa fa-print fa-lg"></span></div>',
                enabled: function () {
                    return true;
                },
                click: function ($itemScope, $event, value) {
                    vm.printCustomers($itemScope.supplier);
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
            {'id': 2, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'المبالغ المحصلة' : 'Cash From Sellers'}
        );

        vm.setSelectedIn = function (object) {
            if (object) {
                angular.forEach(vm.receiptsIn, function (supplierReceipt) {
                    if (object.id == supplierReceipt.id) {
                        vm.selectedReceiptIn = supplierReceipt;
                        return supplierReceipt.isSelected = true;
                    } else {
                        return supplierReceipt.isSelected = false;
                    }
                });
            }
        };

        vm.filterIn = function () {

            var search = [];

            if (vm.paramIn.supplierCodeFrom) {
                search.push('supplierCodeFrom=');
                search.push(vm.paramIn.supplierCodeFrom);
                search.push('&');
            }
            if (vm.paramIn.supplierCodeTo) {
                search.push('supplierCodeTo=');
                search.push(vm.paramIn.supplierCodeTo);
                search.push('&');
            }
            //
            if (vm.paramIn.supplierName) {
                search.push('supplierName=');
                search.push(vm.paramIn.supplierName);
                search.push('&');
            }
            if (vm.paramIn.supplierMobile) {
                search.push('supplierMobile=');
                search.push(vm.paramIn.supplierMobile);
                search.push('&');
            }
            if (vm.paramIn.supplierIdentityNumber) {
                search.push('supplierIdentityNumber=');
                search.push(vm.paramIn.supplierIdentityNumber);
                search.push('&');
            }

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

            SupplierReceiptService.filter(search.join("")).then(function (data) {
                vm.receiptsIn = data;
                vm.setSelectedIn(data[0]);
                vm.totalAmountIn = 0;
                angular.forEach(data, function (supplierReceipt) {
                    vm.totalAmountIn+=supplierReceipt.receipt.amountNumber;
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
                        'name': $rootScope.lang === 'AR' ? 'المبالغ المحصلة' : 'Cash From Sellers'
                    },
                    {'id': 3, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'بحث مخصص' : 'Custom Filters'}
                );
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        vm.findSuppliersReceiptsInByToday = function () {
            SupplierReceiptService.findByTodayIn().then(function (data) {
                vm.receiptsIn = data;
                vm.setSelectedIn(data[0]);
                vm.totalAmountIn = 0;
                angular.forEach(data, function (supplierReceipt) {
                    vm.totalAmountIn+=supplierReceipt.receipt.amountNumber;
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
                        'name': $rootScope.lang === 'AR' ? 'المبالغ المحصلة' : 'Supplier Cash In'
                    },
                    {'id': 3, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'تحصيل اليوم' : 'For Today'}
                );
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        vm.findSuppliersReceiptsInByWeek = function () {
            SupplierReceiptService.findByWeekIn().then(function (data) {
                vm.receiptsIn = data;
                vm.setSelectedIn(data[0]);
                vm.totalAmountIn = 0;
                angular.forEach(data, function (supplierReceipt) {
                    vm.totalAmountIn+=supplierReceipt.receipt.amountNumber;
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
                        'name': $rootScope.lang === 'AR' ? 'المبالغ المحصلة' : 'Supplier Cash In'
                    },
                    {'id': 3, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'تحصيل الاسبوع' : 'For Week'}
                );
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        vm.findSuppliersReceiptsInByMonth = function () {
            SupplierReceiptService.findByMonthIn().then(function (data) {
                vm.receiptsIn = data;
                vm.setSelectedIn(data[0]);
                vm.totalAmountIn = 0;
                angular.forEach(data, function (supplierReceipt) {
                    vm.totalAmountIn+=supplierReceipt.receipt.amountNumber;
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
                        'name': $rootScope.lang === 'AR' ? 'المبالغ المحصلة' : 'Supplier Cash In'
                    },
                    {'id': 3, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'تحصيل الشهر' : 'For Month'}
                );
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        vm.findSuppliersReceiptsInByYear = function () {
            SupplierReceiptService.findByYearIn().then(function (data) {
                vm.receiptsIn = data;
                vm.setSelectedIn(data[0]);
                vm.totalAmountIn = 0;
                angular.forEach(data, function (supplierReceipt) {
                    vm.totalAmountIn+=supplierReceipt.receipt.amountNumber;
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
                        'name': $rootScope.lang === 'AR' ? 'المبالغ المحصلة' : 'Supplier Cash In'
                    },
                    {'id': 3, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'تحصيل العام' : 'For Year'}
                );
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        vm.deleteIn = function (supplierReceipt) {
            if (supplierReceipt) {
                $rootScope.showConfirmNotify("حذف البيانات", "هل تود حذف السند وكل ما يتعلق به من حسابات فعلاً؟", "error", "fa-trash", function () {
                    SupplierReceiptService.remove(supplierReceipt.id).then(function () {
                        var index = vm.receiptsIn.indexOf(supplierReceipt);
                        vm.receiptsIn.splice(index, 1);
                        vm.setSelectedIn(vm.receiptsIn[0]);
                        vm.totalAmountIn = 0;
                        angular.forEach(vm.receiptsIn, function (supplierReceipt) {
                            vm.totalAmountIn+=supplierReceipt.receipt.amountNumber;
                        });
                    });
                });
                return;
            }

            $rootScope.showConfirmNotify("حذف البيانات", "هل تود حذف السند وكل ما يتعلق به من حسابات فعلاً؟", "error", "fa-trash", function () {
                SupplierReceiptService.remove(vm.selectedReceiptIn.id).then(function () {
                    var index = vm.receiptsIn.indexOf(vm.selectedReceiptIn);
                    vm.receiptsIn.splice(index, 1);
                    vm.setSelectedIn(vm.receiptsIn[0]);
                    vm.totalAmountIn = 0;
                    angular.forEach(vm.receiptsIn, function (supplierReceipt) {
                        vm.totalAmountIn+=supplierReceipt.receipt.amountNumber;
                    });
                });
            });
        };

        vm.newSupplierReceiptIn = function () {
            ModalProvider.openSupplierReceiptInCreateModel().result.then(function (data) {
                vm.receiptsIn.splice(0, 0, data);
                vm.totalAmountIn = 0;
                angular.forEach(vm.receiptsIn, function (supplierReceipt) {
                    vm.totalAmountIn+=supplierReceipt.receipt.amountNumber;
                });
            }, function () {
                console.info('SupplierReceiptCreateModel Closed.');
            });
        };

        vm.rowMenuIn = [
            {
                html: '<div class="drop-menu">انشاء سند جديد<span class="fa fa-pencil fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_SUPPLIER_RECEIPT_IN_CREATE']);
                },
                click: function ($itemScope, $event, value) {
                    vm.newSupplierReceiptIn();
                }
            },
            {
                html: '<div class="drop-menu">حذف السند<span class="fa fa-trash fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_SUPPLIER_RECEIPT_IN_DELETE']);
                },
                click: function ($itemScope, $event, value) {
                    vm.deleteIn($itemScope.supplierReceipt);
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
            {'id': 2, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'المبالغ المصروفة' : 'Paid Payments To Sellers'}
        );

        vm.setSelectedOut = function (object) {
            if (object) {
                angular.forEach(vm.receiptsOut, function (supplierReceipt) {
                    if (object.id == supplierReceipt.id) {
                        vm.selectedOut = supplierReceipt;
                        return supplierReceipt.isSelected = true;
                    } else {
                        return supplierReceipt.isSelected = false;
                    }
                });
            }
        };

        vm.filterOut = function () {

            var search = [];

            if (vm.paramIn.supplierCodeFrom) {
                search.push('supplierCodeFrom=');
                search.push(vm.paramIn.supplierCodeFrom);
                search.push('&');
            }
            if (vm.paramIn.supplierCodeTo) {
                search.push('supplierCodeTo=');
                search.push(vm.paramIn.supplierCodeTo);
                search.push('&');
            }
            //
            if (vm.paramIn.supplierName) {
                search.push('supplierName=');
                search.push(vm.paramIn.supplierName);
                search.push('&');
            }
            if (vm.paramIn.supplierMobile) {
                search.push('supplierMobile=');
                search.push(vm.paramIn.supplierMobile);
                search.push('&');
            }
            if (vm.paramIn.supplierIdentityNumber) {
                search.push('supplierIdentityNumber=');
                search.push(vm.paramIn.supplierIdentityNumber);
                search.push('&');
            }

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

            SupplierReceiptService.filter(search.join("")).then(function (data) {
                vm.receiptsOut = data;
                vm.setSelectedOut(data[0]);
                vm.totalAmountOut = 0;
                angular.forEach(data, function (supplierReceipt) {
                    vm.totalAmountOut+=supplierReceipt.receipt.amountNumber;
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
                        'name': $rootScope.lang === 'AR' ? 'المبالغ المصروفة' : 'Paid Payments To Sellers'
                    },
                    {'id': 3, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'بحث مخصص' : 'Custom Filters'}
                );
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        vm.findSuppliersReceiptsOutByToday = function () {
            SupplierReceiptService.findByTodayOut().then(function (data) {
                vm.receiptsOut = data;
                vm.setSelectedOut(data[0]);
                vm.totalAmountOut = 0;
                angular.forEach(data, function (supplierReceipt) {
                    vm.totalAmountOut+=supplierReceipt.receipt.amountNumber;
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
                        'name': $rootScope.lang === 'AR' ? 'المبالغ المصروفة' : 'Paid Payments To Sellers'
                    },
                    {'id': 3, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'دفعات اليوم' : 'For Today'}
                );
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        vm.findSuppliersReceiptsOutByWeek = function () {
            SupplierReceiptService.findByWeekOut().then(function (data) {
                vm.receiptsOut = data;
                vm.setSelectedOut(data[0]);
                vm.totalAmountOut = 0;
                angular.forEach(data, function (supplierReceipt) {
                    vm.totalAmountOut+=supplierReceipt.receipt.amountNumber;
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
                        'name': $rootScope.lang === 'AR' ? 'المبالغ المصروفة' : 'Paid Payments To Sellers'
                    },
                    {'id': 3, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'دفعات الاسبوع' : 'For Week'}
                );
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        vm.findSuppliersReceiptsOutByMonth = function () {
            SupplierReceiptService.findByMonthOut().then(function (data) {
                vm.receiptsOut = data;
                vm.setSelectedOut(data[0]);
                vm.totalAmountOut = 0;
                angular.forEach(data, function (supplierReceipt) {
                    vm.totalAmountOut+=supplierReceipt.receipt.amountNumber;
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
                        'name': $rootScope.lang === 'AR' ? 'المبالغ المصروفة' : 'Paid Payments To Sellers'
                    },
                    {'id': 3, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'دفعات الشهر' : 'For Month'}
                );
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        vm.findSuppliersReceiptsOutByYear = function () {
            SupplierReceiptService.findByYearOut().then(function (data) {
                vm.receiptsOut = data;
                vm.setSelectedOut(data[0]);
                vm.totalAmountOut = 0;
                angular.forEach(data, function (supplierReceipt) {
                    vm.totalAmountOut+=supplierReceipt.receipt.amountNumber;
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
                        'name': $rootScope.lang === 'AR' ? 'المبالغ المصروفة' : 'Paid Payments To Sellers'
                    },
                    {'id': 3, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'دفعات العام' : 'For Year'}
                );
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        vm.deleteOut = function (supplierReceipt) {
            if (supplierReceipt) {
                $rootScope.showConfirmNotify("حذف البيانات", "هل تود حذف السند وكل ما يتعلق به من حسابات فعلاً؟", "error", "fa-trash", function () {
                    SupplierReceiptService.remove(supplierReceipt.id).then(function () {
                        var index = vm.receiptsOut.indexOf(supplierReceipt);
                        vm.receiptsOut.splice(index, 1);
                        vm.setSelectedOut(vm.receiptsOut[0]);
                        vm.totalAmountOut = 0;
                        angular.forEach(vm.receiptsOut, function (supplierReceipt) {
                            vm.totalAmountOut+=supplierReceipt.receipt.amountNumber;
                        });
                    });
                });
                return;
            }

            $rootScope.showConfirmNotify("حذف البيانات", "هل تود حذف السند وكل ما يتعلق به من حسابات فعلاً؟", "error", "fa-trash", function () {
                SupplierReceiptService.remove(vm.selectedOut.id).then(function () {
                    var index = vm.receiptsOut.indexOf(vm.selectedOut);
                    vm.receiptsOut.splice(index, 1);
                    vm.setSelectedOut(vm.receiptsOut[0]);
                    vm.totalAmountOut = 0;
                    angular.forEach(vm.receiptsOut, function (supplierReceipt) {
                        vm.totalAmountOut+=supplierReceipt.receipt.amountNumber;
                    });
                });
            });
        };

        vm.newSupplierReceiptOut = function () {
            ModalProvider.openSupplierReceiptOutCreateModel().result.then(function (data) {
                vm.receiptsOut.splice(0, 0, data);
                vm.totalAmountOut = 0;
                angular.forEach(vm.receiptsOut, function (supplierReceipt) {
                    vm.totalAmountOut+=supplierReceipt.receipt.amountNumber;
                });
            }, function () {
                console.info('SupplierReceiptCreateModel Closed.');
            });
        };

        vm.rowMenuOut = [
            {
                html: '<div class="drop-menu">انشاء سند جديد<span class="fa fa-pencil fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_SUPPLIER_RECEIPT_OUT_CREATE']);
                },
                click: function ($itemScope, $event, value) {
                    vm.newSupplierReceiptOut();
                }
            },
            {
                html: '<div class="drop-menu">حذف السند<span class="fa fa-trash fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_SUPPLIER_RECEIPT_OUT_DELETE']);
                },
                click: function ($itemScope, $event, value) {
                    vm.deleteOut($itemScope.supplierReceipt);
                }
            }
        ];

        $timeout(function () {
            vm.fetchSupplierTableData();
        }, 1500);

        $timeout(function () {
            vm.findSuppliersReceiptsInByWeek();
        }, 1600);

        $timeout(function () {
            vm.findSuppliersReceiptsOutByWeek();
            window.componentHandler.upgradeAllRegistered();
        }, 1700);

    }]);