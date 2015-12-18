angular.module('ngApp', [
  'templates-app',
  'templates-common',
  'ui.router',
  'ui.bootstrap',
  'underscore',
  'ngApp.services.localStorage',
  'ngApp.directives.swPassword',
  /* states */
  'ngApp.states.index',
  'ngApp.states.signup',
  'ngApp.states.signin',
  'ngApp.states.signout'
])

.config(function appConfig ($stateProvider, $httpProvider, $locationProvider, $urlRouterProvider) {
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.defaults.headers.common = {'Content-Type': 'application/json;charset=utf-8'};

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

  $stateProvider.state('swex', {
    abstract: true,
    resolve: {
      CurrentUser: function ($rootScope, $state, localStorage) {
        $rootScope.Storage = localStorage.storage;
        return localStorage.val('CurrentUser');
      }
    }
  });

  $urlRouterProvider.otherwise('signin');
})

.run( function appRun ($rootScope) {
  //
})

.controller('AppCtrl', function AppCtrl ($scope, $rootScope, $window, $state, localStorage) {
  $rootScope.$on('$stateChangeSuccess', function (evt, toState, toParams, fromState, fromParams) {
    if (toState.auth && !localStorage.val('CurrentUser')) {
      evt.preventDefault();
      $state.go('signin');
    }
  });

  $scope.$on('$stateChangeSuccess', function (evt, toState, toParams, fromState, fromParams) {
    if (angular.isDefined(toState.data.pageTitle)) {
      $scope.pageTitle = toState.data.pageTitle;
    }
  });
})

;

