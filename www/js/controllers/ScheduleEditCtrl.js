/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
kitchsy.controller('ScheduleEditCtrl', ['$scope', 'Schedule', 'moment', 'Auth', '$ionicLoading', function ScheduleEditCtrl($scope, Schedule, moment, Auth, $ionicLoading) {

    $ionicLoading.show({
        template: 'Loading...'
    });
    
    $scope.schedule = Schedule.get(Auth.user.uid);

    $scope.schedule.then(function () {
        $ionicLoading.hide();
    });

    }]);