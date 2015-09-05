/*global kitchsy*/
'use strict';

kitchsy.controller('MenuEditCtrl', ['$scope', '$state', 'Auth', 'Menu', '$ionicModal', '$ionicLoading', '$ionicActionSheet', '$cordovaImagePicker', 'Image', 'ImageUploadService', '$ionicSlideBoxDelegate', function MenuEditCtrl($scope, $state, Auth, Menu, $ionicModal, $ionicLoading, $ionicActionSheet, $cordovaImagePicker, Image, ImageUploadService, $ionicSlideBoxDelegate) {

    $ionicLoading.show({
        template: 'Loading...'
    });

    var imagesToUpload;
    var actionSheet;
    var options = {
        maximumImagesCount: 10,
        width: 800,
        height: 800,
        quality: 80
    };

    $scope.images = [];


    $scope.min = {
        price: 1,
        guests: 1
    }

    $scope.max = {
        price: 100,
        guests: 100
    }

    $scope.uploadImages = function () {

        if (window.cordova) {
            $cordovaImagePicker.getPictures(options).then(function (results) {
                for (var i = 0; i < results.length; i++) {
                    $scope.images.push(results[i]);
                }
            }, function (error) {
                console.log(error);
            });
        }
    }

    Menu.get(Auth.user.uid).then(function (menu) {
        if (menu.price) {

            Image.all(Auth.user.uid).then(function (images) {

                $scope.menu = {
                    price: menu.price,
                    min: menu.min,
                    max: menu.max,
                    starter: menu.starter,
                    main: menu.main,
                    dessert: menu.dessert,
                    beverage: menu.beverage,
                    images: images.map(function (image) {
                        return image.$value;
                    })
                }

                $ionicSlideBoxDelegate.update();
                $ionicLoading.hide();
            });

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

        $scope.confirmImages = function () {
            $scope.menu.images = $scope.images;
            $ionicSlideBoxDelegate.update();
            $scope.hideImagePickerModal();
        }

        $ionicModal.fromTemplateUrl('templates/modals/image_picker.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.imagePicker = modal;
        });

        $scope.showImagePickerModal = function () {
            $scope.images = $scope.menu.images;
            $scope.imagePicker.show();
        };

        $scope.hideImagePickerModal = function () {
            $scope.imagePicker.hide();
        };

        $scope.$on('modal.hidden', function () {
            //$scope.user.city = '';
        });

        $scope.deleteImageConfirm = function () {
            actionSheet = $ionicActionSheet.show({
                destructiveText: 'Delete',
                titleText: 'Delete image?',
                cancelText: 'Cancel',
                cancel: function () {
                    actionSheet();
                },
                destructiveButtonClicked: function () {
                    //Image.delete().then(function(){
                        actionSheet();
                    //});
                }
            });
        }


        $scope.save = function () {

            imagesToUpload = $scope.menu.images.filter(function (image) {
                if (image.indexOf('http') == -1) return image;
            });

            ImageUploadService(imagesToUpload).then(function (images) {

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

                    if (images.length) {
                        var i = 1;
                        angular.forEach(images, function (value, key) {
                            Image.create(Auth.user.uid, value.url).then(function () {
                                if (i === images.length) {
                                    Image.all(Auth.user.uid).then(function (images) {
                                        $scope.menu.images = images.map(function (image) {
                                            return image.$value;
                                        })
                                        $ionicSlideBoxDelegate.update();
                                        $ionicLoading.hide();
                                    });
                                }

                                i++;
                            });
                        });

                    } else {
                        $ionicLoading.hide();
                    }
                });

            }).then(function (error) {
                if (error)
                    console.log(error);
            });
        }
    });

    }]);