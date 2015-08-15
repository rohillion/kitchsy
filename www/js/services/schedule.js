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
        all: function (filters) {
            //return $firebaseArray(schedulesRef.orderByChild("deletedAt").equalTo(false)).$loaded();
            return $firebaseArray(schedulesRef).$loaded();
        },
        create: function (userID, schedule) {
            return $firebaseArray(schedulesRef).$add(schedule).then(function (scheduleRef) {
                ref.child('user_schedules').child(userID).child(scheduleRef.key())
                    .set(true);
                return scheduleRef;
            });
        },
        edit: function (schedule_id, input) {
            var schedule = schedulesRef.child(schedule_id);

            return $q(function (resolve, reject) {

                return schedule.update(input, function (error) {
                    if (error) {
                        console.log('Synchronization failed');
                        reject('Synchronization failed');
                    } else {
                        //Profile.set(input.id, input);
                        console.log('Synchronization succeeded');
                        resolve(input);
                    }
                });

            });
        },
        get: function (scheduleId) {
            return $firebaseObject(ref.child('schedules').child(scheduleId)).$loaded();
            //return schedules.$getRecord(scheduleId);
        }
    };

    return Schedule;
    }]);