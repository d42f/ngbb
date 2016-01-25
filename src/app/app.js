angular.module('ngApp', [
  'templates-app',
  'templates-components',
  'ui.router',
  'ui.bootstrap',
  'underscore',
  'ngApp.filters.color',
  'ngApp.filters.media',
  'ngApp.services.localStorage',
  'ngApp.directives.swPassword',
  'ngApp.directives.swRating',
  /* states */
  'ngApp.states.index',
  'ngApp.states.signup',
  'ngApp.states.signin',
  'ngApp.states.signout'
])

.constant('CONST', {
  colors: [
    {value: 'red', title: 'Red'},
    {value: 'white', title: 'White'},
    {value: 'black', title: 'Black'},
    {value: 'blue', title: 'Blue'},
    {value: 'yellow', title: 'Yellow'},
    {value: 'green', title: 'Green'}
  ]
})

.config(function appConfig ($stateProvider, $httpProvider, $locationProvider, $urlRouterProvider) {
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.defaults.headers.common = {'Content-Type': 'application/json;charset=utf-8'};

  $locationProvider.html5Mode({
    enabled: false,
    requireBase: false
  });

  $stateProvider.state('ngbb', {
    abstract: true,
    resolve: {
      CurrentUser: function (localStorage) {
        return localStorage.val('CurrentUser');
      }
    }
  });

  $urlRouterProvider.otherwise('signin');
})

.run(function appRun ($rootScope, localStorage) {
  angular.extend(angular, {
    ngbb: {
      parseIsoDate: function (date) {
        var match, regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;
        if (typeof date === 'string' && (match = date.match(regexIso8601))) {
          var milliseconds = Date.parse(match[0]);
          if (!isNaN(milliseconds)) {
              date = new Date(milliseconds);
          }
        }
        return date;
      }
    }
  });

  angular.extend($rootScope, {
    Storage: localStorage.storage
  });
})

.controller('AppCtrl', function AppCtrl ($scope, $rootScope, $state, localStorage) {
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

