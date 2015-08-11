/*global kitchsy*/
'use strict';

kitchsy.controller('MyEventListCtrl', ['$scope', '$state', 'Auth', 'Profile', 'Event', '$ionicModal', '$ionicLoading', function MyEventListCtrl($scope, $state, Auth, Profile, Event, $ionicModal, $ionicLoading) {

    $scope.events = [];
    
    Profile.get(Auth.user.uid).then(function (profile) {
        console.log(profile);
        $scope.event.chef = !profile.isChef;
    });

    Event.all(Auth.user.uid).then(function (events) {
        console.log(events);
        $scope.events = events;
    });
    
    $scope.event = {
        repeat: {id:1},
        guests: {id:15},
        chef : false,
    };

    $scope.createEvent = function () {
        var input = {
            title : 'New event',
            starts : moment(new Date()).unix(),
            repeat : $scope.event.repeat.id,
            chef : $scope.event.chef,
            guests : $scope.event.guests.id,
            chefs : false,
            deletedAt : false
        }
        
        $ionicLoading.show({
            template: 'Creating...',
            hideOnStateChange:true
        });
        
        Event.create(Auth.user.uid, input).then(function (event) {
            $scope.editEvent(event.key());
        });
    }
    
    $scope.editEvent = function (id) {
        $state.go("app.event_edit", { event_id: id });
    }
    
    $scope.delete = function (event) {
        Event.delete(event);
    }

    }]);