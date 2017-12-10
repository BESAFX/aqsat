app.controller('contractReceiptCreateUpdateCtrl', ['ContractReceiptService', 'CustomerService', 'SupplierService', 'ModalProvider', '$scope', '$rootScope', '$timeout', '$log', '$uibModalInstance', 'title', 'action', 'contractReceipt',
    function (ContractReceiptService, CustomerService, SupplierService, ModalProvider, $scope, $rootScope, $timeout, $log, $uibModalInstance, title, action, contractReceipt) {

        $scope.contractReceipt = contractReceipt;

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

        $scope.newCustomer = function () {
            ModalProvider.openCustomerCreateModel().result.then(function (data) {
                $scope.customers.splice(0, 0, data);
            }, function () {
                console.info('CustomerCreateModel Closed.');
            });
        };

        $scope.newSupplier = function () {
            ModalProvider.openSupplierCreateModel().result.then(function (data) {
                $scope.suppliers.splice(0, 0, data);
            }, function () {
                console.info('SupplierCreateModel Closed.');
            });
        };

        $scope.submit = function () {
            switch ($scope.action) {
                case 'create' :
                    ContractReceiptService.create($scope.contractReceipt).then(function (data) {
                        $uibModalInstance.close(data);
                    });
                    break;
                case 'update' :
                    ContractReceiptService.update($scope.contractReceipt).then(function (data) {
                        $scope.contractReceipt = data;
                    });
                    break;
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]);