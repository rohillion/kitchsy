/*global kitchsy*/
'use strict';

kitchsy.controller('BookCtrl', ['$scope', '$state', '$stateParams', 'Auth', 'Profile', '$ionicModal', '$ionicLoading', 'Menu', 'uiGmapGoogleMapApi', function BookCtrl($scope, $state, $stateParams, Auth, Profile, $ionicModal, $ionicLoading, Menu, uiGmapGoogleMapApi) {

    $ionicLoading.show({
        template: 'Loading...'
    });

    $scope.mapLoaded = false;

    uiGmapGoogleMapApi.then(function (maps) {
        console.log('carga mapa');
        $ionicModal.fromTemplateUrl('templates/modals/map.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            console.log('carga modal');
            $scope.placeModal = modal;
            $scope.showPlaceModal();
            $scope.closePlaceModal();

            $scope.map = {
                searchbox: {
                    parentdiv: 'searchBoxParent',
                    template: 'searchbox.tpl.html',
                    wrapper: 'searchbox',
                    events: {
                        places_changed: function (searchBox) {
                            console.log('B');
                            /*$ionicLoading.show({
                                template: 'Loading...'
                            });
                            console.log(searchBox.getPlaces());
                            var place = searchBox.getPlaces();
                            if (!place || place == 'undefined' || place.length == 0) {
                                console.log('no place data :(');
                                return;
                            }

                            $scope.map.center = {
                                "latitude": place[0].geometry.location.lat(),
                                "longitude": place[0].geometry.location.lng()
                            }

                            $scope.map.marker.coords = {
                                "latitude": place[0].geometry.location.lat(),
                                "longitude": place[0].geometry.location.lng()
                            }

                            $scope.map.marker.hidden = false;

                            $scope.map.zoom = 13;
                            $ionicLoading.hide();*/
                        }
                    }
                },
                center: {
                    latitude: 53.3571559,
                    longitude: -6.2596246
                },
                zoom: 8,
                options: {
                    disableDefaultUI: true
                },
                marker: {
                    id: 1,
                    hidden: true,
                    coords: {
                        latitude: 53.3571559,
                        longitude: -6.2596246
                    }
                }
            }

            $scope.mapLoaded = true;
            $ionicLoading.hide();

        });

        $scope.showPlaceModal = function () {
            $scope.placeModal.show();
        };

        $scope.closePlaceModal = function () {
            $scope.placeModal.hide();
        };

        $scope.$on('modal.hidden', function () {
            //$scope.user.city = '';
        });


    });
    
    $scope.$watch('map.center',function(change){
        console.log(change);
    });


    $scope.book = {
        date: new Date(),
        place: '6 Gardiner St. Upper.'
    }

    $scope.datepickerObject = {
        titleLabel: 'Select a date', //Optional
        todayLabel: 'Today', //Optional
        closeLabel: 'Close', //Optional
        setLabel: 'Select', //Optional
        setButtonType: 'button-assertive', //Optional
        todayButtonType: 'button-assertive', //Optional
        closeButtonType: 'button-assertive', //Optional
        inputDate: $scope.book.date, //Optional
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
            $scope.book.date = new Date(val);
        }
    };

    Profile.get($stateParams.profileID).then(function (profile) {

        Menu.get(profile.id).then(function (menu) {
            $scope.menu = menu;
            $scope.attendes = menu.min;
        });

    });

    window.addEventListener('native.keyboardshow', keyboardShowHandler);

    function keyboardShowHandler(e) {
        console.log('Keyboard height is: ' + e.keyboardHeight);
    }

    // Fixe for ngAutocomplete
    var fix = false;
    $scope.disableTap = function () {
        if (!fix) {
            fix = true;
            var container = document.getElementsByClassName('pac-container');
            // disable ionic data tab
            angular.element(container).attr('data-tap-disabled', 'true');
            // leave input field if google-address-entry is selected
            console.log('A');
            angular.element(container).on("click", function () {
                console.log('Click!');
                /*ionic.trigger('tap', {
                    target: document.getElementById('autocomplete')
                });*/
                cordova.plugins.Keyboard.close();
                document.getElementById('autocomplete').blur();
            });
        }
    }

}]);