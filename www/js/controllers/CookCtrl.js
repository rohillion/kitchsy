/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
kitchsy.controller('CookCtrl', ['$scope', '$ionicModal', 'moment', 'Auth', '$translate', 'Profile', '$stateParams', function CookCtrl($scope, $ionicModal, moment, Auth, $translate, Profile, $stateParams) {

    console.log('Hello Cook ' + $stateParams.profileID);
    $scope.profileID = $stateParams.profileID;
    
    }]);