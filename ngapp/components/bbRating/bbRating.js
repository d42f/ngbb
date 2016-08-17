angular.module('ngApp.directives.bbRating', [])

.directive('bbRating', function () {
  var MAX = 5;
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      value: '='
    },
    templateUrl: 'bbRating/bbRating.tpl.html',
    link: function(scope, el, attrs) {
      scope.percents = Math.round(scope.value * 100 / MAX);
    }
  };
})

;
