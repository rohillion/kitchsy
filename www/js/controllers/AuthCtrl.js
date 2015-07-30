/*global kitchsy*/
'use strict';

kitchsy.controller('AuthCtrl', ['$scope', '$location', 'Auth', function ($scope, $location, Auth) {
        if (Auth.signedIn()) {
            console.log('pasa');
            $location.path('/main');
        }
        
        $scope.user = {};

        $scope.login = function () {
            Auth.login($scope.user).then(function () {
                $location.path('/main');
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
                            $location.path('/main');
                        });
            }, function (error) {
                $scope.error = error.toString();
            });
        };
    }]);