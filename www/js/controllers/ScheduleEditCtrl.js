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

    var days = [
        {
            id: 1,
            name: 'MONDAY'
        }, {
            id: 2,
            name: 'TUESDAY'
        }, {
            id: 3,
            name: 'WEDNESDAY'
        }, {
            id: 4,
            name: 'THURSDAY'
        }, {
            id: 5,
            name: 'FRIDAY'
        }, {
            id: 6,
            name: 'SATURDAY'
        }, {
            id: 7,
            name: 'SUNDAY'
        }
    ];
    
    $scope.days = new Array;
    
    Schedule.get(Auth.user.uid).then(function (schedule) {
        
        angular.forEach(days, function (day, key) {
            day.on = schedule[day.id] != undefined? schedule[day.id] : false;
            $scope.days.push(day);
        });
        
        $ionicLoading.hide();
    });

    
    $scope.updateSchedule = function (day) {
        Schedule.edit(Auth.user.uid, {
            id: day.id,
            on: day.on
        });
    }

    }]);