app.factory("ContractReceiptService",
    ['$http', '$log', function ($http, $log) {
        return {
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
            create: function (contract) {
                return $http.post("/api/contractReceipt/create", contract).then(function (response) {
                    return response.data;
                });
            },
            remove: function (id) {
                return $http.delete("/api/contractReceipt/delete/" + id);
            }
        };
    }]);