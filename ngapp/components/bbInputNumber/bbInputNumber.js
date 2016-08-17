angular.module('ngApp.directives.bbInputNumber', [])

.directive('bbInputNumber', function () {
  function onkeydown (evt) {
    if (angular.element.inArray(evt.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 || 
      // Allow: Ctrl+A, Command+A
      (evt.keyCode == 65 && (evt.ctrlKey === true || evt.metaKey === true)) || 
      // Allow: home, end, left, right, down, up
      (evt.keyCode >= 35 && evt.keyCode <= 40)) {
      // let it happen, don't do anything
      return undefined;
    }
    // Ensure that it is a number and stop the keypress
    if ((evt.shiftKey || (evt.keyCode < 48 || evt.keyCode > 57)) && (evt.keyCode < 96 || evt.keyCode > 105)) {
      evt.preventDefault();
      return false;
    }
  }
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, el, attrs, NgModelController) {
      function onchange (evt) {
        setTimeout(function () {
          evt.target.value = NgModelController.$modelValue;
        }, 100);
      }

      //el.on('change', onchange);
      el.on('keydown', onkeydown);
      scope.$on('$destroy', function () {
        //el.off('change', onchange);
        el.off('keydown', onkeydown);
      });
    }
  };
})

.directive('lkInputNumberFloat', function () {
  function onkeydown (evt) {
    if (angular.element.inArray(evt.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 || 
      // Allow: Ctrl+A, Command+A
      (evt.keyCode == 65 && (evt.ctrlKey === true || evt.metaKey === true)) || 
      // Allow: home, end, left, right, down, up
      (evt.keyCode >= 35 && evt.keyCode <= 40)) {
      // let it happen, don't do anything
      return undefined;
    }
    if (evt.keyCode === 190) {
      if (evt.target.value && evt.target.value.indexOf('.') === -1) {
        return undefined;
      }
      evt.preventDefault();
      return false;
    }
    // Ensure that it is a number and stop the keypress
    if ((evt.shiftKey || (evt.keyCode < 48 || evt.keyCode > 57)) && (evt.keyCode < 96 || evt.keyCode > 105)) {
      evt.preventDefault();
      return false;
    }
  }
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, el, attrs, NgModelController) {
      function onchange (evt) {
        setTimeout(function () {
          evt.target.value = NgModelController.$modelValue;
        }, 100);
      }

      //el.on('change', onchange);
      el.on('keydown', onkeydown);
      scope.$on('$destroy', function () {
        //el.off('change', onchange);
        el.off('keydown', onkeydown);
      });
    }
  };
})

;
