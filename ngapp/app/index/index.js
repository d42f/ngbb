angular.module('ngApp.states.index', [
  'ngApp.filters.color',
  'ngApp.filters.media',
  'ngApp.directives.bbRating'
])

.config(function config ($stateProvider) {
  $stateProvider.state('index', {
    parent: 'private',
    url: '/index?filter',
    auth: true,
    views: {
      'page@private': {
        controller: 'IndexCtrl',
        templateUrl: 'index/index.tpl.html'
      }
    },
    resolve: {
      Items: function ($http) {
        return $http.get('/assets/items.json').then(function (rsp) {
          return rsp.data;
        });
      }
    },
    data: {
      pageTitle: /*i18nextract*/'Index'
    }
  });
})

.factory('IndexCtrlService', function () {
  return {
    animateAddToCart: function (id) {
      angular.element('.filter-list__item[data-itemid=' + id + ']:first').find('img:first').each(function (ind, $o) {
        $o = angular.element($o);
        var target = angular.element('#navbar').find('i.glyphicon-shopping-cart:first').offset(),
            pos = $o.offset(),
            size = {width: $o.width(), height: $o.height()};
        if (!target || !pos) {
          return undefined;
        }
        $o.clone().appendTo(document.body).css({
          opacity: '.5',
          width: size.width + 'px', height: size.height + 'px',
          position: 'absolute', top: pos.top + 'px', left: pos.left + 'px'
        }).animate({width: 0, height: 0, top: target.top + 'px', left: target.left + 'px'}, 'slow', function () {
          angular.element(this).remove();
        });
      });
    }
  };
})

.controller('IndexCtrl', function IndexCtrl ($scope, $state, $stateParams, _, Const, LocalStorage, IndexCtrlService, Items) {
  var filter;
  try {
    filter = $stateParams.filter ? angular.fromJson($stateParams.filter) || {} : {};
  } catch (err) {
    filter = {};
  }

  angular.extend($scope, {
    colors: Const.colors,
    filter: angular.extend({}, filter),
    mediaFilter: angular.extend({}, filter),
    items: Items
  });

  $scope.toOrder = function (o) {
    var cart = LocalStorage.val('UserCart');
    cart = angular.isArray(cart) ? cart : [];
    cart.push(o);
    LocalStorage.val('UserCart', cart);

    setTimeout(function () {
      IndexCtrlService.animateAddToCart(o.Id);
    });
  };

  $scope.onChangeFilter = function () {
    for (var key in $scope.mediaFilter) {
      if ($scope.mediaFilter.hasOwnProperty(key)) {
        delete $scope.mediaFilter[key];
      }
    }
    for (var key in $scope.filter) {
      if ($scope.filter.hasOwnProperty(key) && !$scope.filter[key]) {
        delete $scope.filter[key];
      }
    }
    angular.extend($scope.mediaFilter, $scope.filter);
    $state.go('.', {filter: _.isEmpty($scope.mediaFilter) ? null : angular.toJson($scope.mediaFilter)});
  };
})

;
