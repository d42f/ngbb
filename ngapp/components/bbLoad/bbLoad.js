angular.module('ngApp.directives.bbLoad', [])

.directive('bbLoad', function ($parse) {
  var events = 'load loadeddata loadedmetadata error';
  return {
    restrict: 'A',
    link: function (scope, el, attrs) {
      var fn = $parse(attrs.lkLoad);

      function onload (evt) {
        el.off(events, onload);

        scope.$apply(function () {
          fn(scope, {$event: evt});
        });
      }

      el.on(events, onload);
      scope.$on('$destroy', function () {
        el.off(events, onload);
      });
    }
  };
})

;
