angular.module('ngApp.directives.swPassword', [])

.directive('swPassword', function () {
  return {
    require: '^form',
    link: function(scope, el, attrs, formCtrl) {
      var pwd = formCtrl[attrs.swPassword],
          pwd2 = formCtrl[attrs.name];
      if (!pwd || !pwd2) {
        return undefined;
      }
      pwd.$validators.equal = pwd2.$validators.equal = function (modelValue, viewValue) {
        var equal = pwd.$viewValue === pwd2.$viewValue;
        pwd.$setValidity('equal', equal, pwd);
        pwd2.$setValidity('equal', equal, pwd2);
        return equal;
      };
    }
  };
})

;
