/*global kitchsy*/
'use strict';

kitchsy.controller('MyEventListCtrl', ['$scope', '$state', 'Auth', 'Profile', 'Event', '$ionicModal', '$ionicLoading', function MyEventListCtrl($scope, $state, Auth, Profile, Event, $ionicModal, $ionicLoading) {

    $scope.events = {};
    
    Profile.get(Auth.user.uid).then(function (profile) {
        console.log(profile);
        $scope.event.chef = !profile.isChef;
    });

    Event.all(Auth.user.uid).then(function (events) {
        console.log(events);
        $scope.events = events;
    });
    
    $scope.event = {
        starts: new Date(),
        repeat: {id:1},
        chef: false,
        guests: {id:15},
    };

    $scope.createEvent = function () {
        var input = {
            starts : moment($scope.event.starts).unix(),
            repeat : $scope.event.repeat.id,
            chef : $scope.event.chef,
            guests : $scope.event.guests.id,
        }
        
        $ionicLoading.show({
            template: 'Creating...',
            hideOnStateChange:true
        });
        
        Event.create(Auth.user.uid, input).then(function (event) {
            $state.go("app.event_edit", { event_id: event.key() });
        });
    }

    }]);