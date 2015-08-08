/*global kitchsy*/
'use strict';

kitchsy.controller('EventCreateCtrl', ['$scope', '$location', 'Auth', 'Profile', 'Event', '$ionicModal', function EventCreateCtrl($scope, $location, Auth, Profile, Event, $ionicModal) {

    Profile.get(Auth.user.uid).then(function (profile) {
        console.log(profile);
        $scope.event.chef = !profile.isChef;
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
            id: i
        });
        return input;
    };
    
    $scope.guestsRange = getRange(1,100);

    $scope.event = {
        repeat: '1',
        starts: new Date(),
        place: '',
        coords: '',
        chef: false,
        guests: 15,
    };

    $ionicModal.fromTemplateUrl('templates/modals/chef_picker.html', {
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