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
        $scope.menu = menu;

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

    }]);