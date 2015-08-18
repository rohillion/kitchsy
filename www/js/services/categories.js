/*global kitchsy, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides category handlers
 */
kitchsy.factory('Category', ['$firebaseArray', '$firebaseObject', 'FIREBASE_URL', 'Auth', '$q', function ($firebaseArray, $firebaseObject, FIREBASE_URL, Auth, $q) {
    var ref = new Firebase(FIREBASE_URL);
    var categoriesRef = ref.child('categories');

    var Category = {
        all: function () {
            //return $firebaseArray(categoriesRef.orderByChild("deletedAt").equalTo(false)).$loaded();
            return $firebaseArray(categoriesRef).$loaded();
        },
        create: function (userID, category) {
            return $firebaseArray(categoriesRef).$add(category).then(function (categoryRef) {
                ref.child('user_categories').child(userID).child(categoryRef.key())
                    .set(true);
                return categoryRef;
            });
        },
        edit: function (userId, input) {

            return $q(function (resolve, reject) {

                return categoriesRef.child(userId).update(input, function (error) {
                    if (error) {
                        console.log('Category::edit: failed');
                        reject('Synchronization failed');
                    } else {
                        //Profile.set(input.id, input);
                        console.log('Synchronization succeeded');
                        resolve(input);
                    }
                });

            });
        },
        get: function (categoryId) {
            return $firebaseObject(ref.child('categories').child(categoryId)).$loaded();
            //return categories.$getRecord(categoryId);
        },
        delete: function (category) {
            /*return ref.child('categories')
                .child(category.$id)
                .child("deletedAt").set(Math.floor(Date.now() / 1000));*/
            return $firebaseArray(categoriesRef).$remove(category);
        }
    };

    return Category;
    }]);