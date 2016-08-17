angular.module('ngApp.directives.lkHideimg404', [])

.directive('lkHideimg404', function () {
  function onerror () {
    this.className += ' visibility-hidden';
  }
  function onload () {
    this.className = this.className.replace(' visibility-hidden', '');
  }

  return {
    restrict: 'A',
    link: function (scope, el, attrs) {
      el.bind('load', onload);
      el.bind('error', onerror);
      scope.$on('$destroy', function () {
        el.unbind('load', onload);
        el.unbind('error', onerror);
      })
    }
  };
})

;
