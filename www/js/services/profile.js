/*global kitchsy, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides profile handlers
 */
kitchsy.factory('Profile', ['$firebaseArray', '$firebaseObject', 'FIREBASE_URL', 'localStorageService', '$q', function ($firebaseArray, $firebaseObject, FIREBASE_URL, localStorageService, $q) {
    
        var ref = new Firebase(FIREBASE_URL);
        var profiles = $firebaseArray(ref.child('profiles').orderByChild("deletedAt").equalTo(false));
        //var profiles = $firebaseArray(ref.child('profiles').orderByChild("createdAt").equalTo(Auth.user.uid));
        

        var Profile = {
            all: profiles,
            create: function (user) {
                var profile = {
                    username: user.username
                };
                Profile.set(user.uid, profile);
                return ref.child('profiles').child(user.uid).set(profile);
            },
            edit: function (input) {
                var profile = ref.child('profiles').child(input.key)
                profile.child("title").set(input.title);
                profile.child("description").set(input.description);
                Profile.set(user.uid, profile);
                return profile;
            },
            get: function (userID) {
                
                return $q(function(resolve, reject) {
                    
                    var profile = localStorageService.get(userID);
                    if(!profile)
                    {
                        $firebaseObject(ref.child('profiles').child(userID)).$loaded(function(profile){
                            console.log('firebase');
                            Profile.set(userID, profile);
                            resolve(profile);
                        });
                    }
                    else {
                        console.log('cache');
                        resolve(profile);
                    }
                  });
                
            },
            set: function(userID, profile){
                return localStorageService.set(userID, profile);
            },
            delete: function (userID) {
                localStorageService.remove(userID);
                return ref.child('profiles')
                            .child(userID)
                            .child("deletedAt").set(Math.floor(Date.now() / 1000));
            }
        };

        return Profile;
    }]);