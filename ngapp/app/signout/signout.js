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

.controller('SignoutCtrl', function SignoutCtrl ($scope, $state, Restangular, cfpLoadingBar, UserSession) {
  cfpLoadingBar.start();
  Restangular.one('users', UserSession.user.userId).one('logout').customPOST({
    infoId: UserSession.user.infoId
  }).then(function () {
    UserSession.reset();
    $state.go('signin');
  }).finally(cfpLoadingBar.complete);
})

;
