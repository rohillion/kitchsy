/*global kitchsy, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides booking handlers
 */
kitchsy.factory('Booking', ['$firebaseArray', '$firebaseObject', 'FIREBASE_URL', 'localStorageService', '$q', function ($firebaseArray, $firebaseObject, FIREBASE_URL, localStorageService, $q) {

    var ref = new Firebase(FIREBASE_URL);
    var bookings = ref.child('bookings');
    //var bookings = $firebaseArray(ref.child('bookings').orderByChild("deletedAt").equalTo(false));
    //var bookings = $firebaseArray(ref.child('bookings').orderByChild("createdAt").equalTo(Auth.user.uid));


    var Booking = {
        all: function (userId) {
            if (userId)
                return $firebaseArray(bookings.orderByChild("user").equalTo(userId)).$loaded();
            return $firebaseArray(bookings).$loaded();
        },
        create: function (booking) {
            console.log(booking);
            return $firebaseArray(bookings).$add(booking);
        },
        edit: function (input) {
            var booking = ref.child('bookings').child(input.id);

            return $q(function (resolve, reject) {

                return booking.update(input, function (error) {
                    if (error) {
                        console.log('Synchronization failed');
                        reject('Synchronization failed');
                    } else {
                        Booking.set(input.id, input);
                        console.log('Synchronization succeeded');
                        resolve(input);
                    }
                });

            });
        },
        get: function (bookingID, fromServer) {

            if (fromServer)
                return $firebaseObject(ref.child('bookings').child(bookingID)).$loaded();

            return $q(function (resolve, reject) {

                var booking = localStorageService.get(userID);
                if (!booking) {
                    $firebaseObject(ref.child('bookings').child(userID)).$loaded(function (booking) {
                        Booking.set(userID, booking);
                        resolve(booking);
                    });
                } else {
                    resolve(booking);
                }
            });

        },
        set: function (userID, booking) {
            return localStorageService.set(userID, booking);
        },
        delete: function (userID) {
            localStorageService.remove(userID);
            return ref.child('bookings')
                .child(userID)
                .child("deletedAt").set(Math.floor(Date.now() / 1000));
        }
    };

    return Booking;
    }]);