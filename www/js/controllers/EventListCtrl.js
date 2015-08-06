/*global kitchsy*/
'use strict';

kitchsy.controller('EventListCtrl', ['$scope', '$location', 'Auth', 'Profile', 'Event', function EventListCtrl($scope, $location, Auth, Profile, Event) {

    $scope.events = {};

    Event.all(Auth.user.uid).then(function (events) {
        console.log(events);
        $scope.events = events;
    });

    }]);