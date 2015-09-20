/*global kitchsy*/
'use strict';

kitchsy.controller('MyAgendaListCtrl', ['$scope', '$state', 'Auth', 'Profile', '$ionicModal', '$ionicLoading', 'CookBooking', 'Booking', 'moment', 'DATEFORMAT', function MyBookingListCtrl($scope, $state, Auth, Profile, $ionicModal, $ionicLoading, CookBooking, Booking, moment, DATEFORMAT) {

    $scope.bookings = [];
    var res = [];
    
    $ionicLoading.show({
        template: 'Loading...'
    });

    CookBooking.all(Auth.user.uid).then(function (CookBookings) {
        angular.forEach(CookBookings, function (cookBooking, i) {
            Booking.get(cookBooking.id, true).then(function (booking) {
                Profile.get(booking.clientId).then(function (profile) {
                    booking.client_name = profile.name;
                    booking.date = moment(booking.date,DATEFORMAT).format('dddd, MMMM Do YYYY');
                    res.push(booking);
                    if (CookBookings.length == i + 1) {
                        $scope.bookings = res;
                        $ionicLoading.hide();
                    }
                });
            });
        });
    });

    }]);