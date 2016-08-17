angular.module('ngApp.states.signup', [
  //
])

.config(function config ($stateProvider) {
  $stateProvider.state('signup', {
    parent: 'public',
    url: '/signup',
    views: {
      'page@public': {
        controller: 'SignupCtrl',
        templateUrl: 'signup/signup.tpl.html'
      }
    },
    data: {
      pageTitle: /* i18nextract */'Sign up'
    }
  });
})

.controller('SignupCtrl', function SignupCtrl ($scope, Restangular, cfpLoadingBar, LocalStorage, UserSession) {
  UserSession.reset();

  angular.extend($scope, {
    state: {
      busy: false,
      error: false
    },
    user: {
      //
    }
  });

  $scope.signup = function (form) {
    if (form.$invalid) {
      return undefined;
    }
    if ($scope.state.busy) {
      return undefined;
    }
    $scope.state.busy = true;
    $scope.state.error = false;

    var user = {
      userId: new Date().getTime(),
      email: $scope.user.email,
      hash: encodeURIComponent($scope.user.password2)
    };
    var users = LocalStorage.val('Users');
    users = angular.isArray(users) ? users : [];
    users.push(user);
    LocalStorage.val('Users', users);
    $scope.state.busy = false;
    $scope.state.success = true;
  };
})

;
