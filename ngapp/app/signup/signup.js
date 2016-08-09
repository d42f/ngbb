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

.controller('SignupCtrl', function SignupCtrl ($scope, Restangular, cfpLoadingBar, UserSession) {
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
    cfpLoadingBar.start();
    Restangular.one('users').customPOST({
      phone: $scope.user.phone
    }).then(function (rsp) {
      $scope.user.userId = rsp.userId;
    }, function (rsp) {
      $scope.state.error = rsp.status + (rsp.data && rsp.data.data ? ':' + rsp.data.data : '');
    }).finally(function () {
      $scope.state.busy = false;
    }).finally(cfpLoadingBar.complete);
  };

  $scope.confirm = function (form) {
    if (form.$invalid) {
      return undefined;
    }
    if ($scope.state.busy) {
      return undefined;
    }
    $scope.state.busy = true;
    $scope.state.error = false;
    cfpLoadingBar.start();
     Restangular.one('users').one('confirmation').customPOST({
      userId: $scope.user.userId,
      code: $scope.user.code,
      password: $scope.user.password2
    }).then(function () {
      $scope.state.success = true;
    }, function () {
      $scope.state.error = true;
    }).finally(function () {
      $scope.state.busy = false;
    }).finally(cfpLoadingBar.complete);
  };
})

;
