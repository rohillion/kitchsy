/*global kitchsy*/
'use strict';

kitchsy.controller('MainCtrl', ['$scope', '$location', 'Auth', function ($scope, $location, Auth) {
        if (Auth.signedIn()) {
            $location.path('/dashboard');
        }
        
        $scope.user = {};

        $scope.login = function () {
            Auth.login($scope.user).then(function () {
                $location.path('/dashboard');
            });
        };

        $scope.signup = function () {
            Auth.register($scope.user).then(function (user) {
                return Auth.login($scope.user)
                        .then(function () {
                            user.username = $scope.user.username;
                            return Auth.createProfile(user);
                        })
                        .then(function () {
                            $location.path('/dashboard');
                        });
            }, function (error) {
                $scope.error = error.toString();
            });
        };
    }]);