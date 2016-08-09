angular.module('ngApp.services.Text', [])

.factory('$text', function () {
  return function () {
    return angular.look.translate.apply(angular.look, arguments);
  };
})

;
