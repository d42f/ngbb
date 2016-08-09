angular.module('ngApp.states.reset', [
  //
])

.config(function config ($stateProvider) {
  $stateProvider.state('reset', {
    parent: 'public',
    url: '/reset',
    views: {
      'page@public': {
        controller: 'ResetCtrl',
        templateUrl: 'reset/reset.tpl.html'
      }
    },
    data: {
      pageTitle: /* i18nextract */'Reset password'
    }
  });
})

.controller('ResetCtrl', function ResetCtrl ($scope, UserSession) {
  UserSession.reset();

  angular.extend($scope, {
    //
  });
})

;
