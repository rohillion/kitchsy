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

    $scope.lang = function () 
    {
        // Change Language
        switch ($translate.use()) 
        {
            case 'en' :
                $translate.use('es'); 
                break;
            case 'es' :
                $translate.use('pt'); 
                break;
            case 'pt' :
                $translate.use('en'); 
                break;
        }
    };

    $scope.logout = function () {
        Auth.logout();
    };
    }]);