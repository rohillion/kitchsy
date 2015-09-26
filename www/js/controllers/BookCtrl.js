/*global kitchsy*/
'use strict';

kitchsy.controller('BookCtrl', ['$scope', '$state', '$stateParams', '$translate', 'moment', 'Auth', 'Profile', '$ionicModal', '$ionicLoading', 'uiGmapGoogleMapApi', 'Menu', 'Booking', 'CookBooking', 'ClientBooking', 'Category', 'DATEFORMAT', function BookCtrl($scope, $state, $stateParams, $translate, moment, Auth, Profile, $ionicModal, $ionicLoading, uiGmapGoogleMapApi, Menu, Booking, CookBooking, ClientBooking, Category, DATEFORMAT) {

    $ionicLoading.show({
        template: 'Loading...'
    });

    $scope.unavailableDates = [];
    $scope.placeApi = {
        place: {}
    };

    $scope.mapLoaded = false;

    uiGmapGoogleMapApi.then(function () {
        $scope.mapLoaded = true;

        $scope.$watch('placeApi.place', function (change) {
            if (change.geometry) {
                $scope.booking.address = change.formatted_address;
                $scope.booking.position = {
                    lat: change.geometry.location.lat(),
                    lng: change.geometry.location.lng()
                }
            }
        });

        Category.all().then(function (categories) {

            Profile.get($stateParams.profileID).then(function (profile) {

                $translate(categories.$getRecord(profile.category).$value).then(function (category) {

                    Menu.get(profile.id).then(function (menu) {
                        
                        CookBooking.all(profile.id).then(function (cookBookings) {

                            $scope.unavailableDates = cookBookings.map(function (booking) {
                                return moment(booking.date, DATEFORMAT).toDate();
                            });
                            initCalendar();
                            
                            $scope.title = 'Eat ' + category.toLocaleLowerCase() + ' with ' + profile.name;
                            $scope.menu = menu;
                            $scope.booking.attendees = menu.min;
                            $scope.booking.price = menu.price;
                            $ionicLoading.hide();
                        });
                    });
                });
            });
        });
    });

    $scope.booking = {
        cookId: $stateParams.profileID,
        clientId: Auth.user.uid
    }

    var initCalendar = function () {
        $scope.date = new Date();
        $scope.datepickerObject = {
            titleLabel: 'Select a date', //Optional
            todayLabel: 'Today', //Optional
            closeLabel: 'Close', //Optional
            setLabel: 'Select', //Optional
            setButtonType: 'button-assertive', //Optional
            todayButtonType: 'button-assertive', //Optional
            closeButtonType: 'button-assertive', //Optional
            inputDate: $scope.date, //Optional
            mondayFirst: true, //Optional
            disabledDates: $scope.unavailableDates,
            templateType: 'modal', //Optional
            modalHeaderColor: 'bar-calm', //Optional
            modalFooterColor: 'bar-calm', //Optional
            from: new Date(), //Optional
            //to: new Date(2015, 9, 1), //Optional
            callback: function (val) { //Mandatory
                $scope.date = new Date(val);
            }
        };
    }
    
    $ionicModal.fromTemplateUrl('templates/modals/booking_confirmation.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.confirmationModal = modal;
    });

    $scope.showConfirmation = function () {
        $scope.confirmationModal.show();
    };

    $scope.hideConfirmation = function () {
        $scope.confirmationModal.hide();
    };

    $scope.$on('modal.hidden', function () {
        //$scope.user.city = '';
    });

    $scope.book = function () {

        $ionicLoading.show({
            template: 'Booking...'
        });

        $scope.booking.date = moment($scope.date).format(DATEFORMAT);

        Booking.create($scope.booking).then(function (booking) {

            CookBooking.create({
                user: $scope.booking.cookId,
                booking: {
                    id: booking.key(),
                    date: $scope.booking.date
                }
            });

            ClientBooking.create({
                user: $scope.booking.clientId,
                booking: {
                    id: booking.key(),
                    date: $scope.booking.date
                }
            });

            $ionicLoading.hide();
            $scope.hideConfirmation();
        });
    };

}]);