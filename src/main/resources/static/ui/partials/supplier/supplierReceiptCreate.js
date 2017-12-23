app.controller('supplierReceiptCreateCtrl', ['SupplierReceiptService', 'SupplierService', 'ModalProvider', '$scope', '$rootScope', '$timeout', '$log', '$uibModalInstance', 'receiptType',
    function (SupplierReceiptService, SupplierService, ModalProvider, $scope, $rootScope, $timeout, $log, $uibModalInstance, receiptType) {

        $scope.receiptType = receiptType;

        $scope.supplierReceipt = {};

        $scope.suppliers = [];

        $timeout(function () {
            SupplierService.findAllCombo().then(function (data) {
                $scope.suppliers = data;
            });
        }, 2000);

        $scope.newSupplier = function () {
            ModalProvider.openSupplierCreateModel().result.then(function (data) {
                $scope.suppliers.splice(0, 0, data);
            }, function () {
                console.info('SupplierCreateModel Closed.');
            });
        };

        $scope.submit = function () {
            switch ($scope.receiptType){
                case "In":
                    SupplierReceiptService.createIn($scope.supplierReceipt).then(function (data) {
                        $uibModalInstance.close(data);
                    });
                    break;
                case "Out":
                    SupplierReceiptService.createOut($scope.supplierReceipt).then(function (data) {
                        $uibModalInstance.close(data);
                    });
                    break;
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]);