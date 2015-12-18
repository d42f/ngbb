angular.module('ngApp.states.index', [
  //
])

.config(function config ($stateProvider) {
  $stateProvider.state('index', {
    parent: 'swex',
    auth: true,
    url: '/index',
    views: {
      'layout@': {
        controller: 'IndexCtrl',
        templateUrl: 'index/index.tpl.html'
      }
    },
    data: {
      pageTitle: 'Index'
    },
    resolve: {
      //
    }
  });
})

.controller('IndexCtrl', function IndexCtrl ($scope) {
  angular.extend($scope, {
    filter: {}
  });
})

;

