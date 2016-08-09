angular.module('ngApp.states.channels', [
  //
])

.config(function config ($stateProvider) {
  $stateProvider.state('channels', {
    parent: 'private',
    url: '/channels',
    auth: true
  });

  $stateProvider.state('channels.my', {
    parent: 'channels',
    url: '/my',
    views: {
      'page@private': {
        controller: 'ChannelsCtrl',
        templateUrl: 'channels/channels.tpl.html'
      }
    },
    resolve: {
      //
    },
    data: {
      pageTitle: /*i18nextract*/'My channels',
      className: ''
    }
  });

  $stateProvider.state('channels.info', {
    parent: 'channels',
    url: '/info',
    views: {
      'page@private': {
        controller: 'ChannelsCtrl',
        templateUrl: 'channels/channels.tpl.html'
      }
    },
    resolve: {
      //
    },
    data: {
      pageTitle: /*i18nextract*/'Info channels',
      className: ''
    }
  });
})

.controller('ChannelsCtrl', function ChannelsCtrl ($scope) {
  angular.extend($scope, {
    //
  });
})

;
