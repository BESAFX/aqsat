app.factory("ContractService",
    ['$http', '$log', function ($http, $log) {
        return {
            findAll: function () {
                return $http.get("/api/contract/findAll").then(function (response) {
                    return response.data;
                });
            },
            findAllCombo: function () {
                return $http.get("/api/contract/findAllCombo").then(function (response) {
                    return response.data;
                });
            },
            findOne: function (id) {
                return $http.get("/api/contract/findOne/" + id).then(function (response) {
                    return response.data;
                });
            },
            create: function (contract) {
                return $http.post("/api/contract/create", contract).then(function (response) {
                    return response.data;
                });
            },
            remove: function (id) {
                return $http.delete("/api/contract/delete/" + id);
            },
            update: function (contract) {
                return $http.put("/api/contract/update", contract).then(function (response) {
                    return response.data;
                });
            }
        };
    }]);