/*global kitchsy*/
'use strict';

kitchsy.controller('MenuEditCtrl', ['$scope', '$state', '$stateParams', 'Auth', 'Profile', 'Event', '$ionicModal', '$ionicNavBarDelegate', function MenuEditCtrl($scope, $state, $stateParams, Auth, Profile, Event, $ionicModal, $ionicNavBarDelegate) {
    
    $scope.event_id = $stateParams.event_id;

    Event.get($stateParams.event_id).then(function (event) {
        $scope.event = event;
    });


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