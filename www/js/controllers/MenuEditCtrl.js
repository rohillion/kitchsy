/*global kitchsy*/
'use strict';

kitchsy.controller('MenuEditCtrl', ['$scope', '$state', 'Auth', 'Menu', '$ionicModal', '$ionicLoading', '$cordovaImagePicker', 'ImageEncoder', 'Image', 'ImageUploadService', function MenuEditCtrl($scope, $state, Auth, Menu, $ionicModal, $ionicLoading, $cordovaImagePicker, ImageEncoder, Image, ImageUploadService) {

    var options = {
        maximumImagesCount: 10,
        width: 800,
        height: 800,
        quality: 80
    };

    $scope.images = ['http://placehold.it/50x50', 'img/food2.jpg', 'img/food3.jpg'];



    $scope.loadImages = function () {
        for (var i = 0; i < 0; i++) {
            $scope.images.push({
                id: i,
                src: "http://placehold.it/50x50"
            });
        }
    }

    $scope.uploadImages = function () {

        if (window.cordova) {
            $cordovaImagePicker.getPictures(options).then(function (results) {
                for (var i = 0; i < results.length; i++) {

                    ImageUploadService(results[i]).then(function (something) {
                        console.log(something);
                    });
                    //$scope.$apply();
                    /*ImageEncoder.get(results[i], function (encodedUrl) {

                        $scope.images.push({
                            id: i,
                            src: encodedUrl
                        });

                        $scope.$apply();

                    }, 'image/jpeg');*/
                }
            }, function (error) {
                console.log(error);
            });
        }
    }

    $ionicLoading.show({
        template: 'Loading...'
    });

    $scope.min = {
        price: 1,
        guests: 1
    }

    $scope.max = {
        price: 100,
        guests: 100
    }

    Menu.get(Auth.user.uid).then(function (menu) {
        if (menu.price) {

            ///Image.all(Auth.user.uid).then(function (images) {

            $scope.menu = {
                price: menu.price,
                min: menu.min,
                max: menu.max,
                starter: menu.starter,
                main: menu.main,
                dessert: menu.dessert,
                beverage: menu.beverage,
                //images: images
            }

            console.log($scope.menu);

            $scope.$watch('menu.min', function (newValue) {
                console.log(newValue);
            });

            $ionicLoading.hide();
            //});

        } else {
            $ionicLoading.show({
                template: 'Creating menu...'
            });

            menu.price = 15;
            menu.description = '';
            menu.max = 15;
            menu.min = 5;
            menu.starter = {
                on: false
            };
            menu.main = {
                on: false
            };
            menu.dessert = {
                on: false
            };
            menu.beverage = {
                on: false
            };

            menu.$save().then(function () {

                $scope.menu = {
                    price: menu.price,
                    min: menu.min,
                    max: menu.max,
                    starter: menu.starter,
                    main: menu.main,
                    dessert: menu.dessert,
                    beverage: menu.beverage
                };

                $ionicLoading.hide();
            });

        }

        $ionicModal.fromTemplateUrl('templates/modals/image_picker.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            //$scope.loadImages();
            $scope.imagePicker = modal;
        });

        $scope.showImagePickerModal = function () {
            $scope.imagePicker.show();
        };

        $scope.hideImagePickerModal = function () {
            $scope.imagePicker.hide();
        };

        $scope.$on('modal.hidden', function () {
            //$scope.user.city = '';
        });

        $scope.save = function () {

            $ionicLoading.show({
                template: 'Saving changes...'
            });

            Menu.edit(Auth.user.uid, {
                price: $scope.menu.price,
                max: $scope.menu.max,
                min: $scope.menu.min,
                starter: $scope.menu.starter,
                main: $scope.menu.main,
                dessert: $scope.menu.dessert,
                beverage: $scope.menu.beverage
            }).then(function () {

                /*var i = 0;
                angular.forEach($scope.images, function (value, key) {
                    Image.create(Auth.user.uid, value.src).then(function () {
                        if (i = $scope.images.length)
                            $ionicLoading.hide();
                        i++;
                    });
                });*/

            });
        }
    });

    }]);