angular.module('ngApp.states.signup', [
  //
])

.config(function config ($stateProvider) {
  $stateProvider.state('signup', {
    parent: 'swex',
    url: '/signup',
    views: {
      'layout@': {
        controller: 'SignupCtrl',
        templateUrl: 'signup/signup.tpl.html'
      }
    },
    data: {
      pageTitle: 'Sign up'
    }
  });
})

.controller('SignupCtrl', function SignupCtrl ($scope, $state, localStorage) {
  localStorage.val('CurrentUser', undefined);

  angular.extend($scope, {
    user: {}
  });

  $scope.signup = function (form) {
    if (form.$invalid) {
      return undefined;
    }
    var user = {
      email: $scope.user.email,
      hash: encodeURIComponent($scope.user.password)
    };
    var users = localStorage.val('Users');
    users = angular.isArray(users) ? users : [];
    users.push(user);
    localStorage.val('Users', users);
    $state.go('signin');
  };
})

;
