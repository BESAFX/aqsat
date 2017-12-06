app.factory("PersonService",
    ['$http', '$log', function ($http, $log) {
        return {
            update: function (person) {
                return $http.put("/api/person/update", person).then(function (response) {
                    return response.data;
                });
            },
            setGUILang: function (lang) {
                return $http.get("/api/person/setGUILang/" + lang).then(function (response) {
                    return response.data;
                });
            },
            setDateType: function (dateType) {
                return $http.get("/api/person/setDateType/" + dateType).then(function (response) {
                    return response.data;
                });
            },
            findActivePerson: function () {
                return $http.get("/api/person/findActivePerson").then(function (response) {
                    return response.data;
                });
            }
        };
    }]);