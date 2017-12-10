app.controller("contractCtrl", ['ContractService', 'ModalProvider', '$scope', '$rootScope', '$state', '$timeout', '$uibModal',
    function (ContractService, ModalProvider, $scope, $rootScope, $state, $timeout, $uibModal) {

        $scope.selected = {};

        $scope.fetchTableData = function () {
            ContractService.findAll().then(function (data) {
                $scope.contracts = data;
                $scope.setSelected(data[0]);
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
            }
        ];

        $timeout(function () {
            window.componentHandler.upgradeAllRegistered();
        }, 1500);

    }]);