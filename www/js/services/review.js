/*global kitchsy, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides review handlers
 */
kitchsy.factory('Review', ['$firebaseArray', '$firebaseObject', 'FIREBASE_URL', 'Auth', '$q', function ($firebaseArray, $firebaseObject, FIREBASE_URL, Auth, $q) {
    
    var ref = new Firebase(FIREBASE_URL);
    var reviewsRef = ref.child('reviews');

    var Review = {
        all: function (filters) {
            //return $firebaseArray(reviewsRef.orderByChild("deletedAt").equalTo(false)).$loaded();
            return $firebaseArray(reviewsRef).$loaded();
        },
        create: function (userID, review) {
            return $firebaseArray(reviewsRef).child(userID).$add(review);
        },
        edit: function (userID, review) {

            return $q(function (resolve, reject) {

                return reviewsRef.child(userID).update(review, function (error) {
                    if (error) {
                        console.log('Review::edit: failed');
                        reject('Synchronization failed');
                    } else {
                        console.log('Synchronization succeeded');
                        resolve(input);
                    }
                });

            });
        },
        get: function (userID) {
            return $firebaseArray(ref.child('reviews').child(userID)).$loaded();
            //return reviews.$getRecord(reviewId);
        },
        delete: function (review) {
            /*return ref.child('reviews')
                .child(review.$id)
                .child("deletedAt").set(Math.floor(Date.now() / 1000));*/
            return $firebaseArray(reviewsRef).$remove(review);
        },
        comments: function (reviewId) {
            return $firebaseArray(ref.child('comments').child(reviewId));
        }
    };

    return Review;
    }]);