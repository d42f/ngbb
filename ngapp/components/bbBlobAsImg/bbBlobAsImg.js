angular.module('ngApp.directives.bbBlobAsImg', [])

.directive('bbBlobAsImg', function ($timeout) {
  return {
    restrict: 'A',
    scope: {
      bbBlobAsImg: '='
    },
    link: function (scope, el, attrs) {
      if (scope.lkBlobAsImg) {
        el.attr('src', URL.createObjectURL(scope.lkBlobAsImg));
      }
      scope.$on('$destroy', scope.$watch('bbBlobAsImg', function (nv, ov) {
        if (nv === ov) {
          return undefined;
        }
        if (nv) {
          el.attr('src', URL.createObjectURL(nv));
        }
      }));
    }
  };
})

;
