/*global kitchsy, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
kitchsy.factory('ShiftsAvailable', ['moment', function (moment) {
    
        var allShifts, shiftsAvailable = [], nextShift, shiftMinutes = 30;
    
        var Availability = {
            all : function(workingHours, shiftsTaken){

                 angular.forEach(workingHours, function (dayShifts) {

                    angular.forEach(dayShifts, function (shifts, dayName) {

                        //console.log(dayName);
                        shiftsAvailable[dayName] = [];

                        angular.forEach(shifts, function (shift,i) {
                            //i++;

                            //calculate differnce between to and from shift hours.
                            allShifts = moment(shift.to,"HH:mm").diff(moment(shift.from,"HH:mm"), 'minutes') / shiftMinutes;

                            //console.log( 'Franja '+i+': '+ shiftsAvailable +' turnos' );

                            nextShift = moment(shift.from,"HH:mm");

                            for(var s = 1; s <= allShifts; s++){
                                //console.log('Turno: '+ shiftAvailable.format("HH:mm"));

                                if(shiftsTaken.indexOf(nextShift.format("YYYYMMDDHHmm")) === -1)
                                    shiftsAvailable[dayName].push(nextShift.format("HH:mm"));

                                nextShift = moment(nextShift,"HH:mm").add(shiftMinutes, 'minutes');
                            }
                        });
                    });
                });
                
                return shiftsAvailable;
            }
        }
    
        return Availability;
    }]);