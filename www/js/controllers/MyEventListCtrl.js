/*global kitchsy*/
'use strict';

kitchsy.controller('MyEventListCtrl', ['$scope', '$location', 'Auth', 'Profile', 'Event', '$ionicModal', function MyEventListCtrl($scope, $location, Auth, Profile, Event, $ionicModal) {

    $scope.events = {};

    Event.all(Auth.user.uid).then(function (events) {
        console.log(events);
        $scope.events = events;
    });

    }]);