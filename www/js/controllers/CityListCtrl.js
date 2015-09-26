/*global kitchsy*/
'use strict';

kitchsy.controller('CityListCtrl', ['$scope', '$location', 'Auth', 'Profile', function ($scope, $location, Auth, Profile) {
       
        $scope.cities = [
            {
                id:1,
                name:"London"
            },{
                id:2,
                name:"Dublin"
            },{
                id:3,
                name:"Barcelona"
            },{
                id:4,
                name:"Berlin"
            },
        ]
    }]);