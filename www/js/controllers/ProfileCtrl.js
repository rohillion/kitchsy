/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
kitchsy.controller('ProfileCtrl', ['$scope', '$ionicModal', 'moment', 'Auth', '$translate', 'Profile', '$ionicLoading', '$state', '$ionicViewSwitcher', '$ionicSideMenuDelegate', '$ionicHistory', function ProfileCtrl($scope, $ionicModal, moment, Auth, $translate, Profile, $ionicLoading, $state, $ionicViewSwitcher, $ionicSideMenuDelegate, $ionicHistory) {

    $scope.showMenuButton = false;

    $ionicLoading.show({
        template: 'Loading...'
    });

    Profile.get(Auth.user.uid).then(function (profile) {
        $ionicLoading.hide();
        $scope.profile = profile;
        $scope.showMenuButton = $ionicSideMenuDelegate.canDragContent(profile.name != undefined);
        $ionicHistory.nextViewOptions({
            disableBack: !$scope.showMenuButton
        });
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
        }

        $ionicLoading.show({
            template: 'Saving...',
            hideOnStateChange: true
        });

        Profile.edit(input).then(function (profile) {
            if (profile) {
                
                if (!$scope.showMenuButton) {
                    $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
                    $scope.showMenuButton = true;
                    $ionicSideMenuDelegate.canDragContent(true);
                    $state.go('app.cooks');
                } else {
                    $ionicLoading.show({
                        template: 'Saved!',
                        duration: 1000
                    });
                }

            } else {
                $ionicLoading.hide();
                alert(profile);
            }
        });
    };

    }]);