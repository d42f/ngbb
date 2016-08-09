angular.module('ngApp.states.favorites', [
  //
])

.config(function config ($stateProvider) {
  $stateProvider.state('favorites', {
    parent: 'private',
    url: '/favorites',
    auth: true,
    views: {
      'page@private': {
        controller: 'FavoritesCtrl',
        templateUrl: 'favorites/favorites.tpl.html'
      }
    },
    resolve: {
      //
    },
    data: {
      pageTitle: /*i18nextract*/'Favorites',
      className: ''
    }
  });
})

.controller('FavoritesCtrl', function FavoritesCtrl ($scope) {
  angular.extend($scope, {
    //
  });
})

;
