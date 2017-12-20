app.factory("SupplierReceiptService",
    ['$http', '$log', function ($http, $log) {
        return {
            findOne: function (id) {
                return $http.get("/api/supplierReceipt/findOne/" + id).then(function (response) {
                    return response.data;
                });
            },
            findBySupplier: function (supplierId) {
                return $http.get("/api/supplierReceipt/findBySupplier/" + supplierId).then(function (response) {
                    return response.data;
                });
            },
            createIn: function (supplierReceipt) {
                return $http.post("/api/supplierReceipt/create/In", supplierReceipt).then(function (response) {
                    return response.data;
                });
            },
            createOut: function (supplierReceipt) {
                return $http.post("/api/supplierReceipt/create/Out", supplierReceipt).then(function (response) {
                    return response.data;
                });
            },
            remove: function (id) {
                return $http.delete("/api/supplierReceipt/delete/" + id);
            },
            filter: function (search) {
                return $http.get("/api/supplierReceipt/filter?" + search).then(function (response) {
                    return response.data;
                });
            },
            findByTodayIn: function () {
                return $http.get("/api/supplierReceipt/findByToday/In").then(function (response) {
                    return response.data;
                });
            },
            findByWeekIn: function () {
                return $http.get("/api/supplierReceipt/findByWeek/In").then(function (response) {
                    return response.data;
                });
            },
            findByMonthIn: function () {
                return $http.get("/api/supplierReceipt/findByMonth/In").then(function (response) {
                    return response.data;
                });
            },
            findByYearIn: function () {
                return $http.get("/api/supplierReceipt/findByYear/In").then(function (response) {
                    return response.data;
                });
            },
            findByTodayOut: function () {
                return $http.get("/api/supplierReceipt/findByToday/Out").then(function (response) {
                    return response.data;
                });
            },
            findByWeekOut: function () {
                return $http.get("/api/supplierReceipt/findByWeek/Out").then(function (response) {
                    return response.data;
                });
            },
            findByMonthOut: function () {
                return $http.get("/api/supplierReceipt/findByMonth/Out").then(function (response) {
                    return response.data;
                });
            },
            findByYearOut: function () {
                return $http.get("/api/supplierReceipt/findByYear/Out").then(function (response) {
                    return response.data;
                });
            }
        };
    }]);