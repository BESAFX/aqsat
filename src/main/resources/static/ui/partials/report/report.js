app.controller("reportCtrl", ['$rootScope', '$scope', '$timeout', function ($rootScope, $scope, $timeout) {

    $timeout(function () {
        window.componentHandler.upgradeAllRegistered();
    }, 1500);


}]);