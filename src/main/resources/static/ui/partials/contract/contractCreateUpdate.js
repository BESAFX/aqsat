app.controller('contractCreateUpdateCtrl', ['ContractService', 'ContractAttachService', 'CustomerService', 'SupplierService', 'ModalProvider', '$scope', '$rootScope', '$uibModal', '$timeout', '$log', '$uibModalInstance', 'title', 'action', 'contract',
    function (ContractService, ContractAttachService, CustomerService, SupplierService, ModalProvider, $scope, $rootScope, $uibModal, $timeout, $log, $uibModalInstance, title, action, contract) {

        $scope.contract = contract;

        $scope.title = title;

        $scope.action = action;

        $scope.customers = [];

        $scope.suppliers = [];

        $scope.wrappers = [];

        $timeout(function () {
            CustomerService.findAllCombo().then(function (data) {
                $scope.customers = data;
            });
            SupplierService.findAllCombo().then(function (data) {
                $scope.suppliers = data;
            });
        }, 2000);

        $scope.newCustomer = function () {
            ModalProvider.openCustomerCreateModel().result.then(function (data) {
                $scope.customers.splice(0, 0, data);
            }, function () {
                console.info('CustomerCreateModel Closed.');
            });
        };

        $scope.newSupplier = function () {
            ModalProvider.openSupplierCreateModel().result.then(function (data) {
                $scope.suppliers.splice(0, 0, data);
            }, function () {
                console.info('SupplierCreateModel Closed.');
            });
        };

        /***********************************
         *                                 *
         * START FILE UPLOADER             *
         *                                 *
         **********************************/
        $scope.uploadFiles = function () {
            document.getElementById('uploader').click();
        };

        $scope.initFiles = function (files) {

            angular.forEach(files, function (file) {
                var wrapper = {};
                wrapper.src = file;
                wrapper.name = file.name.substr(0, file.name.lastIndexOf('.')) || file.name;
                wrapper.mimeType = file.name.split('.').pop();
                wrapper.size = file.size;
                $scope.wrappers.push(wrapper);
            });

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: '/ui/partials/contract/contractAttachUpload.html',
                controller: 'contractAttachUploadCtrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            });

            modalInstance.result.then(function () {
                angular.forEach($scope.wrappers, function (wrapper) {
                    console.info(wrapper);
                });
            }, function () {
            });

        };
        /***********************************
         *                                 *
         * END FILE UPLOADER               *
         *                                 *
         **********************************/

        /***********************************
         *                                 *
         * START SCAN MANAGER              *
         *                                 *
         **********************************/
        $scope.scanToJpg = function () {
            scanner.scan(displayImagesOnPage,
                {
                    "output_settings": [
                        {
                            "type": "return-base64",
                            "format": "jpg"
                        }
                    ]
                }
            );
        };

        function dataURItoBlob(dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            var byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            return new Blob([ia], {type: mimeString});
        }

        /** Processes the scan result */
        function displayImagesOnPage(successful, mesg, response) {
            var scannedImages = scanner.getScannedImages(response, true, false); // returns an array of ScannedImage
            var files = [];
            for (var i = 0; (scannedImages instanceof Array) && i < scannedImages.length; i++) {
                var blob = dataURItoBlob(scannedImages[i].src);
                var file = new File([blob], wrapper.name + '.jpg');
                files.push(file);
            }
            $scope.initFiles(files);
        }
        /***********************************
         *                                 *
         * END SCAN MANAGER                *
         *                                 *
         **********************************/

        $scope.submit = function () {
            switch ($scope.action) {
                case 'create' :
                    ContractService.create($scope.contract).then(function (data) {
                        //رفع الملفات
                        angular.forEach($scope.wrappers, function (wrapper) {
                            ContractAttachService.upload(data, wrapper.name, wrapper.mimeType, wrapper.description, wrapper.src).then(function (data) {

                            });
                        });
                        $uibModalInstance.close(data);
                    });
                    break;
                case 'update' :
                    ContractService.update($scope.contract).then(function (data) {
                        $scope.contract = data;
                    });
                    break;
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }]);