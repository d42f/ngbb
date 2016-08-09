angular.module('ngApp.directives.lkInputFocus', [])

.directive('lkInputFocus', function () {
  return {
    restrict: 'A',
    link: function (scope, el, attrs) {
      setTimeout(function () {
        el.focus();
        var input = el.get(0);
        if (input.setSelectionRange) {
          input.setSelectionRange(0, input.value.length);
        }
      });
    }
  };
})

;
