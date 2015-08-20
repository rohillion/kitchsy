/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
kitchsy.controller('CookCtrl', ['$scope', '$ionicModal', 'moment', 'Auth', '$translate', 'Profile', '$stateParams', 'Menu', 'Category', function CookCtrl($scope, $ionicModal, moment, Auth, $translate, Profile, $stateParams, Menu, Category) {

    Category.all().then(function (categories) {

        Profile.get($stateParams.profileID).then(function (profile) {

            $translate(categories.$getRecord(profile.category).$value).then(function (category) {
                console.log(profile);
                Menu.get(profile.id).then(function (menu) {
                    $scope.title = 'Eat ' + category.toLocaleLowerCase() + ' with ' + profile.name;
                    $scope.menu = menu;
                });
            });



        });
    });





    }]);