angular.module('ngApp.states.signin', [
  //
])

.config(function config ($stateProvider) {
  $stateProvider.state('signin', {
    parent: 'public',
    url: '/signin',
    views: {
      'page@public': {
        controller: 'SigninCtrl',
        templateUrl: 'signin/signin.tpl.html'
      }
    },
    data: {
      pageTitle: /* i18nextract */'Sign in'
    }
  });
})

.controller('SigninCtrl', function SigninCtrl ($scope, $state, Restangular, cfpLoadingBar, Const, UserSession) {
  UserSession.reset();

  angular.extend($scope, {
    state: {
      busy: false,
      error: false
    },
    user: {
      remember: true
    }
  });

  $scope.signin = function (form) {
    if (form.$invalid) {
      return undefined;
    }
    if ($scope.state.busy) {
      return undefined;
    }
    $scope.state.busy = true;
    $scope.state.error = false;
    cfpLoadingBar.start();
    Restangular.one('users').one('login').customPOST({
      phone: $scope.user.phone,
      password: $scope.user.password
    }).then(function (rsp) {
      UserSession.set(rsp);
      $state.go(Const.indexState, {}, {reload: true});
    }, function (rsp) {
      $scope.state.error = rsp.status + (rsp.data && rsp.data.data ? ':' + rsp.data.data : '');
    }).finally(function () {
      $scope.state.busy = false;
    }).finally(cfpLoadingBar.complete);
  };
})

;
