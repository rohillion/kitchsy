/*global kitchsy*/
'use strict';

kitchsy.controller('AuthCtrl', ['$scope', '$location', 'Auth', 'Profile', function ($scope, $location, Auth, Profile) {
        if (Auth.signedIn()) {
            $location.path('/events');
        }
        
        $scope.user = {};

        $scope.login = function () {
            Auth.login($scope.user).then(function () {
                $location.path('/events');
            });
        };

        $scope.signup = function () {
            Auth.register($scope.user).then(function (user) {
                return Auth.login($scope.user)
                        .then(function () {
                            user.username = $scope.user.username;
                            return Profile.create(user);
                        })
                        .then(function () {
                            $location.path('/events');
                        });
            }, function (error) {
                $scope.error = error.toString();
            });
        };
    }]);