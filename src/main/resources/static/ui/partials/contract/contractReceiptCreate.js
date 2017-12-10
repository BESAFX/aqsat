app.controller('contractReceiptCreateCtrl', ['ContractReceiptService', 'ModalProvider', '$uibModal', '$scope', '$rootScope', '$timeout', '$log', '$uibModalInstance', 'contract',
    function (ContractReceiptService, ModalProvider, $uibModal, $scope, $rootScope, $timeout, $log, $uibModalInstance, contract) {

        $scope.contractReceipt = {};

        $scope.contractReceipt.contract = contract;

        $scope.submit = function () {
            ContractReceiptService.create($scope.contractReceipt).then(function (data) {
                $uibModalInstance.close(data);
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]);