angular.module('ngApp.directives.lkIcon', [])

.directive('lkIcon', function () {
  return {
    restrict: 'A',
    templateUrl: function (el, attrs) {
      return 'lkIcon/' + attrs.lkIcon + '.tpl.html';
    },
    link: function (scope, el, attrs) {
      //
    }
  };
})

;
