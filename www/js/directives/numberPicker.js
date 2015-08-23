kitchsy.directive('numberPicker', function ($timeout, $interval) {

    var defaults = {
        min: 1,
        max: 100,
        step: 1,
        timeout: 0
    };

    var assign = function (dest, src) {
        for (var key in src) {
            if (!dest[key]) {
                dest[key] = src[key];
            }
        }
        return dest;
    };

    var isNumber = function (value) {
        var val = Number(value);
        return !isNaN(val) && val == value;
    };

    var toNumber = function (value) {
        return Number(value);
    };

    var checkNumber = function (value) {
        if (!isNumber(value)) {
            throw new Error('value [' + value + '] is not a valid number');
        }
    };

    var getTarget = function (e) {
        if (e.touches && e.touches.length > 0) {
            return angular.element(e.touches[0].target);
        }
        return angular.element(e.target);
    };

    var getType = function (e) {
        return getTarget(e).attr('type');
    };

    var transform = function (opts) {
        for (var key in opts) {
            var value = opts[key];
            opts[key] = toNumber(value);
        }
    };

    return {
        restrict: 'E',
        scope: {
            'value': '=',
            'singular': '@',
            'plural': '@',
            'min': '=',
            'max': '=',
            'step': '@',
            'change': '&'
        },
        link: function ($scope, element) {

            var opts = assign({
                min: $scope.min,
                max: $scope.max,
                step: $scope.step
            }, defaults);

            checkNumber(opts.min);
            checkNumber(opts.max);
            checkNumber(opts.step);

            transform(opts);

            $scope.$watch('min', function (newValue) {
                opts.min = newValue;
                $scope.canDown = newValue >= opts.min;
            });
            
            $scope.$watch('max', function (newValue) {
                opts.max = newValue;
                $scope.canUp = newValue <= opts.max;
            });

            $scope.$watch('value', function (newValue) {
                $scope.canDown = newValue > opts.min;
                $scope.canUp = newValue < opts.max;
            });

            var changeNumber = function ($event) {

                if (!$event.isIonicTap)
                    return;
                var type = getType($event);
                if ('up' === type) {
                    if ($scope.value >= opts.max) {
                        return;
                    }
                    $scope.value += opts.step;
                } else if ('down' === type) {
                    if ($scope.value <= opts.min) {
                        return;
                    }
                    $scope.value -= opts.step;
                }
                $scope.change();
            };

            var timeoutPro;
            var intervalPro;
            var start;
            var end;
            var addon = element.find('span');

            addon.on('click', function (e) {

                changeNumber(e);
                $scope.$apply();
                e.stopPropagation();

            });

            addon.on('touchstart', function (e) {
                getTarget(e).addClass('active');
                start = new Date().getTime();
                timeoutPro = $timeout(function () {
                    intervalPro = $interval(function () {
                        changeNumber(e);
                    }, 200);
                }, opts.timeout);
                e.preventDefault();
            });

            addon.on('touchend', function (e) {
                end = new Date().getTime();
                if (intervalPro) {
                    $interval.cancel(intervalPro);
                    intervalPro = undefined;
                }
                if (timeoutPro) {
                    $timeout.cancel(timeoutPro);
                    timeoutPro = undefined;
                }
                if ((end - start) < opts.timeout) {
                    changeNumber(e);
                    $scope.$apply();
                }
                getTarget(e).removeClass('active');
            });

            $scope.$on('$destroy', function () {
                addon.off('touchstart touchend click');
            });

        },
        templateUrl: 'templates/directives/numberPicker.html',
    };
});