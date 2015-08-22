/*global kitchsy*/
'use strict';

kitchsy.controller('CookListCtrl', ['$scope', '$location', 'Auth', 'Profile', 'Category', '$ionicLoading', '$ionicModal', '$translate', function CookListCtrl($scope, $location, Auth, Profile, Category, $ionicLoading, $ionicModal, $translate) {

    $scope.cooks = {};
    $scope.category = '5';

    $ionicLoading.show({
        template: 'Looking for cooks..'
    });

    Category.all().then(function (categories) {
        console.log(categories);
        $scope.categories = categories;

        Profile.all($scope.category).then(function (profiles) {
            console.log(profiles);
            $ionicLoading.hide();
            $scope.profiles = profiles;
            $translate($scope.categories.$getRecord($scope.category).$value).then(function (title) {
                $scope.title = title;
            });
        });
    });

    $scope.updateCookList = function (categoryID) {

        $ionicLoading.show({
            template: 'Looking for cooks..'
        });

        $translate($scope.categories.$getRecord(categoryID).$value).then(function (title) {
            $scope.title = title;
        });

        Profile.all(categoryID).then(function (profiles) {
            $ionicLoading.hide();
            $scope.profiles = profiles;
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