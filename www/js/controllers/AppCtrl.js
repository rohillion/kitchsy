/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
kitchsy.controller('AppCtrl', ['$scope', '$ionicModal', 'moment', 'Auth', 'Event', function DashCtrl($scope, $ionicModal, moment, Auth, Event) {

        $scope.user = Auth.user;
        

    }]);
