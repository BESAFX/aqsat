app.controller("employeeCtrl", ['EmployeeService', 'ModalProvider', '$rootScope', '$state', '$timeout',
    function (EmployeeService, ModalProvider, $rootScope, $state, $timeout) {

        var vm = this;

        /**************************************************************
         *                                                            *
         * Employee                                                   *
         *                                                            *
         *************************************************************/
        vm.selected = {};
        vm.employees = [];
        vm.fetchTableData = function () {
            EmployeeService.findAll().then(function (data) {
                vm.employees = data;
                vm.setSelected(data[0]);
            });
        };
        vm.setSelected = function (object) {
            if (object) {
                angular.forEach(vm.employees, function (employee) {
                    if (object.id == employee.id) {
                        vm.selected = employee;
                        return employee.isSelected = true;
                    } else {
                        return employee.isSelected = false;
                    }
                });
            }
        };
        vm.delete = function (employee) {
            if (employee) {
                $rootScope.showConfirmNotify("حذف البيانات", "هل تود حذف الموظف فعلاً؟", "error", "fa-trash", function () {
                    EmployeeService.remove(employee.id).then(function () {
                        var index = vm.employees.indexOf(employee);
                        vm.employees.splice(index, 1);
                        vm.setSelected(vm.employees[0]);
                    });
                });
                return;
            }

            $rootScope.showConfirmNotify("حذف البيانات", "هل تود حذف الموظف فعلاً؟", "error", "fa-trash", function () {
                EmployeeService.remove(vm.selected.id).then(function () {
                    var index = vm.employees.indexOf(vm.selected);
                    vm.employees.splice(index, 1);
                    vm.setSelected(vm.employees[0]);
                });
            });
        };
        vm.newEmployee = function () {
            ModalProvider.openEmployeeCreateModel().result.then(function (data) {
                vm.employees.splice(0,0,data);
            }, function () {
                console.info('EmployeeCreateModel Closed.');
            });
        };
        vm.enable = function () {
            EmployeeService.enable(vm.selected).then(function (data) {
                var index = vm.employees.indexOf(vm.selected);
                vm.employees[index] = data;
            });
        };
        vm.disable = function () {
            EmployeeService.disable(vm.selected).then(function (data) {
                var index = vm.employees.indexOf(vm.selected);
                vm.employees[index] = data;
            });
        };
        vm.rowMenu = [
            {
                html: '<div class="drop-menu">انشاء موظف جديد<span class="fa fa-pencil fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_EMPLOYEE_CREATE']);
                },
                click: function ($itemScope, $event, value) {
                    vm.newEmployee();
                }
            },
            {
                html: '<div class="drop-menu">تعديل بيانات الموظف<span class="fa fa-edit fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_EMPLOYEE_UPDATE']);
                },
                click: function ($itemScope, $event, value) {
                    ModalProvider.openEmployeeUpdateModel($itemScope.employee);
                }
            },
            {
                html: '<div class="drop-menu">حذف الموظف<span class="fa fa-trash fa-lg"></span></div>',
                enabled: function () {
                    return $rootScope.contains($rootScope.me.team.authorities, ['ROLE_EMPLOYEE_DELETE']);
                },
                click: function ($itemScope, $event, value) {
                    vm.delete($itemScope.employee);
                }
            }
        ];
        /**************************************************************
         *                                                            *
         * General                                                    *
         *                                                            *
         *************************************************************/
        $timeout(function () {
            window.componentHandler.upgradeAllRegistered();
        }, 1500);

    }]);