/*global kitchsy, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides profile handlers
 */
kitchsy.factory('Image', ['$firebaseArray', '$firebaseObject', 'FIREBASE_URL', 'localStorageService', '$q', function ($firebaseArray, $firebaseObject, FIREBASE_URL, localStorageService, $q) {

    var ref = new Firebase(FIREBASE_URL);

    var Image = {
        all: function (userId) {
            return $firebaseArray(ref.child('images').child(userId)).$loaded();
        },
        create: function (userId, src) {
            return $firebaseArray(ref.child('images').child(userId)).$add(src);
        },
        delete: function (userId, imageId) {
            return $firebaseArray(ref.child('images').child(userId)).$loaded(function (images) {
                return images.$remove(images.$indexFor(imageId));
            });
        }
    };

    return Image;
    }]);