app.controller('contractCreateUpdateCtrl', ['ContractService', '$scope', '$rootScope', '$timeout', '$log', '$uibModalInstance', 'title', 'action', 'contract',
    function (ContractService, $scope, $rootScope, $timeout, $log, $uibModalInstance, title, action, contract) {

        $scope.contract = contract;

        $scope.title = title;

        $scope.action = action;

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