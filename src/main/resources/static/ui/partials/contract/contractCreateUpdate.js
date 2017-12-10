app.controller('contractCreateUpdateCtrl', ['ContractService', 'CustomerService', 'SupplierService', '$scope', '$rootScope', '$timeout', '$log', '$uibModalInstance', 'title', 'action', 'contract',
    function (ContractService, CustomerService, SupplierService, $scope, $rootScope, $timeout, $log, $uibModalInstance, title, action, contract) {

        $scope.contract = contract;

        $scope.title = title;

        $scope.action = action;

        $scope.customers = [];

        $scope.suppliers = [];

        $timeout(function () {
            CustomerService.findAllCombo().then(function (data) {
                $scope.customers = data;
            });
            SupplierService.findAllCombo().then(function (data) {
                $scope.suppliers = data;
            });
        }, 2000);

        $scope.submit = function () {
            switch ($scope.action) {
                case 'create' :
                    ContractService.create($scope.contract).then(function (data) {
                        $uibModalInstance.close(data);
                    });
                    break;
                case 'update' :
                    ContractService.update($scope.contract).then(function (data) {
                        $scope.contract = data;
                    });
                    break;
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]);