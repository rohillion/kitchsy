/*global kitchsy*/
'use strict';

kitchsy.controller('MyBookingListCtrl', ['$scope', '$state', 'Auth', 'Profile', '$ionicModal', '$ionicLoading', 'ClientBooking', 'Booking', 'moment', 'DATEFORMAT', function MyBookingListCtrl($scope, $state, Auth, Profile, $ionicModal, $ionicLoading, ClientBooking, Booking, moment, DATEFORMAT) {

    $scope.bookings = [];
    var res = [];

    $ionicLoading.show({
        template: 'Loading...'
    });

    ClientBooking.all(Auth.user.uid).then(function (ClientBookings) {
        angular.forEach(ClientBookings, function (clientBooking, i) {
            Booking.get(clientBooking.id, true).then(function (booking) {
                Profile.get(booking.cookId).then(function (profile) {
                    booking.cook_name = profile.name;
                    booking.date = moment(booking.date,DATEFORMAT).format('dddd, MMMM Do YYYY');
                    res.push(booking);
                    if (ClientBookings.length == i + 1) {
                        $scope.bookings = res;
                        $ionicLoading.hide();
                    }
                });
            });
        });
    });

    }]);