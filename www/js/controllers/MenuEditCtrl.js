/*global kitchsy*/
'use strict';

kitchsy.controller('MenuEditCtrl', ['$scope', '$state', 'Auth', 'Menu', '$ionicLoading', function MenuEditCtrl($scope, $state, Auth, Menu, $ionicLoading) {

    $ionicLoading.show({
        template: 'Loading...'
    });

    var getRange = function (min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) input.push({
            id: i,
            name: i
        });
        return input;
    };

    $scope.guestsRange = getRange(1, 100);

    Menu.get(Auth.user.uid).then(function (menu) {
        console.log(menu.price);
        if (menu.price) {

            $scope.menu = {
                description: menu.description,
                price: menu.price,
                min: {
                    id: menu.min
                },
                max: {
                    id: menu.max
                },
            };
            
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
                    min: {
                        id: menu.min
                    },
                    max: {
                        id: menu.max
                    },
                };

                $ionicLoading.hide();
            });


            /*Menu.create(Auth.user.uid, {
                price:0,
                description:'',
                max:15,
                min:5
            });*/
        }

        $scope.save = function () {
            
            $ionicLoading.show({
                template: 'Saving changes...'
            });

            Menu.edit(Auth.user.uid, {
                price: $scope.menu.price,
                description: $scope.menu.description,
                max: $scope.menu.max.id,
                min: $scope.menu.min.id
            }).then(function(){
                $ionicLoading.hide();
            });

        }

    });

    }]);