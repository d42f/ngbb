angular.module('ngApp.directives.lkPagination', [])

.directive('lkPagination', function (_) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'lkPagination/lkPagination.tpl.html',
    link: function (scope, el, attrs) {
      var current = scope.$eval(attrs.current) || 1,
          total = scope.$eval(attrs.total) || 1,
          key = scope.$eval(attrs.key) || 'key';
      current = current > total ? total : current;
      scope.pages = _.map(new Array(total), function (o, ind) {
        var params = {};
        params[key] = ind + 1;
        return {
          isCurrent: ind + 1 === current,
          title: ind + 1,
          params: params
        };
      });
    }
  };
})

;
