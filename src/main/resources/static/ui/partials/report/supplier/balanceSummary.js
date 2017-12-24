app.controller('balanceSummaryCtrl', ['SupplierService', '$scope', '$rootScope', '$timeout', '$uibModalInstance',
    function (SupplierService, $scope, $rootScope, $timeout, $uibModalInstance) {

        $scope.buffer = {};
        $scope.suppliers = [];

        $timeout(function () {
            SupplierService.findAllCombo().then(function (data) {
                $scope.suppliers = data;
            });
        }, 2000);

        $scope.submit = function () {
            window.open('/report/supplier/' + $scope.buffer.supplier.id + '/PDF');
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);