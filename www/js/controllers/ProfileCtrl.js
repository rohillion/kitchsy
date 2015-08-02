/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
kitchsy.controller('ProfileCtrl', ['$scope', '$ionicModal', 'moment', 'Auth', '$translate', 'Profile', function ProfileCtrl($scope, $ionicModal, moment, Auth, $translate, Profile) {

        $scope.user = Auth.user;
    
        $scope.logout = function(){
            Auth.logout();
        };
    }]);
