/*global kitchsy*/
'use strict';

kitchsy.controller('AuthCtrl', ['$scope', '$location', 'Auth', 'Profile', '$ionicModal', '$ionicSlideBoxDelegate', function AuthCtrl($scope, $location, Auth, Profile, $ionicModal, $ionicSlideBoxDelegate) {
    
    if (Auth.signedIn()) {
        $location.path('/events');
    }

    $scope.user = {};

    $scope.login = function () {
        Auth.login($scope.user).then(function () {
            $location.path('/events');
            $scope.loginSignupModal.hide();
        });
    };

    $scope.signup = function () {
        Auth.register($scope.user).then(function (user) {
            return Auth.login($scope.user)
                .then(function () {
                    user.city = $scope.user.city;
                    return Profile.create(user);
                })
                .then(function () {
                    $location.path('/profile');
                    $scope.loginSignupModal.hide();
                });
        }, function (error) {
            $scope.error = error.toString();
        });
    };

    $scope.saveProfile = function () {
        Profile.edit($scope.profile);
        $ionicSlideBoxDelegate.$getByHandle('loginSignupModalSlider').next();
    };

    $ionicModal.fromTemplateUrl('templates/modals/login_signup.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {

        $scope.loginSignupModal = modal;
        $scope.loginSignupModalSlider = $ionicSlideBoxDelegate.$getByHandle('loginSignupModalSlider');
        $scope.loginSignupModalSlider.enableSlide(false);

        //Append the modal on load to avoid slide index issues.
        $scope.loginSignupModal.show();
        $scope.loginSignupModal.hide();
    });


    $scope.showLogin = function () {
        $scope.loginSignupModal.show();
        $scope.loginSignupModalSlider.slide(0);
    };

    $scope.showSignup = function () {
        $scope.loginSignupModal.show();
        $scope.loginSignupModalSlider.slide(1);
    };

    $scope.closeLoginSignupModal = function () {
        $scope.loginSignupModal.hide();
    };

    }]);