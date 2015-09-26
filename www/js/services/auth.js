/*global kitchsy */
'use strict';

kitchsy.factory('Auth', ['$firebaseObject', '$firebaseArray', '$firebaseAuth', 'FIREBASE_URL', '$location', '$ionicHistory', '$cordovaOauth', '$q', function ($firebaseObject, $firebaseArray, $firebaseAuth, FIREBASE_URL, $location, $ionicHistory, $cordovaOauth, $q) {

    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);

    var Auth = {
        register: function (user) {
            return auth.$createUser(user);
        },
        login: function (user) {
            return auth.$authWithPassword(user);
            return auth.$authWithPassword({
                email: 'b@b.com',
                password: '123'
            });
        },
        fblogin: function (user) {
            
            return $q(function (resolve, reject) {
                facebookConnectPlugin.login(['email'], function (status) {
                    facebookConnectPlugin.getAccessToken(function (token) {
                        // Authenticate with Facebook using an existing OAuth 2.0 access token
                        return auth.$authWithOAuthToken("facebook", token).then(function (authData, error) {
                            if (error) {
                                console.log("Login Failed!", error);
                                reject(error);
                            } else {
                                console.log("Authenticated successfully with payload:", authData);
                                resolve(authData);
                            }
                        }, {
                            remember: "default"
                        });
                    }, function (error) {
                        console.log('Could not get access token', error);
                        reject(error);
                    });
                }, function (error) {
                    console.log('An error occurred logging the user in', error);
                    reject(error);
                });
            });

            /*return $cordovaOauth.facebook("1052091691467996", ["email"]).then(function (result) {
                console.log(result);
                return auth.$authWithOAuthToken("facebook", result.access_token);
            }, function (error) {
                console.log("ERROR: " + error);
            });*/
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