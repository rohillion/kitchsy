/*global kitchsy, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
kitchsy.factory('Event', ['$firebaseArray', '$firebaseObject', 'FIREBASE_URL', 'Auth', '$q', function ($firebaseArray, $firebaseObject, FIREBASE_URL, Auth, $q) {
    var ref = new Firebase(FIREBASE_URL);
    var eventsRef = ref.child('events');
    //var events = $firebaseArray(ref.child('events').orderByChild("authorUID").equalTo(Auth.user.uid));


    var Event = {
        all: function (filters) {
            //return $firebaseArray(eventsRef.orderByChild("deletedAt").equalTo(false)).$loaded();
            return $firebaseArray(eventsRef).$loaded();
        },
        create: function (userID, event) {
            return $firebaseArray(eventsRef).$add(event).then(function (eventRef) {
                ref.child('user_events').child(userID).child(eventRef.key())
                    .set(true);
                return eventRef;
            });
        },
        edit: function (event_id, input) {
            var event = eventsRef.child(event_id);

            return $q(function (resolve, reject) {

                return event.update(input, function (error) {
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
        get: function (eventId) {
            return $firebaseObject(ref.child('events').child(eventId)).$loaded();
            //return events.$getRecord(eventId);
        },
        delete: function (event) {
            console.log(event);
            /*return ref.child('events')
                .child(event.$id)
                .child("deletedAt").set(Math.floor(Date.now() / 1000));*/
            return $firebaseArray(eventsRef).$remove(event);
        },
        comments: function (eventId) {
            return $firebaseArray(ref.child('comments').child(eventId));
        }
    };

    return Event;
    }]);