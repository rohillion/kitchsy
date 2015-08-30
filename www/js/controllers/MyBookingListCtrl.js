/*global kitchsy*/
'use strict';

kitchsy.controller('MyBookingListCtrl', ['$scope', '$state', 'Auth', 'Profile', '$ionicModal', '$ionicLoading', 'ClientBooking', function MyBookingListCtrl($scope, $state, Auth, Profile, $ionicModal, $ionicLoading, ClientBooking) {
    
    $scope.bookings = [];
    
    ClientBooking.all(Auth.user.uid).then(function(bookings){
        $scope.bookings = bookings;
    });

    }]);