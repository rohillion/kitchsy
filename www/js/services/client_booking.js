/*global kitchsy, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides clientBooking handlers
 */
kitchsy.factory('ClientBooking', ['$firebaseArray', '$firebaseObject', 'FIREBASE_URL', 'localStorageService', '$q', function ($firebaseArray, $firebaseObject, FIREBASE_URL, localStorageService, $q) {

    var ref = new Firebase(FIREBASE_URL);
    var clientBookings = ref.child('client_bookings');


    var ClientBooking = {
        all: function (userId) {
            if (userId)
                return $firebaseArray(clientBookings.child(userId)).$loaded();
            return $firebaseArray(clientBookings).$loaded();
        },
        create: function (clientBooking) {
            return $firebaseArray(clientBookings.child(clientBooking.user)).$add(clientBooking.booking);
        },
        edit: function (input) {
            var clientBooking = ref.child('clientBookings').child(input.id);

            return $q(function (resolve, reject) {

                return clientBooking.update(input, function (error) {
                    if (error) {
                        console.log('Synchronization failed');
                        reject('Synchronization failed');
                    } else {
                        ClientBooking.set(input.id, input);
                        console.log('Synchronization succeeded');
                        resolve(input);
                    }
                });

            });
        },
        get: function (userID, fromServer) {

            if (fromServer)
                return $firebaseObject(ref.child('clientBookings').child(userID)).$loaded();

            return $q(function (resolve, reject) {

                var clientBooking = localStorageService.get(userID);
                if (!clientBooking) {
                    $firebaseObject(ref.child('clientBookings').child(userID)).$loaded(function (clientBooking) {
                        ClientBooking.set(userID, clientBooking);
                        resolve(clientBooking);
                    });
                } else {
                    resolve(clientBooking);
                }
            });

        },
        set: function (userID, clientBooking) {
            return localStorageService.set(userID, clientBooking);
        },
        delete: function (userID) {
            localStorageService.remove(userID);
            return ref.child('clientBookings')
                .child(userID)
                .child("deletedAt").set(Math.floor(Date.now() / 1000));
        }
    };

    return ClientBooking;
    }]);