angular.module('ngApp.directives.lkBlobAsImg', [])

.directive('lkBlobAsImg', function ($timeout) {
  return {
    restrict: 'A',
    scope: {
      lkBlobAsImg: '='
    },
    link: function (scope, el, attrs) {
      if (scope.lkBlobAsImg) {
        el.attr('src', URL.createObjectURL(scope.lkBlobAsImg));
      }
      scope.$on('$destroy', scope.$watch('lkBlobAsImg', function (nv, ov) {
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
