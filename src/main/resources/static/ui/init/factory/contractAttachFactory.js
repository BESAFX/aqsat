app.factory("ContractAttachService",
    ['$http', '$log', function ($http, $log) {
        return {
            upload: function (contract, fileName, mimeType, description, file) {
                var fd = new FormData();
                fd.append('file', file);
                return $http.post("/api/contractAttach/upload?contractId=" + contract.id + "&fileName=" + fileName + "&mimeType=" + mimeType + "&description=" + description + "&remote=true",
                    fd, {transformRequest: angular.identity, headers: {'Content-Type': undefined}}).then(function (response) {
                    return response.data;
                });
            },
            remove: function (contractAttach) {
                return $http.delete("/api/contractAttach/delete/" + contractAttach.id).then(function (response) {
                    return response.data;
                });
            },
            removeWhatever: function (contractAttach) {
                return $http.delete("/api/contractAttach/deleteWhatever/" + contractAttach.id);
            },
            findByContract: function (contract) {
                return $http.get("/api/contractAttach/findByContract/" + contract.id).then(function (response) {
                    return response.data;
                });
            }
        };
    }]);