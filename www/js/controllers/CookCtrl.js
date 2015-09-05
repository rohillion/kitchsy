/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
kitchsy.controller('CookCtrl', ['$scope', '$ionicModal', '$ionicLoading', 'moment', 'Auth', '$translate', 'Profile', 'Review', '$stateParams', '$state', 'Menu', 'Category', 'Image', '$ionicSlideBoxDelegate', function CookCtrl($scope, $ionicModal, $ionicLoading, moment, Auth, $translate, Profile, Review, $stateParams, $state, Menu, Category, Image, $ionicSlideBoxDelegate) {

    $scope.stars = 0;
    $scope.cookID = $stateParams.profileID;
    $scope.userID = Auth.user.uid;

    $ionicLoading.show({
        'template': 'Loading...'
    });

    Category.all().then(function (categories) {

        Profile.get($stateParams.profileID).then(function (profile) {

            Review.get(profile.id).then(function (reviews) {

                angular.forEach(reviews, function (value, key) {
                    $scope.stars = $scope.stars + value.stars;
                });

                $scope.stars = $scope.stars / reviews.length;

                $translate(categories.$getRecord(profile.category).$value).then(function (category) {
                    console.log(profile);
                    Menu.get(profile.id).then(function (menu) {

                        Image.all($stateParams.profileID).then(function (images) {

                            $scope.title = 'Eat ' + category.toLocaleLowerCase() + ' with ' + profile.name;
                            $scope.menu = menu;
                            $scope.menu.images = images.map(function (image) {
                                return image.$value;
                            });

                            $ionicSlideBoxDelegate.update();
                            $ionicLoading.hide();
                        });

                    });
                });
            });

        });
    });

    $scope.book = function () {
        $state.go('app.book', {
            profileID: $stateParams.profileID
        });
    }

    }]);