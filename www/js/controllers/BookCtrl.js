/*global kitchsy*/
'use strict';

kitchsy.controller('BookCtrl', ['$scope', '$state', '$stateParams', 'Auth', 'Profile', '$ionicModal', '$ionicLoading', 'uiGmapGoogleMapApi', 'Menu', 'Booking', 'CookBooking', 'ClientBooking', function BookCtrl($scope, $state, $stateParams, Auth, Profile, $ionicModal, $ionicLoading, uiGmapGoogleMapApi, Menu, Booking, CookBooking, ClientBooking) {

    $ionicLoading.show({
        template: 'Loading...'
    });

    $scope.placeApi = {
        place: {}
    };

    $scope.mapLoaded = false;

    uiGmapGoogleMapApi.then(function () {
        $scope.mapLoaded = true;

        $scope.$watch('placeApi.place', function (change) {
            console.log(change);
            if (change.geometry) {
                $scope.booking.position = {
                    lat: change.geometry.location.lat(),
                    lng: change.geometry.location.lng()
                }
            }
        });

        Profile.get($stateParams.profileID).then(function (profile) {

            Menu.get(profile.id).then(function (menu) {
                $scope.menu = menu;
                $scope.booking.attendes = menu.min;
                $ionicLoading.hide();
            });

        });

    });

    $scope.booking = {
        cookId: $stateParams.profileID,
        clientId: Auth.user.uid,
        date: new Date()
    }

    $scope.datepickerObject = {
        titleLabel: 'Select a date', //Optional
        todayLabel: 'Today', //Optional
        closeLabel: 'Close', //Optional
        setLabel: 'Select', //Optional
        setButtonType: 'button-assertive', //Optional
        todayButtonType: 'button-assertive', //Optional
        closeButtonType: 'button-assertive', //Optional
        inputDate: $scope.booking.date, //Optional
        mondayFirst: true, //Optional
        disabledDates: [
                new Date(2015, 8, 16),
                new Date(2015, 8, 17),
            ], //Optional
        templateType: 'modal', //Optional
        modalHeaderColor: 'bar-calm', //Optional
        modalFooterColor: 'bar-calm', //Optional
        from: new Date(), //Optional
        to: new Date(2015, 9, 1), //Optional
        callback: function (val) { //Mandatory
            $scope.booking.date = new Date(val);
        }
    };

    $scope.bookConfirm = function () {

        $ionicLoading.show({
            template: 'Booking...'
        });

        Booking.create($scope.booking).then(function (booking) {

            CookBooking.create({
                user: $scope.booking.cookId,
                booking: booking.key()
            });

            ClientBooking.create({
                user: $scope.booking.clientId,
                booking: booking.key()
            });
            
            $ionicLoading.hide();
        });
    };

}]);