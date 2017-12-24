app.controller('paymentsDetailsCtrl', ['CustomerService', '$scope', '$rootScope', '$timeout', '$uibModalInstance',
    function (CustomerService, $scope, $rootScope, $timeout, $uibModalInstance) {

        $scope.buffer = {};
        $scope.customers = [];

        $timeout(function () {
            CustomerService.findAllCombo().then(function (data) {
                $scope.customers = data;
            });
        }, 2000);

        $scope.submit = function () {
            window.open('/report/customer/payments/' + $scope.buffer.customer.id + '/PDF');
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);