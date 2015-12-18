angular.module('ngApp.states.signin', [
  //
])

.config(function config ($stateProvider) {
  $stateProvider.state('signin', {
    parent: 'swex',
    url: '/signin',
    views: {
      'layout@': {
        controller: 'SigninCtrl',
        templateUrl: 'signin/signin.tpl.html'
      }
    },
    data: {
      pageTitle: 'Sign in'
    }
  });
})

.controller('SigninCtrl', function SigninCtrl ($scope, $state, localStorage) {
  var user = localStorage.val('CurrentUser');
  if (user && user.email) {
    $state.go('index');
  }

  angular.extend($scope, {
    invalidLoginOrPassword: false,
    user: {}
  });

  $scope.signin = function (form) {
    if (form.$invalid) {
      return undefined;
    }
    $scope.invalidLoginOrPassword = false;
    user = {
      email: $scope.user.email,
      hash: encodeURIComponent($scope.user.password)
    };
    var users = localStorage.val('Users');
    users = angular.isArray(users) ? users : [];
    for (var i = users.length; i-- > 0;) {
      if (users[i].email === user.email && users[i].hash === user.hash) {
        localStorage.val('CurrentUser', user);
        return $state.go('index');
      }
    }
    $scope.invalidLoginOrPassword = true;
  };
})

;
