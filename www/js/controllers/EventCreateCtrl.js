/*global kitchsy*/
'use strict';

kitchsy.controller('EventCreateCtrl', ['$scope', '$location', 'Auth', 'Event', '$ionicModal', function EventCreateCtrl($scope, $location, Auth, Event, $ionicModal) {

    $scope.events = {};

    Event.all(Auth.user.uid).then(function (events) {
        console.log(events);
        $scope.events = events;
    });

    $ionicModal.fromTemplateUrl('templates/modals/event.html', {
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