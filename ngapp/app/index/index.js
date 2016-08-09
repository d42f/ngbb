angular.module('ngApp.states.index', [
  //
])

.config(function config ($stateProvider) {
  $stateProvider.state('index', {
    parent: 'private',
    url: '/index?page',
    auth: true,
    views: {
      'page@private': {
        controller: 'IndexCtrl',
        templateUrl: 'index/index.tpl.html'
      }
    },
    resolve: {
      Subscriptions: function (Restangular) {
        return Restangular.user().one('subscriptions').get();
      }
    },
    data: {
      pageTitle: /*i18nextract*/'Index',
      className: ''
    }
  });
})

.controller('IndexCtrl', function IndexCtrl ($scope, $stateParams, Subscriptions) {
  angular.extend($scope, {
    channels: Subscriptions.data,
    page: {
      current: angular.app.num($stateParams.page) || 1,
      total: Math.ceil(Subscriptions.totalItemsNum / Subscriptions.itemsNum)
    }
  });
})

;
