app.service('ModalProvider', ['$uibModal', '$log', '$rootScope', function ($uibModal, $log, $rootScope) {

    /**************************************************************
     *                                                            *
     * Customer Model                                             *
     *                                                            *
     *************************************************************/
    this.openCustomerCreateModel = function () {
        return $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/ui/partials/customer/customerCreateUpdate.html',
            controller: 'customerCreateUpdateCtrl',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                title: function () {
                    return $rootScope.lang === 'AR' ? 'انشاء حساب عميل جديد' : 'New Customer';
                },
                action: function () {
                    return 'create';
                },
                customer: function () {
                    return {};
                }
            }
        });
    };

    this.openCustomerUpdateModel = function (customer) {
        return $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/ui/partials/customer/customerCreateUpdate.html',
            controller: 'customerCreateUpdateCtrl',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                title: function () {
                    return $rootScope.lang === 'AR' ? 'تعديل حساب عميل' : 'Update Customer Information';
                },
                action: function () {
                    return 'update';
                },
                customer: function () {
                    return customer;
                }
            }
        });
    };

    this.openCustomerDetailsModel = function (customer) {
        return $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/ui/partials/customer/customerDetails.html',
            controller: 'customerDetailsCtrl',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
                customer: function () {
                    return customer;
                }
            }
        });
    };

    this.openCustomerPaymentsSummaryReportModel = function () {
        return $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: "/ui/partials/report/customer/paymentsSummary.html",
            controller: "paymentsSummaryCtrl",
            backdrop: 'static',
            keyboard: false
        });
    };

    this.openCustomerPaymentsDetailsReportModel = function () {
        return $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: "/ui/partials/report/customer/paymentsDetails.html",
            controller: "paymentsDetailsCtrl",
            backdrop: 'static',
            keyboard: false
        });
    };

    /**************************************************************
     *                                                            *
     * Supplier Model                                             *
     *                                                            *
     *************************************************************/
    this.openSupplierCreateModel = function () {
        return $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/ui/partials/supplier/supplierCreateUpdate.html',
            controller: 'supplierCreateUpdateCtrl',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                title: function () {
                    return $rootScope.lang === 'AR' ? 'انشاء حساب تاجر جديد' : 'New Supplier';
                },
                action: function () {
                    return 'create';
                },
                supplier: function () {
                    return {};
                }
            }
        });
    };

    this.openSupplierUpdateModel = function (supplier) {
        return $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/ui/partials/supplier/supplierCreateUpdate.html',
            controller: 'supplierCreateUpdateCtrl',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                title: function () {
                    return $rootScope.lang === 'AR' ? 'تعديل حساب تاجر' : 'Update Supplier Information';
                },
                action: function () {
                    return 'update';
                },
                supplier: function () {
                    return supplier;
                }
            }
        });
    };

    this.openSupplierReceiptInCreateModel = function () {
        return $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/ui/partials/supplier/supplierReceiptCreate.html',
            controller: 'supplierReceiptCreateCtrl',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                receiptType: function () {
                    return 'In';
                }
            }
        });
    };

    this.openSupplierReceiptOutCreateModel = function () {
        return $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/ui/partials/supplier/supplierReceiptCreate.html',
            controller: 'supplierReceiptCreateCtrl',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                receiptType: function () {
                    return 'Out';
                }
            }
        });
    };

    this.openSupplierBalanceSummaryReportModel = function () {
        return $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: "/ui/partials/report/supplier/balanceSummary.html",
            controller: "balanceSummaryCtrl",
            backdrop: 'static',
            keyboard: false
        });
    };

    /**************************************************************
     *                                                            *
     * Contract Model                                             *
     *                                                            *
     *************************************************************/
    this.openContractCreateModel = function () {
        return $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/ui/partials/contract/contractCreateUpdate.html',
            controller: 'contractCreateUpdateCtrl',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
                title: function () {
                    return $rootScope.lang === 'AR' ? 'انشاء عقد جديد' : 'New Contract';
                },
                action: function () {
                    return 'create';
                },
                contract: function () {
                    return {};
                }
            }
        });
    };

    this.openContractUpdateModel = function (contract) {
        return $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/ui/partials/contract/contractCreateUpdate.html',
            controller: 'contractCreateUpdateCtrl',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
                title: function () {
                    return $rootScope.lang === 'AR' ? 'تعديل عقد' : 'Update Contract Information';
                },
                action: function () {
                    return 'update';
                },
                contract: function () {
                    return contract;
                }
            }
        });
    };

    this.openReceiptCreateByContractModel = function (contract) {
        return $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/ui/partials/contract/receiptCreateByContract.html',
            controller: 'receiptCreateByContractCtrl',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                contract: function () {
                    return contract;
                }
            }
        });
    };

    this.openContractReceiptInCreateModel = function () {
        return $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/ui/partials/contract/contractReceiptCreate.html',
            controller: 'contractReceiptCreateCtrl',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                receiptType: function () {
                    return 'In';
                }
            }
        });
    };

    /**************************************************************
     *                                                            *
     * Employee Model                                             *
     *                                                            *
     *************************************************************/
    this.openEmployeeCreateModel = function () {
        return $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/ui/partials/employee/employeeCreateUpdate.html',
            controller: 'employeeCreateUpdateCtrl',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
                title: function () {
                    return $rootScope.lang === 'AR' ? 'انشاء حساب موظف جديد' : 'New Employee';
                },
                action: function () {
                    return 'create';
                },
                employee: function () {
                    return {};
                }
            }
        });
    };

    this.openEmployeeUpdateModel = function (employee) {
        return $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/ui/partials/employee/employeeCreateUpdate.html',
            controller: 'employeeCreateUpdateCtrl',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
                title: function () {
                    return $rootScope.lang === 'AR' ? 'تعديل حساب موظف' : 'Update Employee Information';
                },
                action: function () {
                    return 'update';
                },
                employee: function () {
                    return employee;
                }
            }
        });
    };

    /**************************************************************
     *                                                            *
     * Team Model                                                 *
     *                                                            *
     *************************************************************/
    this.openTeamCreateModel = function () {
        return $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/ui/partials/team/teamCreateUpdate.html',
            controller: 'teamCreateUpdateCtrl',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
                title: function () {
                    return $rootScope.lang === 'AR' ? 'انشاء مجموعة جديدة' : 'New Team';
                },
                action: function () {
                    return 'create';
                },
                team: function () {
                    return undefined;
                }
            }
        });
    };

    this.openTeamUpdateModel = function (team) {
        return $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '/ui/partials/team/teamCreateUpdate.html',
            controller: 'teamCreateUpdateCtrl',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
                title: function () {
                    return $rootScope.lang === 'AR' ? 'تعديل بيانات مجموعة' : 'Update Team';
                },
                action: function () {
                    return 'update';
                },
                team: function () {
                    return team;
                }
            }
        });
    };

}]);

app.service('NotificationProvider', ['$http', function ($http) {

    this.notifyOne = function (code, title, message, type, receiver) {
        $http.post("/notifyOne?"
            + 'code=' + code
            + '&'
            + 'title=' + title
            + '&'
            + 'message=' + message
            + '&'
            + 'type=' + type
            + '&'
            + 'receiver=' + receiver);
    };

    this.notifyAll = function (code, title, message, type) {
        $http.post("/notifyAll?"
            + 'code=' + code
            + '&'
            + 'title=' + title
            + '&'
            + 'message=' + message
            + '&'
            + 'type=' + type
        );
    };

    this.notifyAllExceptMe = function (code, title, message, type) {
        $http.post("/notifyAllExceptMe?"
            + 'code=' + code
            + '&'
            + 'title=' + title
            + '&'
            + 'message=' + message
            + '&'
            + 'type=' + type
        );
    };

}]);

