// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var kitchsy = angular.module('kitchsy', ['ionic', 'firebase', 'ngCookies', 'ngCordova', 'angular.filter', 'pascalprecht.translate', 'LocalStorageModule', 'uiGmapgoogle-maps', 'ionic-datepicker', 'ion-google-place', 'ngCordovaOauth']);

kitchsy.run(['$ionicPlatform', '$rootScope', '$location', 'Auth', function ($ionicPlatform, $rootScope, $location, Auth) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.disableScroll(true);
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
            // get preferred Laguage from device
            if (typeof navigator.globalization !== "undefined") {
                navigator.globalization.getPreferredLanguage(function (language) {
                    $translate.use((language.value).split("-")[0]).then(function (data) {
                        console.log("SUCCESS -> " + data);
                    }, function (error) {
                        console.log("ERROR -> " + error);
                    });
                }, null);
            }
        });
        $rootScope.$on('$stateChangeStart', function (event, next) {
            if (next.access !== undefined) {
                if ((next.access.requiresLogin && !Auth.signedIn()) || (!next.access.requiresLogin && Auth.signedIn())) {
                    event.preventDefault();
                }
            }
        });
    }])
    .config(['$stateProvider', '$urlRouterProvider', '$translateProvider', 'localStorageServiceProvider', 'uiGmapGoogleMapApiProvider', '$ionicConfigProvider', function ($stateProvider, $urlRouterProvider, $translateProvider, localStorageServiceProvider, uiGmapGoogleMapApiProvider, $ionicConfigProvider) {

        //Remove the default back text and the previous title on the back button and use a default icon
        $ionicConfigProvider.backButton.previousTitleText(false).text('').icon('ion-ios-arrow-thin-left');

        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyBL4Xp4ProV6eOky-NQdV2kTQjPMA_zCx8',
            v: '3.17',
            libraries: 'places'
        });

        $translateProvider.useStaticFilesLoader({
            prefix: 'lang/locale-',
            suffix: '.json'
        }).preferredLanguage('en').fallbackLanguage("en").useLocalStorage();

        localStorageServiceProvider
            .setPrefix('kitchsy')
            .setNotify(true, true);

        $stateProvider.state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/main.html",
            controller: 'AppCtrl'
        })

        .state('app.cooks', {
            url: "/cooks",
            access: {
                requiresLogin: true,
                /*requiredPermissions: ['Admin', 'UserManager'],
                 permissionType: 'AtLeastOne'*/
            },
            views: {
                'menuContent': {
                    templateUrl: "templates/cooks.html",
                    controller: 'CookListCtrl',
                }
            }
        })

        .state('app.cook', {
            url: "/cook/:profileID",
            access: {
                requiresLogin: true,
                /*requiredPermissions: ['Admin', 'UserManager'],
                 permissionType: 'AtLeastOne'*/
            },
            views: {
                'menuContent': {
                    templateUrl: "templates/cook.html",
                    controller: 'CookCtrl',
                }
            }
        })

        .state('app.book', {
            url: "/book/:profileID",
            access: {
                requiresLogin: true,
                /*requiredPermissions: ['Admin', 'UserManager'],
                 permissionType: 'AtLeastOne'*/
            },
            views: {
                'menuContent': {
                    templateUrl: "templates/book.html",
                    controller: 'BookCtrl',
                }
            }
        })

        .state('app.my_booking', {
            url: "/my_booking",
            access: {
                requiresLogin: true,
            },
            views: {
                'menuContent': {
                    templateUrl: "templates/my_booking.html",
                    controller: 'MyBookingListCtrl',
                }
            }
        })

        .state('app.schedule_edit', {
            url: "/schedule_edit",
            access: {
                requiresLogin: true,
            },
            views: {
                'menuContent': {
                    templateUrl: "templates/schedule_edit.html",
                    controller: 'ScheduleEditCtrl',
                }
            }
        })

        .state('app.menu_edit', {
            url: "/menu_edit",
            access: {
                requiresLogin: true,
            },
            views: {
                'menuContent': {
                    templateUrl: "templates/menu_edit.html",
                    controller: 'MenuEditCtrl',
                }
            }
        })

        .state('app.profile', {
            url: "/profile",
            access: {
                requiresLogin: true,
            },
            views: {
                'menuContent': {
                    templateUrl: "templates/profile.html",
                    controller: 'ProfileCtrl',
                }
            }
        })

        .state('auth', {
            url: "/auth",
            templateUrl: "templates/auth.html",
            controller: 'AuthCtrl',
            access: {
                requiresLogin: false
            }
        });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/cooks');

            }])
    .constant('moment', moment)
    .constant('CLOUDINARY_CONFIGS', {
        API_URL: 'https://api.cloudinary.com/v1_1/kitchsy/image/upload',
        UPLOAD_PRESET: 'krosjmtm'
    })
    .constant('FIREBASE_URL', 'https://kitchsy.firebaseio.com/');