/*global kitchsy*/
'use strict';

kitchsy.controller('MenuEditCtrl', ['$scope', '$state', 'Auth', 'Menu', '$ionicLoading', '$cordovaImagePicker', function MenuEditCtrl($scope, $state, Auth, Menu, $ionicLoading, $cordovaImagePicker) {

    var options = {
        maximumImagesCount: 10,
        width: 800,
        height: 800,
        quality: 80
    };

    $cordovaImagePicker.getPictures(options)
        .then(function (results) {
            for (var i = 0; i < results.length; i++) {
                console.log('Image URI: ' + results[i]);
            }
        }, function (error) {
            // error getting photos
        });

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

            $scope.menu = {
                price: menu.price,
                min: menu.min,
                max: menu.max,
                starter: menu.starter,
                main: menu.main,
                dessert: menu.dessert,
                beverage: menu.beverage
            }

            $scope.$watch('menu.min', function (newValue) {
                console.log(newValue);
            });

            $ionicLoading.hide();

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
                $ionicLoading.hide();
            });

        }

    });

    }]);