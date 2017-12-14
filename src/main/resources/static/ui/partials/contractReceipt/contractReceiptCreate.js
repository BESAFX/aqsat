app.controller('contractReceiptCreateCtrl', ['ContractReceiptService', 'ContractService', 'ModalProvider', '$scope', '$rootScope', '$timeout', '$log', '$uibModalInstance', 'receiptType',
    function (ContractReceiptService, ContractService, ModalProvider, $scope, $rootScope, $timeout, $log, $uibModalInstance, receiptType) {


        $scope.receiptType = receiptType;

        $scope.contractReceipt = {};

        $scope.contracts = [];

        $timeout(function () {
            ContractService.findAllCombo().then(function (data) {
                $scope.contracts = data;
            });
        }, 2000);

        $scope.newContract = function () {
            ModalProvider.openContractCreateModel().result.then(function (data) {
                $scope.contracts.splice(0, 0, data);
            }, function () {
                console.info('ContractCreateModel Closed.');
            });
        };

        $scope.submit = function () {
            switch (receiptType){
                case 'In':
                    ContractReceiptService.createIn($scope.contractReceipt).then(function (data) {
                        $uibModalInstance.close(data);
                    });
                    break;
                case 'Out':
                    ContractReceiptService.createOut($scope.contractReceipt).then(function (data) {
                        $uibModalInstance.close(data);
                    });
                    break;
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]);