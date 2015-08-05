/*global kitchsy, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
kitchsy.factory('Event', ['$firebaseArray', '$firebaseObject', 'FIREBASE_URL', 'Auth', function ($firebaseArray, $firebaseObject, FIREBASE_URL,Auth) {
        var ref = new Firebase(FIREBASE_URL);
        var eventsRef = ref.child('events');
        //var events = $firebaseArray(ref.child('events').orderByChild("authorUID").equalTo(Auth.user.uid));
        

        var Event = {
            all: function (filters) {
                return $firebaseArray(eventsRef.orderByChild("deletedAt").equalTo(false)).$loaded();
            },
            create: function (event) {
                return $firebaseArray(eventsRef).$add(event).then(function (eventRef) {
                    ref.child('user_events').child(event.authorUID).child(eventRef.key())
                            .set(true);
                    return eventRef;
                });
            },
            edit: function (input) {
                var event = ref.child('events').child(input.key)
                event.child("title").set(input.title);
                event.child("description").set(input.description);
                return event;
            },
            get: function (eventId) {
                return $firebaseObject(ref.child('events').child(eventId)).$loaded();
                //return events.$getRecord(eventId);
            },
            delete: function (event) {
                return ref.child('events')
                            .child(event.key)
                            .child("deletedAt").set(Math.floor(Date.now() / 1000));
            },
            comments: function (eventId) {
                return $firebaseArray(ref.child('comments').child(eventId));
            }
        };

        return Event;
    }]);