/*global kitchsy */
'use strict';

kitchsy.factory('Auth', ['$firebaseObject', '$firebaseArray', '$firebaseAuth', 'FIREBASE_URL', '$location', '$ionicHistory', function ($firebaseObject, $firebaseArray, $firebaseAuth, FIREBASE_URL, $location, $ionicHistory) {
    
    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);

    var Auth = {
        register: function (user) {
            return auth.$createUser(user);
        },
        login: function (user) {
            //return auth.$authWithPassword(user);
            return auth.$authWithPassword({email:'a@a.com',password:'123'});
        },
        logout: function () {
            auth.$unauth();
        },
        resolveUser: function () {
            return auth.$getAuth();
        },
        signedIn: function () {
            return !!Auth.user.provider;
        },
        user: {}
    };

    ref.onAuth(function (authData) {
        if (authData) {
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            console.log("Authenticated with uid:", authData.uid);
            angular.copy(authData, Auth.user);
            Auth.user.profile = $firebaseObject(ref.child('profile').child(authData.uid));
        } else {
            console.log("Client unauthenticated.");
            if (Auth.user && Auth.user.profile) {
                Auth.user.profile.$destroy();
            }
            angular.copy({}, Auth.user);
            $location.path('/auth');
        }
    });

    return Auth;
    }]);