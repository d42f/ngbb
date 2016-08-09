angular.module('ngApp.states.error', [
  //
])

.config(function config ($stateProvider) {
  $stateProvider.state('error', {
    parent: 'base',
    url: '/error',
    views: {
      'layout@': {
        controller: 'ErrorCtrl',
        templateUrl: 'error/error.tpl.html'
      }
    },
    data: {
      pageTitle: /*i18nextract*/'Error page'
    }
  });
})

.controller('ErrorCtrl', function ErrorCtrl ($scope) {
  //
})

;
