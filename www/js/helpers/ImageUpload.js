/*global kitchsy, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides profile handlers
 */
kitchsy.factory('ImageUploadService', function ($q, $ionicLoading, $cordovaFileTransfer, CLOUDINARY_CONFIGS) {

    var ImageUploadService = function (images) {

        var deferred = $q.defer();
        var fileSize;
        var percentage;
        var responses = [];

        function startProcess(imageIndex) {
            
            var imageURI = images[imageIndex];

            window.resolveLocalFileSystemURL(imageURI, function (fileEntry) {
                // Find out how big the original file is
                fileEntry.file(function (fileObj) {
                    fileSize = fileObj.size;
                    // Display a loading indicator reporting the start of the upload
                    $ionicLoading.show({
                        template: 'Uploading Picture '+(imageIndex + 1) +'/'+ images.length +' : ' + 0 + '%'
                    });
                    // Trigger the upload
                    uploadFile(imageIndex);
                });
            });
        }

        function uploadFile(imageIndex) {
            
            var imageURI = images[imageIndex];
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
                /*$ionicLoading.show({
                    template: 'Upload Completed',
                    duration: 1000
                });*/
                // Result has a "response" property that is escaped
                // FYI: The result will also have URLs for any new images generated with 
                // eager transformations
                var response = JSON.parse(decodeURIComponent(result.response));
                
                if(imageIndex + 1 < images.length){
                    responses.push(response);
                    startProcess(imageIndex++);
                }else{
                    deferred.resolve(responses);
                }
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
                    //template: 'Uploading Picture : ' + percentage + '%'
                    template: 'Uploading Picture '+(imageIndex + 1) +'/'+ images.length +' : ' + percentage + '%'
                });
            });
        }
        
        startProcess(0);

        return deferred.promise;
    }

    return ImageUploadService;
});