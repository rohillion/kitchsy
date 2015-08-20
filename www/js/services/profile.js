/*global kitchsy, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides profile handlers
 */
kitchsy.factory('Profile', ['$firebaseArray', '$firebaseObject', 'FIREBASE_URL', 'localStorageService', '$q', function ($firebaseArray, $firebaseObject, FIREBASE_URL, localStorageService, $q) {

    var ref = new Firebase(FIREBASE_URL);
    //var profiles = $firebaseArray(ref.child('profiles').orderByChild("deletedAt").equalTo(false));
    //var profiles = $firebaseArray(ref.child('profiles').orderByChild("createdAt").equalTo(Auth.user.uid));


    var Profile = {
        all: function(categoryID){
            return $firebaseArray(ref.child('profiles').orderByChild("category").equalTo(categoryID)).$loaded();
        },
        create: function (user) {
            Profile.set(user.uid, user);
            return ref.child('profiles').child(user.uid).set(user);
        },
        edit: function (input) {
            var profile = ref.child('profiles').child(input.id);

            return $q(function (resolve, reject) {
                
                return profile.update(input, function (error) {
                    if (error) {
                        console.log('Synchronization failed');
                        reject('Synchronization failed');
                    } 
                    else {
                        Profile.set(input.id, input);
                        console.log('Synchronization succeeded');
                        resolve(input);
                    }
                });

            });
        },
        get: function (userID, fromServer) {
            
            if(fromServer)
                return $firebaseObject(ref.child('profiles').child(userID)).$loaded();

            return $q(function (resolve, reject) {

                var profile = localStorageService.get(userID);
                if (!profile) {
                    $firebaseObject(ref.child('profiles').child(userID)).$loaded(function (profile) {
                        Profile.set(userID, profile);
                        resolve(profile);
                    });
                } else {
                    resolve(profile);
                }
            });

        },
        set: function (userID, profile) {
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