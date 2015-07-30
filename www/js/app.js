// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var kitchsy = angular.module('kitchsy', ['ionic', 'firebase', 'ngCordova', 'angular.filter']);
kitchsy.run(['$ionicPlatform', '$rootScope', '$location', 'Auth', function ($ionicPlatform, $rootScope, $location, $Auth) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
        $rootScope.$on('$stateChangeStart', function (event, next) {
            if (next.access !== undefined) {
                if ((next.access.requiresLogin && !$Auth.signedIn()) || (!next.access.requiresLogin && $Auth.signedIn())) {
                    event.preventDefault();
                }
            }
        });
    }])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })

        .state('app.main', {
            url: "/main",
            access: {
                requiresLogin: true,
                /*requiredPermissions: ['Admin', 'UserManager'],
                 permissionType: 'AtLeastOne'*/
            },
            views: {
                'menuContent': {
                    templateUrl: "templates/main.html",
                    controller: 'MainCtrl',
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
        $urlRouterProvider.otherwise('/app/main');

            }])
    .constant('moment', moment)

.constant('FIREBASE_URL', 'https://kitchsy.firebaseio.com/');