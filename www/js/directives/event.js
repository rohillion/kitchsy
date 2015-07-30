kitchsy.directive('event', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl:'templates/directives/event.html',
    scope:{
        event:"="
    },
    /*link: function(scope, elem, attrs) {
        var newDay = moment(scope.event.startsAt).dayOfYear();
        //if(scope.event.)
        
        console.log();
    }*/
  };
});