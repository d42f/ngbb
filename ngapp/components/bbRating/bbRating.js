angular.module('ngApp.directives.swRating', [])

.directive('swRating', function () {
  var MAX = 5;
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    scope: {
      value: '='
    },
    templateUrl: 'swRating/swRating.tpl.html',
    link: function(scope, el, attrs) {
      scope.percents = Math.round(scope.value * 100 / MAX);
    }
  };
})

;
