angular.module('ngApp.directives.lkUserChannels', [])

.directive('lkUserChannels', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'lkUserChannels/lkUserChannels.tpl.html',
    scope: {
      channels: '='
    },
    link: function (scope, el, attrs) {
      //
    }
  };
})

;
