/*global kitchsy*/
'use strict';

kitchsy.controller('EventListCtrl', ['$scope', '$location', 'Auth', 'Profile', function ($scope, $location, Auth, Profile) {
       
        var profile = Profile.get(Auth.user.uid);
        
        profile.then(function(user){
            console.log(user.username);
        });
        
    
        if(!profile.city){
            
            
            
        }
        else {
        
            
        }
    
    }]);