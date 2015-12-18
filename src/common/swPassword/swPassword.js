angular.module('ngApp.directives.swPassword', [])

.directive('swPassword', function () {
  return {
    require: '^form',
    link: function(scope, el, attrs, formCtrl) {
      var pwd = formCtrl[attrs.swPassword],
          pwd2 = formCtrl[attrs.name];
      pwd2.$validators.equal = function (modelValue, viewValue) {
        if (pwd2.$isEmpty(modelValue)) {
          return true;
        }
        return pwd.$viewValue === pwd2.$viewValue;
      };
    }
  };
})

;
