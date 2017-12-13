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
            create: function (supplier) {
                return $http.post("/api/supplierReceipt/create", supplier).then(function (response) {
                    return response.data;
                });
            },
            remove: function (id) {
                return $http.delete("/api/supplierReceipt/delete/" + id);
            }
        };
    }]);