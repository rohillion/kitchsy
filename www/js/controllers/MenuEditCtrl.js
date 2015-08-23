/*global kitchsy*/
'use strict';

kitchsy.controller('MenuEditCtrl', ['$scope', '$state', 'Auth', 'Menu', '$ionicLoading', function MenuEditCtrl($scope, $state, Auth, Menu, $ionicLoading) {

    $ionicLoading.show({
        template: 'Loading...'
    });
    
    $scope.min = {
        price:1,
        guests:1
    }
    
    $scope.max = {
        price:100,
        guests:100
    }

    $scope.onChange = function () {
        console.log($scope.menu.min);
    };

    Menu.get(Auth.user.uid).then(function (menu) {
        if (menu.price) {

            $scope.menu = {
                description: menu.description,
                price: menu.price,
                min: menu.min,
                max: menu.max
            }

            $scope.$watch('menu.min',function(newValue){
                console.log(newValue);
            });

            $ionicLoading.hide();

        } else {
            $ionicLoading.show({
                template: 'Creating menu...'
            });

            menu.price = 0;
            menu.description = '';
            menu.max = 15;
            menu.min = 5;

            menu.$save().then(function () {

                $scope.menu = {
                    description: menu.description,
                    price: menu.price,
                    min: menu.min,
                    max: menu.max
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
                //description: $scope.menu.description,
                max: $scope.menu.max,
                min: $scope.menu.min
            }).then(function () {
                $ionicLoading.hide();
            });

        }

    });

    }]);