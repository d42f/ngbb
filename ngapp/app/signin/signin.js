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

.controller('SigninCtrl', function SigninCtrl ($scope, $state, LocalStorage, Const, UserSession) {
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

    var user = {
      email: $scope.user.email,
      hash: encodeURIComponent($scope.user.password)
    };
    var users = LocalStorage.val('Users');
    users = angular.isArray(users) ? users : [];
    for (var i = users.length; i-- > 0;) {
      if (users[i].email === user.email && users[i].hash === user.hash) {
        UserSession.set(users[i]);
        return $state.go(Const.indexState, {}, {reload: true});
      }
    }
    $scope.state.busy = false;
    $scope.state.error = 401;
  };
})

;
