/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
kitchsy.controller('AppCtrl', ['$scope', '$ionicModal', 'moment', 'Auth', '$translate', 'Profile', function AppCtrl($scope, $ionicModal, moment, Auth, $translate, Profile) {

    Profile.get(Auth.user.uid, true).then(function (profile) {
        $scope.profile = profile;
    });

    $scope.user = Auth.user;

    $scope.lang = function () {
        $translate.use($translate.use() === 'en' ? 'es' : 'en');
    };

    $scope.logout = function () {
        Auth.logout();
    };
    }]);