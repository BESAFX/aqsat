app.controller('teamCreateUpdateCtrl', ['TeamService', '$scope', '$rootScope', '$timeout', '$log', '$uibModalInstance', 'title', 'action', 'team',
    function (TeamService, $scope, $rootScope, $timeout, $log, $uibModalInstance, title, action, team) {

        $scope.roles = [
            {
                id: 1,
                name: $rootScope.lang === 'AR' ? 'تعديل بيانات الشركة' : 'Update Company Information',
                value: 'ROLE_COMPANY_UPDATE',
                selected: false
            },
            {
                id: 2,
                name: $rootScope.lang === 'AR' ? 'إنشاء حسابات العملاء' : 'Create Customers',
                value: 'ROLE_CUSTOMER_CREATE',
                selected: false
            },
            {
                id: 3,
                name: $rootScope.lang === 'AR' ? 'تعديل بيانات حسابات العملاء' : 'Update Customers Information',
                value: 'ROLE_CUSTOMER_UPDATE',
                selected: false
            },
            {
                id: 4,
                name: $rootScope.lang === 'AR' ? 'حذف حسابات العملاء' : 'Delete Customers',
                value: 'ROLE_CUSTOMER_DELETE',
                selected: false
            },
            {
                id: 5,
                name: $rootScope.lang === 'AR' ? 'تفعيل حسابات العملاء' : 'Enable Customers',
                value: 'ROLE_CUSTOMER_ENABLE',
                selected: false
            },
            {
                id: 6,
                name: $rootScope.lang === 'AR' ? 'تعطيل حسابات العملاء' : 'Disable Customers',
                value: 'ROLE_CUSTOMER_DISABLE',
                selected: false
            },
            {
                id: 7,
                name: $rootScope.lang === 'AR' ? 'إنشاء حسابات الموظفون' : 'Create Employees',
                value: 'ROLE_EMPLOYEE_CREATE',
                selected: false
            },
            {
                id: 8,
                name: $rootScope.lang === 'AR' ? 'تعديل بيانات حسابات الموظفون' : 'Update Employees Information',
                value: 'ROLE_EMPLOYEE_UPDATE',
                selected: false
            },
            {
                id: 9,
                name: $rootScope.lang === 'AR' ? 'حذف حسابات الموظفون' : 'Delete Employees',
                value: 'ROLE_EMPLOYEE_DELETE',
                selected: false
            },
            {
                id: 10,
                name: $rootScope.lang === 'AR' ? 'تفعيل حسابات الموظفون' : 'Enable Employees',
                value: 'ROLE_EMPLOYEE_ENABLE',
                selected: false
            },
            {
                id: 11,
                name: $rootScope.lang === 'AR' ? 'تعطيل حسابات الموظفون' : 'Disable Employees',
                value: 'ROLE_EMPLOYEE_DISABLE',
                selected: false
            },
            {
                id: 12,
                name: $rootScope.lang === 'AR' ? 'إنشاء الصلاحيات' : 'Create Privileges',
                value: 'ROLE_TEAM_CREATE',
                selected: false
            },
            {
                id: 13,
                name: $rootScope.lang === 'AR' ? 'تعديل بيانات الصلاحيات' : 'Update Privileges',
                value: 'ROLE_TEAM_UPDATE',
                selected: false
            },
            {
                id: 14,
                name: $rootScope.lang === 'AR' ? 'حذف الصلاحيات' : 'Delete Privileges',
                value: 'ROLE_TEAM_DELETE',
                selected: false
            },
            {
                id: 15,
                name: $rootScope.lang === 'AR' ? 'إنشاء حسابات التجار' : 'Create Supplier',
                value: 'ROLE_SUPPLIER_CREATE',
                selected: false
            },
            {
                id: 16,
                name: $rootScope.lang === 'AR' ? 'تعديل بيانات حسابات التجار' : 'Update Supplier Information',
                value: 'ROLE_SUPPLIER_UPDATE',
                selected: false
            },
            {
                id: 17,
                name: $rootScope.lang === 'AR' ? 'حذف حسابات التجار' : 'Delete Supplier',
                value: 'ROLE_SUPPLIER_DELETE',
                selected: false
            },
            {
                id: 18,
                name: $rootScope.lang === 'AR' ? 'تفعيل حسابات التجار' : 'Enable Supplier',
                value: 'ROLE_SUPPLIER_ENABLE',
                selected: false
            },
            {
                id: 19,
                name: $rootScope.lang === 'AR' ? 'تعطيل حسابات التجار' : 'Disable Supplier',
                value: 'ROLE_SUPPLIER_DISABLE',
                selected: false
            },
            {
                id: 20,
                name: $rootScope.lang === 'AR' ? 'إنشاء العقود' : 'Create Contracts',
                value: 'ROLE_CONTRACT_CREATE',
                selected: false
            },
            {
                id: 21,
                name: $rootScope.lang === 'AR' ? 'تعديل بيانات العقود' : 'Update Contracts Information',
                value: 'ROLE_CONTRACT_UPDATE',
                selected: false
            },
            {
                id: 23,
                name: $rootScope.lang === 'AR' ? 'حذف العقود' : 'Delete Contracts',
                value: 'ROLE_CONTRACT_DELETE',
                selected: false
            },
            {
                id: 24,
                name: $rootScope.lang === 'AR' ? 'تسديد سندات العقود' : 'Create Receipt',
                value: 'ROLE_CONTRACT_RECEIPT_IN_CREATE',
                selected: false
            },
            {
                id: 25,
                name: $rootScope.lang === 'AR' ? 'حذف سندات العقود' : 'Delete Receipt',
                value: 'ROLE_CONTRACT_RECEIPT_IN_DELETE',
                selected: false
            },
            {
                id: 26,
                name: $rootScope.lang === 'AR' ? 'انشاء سندات قبض التجار' : 'Create Seller Receipt In',
                value: 'ROLE_SUPPLIER_RECEIPT_IN_CREATE',
                selected: false
            },
            {
                id: 27,
                name: $rootScope.lang === 'AR' ? 'حذف سندات قبض التجار' : 'Delete Seller Receipt In',
                value: 'ROLE_SUPPLIER_RECEIPT_IN_DELETE',
                selected: false
            },
            {
                id: 28,
                name: $rootScope.lang === 'AR' ? 'انشاء سندات صرف التجار' : 'Create Seller Receipt Out',
                value: 'ROLE_SUPPLIER_RECEIPT_OUT_CREATE',
                selected: false
            },
            {
                id: 29,
                name: $rootScope.lang === 'AR' ? 'حذف سندات صرف التجار' : 'Delete Seller Receipt Out',
                value: 'ROLE_SUPPLIER_RECEIPT_OUT_DELETE',
                selected: false
            }

        ];


        if (team) {
            $scope.team = team;
            if (typeof team.authorities === 'string') {
                $scope.team.authorities = team.authorities.split(',');
            }
            //
            angular.forEach($scope.team.authorities, function (auth) {
                angular.forEach($scope.roles, function (role) {
                    if (role.value === auth) {
                        return role.selected = true;
                    }
                })
            });
        } else {
            $scope.team = {};
        }

        $scope.title = title;

        $scope.action = action;

        $scope.submit = function () {
            $scope.team.authorities = [];
            angular.forEach($scope.roles, function (role) {
                if (role.selected) {
                    $scope.team.authorities.push(role.value);
                }
            });
            $scope.team.authorities = $scope.team.authorities.join();
            switch ($scope.action) {
                case 'create' :
                    TeamService.create($scope.team).then(function (data) {
                        $uibModalInstance.close(data);
                    });
                    break;
                case 'update' :
                    TeamService.update($scope.team).then(function (data) {
                        $scope.team = data;
                        $scope.team.authorities = team.authorities.split(',');
                    });
                    break;
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]);