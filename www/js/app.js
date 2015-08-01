// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var kitchsy = angular.module('kitchsy', ['ionic', 'firebase', 'ngCookies', 'ngCordova', 'angular.filter', 'pascalprecht.translate', 'LocalStorageModule']);

kitchsy.run(['$ionicPlatform', '$rootScope', '$location', 'Auth', function ($ionicPlatform, $rootScope, $location, Auth) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
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
    .config(['$stateProvider', '$urlRouterProvider', '$translateProvider', 'localStorageServiceProvider', function ($stateProvider, $urlRouterProvider, $translateProvider, localStorageServiceProvider) {

        $translateProvider.useStaticFilesLoader({
            prefix: 'lang/locale-',
            suffix: '.json'
        }).preferredLanguage('en').fallbackLanguage("en").useLocalStorage();
        
        localStorageServiceProvider
            .setPrefix('kitchsy')
            .setNotify(true, true);

        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })

        .state('app.events', {
            url: "/events",
            access: {
                requiresLogin: true,
                /*requiredPermissions: ['Admin', 'UserManager'],
                 permissionType: 'AtLeastOne'*/
            },
            views: {
                'menuContent': {
                    templateUrl: "templates/events.html",
                    controller: 'EventListCtrl',
                }
            }
        })
            
        .state('app.cities', {
            url: "/cities",
            access: {
                requiresLogin: true,
                /*requiredPermissions: ['Admin', 'UserManager'],
                 permissionType: 'AtLeastOne'*/
            },
            views: {
                'menuContent': {
                    templateUrl: "templates/cities.html",
                    controller: 'CityListCtrl',
                }
            }
        })

        .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: 'AuthCtrl',
                access: {
                    requiresLogin: false
                }
            })
            .state('signup', {
                url: "/signup",
                templateUrl: "templates/signup.html",
                controller: 'AuthCtrl',
                access: {
                    requiresLogin: false
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/events');

            }])
    .constant('moment', moment)
    .constant('FIREBASE_URL', 'https://kitchsy.firebaseio.com/');