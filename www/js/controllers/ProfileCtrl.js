/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
kitchsy.controller('ProfileCtrl', ['$scope', '$ionicModal', 'moment', 'Auth', '$translate', 'Profile', '$ionicLoading', '$state', '$ionicViewSwitcher', '$ionicSideMenuDelegate', '$ionicHistory', 'Category', function ProfileCtrl($scope, $ionicModal, moment, Auth, $translate, Profile, $ionicLoading, $state, $ionicViewSwitcher, $ionicSideMenuDelegate, $ionicHistory, Category) {

    $scope.showMenuButton = false;

    $ionicLoading.show({
        template: 'Loading...'
    });

    var categoryProfile = false;

    Category.all().then(function (categories) {
        console.log(categories);
        $scope.categories = categories;

        Profile.get(Auth.user.uid).then(function (profile) {
            $scope.profile = profile;
            $scope.profile.category = $scope.categories.$getRecord(profile.category);

            $scope.showMenuButton = $ionicSideMenuDelegate.canDragContent(profile.username != undefined);
            $ionicHistory.nextViewOptions({
                disableBack: !$scope.showMenuButton
            });
            $ionicLoading.hide();
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
            isChef: $scope.profile.isChef
        }
        
        if($scope.profile.category)
            input.category = $scope.profile.category.$id;

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