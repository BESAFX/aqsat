app.controller("contractReceiptCtrl", ['ContractReceiptService', 'ModalProvider', '$scope', '$rootScope', '$state', '$timeout', '$uibModal',
    function (ContractReceiptService, ModalProvider, $scope, $rootScope, $state, $timeout, $uibModal) {

        $scope.selected = {};

        $scope.contractReceipts = [];

        $scope.items = [];
        $scope.items.push(
            {'id': 1, 'type': 'link', 'name': $rootScope.lang === 'AR' ? 'البرامج' : 'Application', 'link': 'menu'},
            {'id': 2, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'ايرادات العقود' : 'Contract Receipts'}
        );

        $scope.filter = function () {

            var search = [];

            if ($scope.param.contractCodeFrom) {
                search.push('code=');
                search.push($scope.param.contractCodeFrom);
                search.push('&');
            }
            if ($scope.param.contractCodeTo) {
                search.push('code=');
                search.push($scope.param.contractCodeTo);
                search.push('&');
            }
            //
            if ($scope.param.contractCustomerName) {
                search.push('customerName=');
                search.push($scope.param.contractCustomerName);
                search.push('&');
            }
            if ($scope.param.contractCustomerMobile) {
                search.push('customerMobile=');
                search.push($scope.param.contractCustomerMobile);
                search.push('&');
            }
            if ($scope.param.contractCustomerIdentityNumber) {
                search.push('customerIdentityNumber=');
                search.push($scope.param.contractCustomerIdentityNumber);
                search.push('&');
            }
            //
            if ($scope.param.contractSupplierName) {
                search.push('supplierName=');
                search.push($scope.param.contractSupplierName);
                search.push('&');
            }
            if ($scope.param.contractSupplierMobile) {
                search.push('supplierMobile=');
                search.push($scope.param.contractSupplierMobile);
                search.push('&');
            }
            if ($scope.param.contractSupplierIdentityNumber) {
                search.push('supplierIdentityNumber=');
                search.push($scope.param.contractSupplierIdentityNumber);
                search.push('&');
            }
            //
            if ($scope.param.contractAmountFrom) {
                search.push('amountFrom=');
                search.push($scope.param.contractAmountFrom);
                search.push('&');
            }
            if ($scope.param.contractAmountTo) {
                search.push('amountTo=');
                search.push($scope.param.contractAmountTo);
                search.push('&');
            }
            //
            if ($scope.param.contractRegisterDateFrom) {
                search.push('registerDateFrom=');
                search.push($scope.param.contractRegisterDateFrom.getTime());
                search.push('&');
            }
            if ($scope.param.contractRegisterDateTo) {
                search.push('registerDateTo=');
                search.push($scope.param.contractRegisterDateTo.getTime());
                search.push('&');
            }
            //
            ContractService.filter(search.join("")).then(function (data) {
                $scope.contractReceipts = data;
                $scope.setSelected(data[0]);
                $scope.totalAmount = 0;
                $scope.totalPayments = 0;
                $scope.totalRemain = 0;
                angular.forEach(data, function (contract) {
                    $scope.totalAmount+=contract.amount;
                    $scope.totalPayments+=contract.paid;
                    $scope.totalRemain+=contract.remain;
                });
                $scope.items = [];
                $scope.items.push(
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

        $scope.findContractsReceiptsByToday = function () {
            ContractReceiptService.findByToday().then(function (data) {
                $scope.contractReceipts = data;
                $scope.setSelected(data[0]);
                $scope.totalAmount = 0;
                $scope.totalPayments = 0;
                $scope.totalRemain = 0;
                angular.forEach(data, function (contract) {
                    $scope.totalAmount+=contract.amount;
                    $scope.totalPayments+=contract.paid;
                    $scope.totalRemain+=contract.remain;
                });
                $scope.items = [];
                $scope.items.push(
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

        $scope.findContractsReceiptsByWeek = function () {
            ContractReceiptService.findByWeek().then(function (data) {
                $scope.contractReceipts = data;
                $scope.setSelected(data[0]);
                $scope.totalAmount = 0;
                angular.forEach(data, function (contractReceipt) {
                    $scope.totalAmount+=contractReceipt.receipt.amountNumber;
                });
                $scope.items = [];
                $scope.items.push(
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

        $scope.findContractsReceiptsByMonth = function () {
            ContractReceiptService.findByMonth().then(function (data) {
                $scope.contractReceipts = data;
                $scope.setSelected(data[0]);
                $scope.totalAmount = 0;
                $scope.totalPayments = 0;
                $scope.totalRemain = 0;
                angular.forEach(data, function (contract) {
                    $scope.totalAmount+=contract.amount;
                    $scope.totalPayments+=contract.paid;
                    $scope.totalRemain+=contract.remain;
                });
                $scope.items = [];
                $scope.items.push(
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

        $scope.findContractsReceiptsByYear = function () {
            ContractReceiptService.findByYear().then(function (data) {
                $scope.contractReceipts = data;
                $scope.setSelected(data[0]);
                $scope.totalAmount = 0;
                $scope.totalPayments = 0;
                $scope.totalRemain = 0;
                angular.forEach(data, function (contract) {
                    $scope.totalAmount+=contract.amount;
                    $scope.totalPayments+=contract.paid;
                    $scope.totalRemain+=contract.remain;
                });
                $scope.items = [];
                $scope.items.push(
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

        $scope.setSelected = function (object) {
            if (object) {
                angular.forEach($scope.contractReceipts, function (contractReceipt) {
                    if (object.id == contractReceipt.id) {
                        $scope.selected = contractReceipt;
                        return contractReceipt.isSelected = true;
                    } else {
                        return contractReceipt.isSelected = false;
                    }
                });
            }
        };

        $scope.delete = function (contractReceipt) {
            if (contractReceipt) {
                $rootScope.showConfirmNotify("حذف البيانات", "هل تود حذف السند وكل ما يتعلق به من حسابات فعلاً؟", "error", "fa-trash", function () {
                    ContractReceiptService.remove(contractReceipt.id).then(function () {
                        var index = $scope.contractReceipts.indexOf(contractReceipt);
                        $scope.contractReceipts.splice(index, 1);
                        $scope.setSelected($scope.contractReceipts[0]);
                    });
                });
                return;
            }

            $rootScope.showConfirmNotify("حذف البيانات", "هل تود حذف السند وكل ما يتعلق به من حسابات فعلاً؟", "error", "fa-trash", function () {
                ContractReceiptService.remove($scope.selected.id).then(function () {
                    var index = $scope.contractReceipts.indexOf($scope.selected);
                    $scope.contractReceipts.splice(index, 1);
                    $scope.setSelected($scope.contractReceipts[0]);
                });
            });
        };

        $scope.newContractReceipt = function () {
            ModalProvider.openContractReceiptCreateModel().result.then(function (data) {
                $scope.contractReceipts.splice(0, 0, data);
            }, function () {
                console.info('ContractReceiptCreateModel Closed.');
            });
        };

        $scope.rowMenu = [
            {
                html: '<div class="drop-menu">انشاء سند جديد<span class="fa fa-pencil fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_CONTRACT_RECEIPT_CREATE']);
                },
                click: function ($itemScope, $event, value) {
                    $scope.newContractReceipt();
                }
            },
            {
                html: '<div class="drop-menu">تعديل بيانات السند<span class="fa fa-edit fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_CONTRACT_RECEIPT_UPDATE']);
                },
                click: function ($itemScope, $event, value) {
                    ModalProvider.openContractReceiptUpdateModel($itemScope.contractReceipt);
                }
            },
            {
                html: '<div class="drop-menu">حذف السند<span class="fa fa-trash fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_CONTRACT_RECEIPT_DELETE']);
                },
                click: function ($itemScope, $event, value) {
                    $scope.delete($itemScope.contractReceipt);
                }
            }
        ];

        $timeout(function () {
            $scope.findContractsReceiptsByWeek();
            window.componentHandler.upgradeAllRegistered();
        }, 1500);

    }]);