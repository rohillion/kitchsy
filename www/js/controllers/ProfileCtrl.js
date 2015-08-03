/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
kitchsy.controller('ProfileCtrl', ['$scope', '$ionicModal', 'moment', 'Auth', '$translate', 'Profile', '$ionicLoading', '$state', '$ionicViewSwitcher', function ProfileCtrl($scope, $ionicModal, moment, Auth, $translate, Profile, $ionicLoading, $state, $ionicViewSwitcher) {

    Profile.get(Auth.user.uid).then(function (profile) {
        $scope.profile = profile;
    });

    $scope.save = function () {

        if (!$scope.profile.name) {
            alert('Hey! you forgot the Name!');
            return;
        } else if (!$scope.profile.username) {
            alert('Hey! you forgot the Username!');
            return;
        }

        var input = {
            id: Auth.user.uid,
            name: $scope.profile.name,
            username: $scope.profile.username,
            isChef: $scope.profile.isChef,
            isHomeAvailable: !$scope.profile.isChef ? false : $scope.profile.isHomeAvailable
        }

        $ionicLoading.show({
            template: 'Saving...',
            hideOnStateChange:true
        });

        Profile.edit(input).then(function (profile) {
            if (profile) {
                $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
                $state.go('app.events');
            } else {
                $ionicLoading.hide();
                alert(profile);
            }
        });
    };

    }]);