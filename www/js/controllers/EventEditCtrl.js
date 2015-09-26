/*global kitchsy*/
'use strict';

kitchsy.controller('EventEditCtrl', ['$scope', '$state', '$stateParams', 'Auth', 'Profile', 'Event', '$ionicModal', 'moment', '$ionicLoading', '$ionicNavBarDelegate', 'uiGmapGoogleMapApi', function EventEditCtrl($scope, $state, $stateParams, Auth, Profile, Event, $ionicModal, moment, $ionicLoading, $ionicNavBarDelegate, uiGmapGoogleMapApi) {
     
    uiGmapGoogleMapApi.then(function(maps) {
        
    });
    
    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

    $ionicLoading.show({
        template: 'Loading...'
    });

    Event.get($stateParams.event_id).then(function (event) {
        $scope.event = {
            title: event.title,
            starts: new Date(moment.unix(event.starts).format("DD/MM/YYYY")),
            repeat: {
                id: event.repeat
            },
            guests: {
                id: event.guests
            },
            place: '6 Gardiner Street Upper',
            coords: '123456,123456',
            chef: event.chef
        };
        $ionicLoading.hide();
    });

    $scope.repeatOptions = [
        {
            id: 1,
            name: 'Never',
        },
        {
            id: 2,
            name: 'Once a week',
        },
        {
            id: 3,
            name: 'Every day',
        }
    ];

    var getRange = function (min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) input.push({
            id: i,
            name: i
        });
        return input;
    };

    $scope.guestsRange = getRange(1, 100);

    $scope.save = function () {
        var input = {
            title: $scope.event.title,
            starts: moment($scope.event.starts).unix(),
            repeat: $scope.event.repeat.id,
            place: $scope.event.place,
            coords: $scope.event.coords,
            guests: $scope.event.guests.id,
            chef: $scope.event.chef
        }

        $ionicLoading.show({
            template: 'Saving...',
            hideOnStateChange: true
        });

        Event.edit($stateParams.event_id, input).then(function (event) {
            $state.go("app.menu_edit", {
                event_id: $stateParams.event_id
            });
        });
    }

    $ionicModal.fromTemplateUrl('templates/modals/map.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.eventModal = modal;
    });

    $scope.showModal = function () {
        $scope.eventModal.show();
    };

    $scope.closeModal = function () {
        $scope.eventModal.hide();
    };

    $scope.$on('modal.hidden', function () {
        //$scope.user.city = '';
    });

    }]);