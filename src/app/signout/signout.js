angular.module('ngApp.states.signout', [
  //
])

.config(function config ($stateProvider) {
  $stateProvider.state('signout', {
    parent: 'swex',
    url: '/signout',
    views: {
      'layout@': {
        controller: 'SignoutCtrl'
      }
    },
    data: {
      pageTitle: 'Sign out'
    }
  });
})

.controller('SignoutCtrl', function SignoutCtrl ($scope, $state, localStorage) {
  localStorage.val('CurrentUser', undefined);
  $state.go('signin');
})

;