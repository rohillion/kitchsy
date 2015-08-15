/*global kitchsy*/
'use strict';

kitchsy.controller('CookListCtrl', ['$scope', '$location', 'Auth', 'Profile', function CookListCtrl($scope, $location, Auth, Profile) {

    $scope.events = {};

    /*Event.all(Auth.user.uid).then(function (events) {
        console.log(events);
        $scope.events = events;
    });*/

    }]);