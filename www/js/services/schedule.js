/*global kitchsy, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides schedule handlers
 */
kitchsy.factory('Schedule', ['$firebaseArray', '$firebaseObject', 'FIREBASE_URL', 'Auth', '$q', function ($firebaseArray, $firebaseObject, FIREBASE_URL, Auth, $q) {
    var ref = new Firebase(FIREBASE_URL);
    var schedulesRef = ref.child('schedules');
    //var schedules = $firebaseArray(ref.child('schedules').orderByChild("authorUID").equalTo(Auth.user.uid));


    var Schedule = {
        edit: function (userId, input) {

            return $q(function (resolve, reject) {

                return schedulesRef.child(userId).child(input.id).set(input.on, function (error) {
                    if (error) {
                        console.log('Schedule::edit: failed');
                        reject('Synchronization failed');
                    } else {
                        //Profile.set(input.id, input);
                        console.log('Synchronization succeeded');
                        resolve(input);
                    }
                });

            });
        },
        get: function (userId) {
            return $firebaseObject(schedulesRef.child(userId)).$loaded();
        }
    };

    return Schedule;
    }]);