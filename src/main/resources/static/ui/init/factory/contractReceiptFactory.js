app.factory("ContractReceiptService",
    ['$http', '$log', function ($http, $log) {
        return {
            findAllIn: function () {
                return $http.get("/api/contractReceipt/findAllIn").then(function (response) {
                    return response.data;
                });
            },
            findOne: function (id) {
                return $http.get("/api/contractReceipt/findOne/" + id).then(function (response) {
                    return response.data;
                });
            },
            findByContract: function (contractId) {
                return $http.get("/api/contractReceipt/findByContract/" + contractId).then(function (response) {
                    return response.data;
                });
            },
            createIn: function (contractReceipt) {
                return $http.post("/api/contractReceipt/create/In", contractReceipt).then(function (response) {
                    return response.data;
                });
            },
            remove: function (id) {
                return $http.delete("/api/contractReceipt/delete/" + id);
            },
            filter: function (search) {
                return $http.get("/api/contractReceipt/filter?" + search).then(function (response) {
                    return response.data;
                });
            },
            findByTodayIn: function () {
                return $http.get("/api/contractReceipt/findByToday/In").then(function (response) {
                    return response.data;
                });
            },
            findByWeekIn: function () {
                return $http.get("/api/contractReceipt/findByWeek/In").then(function (response) {
                    return response.data;
                });
            },
            findByMonthIn: function () {
                return $http.get("/api/contractReceipt/findByMonth/In").then(function (response) {
                    return response.data;
                });
            },
            findByYearIn: function () {
                return $http.get("/api/contractReceipt/findByYear/In").then(function (response) {
                    return response.data;
                });
            }
        };
    }]);