/*global kitchsy*/
'use strict';

kitchsy.controller('MenuEditCtrl', ['$scope', '$state', '$stateParams', 'Auth', 'Profile', 'Menu', '$ionicModal', '$ionicLoading', function MenuEditCtrl($scope, $state, $stateParams, Auth, Profile, Menu, $ionicModal, $ionicLoading) {

    $ionicLoading.show({
        template: 'Loading...'
    });

    $scope.title = 'Event Menu';

    Event.get($stateParams.event_id).then(function (event) {
        console.log(event);
        $scope.event = event;
        $ionicLoading.hide();

        if ($scope.event.chef) {
            $scope.title = 'Event Chef';
        }
    });


    $ionicModal.fromTemplateUrl('templates/modals/chef_picker.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.chefListModal = modal;
        if (!$scope.event.chefs)
            $scope.chefListModal.show();
    });

    $scope.showModal = function () {
        $scope.chefListModal.show();
    };

    $scope.closeModal = function () {
        $scope.chefListModal.hide();
    };

    $scope.$on('modal.hidden', function () {
        //$scope.user.city = '';
    });

    }]);