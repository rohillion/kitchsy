/*global kitchsy, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides categoryProfile handlers
 */
kitchsy.factory('CategoryProfile', ['$firebaseArray', '$firebaseObject', 'FIREBASE_URL', 'Auth', '$q', function ($firebaseArray, $firebaseObject, FIREBASE_URL, Auth, $q) {
    var ref = new Firebase(FIREBASE_URL);
    var categoryProfilesRef = ref.child('categoryProfiles');

    var CategoryProfile = {
        all: function () {
            //return $firebaseArray(categoryProfilesRef.orderByChild("deletedAt").equalTo(false)).$loaded();
            return $firebaseArray(categoryProfilesRef).$loaded();
        },
        create: function (userID, categoryProfile) {
            return $firebaseArray(categoryProfilesRef).$add(categoryProfile).then(function (categoryProfileRef) {
                ref.child('user_categoryProfiles').child(userID).child(categoryProfileRef.key())
                    .set(true);
                return categoryProfileRef;
            });
        },
        edit: function (userId, input) {

            return $q(function (resolve, reject) {

                return categoryProfilesRef.child(userId).update(input, function (error) {
                    if (error) {
                        console.log('CategoryProfile::edit: failed');
                        reject('Synchronization failed');
                    } else {
                        //Profile.set(input.id, input);
                        console.log('Synchronization succeeded');
                        resolve(input);
                    }
                });

            });
        },
        get: function (categoryID, userID) {
            return $firebaseObject(ref.child('categoryProfiles').child(categoryID).child(userID)).$loaded();
            //return categoryProfiles.$getRecord(categoryProfileId);
        },
        delete: function (categoryProfile) {
            /*return ref.child('categoryProfiles')
                .child(categoryProfile.$id)
                .child("deletedAt").set(Math.floor(Date.now() / 1000));*/
            return $firebaseArray(categoryProfilesRef).$remove(categoryProfile);
        }
    };

    return CategoryProfile;
    }]);