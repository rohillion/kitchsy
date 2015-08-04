/*global kitchsy*/
'use strict';

kitchsy.controller('AuthCtrl', ['$scope', '$location', 'Auth', 'Profile', '$ionicModal', '$ionicSlideBoxDelegate', '$ionicLoading', '$ionicHistory', function AuthCtrl($scope, $location, Auth, Profile, $ionicModal, $ionicSlideBoxDelegate, $ionicLoading, $ionicHistory) {

    if (Auth.signedIn()) {
        $location.path('/events');
    }

    $scope.user = {};

    $scope.login = function () {

        $ionicHistory.nextViewOptions({
            disableAnimate: true
        });

        $ionicLoading.show({
            template: 'Loading...',
            hideOnStateChange: true
        });

        Auth.login($scope.user).then(function () {
            $location.path('/events');
            $scope.loginSignupModal.hide();
        }, function (error) {
            console.log(error);
            $ionicLoading.hide();
            $scope.error = error.toString();
        });
    };

    $scope.signup = function () {
        
        $ionicHistory.nextViewOptions({
            disableAnimate: true
        });

        $ionicLoading.show({
            template: 'Creating profile...',
            hideOnStateChange: true
        });

        Auth.register($scope.user).then(function (user) {
            return Auth.login($scope.user)
                .then(function () {
                    user.city = $scope.user.city;
                    user.isHomeAvailable = user.isChef = false;
                    return Profile.create(user);
                })
                .then(function () {
                    $location.path('/profile');
                    $scope.loginSignupModal.hide();
                });
        }, function (error) {
            $ionicLoading.hide();
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

    $scope.$on('modal.hidden', function () {
        $scope.user.city = '';
        $scope.user.email = '';
        $scope.user.password = '';
    });

    }]);