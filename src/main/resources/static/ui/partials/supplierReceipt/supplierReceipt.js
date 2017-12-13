app.controller("contractReceiptCtrl", ['ContractReceiptService', 'ModalProvider', '$scope', '$rootScope', '$state', '$timeout', '$uibModal',
    function (ContractReceiptService, ModalProvider, $scope, $rootScope, $state, $timeout, $uibModal) {

        $scope.selected = {};

        $scope.contractReceipts = [];

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
            window.componentHandler.upgradeAllRegistered();
        }, 1500);

    }]);