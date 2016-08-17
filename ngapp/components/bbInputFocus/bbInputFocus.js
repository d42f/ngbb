angular.module('ngApp.directives.bbInputFocus', [])

.directive('bbInputFocus', function () {
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
