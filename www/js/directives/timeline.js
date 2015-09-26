kitchsy.directive('timeline', function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl:'templates/directives/timeline.html',
        scope:{
            events:'='
        }
    };
});