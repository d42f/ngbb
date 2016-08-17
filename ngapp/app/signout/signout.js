angular.module('ngApp.states.signout', [
  //
])

.config(function config ($stateProvider) {
  $stateProvider.state('signout', {
    parent: 'private',
    url: '/signout',
    views: {
      'layout@': {
        controller: 'SignoutCtrl'
      }
    },
    data: {
      pageTitle: /* i18nextract */'Sign out'
    }
  });
})

.controller('SignoutCtrl', function SignoutCtrl ($scope, $state, Restangular, UserSession) {
  UserSession.reset();
  $state.go('signin');
})

;
