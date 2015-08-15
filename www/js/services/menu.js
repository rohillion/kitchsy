/*global kitchsy, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides menu handlers
 */
kitchsy.factory('Menu', ['$firebaseArray', '$firebaseObject', 'FIREBASE_URL', 'Auth', '$q', function ($firebaseArray, $firebaseObject, FIREBASE_URL, Auth, $q) {
    var ref = new Firebase(FIREBASE_URL);
    var menusRef = ref.child('menus');
    //var menus = $firebaseArray(ref.child('menus').orderByChild("authorUID").equalTo(Auth.user.uid));


    var Menu = {
        all: function (filters) {
            //return $firebaseArray(menusRef.orderByChild("deletedAt").equalTo(false)).$loaded();
            return $firebaseArray(menusRef).$loaded();
        },
        create: function (userID, menu) {
            return $firebaseArray(menusRef).$add(menu).then(function (menuRef) {
                ref.child('user_menus').child(userID).child(menuRef.key())
                    .set(true);
                return menuRef;
            });
        },
        edit: function (menu_id, input) {
            var menu = menusRef.child(menu_id);

            return $q(function (resolve, reject) {

                return menu.update(input, function (error) {
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
        get: function (menuId) {
            return $firebaseObject(ref.child('menus').child(menuId)).$loaded();
            //return menus.$getRecord(menuId);
        },
        delete: function (menu) {
            console.log(menu);
            /*return ref.child('menus')
                .child(menu.$id)
                .child("deletedAt").set(Math.floor(Date.now() / 1000));*/
            return $firebaseArray(menusRef).$remove(menu);
        },
        comments: function (menuId) {
            return $firebaseArray(ref.child('comments').child(menuId));
        }
    };

    return Menu;
    }]);