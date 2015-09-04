/*global kitchsy, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides profile handlers
 */
kitchsy.factory('ImageUploadService', function ($q, $ionicLoading, $cordovaFileTransfer, CLOUDINARY_CONFIGS) {
    console.log(CLOUDINARY_CONFIGS);
    var ImageUploadService = function (imageURI) {
        
        var deferred = $q.defer();
        var fileSize;
        var percentage;
        // Find out how big the original file is
        window.resolveLocalFileSystemURL(imageURI, function (fileEntry) {
            fileEntry.file(function (fileObj) {
                fileSize = fileObj.size;
                // Display a loading indicator reporting the start of the upload
                $ionicLoading.show({
                    template: 'Uploading Picture : ' + 0 + '%'
                });
                // Trigger the upload
                uploadFile();
            });
        });

        function uploadFile() {
            // Add the Cloudinary "upload preset" name to the headers
            var uploadOptions = {
                params: {
                    'upload_preset': CLOUDINARY_CONFIGS.UPLOAD_PRESET
                }
            };
            $cordovaFileTransfer
            // Your Cloudinary URL will go here
                .upload(CLOUDINARY_CONFIGS.API_URL, imageURI, uploadOptions)

            .then(function (result) {
                // Let the user know the upload is completed
                $ionicLoading.show({
                    template: 'Upload Completed',
                    duration: 1000
                });
                // Result has a "response" property that is escaped
                // FYI: The result will also have URLs for any new images generated with 
                // eager transformations
                var response = JSON.parse(decodeURIComponent(result.response));
                deferred.resolve(response);
            }, function (err) {
                // Uh oh!
                console.log(err);
                $ionicLoading.show({
                    template: 'Upload Failed',
                    duration: 3000
                });
                deferred.reject(err);
            }, function (progress) {
                // The upload plugin gives you information about how much data has been transferred 
                // on some interval.  Use this with the original file size to show a progress indicator.
                percentage = Math.floor(progress.loaded / fileSize * 100);
                $ionicLoading.show({
                    template: 'Uploading Picture : ' + percentage + '%'
                });
            });
        }
        return deferred.promise;
    }
    
    return ImageUploadService;
});