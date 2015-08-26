/*global kitchsy*/
'use strict';

kitchsy.controller('CookListCtrl', ['$scope', '$location', 'Auth', 'Profile', 'Review', 'Category', '$ionicLoading', '$ionicModal', '$translate', function CookListCtrl($scope, $location, Auth, Profile, Review, Category, $ionicLoading, $ionicModal, $translate) {

    var loadingOpts = {
        template: 'Loading for cooks..'
    }

    $scope.cooks = {};
    $scope.category = '5';

    $ionicLoading.show(loadingOpts);

    var listCooks = function (profiles) {
        $scope.profiles = [];
        angular.forEach(profiles, function (value, key) {
            if (value.isChef) {
                Review.get(value.$id).then(function (reviews) {
                    value.reviews = reviews;
                    $scope.profiles.push(value);
                    console.log($scope.profiles);
                });
            }
        });
    };

    Category.all().then(function (categories) {

        $scope.categories = categories;

        Profile.all($scope.category).then(function (profiles) {

            listCooks(profiles);

            $translate($scope.categories.$getRecord($scope.category).$value).then(function (title) {
                $scope.title = title;
            });

            $ionicLoading.hide();

            profiles.$watch(function (profiles) {
                listCooks(profiles);
            });
        });
    });

    $scope.updateCookList = function (categoryID) {

        $ionicLoading.show(loadingOpts);

        $translate($scope.categories.$getRecord(categoryID).$value).then(function (title) {
            $scope.title = title;
        });

        Profile.all(categoryID).then(function (profiles) {
            listCooks(profiles);
            $ionicLoading.hide();
        });

        $scope.filterModal.hide();
    }

    $ionicModal.fromTemplateUrl('templates/modals/filter.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.filterModal = modal;
    });

    $scope.showFilters = function () {
        $scope.filterModal.show();
    };

    $scope.hideFilters = function () {
        $scope.filterModal.hide();
    };

    $scope.$on('modal.hidden', function () {
        //$scope.user.city = '';
    });

    }]);