angular.module('ngApp.states.index', [
  //
])

.config(function config ($stateProvider) {
  $stateProvider.state('index', {
    parent: 'swex',
    auth: true,
    url: '/index?filter',
    reloadOnSearch: false,
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
      Items: function ($http) {
        return $http.get('/assets/items.json').then(function (rsp) {
          return rsp.data;
        });
      }
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

.controller('IndexCtrl', function IndexCtrl ($scope, CONST, $state, $stateParams, _, localStorage, IndexCtrlService, Items) {
  var filter;
  try {
    filter = $stateParams.filter ? angular.fromJson($stateParams.filter) || {} : {};
  } catch (err) {
    filter = {};
  }

  if (filter.hasOwnProperty('dt_fm')) {
    filter.dt_fm = angular.swex.parseIsoDate(filter.dt_fm);
  }
  if (filter.hasOwnProperty('dt_to')) {
    filter.dt_to = angular.swex.parseIsoDate(filter.dt_to);
  }

  angular.extend($scope, {
    colors: CONST.colors,
    filter: angular.extend({}, filter),
    mediaFilter: angular.extend({}, filter),
    items: Items
  });

  $scope.toOrder = function (o) {
    var cart = localStorage.val('UserCart');
    cart = angular.isArray(cart) ? cart : [];
    cart.push(o);
    localStorage.val('UserCart', cart);

    setTimeout(function () {
      IndexCtrlService.animateAddToCart(o.Id);
    });
  };

  $scope.onChangeFilter = _.debounce(function () {
    var key;
    for (key in $scope.mediaFilter) {
      if ($scope.mediaFilter.hasOwnProperty(key)) {
        delete $scope.mediaFilter[key];
      }
    }
    for (key in $scope.filter) {
      if ($scope.filter.hasOwnProperty(key) && !$scope.filter[key]) {
        delete $scope.filter[key];
      }
    }
    angular.extend($scope.mediaFilter, $scope.filter);
    $state.go('.', {filter: _.isEmpty($scope.mediaFilter) ? null : angular.toJson($scope.mediaFilter)});
    if (!$scope.$$phase) {
      $scope.$apply();
    }
  }, 500);
})

;

