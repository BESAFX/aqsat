app.controller("contractCtrl", ['ContractService', 'ModalProvider', '$scope', '$rootScope', '$state', '$timeout', '$uibModal',
    function (ContractService, ModalProvider, $scope, $rootScope, $state, $timeout, $uibModal) {

        $scope.selected = {};

        $scope.contracts = [];

        $scope.items = [];
        $scope.items.push(
            {'id': 1, 'type': 'link', 'name': $rootScope.lang === 'AR' ? 'البرامج' : 'Application', 'link': 'menu'},
            {'id': 2, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'العقود' : 'Contracts'}
        );

        $scope.filter = function () {

            var search = [];

            if ($scope.param.code) {
                search.push('code=');
                search.push($scope.param.code);
                search.push('&');
            }
            //
            if ($scope.param.customerName) {
                search.push('customerName=');
                search.push($scope.param.customerName);
                search.push('&');
            }
            if ($scope.param.customerMobile) {
                search.push('customerMobile=');
                search.push($scope.param.customerMobile);
                search.push('&');
            }
            if ($scope.param.customerIdentityNumber) {
                search.push('customerIdentityNumber=');
                search.push($scope.param.customerIdentityNumber);
                search.push('&');
            }
            //
            if ($scope.param.supplierName) {
                search.push('supplierName=');
                search.push($scope.param.supplierName);
                search.push('&');
            }
            if ($scope.param.supplierMobile) {
                search.push('supplierMobile=');
                search.push($scope.param.supplierMobile);
                search.push('&');
            }
            if ($scope.param.supplierIdentityNumber) {
                search.push('supplierIdentityNumber=');
                search.push($scope.param.supplierIdentityNumber);
                search.push('&');
            }
            //
            if ($scope.param.amountFrom) {
                search.push('amountFrom=');
                search.push($scope.param.amountFrom);
                search.push('&');
            }
            if ($scope.param.amountTo) {
                search.push('amountTo=');
                search.push($scope.param.amountTo);
                search.push('&');
            }
            //
            if ($scope.param.registerDateFrom) {
                search.push('registerDateFrom=');
                search.push($scope.param.registerDateFrom.getTime());
                search.push('&');
            }
            if ($scope.param.registerDateTo) {
                search.push('registerDateTo=');
                search.push($scope.param.registerDateTo.getTime());
                search.push('&');
            }
            //
            ContractService.filter(search.join("")).then(function (data) {
                $scope.contracts = data;
                $scope.setSelected(data[0]);
                $scope.totalAmount = 0;
                $scope.totalPayments = 0;
                $scope.totalRemain = 0;
                angular.forEach(data, function (contract) {
                    $scope.totalAmount+=contract.amount;
                    $scope.totalPayments+=contract.paid;
                    $scope.totalRemain+=contract.remain;
                });
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        $scope.findContractsByToday = function () {
            ContractService.findByToday().then(function (data) {
                $scope.contracts = data;
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
                        'name': $rootScope.lang === 'AR' ? 'العقود' : 'Contracts'
                    },
                    {'id': 3, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'عقود اليوم' : 'Contracts For Today'}
                );
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        $scope.findContractsByWeek = function () {
            ContractService.findByWeek().then(function (data) {
                $scope.contracts = data;
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
                        'name': $rootScope.lang === 'AR' ? 'العقود' : 'Contracts'
                    },
                    {'id': 3, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'عقود الاسبوع' : 'Contracts For Week'}
                );
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        $scope.findContractsByMonth = function () {
            ContractService.findByMonth().then(function (data) {
                $scope.contracts = data;
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
                        'name': $rootScope.lang === 'AR' ? 'العقود' : 'Contracts'
                    },
                    {'id': 3, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'عقود الشهر' : 'Contracts For Month'}
                );
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        $scope.findContractsByYear = function () {
            ContractService.findByYear().then(function (data) {
                $scope.contracts = data;
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
                        'name': $rootScope.lang === 'AR' ? 'العقود' : 'Contracts'
                    },
                    {'id': 3, 'type': 'title', 'name': $rootScope.lang === 'AR' ? 'عقود العام' : 'Contracts For Year'}
                );
                $timeout(function () {
                    window.componentHandler.upgradeAllRegistered();
                }, 500);
            });
        };

        $scope.setSelected = function (object) {
            if (object) {
                angular.forEach($scope.contracts, function (contract) {
                    if (object.id == contract.id) {
                        $scope.selected = contract;
                        return contract.isSelected = true;
                    } else {
                        return contract.isSelected = false;
                    }
                });
            }
        };

        $scope.delete = function (contract) {
            if (contract) {
                $rootScope.showConfirmNotify("حذف البيانات", "هل تود حذف العقد وكل ما يتعلق به من حسابات فعلاً؟", "error", "fa-trash", function () {
                    ContractService.remove(contract.id).then(function () {
                        var index = $scope.contracts.indexOf(contract);
                        $scope.contracts.splice(index, 1);
                        $scope.setSelected($scope.contracts[0]);
                    });
                });
                return;
            }

            $rootScope.showConfirmNotify("حذف البيانات", "هل تود حذف العقد وكل ما يتعلق به من حسابات فعلاً؟", "error", "fa-trash", function () {
                ContractService.remove($scope.selected.id).then(function () {
                    var index = $scope.contracts.indexOf($scope.selected);
                    $scope.contracts.splice(index, 1);
                    $scope.setSelected($scope.contracts[0]);
                });
            });
        };

        $scope.newContract = function () {
            ModalProvider.openContractCreateModel().result.then(function (data) {
                $scope.contracts.splice(0, 0, data);
            }, function () {
                console.info('ContractCreateModel Closed.');
            });
        };

        $scope.newContractReceipt = function (contract) {
            ModalProvider.openContractReceiptCreateInnerModel(contract).result.then(function (data) {
                if (contract.contractReceipts) {
                    return contract.contractReceipts.splice(0, 0, data);
                }
            }, function () {
                console.info('ContractReceiptCreateModel Closed.');
            });
        };

        $scope.rowMenu = [
            {
                html: '<div class="drop-menu">انشاء تاجر جديد<span class="fa fa-pencil fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_CONTRACT_CREATE']);
                },
                click: function ($itemScope, $event, value) {
                    $scope.newContract();
                }
            },
            {
                html: '<div class="drop-menu">تعديل بيانات العقد<span class="fa fa-edit fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_CONTRACT_UPDATE']);
                },
                click: function ($itemScope, $event, value) {
                    ModalProvider.openContractUpdateModel($itemScope.contract);
                }
            },
            {
                html: '<div class="drop-menu">حذف العقد<span class="fa fa-trash fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_CONTRACT_DELETE']);
                },
                click: function ($itemScope, $event, value) {
                    $scope.delete($itemScope.contract);
                }
            },
            {
                html: '<div class="drop-menu">تسديد دفعة<span class="fa fa-money fa-lg"></span></div>',
                enabled: function ($itemScope) {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_CONTRACT_RECEIPT_CREATE']);
                },
                click: function ($itemScope, $event, value) {
                    $scope.newContractReceipt($itemScope.contract);
                }
            }
        ];

        $timeout(function () {
            $scope.findContractsByWeek();
            window.componentHandler.upgradeAllRegistered();
        }, 1500);

    }]);