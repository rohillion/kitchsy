/*global kitchsy, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides cookBooking handlers
 */
kitchsy.factory('CookBooking', ['$firebaseArray', '$firebaseObject', 'FIREBASE_URL', 'localStorageService', '$q', function ($firebaseArray, $firebaseObject, FIREBASE_URL, localStorageService, $q) {

    var ref = new Firebase(FIREBASE_URL);
    var cookBookings = ref.child('cook_bookings');


    var CookBooking = {
        all: function (userId) {
            if (userId)
                return $firebaseArray(cookBookings.orderByChild("user").equalTo(userId)).$loaded();
            return $firebaseArray(cookBookings).$loaded();
        },
        create: function (cookBooking) {
            return $firebaseArray(cookBookings.child(cookBooking.user)).$add(cookBooking.booking);
        },
        edit: function (input) {
            var cookBooking = ref.child('cookBookings').child(input.id);

            return $q(function (resolve, reject) {

                return cookBooking.update(input, function (error) {
                    if (error) {
                        console.log('Synchronization failed');
                        reject('Synchronization failed');
                    } else {
                        CookBooking.set(input.id, input);
                        console.log('Synchronization succeeded');
                        resolve(input);
                    }
                });

            });
        },
        get: function (userID, fromServer) {

            if (fromServer)
                return $firebaseObject(ref.child('cookBookings').child(userID)).$loaded();

            return $q(function (resolve, reject) {

                var cookBooking = localStorageService.get(userID);
                if (!cookBooking) {
                    $firebaseObject(ref.child('cookBookings').child(userID)).$loaded(function (cookBooking) {
                        CookBooking.set(userID, cookBooking);
                        resolve(cookBooking);
                    });
                } else {
                    resolve(cookBooking);
                }
            });

        },
        set: function (userID, cookBooking) {
            return localStorageService.set(userID, cookBooking);
        },
        delete: function (userID) {
            localStorageService.remove(userID);
            return ref.child('cookBookings')
                .child(userID)
                .child("deletedAt").set(Math.floor(Date.now() / 1000));
        }
    };

    return CookBooking;
    }]);